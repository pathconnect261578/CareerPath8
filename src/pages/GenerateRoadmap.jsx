import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function GenerateRoadmap() {
  const [formData, setFormData] = useState({
    domain: '',
    currentYear: '',
    experienceLevel: ''
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendPort, setBackendPort] = useState(8080);

  const navigate = useNavigate();

  const domains = [
    'Software Development',
    'Data Science & Analytics',
    'Cybersecurity',
    'DevOps & Cloud Computing',
    'Artificial Intelligence & Machine Learning',
    'Web Development',
    'Mobile App Development',
    'Game Development',
    'Network Engineering',
    'Database Administration',
    'UI/UX Design',
    'Digital Marketing',
    'Business Analytics',
    'Project Management',
    'Quality Assurance'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

  // Function to get backend port from file or use default
  const getBackendPort = async () => {
    try {
      // Try to read port from file first
      const response = await fetch('/api/backend-port');
      if (response.ok) {
        const data = await response.json();
        return data.port || 8080;
      }
    } catch (error) {
      console.log('Could not get port from API, trying file...');
    }
    
    // Fallback to default port
    return 8080;
  };

  // Check backend status with dynamic port
  const checkBackendStatus = async () => {
    try {
      const port = await getBackendPort();
      setBackendPort(port);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`http://localhost:${port}/test`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setBackendStatus('connected');
        setError('');
      } else {
        setBackendStatus('error');
        setError('Backend responded with error');
      }
    } catch (error) {
      console.log('Backend status check failed:', error.message);
      setBackendStatus('disconnected');
      setError('Backend not reachable');
    }
  };

  // Auto-retry backend connection
  useEffect(() => {
    checkBackendStatus();
    
    const interval = setInterval(() => {
      if (backendStatus !== 'connected') {
        checkBackendStatus();
      }
    }, 5000); // Check every 5 seconds if not connected

    return () => clearInterval(interval);
  }, [backendStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.domain || !formData.currentYear || !formData.experienceLevel) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      console.log('Submitting form with data:', formData);
      console.log('Making request to:', `http://localhost:${backendPort}/generate-roadmap`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`http://localhost:${backendPort}/generate-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setRoadmap(data);
      setError('');
    } catch (error) {
      console.log('Fetch error:', error);
      if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      
      <main style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1C1C1E', marginBottom: 12 }}>
            AI Career Path Generator
          </h1>
          <p style={{ fontSize: 18, color: '#5F6368', marginBottom: 20 }}>
            Get a personalized career roadmap based on your domain, year, and experience level
          </p>
          
          {/* Backend Status Indicator */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '8px 16px', 
            borderRadius: 20, 
            background: backendStatus === 'connected' ? '#D1FAE5' : backendStatus === 'checking' ? '#FEF3C7' : '#FEE2E2',
            color: backendStatus === 'connected' ? '#065F46' : backendStatus === 'checking' ? '#92400E' : '#991B1B',
            fontSize: 14,
            fontWeight: 600
          }}>
            {backendStatus === 'connected' ? '✅ Connected' : 
             backendStatus === 'checking' ? '⏳ Checking...' : '❌ Disconnected'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* Form Section */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1C1C1E', marginBottom: 24 }}>
              Generate Your Roadmap
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1C1C1E' }}>
                  Domain/Field *
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: 8,
                    fontSize: 16,
                    background: '#fff',
                    color: '#1C1C1E'
                  }}
                >
                  <option value="">Select your domain</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1C1C1E' }}>
                  Current Year *
                </label>
                <select
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: 8,
                    fontSize: 16,
                    background: '#fff',
                    color: '#1C1C1E'
                  }}
                >
                  <option value="">Select your current year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1C1C1E' }}>
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: 8,
                    fontSize: 16,
                    background: '#fff',
                    color: '#1C1C1E'
                  }}
                >
                  <option value="">Select your experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || backendStatus !== 'connected'}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  background: backendStatus === 'connected' ? '#7C3AED' : '#9CA3AF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: backendStatus === 'connected' ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => {
                  if (backendStatus === 'connected') {
                    e.currentTarget.style.background = '#6D28D9';
                  }
                }}
                onMouseOut={e => {
                  if (backendStatus === 'connected') {
                    e.currentTarget.style.background = '#7C3AED';
                  }
                }}
              >
                {loading ? 'Generating Roadmap...' : 'Generate Career Roadmap'}
              </button>
            </form>

            {error && (
              <div style={{ 
                marginTop: 16, 
                padding: '12px 16px', 
                background: '#FEE2E2', 
                color: '#991B1B', 
                borderRadius: 8, 
                fontSize: 14 
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Roadmap Display Section */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1C1C1E', marginBottom: 24 }}>
              Your Personalized Roadmap
            </h2>
            
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 18, color: '#5F6368', marginBottom: 16 }}>
                  🤖 AI is generating your personalized roadmap...
                </div>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  border: '4px solid #E5E7EB', 
                  borderTop: '4px solid #7C3AED', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
              </div>
            )}

            {roadmap && !loading && (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {/* Semester Plan */}
                {roadmap.semesterPlan && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                      📚 Semester-wise Learning Plan
                    </h3>
                    {Object.entries(roadmap.semesterPlan).map(([semester, plan]) => (
                      <div key={semester} style={{ 
                        marginBottom: 20, 
                        padding: 16, 
                        background: '#F8FAFC', 
                        borderRadius: 8,
                        border: '1px solid #E2E8F0'
                      }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E', marginBottom: 8 }}>
                          {plan.title}
                        </h4>
                        <p style={{ fontSize: 14, color: '#5F6368', marginBottom: 12 }}>
                          {plan.description}
                        </p>
                        {plan.skills && (
                          <div style={{ marginBottom: 8 }}>
                            <strong style={{ fontSize: 13, color: '#374151' }}>Skills:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                              {plan.skills.map((skill, index) => (
                                <span key={index} style={{
                                  background: '#E0E7FF',
                                  color: '#3730A3',
                                  padding: '4px 8px',
                                  borderRadius: 12,
                                  fontSize: 12,
                                  fontWeight: 500
                                }}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {plan.projects && (
                          <div>
                            <strong style={{ fontSize: 13, color: '#374151' }}>Projects:</strong>
                            <ul style={{ margin: '4px 0 0 0', paddingLeft: 20 }}>
                              {plan.projects.map((project, index) => (
                                <li key={index} style={{ fontSize: 13, color: '#5F6368', marginBottom: 2 }}>
                                  {project}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {roadmap.certifications && roadmap.certifications.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                      🏆 Recommended Certifications
                    </h3>
                    {roadmap.certifications.map((cert, index) => (
                      <div key={index} style={{ 
                        marginBottom: 16, 
                        padding: 16, 
                        background: '#F0FDF4', 
                        borderRadius: 8,
                        border: '1px solid #BBF7D0'
                      }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: '#166534', marginBottom: 4 }}>
                          {cert.name}
                        </h4>
                        <p style={{ fontSize: 13, color: '#15803D', marginBottom: 4 }}>
                          <strong>Organization:</strong> {cert.organization}
                        </p>
                        <p style={{ fontSize: 13, color: '#5F6368', marginBottom: 4 }}>
                          {cert.description}
                        </p>
                        <p style={{ fontSize: 13, color: '#7C3AED', fontWeight: 600 }}>
                          <strong>Timeline:</strong> {cert.timeline}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Internships */}
                {roadmap.internships && roadmap.internships.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                      💼 Suggested Internships
                    </h3>
                    {roadmap.internships.map((internship, index) => (
                      <div key={index} style={{ 
                        marginBottom: 16, 
                        padding: 16, 
                        background: '#FEF3C7', 
                        borderRadius: 8,
                        border: '1px solid #FCD34D'
                      }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>
                          {internship.type}
                        </h4>
                        <p style={{ fontSize: 13, color: '#5F6368', marginBottom: 8 }}>
                          {internship.description}
                        </p>
                        <p style={{ fontSize: 13, color: '#7C3AED', fontWeight: 600, marginBottom: 4 }}>
                          <strong>Timeline:</strong> {internship.timeline}
                        </p>
                        {internship.companies && (
                          <div>
                            <strong style={{ fontSize: 13, color: '#374151' }}>Companies:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                              {internship.companies.map((company, idx) => (
                                <span key={idx} style={{
                                  background: '#FEE2E2',
                                  color: '#991B1B',
                                  padding: '4px 8px',
                                  borderRadius: 12,
                                  fontSize: 12,
                                  fontWeight: 500
                                }}>
                                  {company}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Learning Resources */}
                {roadmap.learningResources && roadmap.learningResources.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                      📚 Top Learning Resources
                    </h3>
                    {roadmap.learningResources.map((category, index) => (
                      <div key={index} style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E', marginBottom: 12 }}>
                          {category.category}
                        </h4>
                        {category.resources && category.resources.map((resource, idx) => (
                          <div key={idx} style={{ 
                            marginBottom: 12, 
                            padding: 12, 
                            background: '#F8FAFC', 
                            borderRadius: 6,
                            border: '1px solid #E2E8F0'
                          }}>
                            <h5 style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1E', marginBottom: 4 }}>
                              {resource.name}
                            </h5>
                            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
                              <strong>Type:</strong> {resource.type}
                            </p>
                            <p style={{ fontSize: 12, color: '#5F6368', marginBottom: 4 }}>
                              {resource.description}
                            </p>
                            {resource.link && (
                              <a 
                                href={resource.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  fontSize: 12, 
                                  color: '#7C3AED', 
                                  textDecoration: 'none',
                                  fontWeight: 600
                                }}
                              >
                                🔗 Visit Resource
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Career Advice */}
                {roadmap.careerAdvice && (
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                      💡 Career Advice
                    </h3>
                    <div style={{ 
                      padding: 16, 
                      background: '#FEF3C7', 
                      borderRadius: 8,
                      border: '1px solid #FCD34D'
                    }}>
                      <p style={{ fontSize: 14, color: '#92400E', lineHeight: 1.6 }}>
                        {roadmap.careerAdvice}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!roadmap && !loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                <div style={{ fontSize: 16, marginBottom: 8 }}>
                  Ready to generate your roadmap?
                </div>
                <div style={{ fontSize: 14 }}>
                  Fill out the form and click "Generate Career Roadmap"
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 