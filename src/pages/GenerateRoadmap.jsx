import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const domains = [
  'Software Development',
  'Data Science & Analytics',
  'Artificial Intelligence & Machine Learning',
  'Web Development',
  'Mobile App Development',
  'DevOps & Cloud Computing',
  'Cybersecurity',
  'UI/UX Design',
  'Digital Marketing',
  'Product Management',
  'Database Administration',
  'Network Engineering',
  'Game Development',
  'Blockchain Development',
  'IoT Development'
];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

export default function GenerateRoadmap() {
  const [formData, setFormData] = useState({
    domain: '',
    currentYear: '',
    experienceLevel: ''
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoadmap(null);

    console.log('Submitting form with data:', formData);

    try {
      console.log('Making request to: http://localhost:5004/generate-roadmap');
      
      const response = await fetch('http://localhost:5004/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setRoadmap(data);
      } else {
        setError(data.error || 'Failed to generate roadmap');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Network error: ${err.message}. Please check if the backend server is running on port 5003.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>
      <Navbar user={null} userData={null} onLogout={() => navigate('/login')} />
      
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1C1C1E', marginBottom: 12 }}>
            AI Career Path Generator
          </h1>
          <p style={{ fontSize: 18, color: '#5F6368', maxWidth: 600, margin: '0 auto' }}>
            Get a personalized career roadmap tailored to your domain, year, and experience level
          </p>
        </div>

        {/* Form */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)', 
          padding: 32, 
          marginBottom: 32 
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div>
                <label style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 16, marginBottom: 8, display: 'block' }}>
                  Domain *
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', background: '#fff', border: '1.5px solid #CBD5E1', borderRadius: 10, 
                    padding: '12px 16px', fontSize: 16, color: '#1C1C1E', outline: 'none',
                    transition: 'border 0.2s'
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #7C3AED'}
                  onBlur={e => e.target.style.border = '1.5px solid #CBD5E1'}
                >
                  <option value="">Select Domain</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 16, marginBottom: 8, display: 'block' }}>
                  Current Year *
                </label>
                <select
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', background: '#fff', border: '1.5px solid #CBD5E1', borderRadius: 10, 
                    padding: '12px 16px', fontSize: 16, color: '#1C1C1E', outline: 'none',
                    transition: 'border 0.2s'
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #7C3AED'}
                  onBlur={e => e.target.style.border = '1.5px solid #CBD5E1'}
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 16, marginBottom: 8, display: 'block' }}>
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', background: '#fff', border: '1.5px solid #CBD5E1', borderRadius: 10, 
                    padding: '12px 16px', fontSize: 16, color: '#1C1C1E', outline: 'none',
                    transition: 'border 0.2s'
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #7C3AED'}
                  onBlur={e => e.target.style.border = '1.5px solid #CBD5E1'}
                >
                  <option value="">Select Experience Level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#CBD5E1' : '#7C3AED',
                color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10,
                padding: '16px 32px', marginTop: 24, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', width: '100%'
              }}
              onMouseOver={e => {
                if (!loading) e.currentTarget.style.background = '#5B21B6';
              }}
              onMouseOut={e => {
                if (!loading) e.currentTarget.style.background = '#7C3AED';
              }}
            >
              {loading ? 'Generating Roadmap...' : 'Generate Career Roadmap'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16,
            marginBottom: 24, color: '#DC2626'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Roadmap Display */}
        {roadmap && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.06)', padding: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1C1C1E', marginBottom: 24 }}>
              Your Personalized Career Roadmap
            </h2>

            {/* Semester Plan */}
            {roadmap.semesterPlan && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                  📚 Semester-wise Learning Plan
                </h3>
                <div style={{ display: 'grid', gap: 20 }}>
                  {Object.entries(roadmap.semesterPlan).map(([semester, plan]) => (
                    <div key={semester} style={{
                      border: '1px solid #E5E7EB', borderRadius: 12, padding: 20,
                      background: '#F9FAFB'
                    }}>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: '#7C3AED', marginBottom: 8 }}>
                        {plan.title}
                      </h4>
                      <p style={{ color: '#5F6368', marginBottom: 12 }}>{plan.description}</p>
                      
                      {plan.skills && plan.skills.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <strong style={{ color: '#1C1C1E' }}>Skills to Focus:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                            {plan.skills.map((skill, index) => (
                              <span key={index} style={{
                                background: '#E0E7FF', color: '#7C3AED', padding: '4px 12px',
                                borderRadius: 20, fontSize: 14, fontWeight: 600
                              }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.projects && plan.projects.length > 0 && (
                        <div>
                          <strong style={{ color: '#1C1C1E' }}>Suggested Projects:</strong>
                          <ul style={{ marginTop: 8, paddingLeft: 20, color: '#5F6368' }}>
                            {plan.projects.map((project, index) => (
                              <li key={index}>{project}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {roadmap.certifications && roadmap.certifications.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                  🏆 Recommended Certifications
                </h3>
                <div style={{ display: 'grid', gap: 16 }}>
                  {roadmap.certifications.map((cert, index) => (
                    <div key={index} style={{
                      border: '1px solid #E5E7EB', borderRadius: 12, padding: 20,
                      background: '#F9FAFB'
                    }}>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: '#1C1C1E', marginBottom: 8 }}>
                        {cert.name}
                      </h4>
                      <p style={{ color: '#5F6368', marginBottom: 8 }}>
                        <strong>Organization:</strong> {cert.organization}
                      </p>
                      <p style={{ color: '#5F6368', marginBottom: 8 }}>{cert.description}</p>
                      <p style={{ color: '#7C3AED', fontWeight: 600 }}>
                        <strong>Timeline:</strong> {cert.timeline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internships */}
            {roadmap.internships && roadmap.internships.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                  💼 Suggested Internships
                </h3>
                <div style={{ display: 'grid', gap: 16 }}>
                  {roadmap.internships.map((internship, index) => (
                    <div key={index} style={{
                      border: '1px solid #E5E7EB', borderRadius: 12, padding: 20,
                      background: '#F9FAFB'
                    }}>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: '#1C1C1E', marginBottom: 8 }}>
                        {internship.type}
                      </h4>
                      <p style={{ color: '#5F6368', marginBottom: 8 }}>{internship.description}</p>
                      <p style={{ color: '#7C3AED', fontWeight: 600, marginBottom: 8 }}>
                        <strong>Timeline:</strong> {internship.timeline}
                      </p>
                      {internship.companies && internship.companies.length > 0 && (
                        <div>
                          <strong style={{ color: '#1C1C1E' }}>Companies to Target:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                            {internship.companies.map((company, idx) => (
                              <span key={idx} style={{
                                background: '#E0E7FF', color: '#7C3AED', padding: '4px 12px',
                                borderRadius: 20, fontSize: 14, fontWeight: 600
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
              </div>
            )}

            {/* Learning Resources */}
            {roadmap.learningResources && roadmap.learningResources.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', marginBottom: 16 }}>
                  📚 Top Learning Resources
                </h3>
                <div style={{ display: 'grid', gap: 20 }}>
                  {roadmap.learningResources.map((category, index) => (
                    <div key={index} style={{
                      border: '1px solid #E5E7EB', borderRadius: 12, padding: 20,
                      background: '#F9FAFB'
                    }}>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: '#1C1C1E', marginBottom: 12 }}>
                        {category.category}
                      </h4>
                      <div style={{ display: 'grid', gap: 12 }}>
                        {category.resources.map((resource, idx) => (
                          <div key={idx} style={{
                            background: '#fff', borderRadius: 8, padding: 16,
                            border: '1px solid #E5E7EB'
                          }}>
                            <h5 style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1E', marginBottom: 4 }}>
                              {resource.name}
                            </h5>
                            <p style={{ color: '#5F6368', fontSize: 14, marginBottom: 4 }}>
                              <strong>Type:</strong> {resource.type}
                            </p>
                            <p style={{ color: '#5F6368', fontSize: 14 }}>
                              {resource.description}
                            </p>
                            {resource.link && (
                              <a 
                                href={resource.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  color: '#7C3AED', textDecoration: 'none', fontSize: 14,
                                  display: 'inline-block', marginTop: 8
                                }}
                              >
                                Visit Resource →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Advice */}
            {roadmap.careerAdvice && (
              <div style={{
                background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: 20
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 12 }}>
                  💡 Career Advice
                </h3>
                <p style={{ color: '#5F6368', lineHeight: 1.6 }}>{roadmap.careerAdvice}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 