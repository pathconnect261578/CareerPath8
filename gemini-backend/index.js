require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const net = require('net');

const app = express();

// Allow all origins for development
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Port endpoint
app.get('/port', (req, res) => {
  res.json({ port: process.env.PORT || 8080 });
});

const GEMINI_API_KEY = 'AIzaSyBenwcW6fDo81PyN9PY21OceFFdP9qpHoU';

// Generate roadmap endpoint with fallback
app.post('/generate-roadmap', async (req, res) => {
  console.log('Received request:', req.body);

  const { domain, currentYear, experienceLevel } = req.body;
  
  if (!domain || !currentYear || !experienceLevel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Calling Gemini API...');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Generate a career roadmap for ${domain} for a ${currentYear} student with ${experienceLevel} experience level. 
            Return ONLY valid JSON in this exact format:
            {
              "semesterPlan": {
                "semester1": {
                  "title": "Foundation",
                  "description": "Focus on basic concepts",
                  "skills": ["skill1", "skill2"],
                  "projects": ["project1", "project2"]
                },
                "semester2": {
                  "title": "Intermediate",
                  "description": "Build on foundation",
                  "skills": ["skill3", "skill4"],
                  "projects": ["project3", "project4"]
                }
              },
              "certifications": [
                {
                  "name": "Certification Name",
                  "organization": "Organization",
                  "description": "Why this certification is valuable",
                  "timeline": "When to take it"
                }
              ],
              "internships": [
                {
                  "type": "Internship Type",
                  "description": "What to look for",
                  "timeline": "When to apply",
                  "companies": ["Company 1", "Company 2"]
                }
              ],
              "learningResources": [
                {
                  "category": "Online Courses",
                  "resources": [
                    {
                      "name": "Resource Name",
                      "type": "Course",
                      "description": "What you'll learn",
                      "link": "https://example.com"
                    }
                  ]
                }
              ],
              "careerAdvice": "Specific career advice for this domain and experience level."
            }`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini response received');

    // Try to parse JSON
    try {
      let jsonText = text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const parsedResponse = JSON.parse(jsonText);
      console.log('Successfully parsed JSON');
      res.json(parsedResponse);
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback response');
      
      // Fallback response
      const fallbackResponse = {
        semesterPlan: {
          semester1: {
            title: `${domain} Foundation`,
            description: `Start with basic ${domain} concepts and fundamentals. Focus on understanding core principles and building a strong foundation.`,
            skills: [`Basic ${domain} concepts`, 'Problem solving', 'Critical thinking'],
            projects: [`Simple ${domain} project`, 'Portfolio website']
          },
          semester2: {
            title: `${domain} Intermediate`,
            description: `Build upon your foundation and start working on more complex ${domain} projects. Focus on practical applications.`,
            skills: [`Advanced ${domain} techniques`, 'Project management', 'Team collaboration'],
            projects: [`Complex ${domain} application`, 'Open source contribution']
          }
        },
        certifications: [
          {
            name: `${domain} Certification`,
            organization: "Industry Standard Organization",
            description: `Validate your ${domain} skills and knowledge with this recognized certification.`,
            timeline: "After completing semester 2"
          }
        ],
        internships: [
          {
            type: `${domain} Internship`,
            description: `Gain real-world experience in ${domain} through hands-on projects and mentorship.`,
            timeline: "Summer after semester 2",
            companies: ["Tech Company A", "Tech Company B", "Startup C"]
          }
        ],
        learningResources: [
          {
            category: "Online Courses",
            resources: [
              {
                name: `${domain} Fundamentals Course`,
                type: "Online Course",
                description: `Comprehensive course covering ${domain} basics and advanced concepts.`,
                link: "https://coursera.org"
              },
              {
                name: `${domain} Practice Platform`,
                type: "Practice Platform",
                description: `Hands-on practice with ${domain} projects and challenges.`,
                link: "https://leetcode.com"
              }
            ]
          }
        ],
        careerAdvice: `Focus on building a strong foundation in ${domain}. Practice regularly, work on real projects, and network with professionals in the field. Consider joining ${domain} communities and attending industry events to stay updated with the latest trends.`
      };

      res.json(fallbackResponse);
    }
  } catch (error) {
    console.error('API Error:', error.message);
    
    // Return fallback response on any error
    const fallbackResponse = {
      semesterPlan: {
        semester1: {
          title: `${domain} Foundation`,
          description: `Start with basic ${domain} concepts and fundamentals.`,
          skills: [`Basic ${domain} concepts`, 'Problem solving'],
          projects: [`Simple ${domain} project`]
        },
        semester2: {
          title: `${domain} Intermediate`,
          description: `Build upon your foundation with more complex projects.`,
          skills: [`Advanced ${domain} techniques`, 'Project management'],
          projects: [`Complex ${domain} application`]
        }
      },
      certifications: [
        {
          name: `${domain} Certification`,
          organization: "Industry Organization",
          description: `Validate your ${domain} skills.`,
          timeline: "After semester 2"
        }
      ],
      internships: [
        {
          type: `${domain} Internship`,
          description: `Gain real-world ${domain} experience.`,
          timeline: "Summer after semester 2",
          companies: ["Tech Company A", "Tech Company B"]
        }
      ],
      learningResources: [
        {
          category: "Online Courses",
          resources: [
            {
              name: `${domain} Course`,
              type: "Online Course",
              description: `Learn ${domain} fundamentals.`,
              link: "https://coursera.org"
            }
          ]
        }
      ],
      careerAdvice: `Focus on building a strong foundation in ${domain}. Practice regularly and work on real projects.`
    };

    res.json(fallbackResponse);
  }
});

// Function to find available port
function findAvailablePort(startPort = 8080) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} is in use, trying ${startPort + 1}...`);
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Start server with automatic port finding
async function startServer() {
  try {
    const port = await findAvailablePort(8080);
    
    app.listen(port, () => {
      console.log(`🚀 Backend running on port ${port}`);
      console.log(`📡 Ready to generate career roadmaps!`);
      console.log(`🔗 Test: http://localhost:${port}/test`);
      
      // Save port to file for frontend
      const fs = require('fs');
      fs.writeFileSync('port.txt', port.toString());
      console.log(`📝 Port ${port} saved to port.txt`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 