require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// More permissive CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins with any port
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Allow specific ports that might be used
    const allowedPorts = ['5173', '5174', '5175', '3000', '5004'];
    const port = origin.split(':').pop();
    if (allowedPorts.includes(port)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Add a test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Add a simple POST test endpoint
app.post('/test', (req, res) => {
  res.json({ message: 'POST request received!', data: req.body });
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/generate-roadmap', async (req, res) => {
  console.log('Received request:', req.body);
  
  const { domain, currentYear, experienceLevel } = req.body;
  
  if (!domain || !currentYear || !experienceLevel) {
    return res.status(400).json({ error: 'Missing required fields: domain, currentYear, experienceLevel' });
  }

  const prompt = `You are a career guidance AI. Generate a comprehensive, personalized career roadmap for a student with the following details:

Domain: ${domain}
Current Year: ${currentYear}
Experience Level: ${experienceLevel}

IMPORTANT: You must respond with ONLY valid JSON in the exact format specified below. Do not include any text before or after the JSON.

{
  "semesterPlan": {
    "semester1": {
      "title": "Semester 1 Focus",
      "description": "What to focus on in this semester",
      "skills": ["skill1", "skill2"],
      "projects": ["project1", "project2"]
    },
    "semester2": {
      "title": "Semester 2 Focus", 
      "description": "What to focus on in this semester",
      "skills": ["skill1", "skill2"],
      "projects": ["project1", "project2"]
    }
  },
  "certifications": [
    {
      "name": "Certification Name",
      "organization": "Issuing Organization",
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
      "category": "Resource Category",
      "resources": [
        {
          "name": "Resource Name",
          "type": "Course/Book/Platform",
          "description": "What you'll learn",
          "link": "URL if applicable"
        }
      ]
    }
  ],
  "careerAdvice": "General career advice and tips for this domain"
}

Provide practical, actionable steps tailored to the specific domain and experience level. Focus on real-world skills and resources.`;

  try {
    console.log('Calling Gemini API...');
    console.log('API Key:', GEMINI_API_KEY ? 'Present' : 'Missing');
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    console.log('Gemini response received');
    console.log('Raw response length:', text.length);
    
    // Try to parse the JSON response
    try {
      // Try to extract JSON from the response (in case AI added extra text)
      let jsonText = text;
      
      // Look for JSON object in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
        console.log('Extracted JSON from response');
      }
      
      const parsedResponse = JSON.parse(jsonText);
      console.log('Successfully parsed JSON response');
      res.json(parsedResponse);
    } catch (parseError) {
      console.log('Failed to parse JSON, returning raw response');
      console.log('Parse error:', parseError.message);
      console.log('Raw response preview:', text.substring(0, 200) + '...');
      
      // If JSON parsing fails, return the raw text
      res.json({ 
        error: "Failed to parse AI response as JSON",
        rawResponse: text,
        parseError: parseError.message
      });
    }
  } catch (error) {
    console.error('Gemini API Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to generate roadmap',
      details: error.response?.data || error.message,
      status: error.response?.status
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Gemini backend running on port ${PORT}`);
  console.log(`📡 Ready to generate career roadmaps!`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
}); 