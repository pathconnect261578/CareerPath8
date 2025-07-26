import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  boxShadow: '0 4px 24px 0 rgba(59,130,246,0.10)',
  padding: '2.5rem 2rem',
  marginBottom: '2rem',
};
const sectionTitle = {
  fontWeight: 700,
  fontSize: 22,
  marginBottom: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
const tagStyle = {
  display: 'inline-block',
  padding: '6px 18px',
  background: '#E0F2FE',
  color: '#1E88E5',
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 15,
  marginBottom: 8,
};
const techTag = {
  display: 'inline-block',
  padding: '4px 12px',
  background: '#E0F2FE',
  color: '#1E88E5',
  borderRadius: 999,
  fontWeight: 500,
  fontSize: 13,
  marginRight: 8,
  marginBottom: 6,
};
const gradientBg = {
  background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)',
  minHeight: '100vh',
  fontFamily: 'Inter, Open Sans, Segoe UI, sans-serif',
  padding: 0,
  margin: 0,
};
const greenText = { color: '#10B981', fontWeight: 700, fontSize: 24 };
const blueText = { color: '#1E88E5', fontWeight: 700 };
const quoteBlock = {
  background: 'linear-gradient(90deg, #4F46E5 0%, #3B82F6 100%)',
  color: '#fff',
  borderRadius: 18,
  padding: '2rem',
  fontStyle: 'italic',
  fontSize: 20,
  margin: '2.5rem 0 1.5rem 0',
  textAlign: 'center',
  boxShadow: '0 4px 24px 0 rgba(59,130,246,0.10)',
};

export default function SeniorStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [senior, setSenior] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSenior() {
      setLoading(true);
      const ref = doc(db, 'seniors', id);
      const snap = await getDoc(ref);
      if (snap.exists()) setSenior(snap.data());
      else setSenior(null);
      setLoading(false);
    }
    fetchSenior();
  }, [id]);

  if (loading) return <div style={{textAlign: 'center', marginTop: 40}}>Loading...</div>;
  if (!senior) return <div style={{textAlign: 'center', marginTop: 40}}>Senior not found.</div>;

  return (
    <div style={gradientBg}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 12px 24px 12px' }}>
        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#fff',
            border: '1px solid #7C3AED',
            color: '#7C3AED',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 24,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 4px 0 rgba(124,58,237,0.04)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#F8FAFC';
            e.currentTarget.style.color = '#5B21B6';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#7C3AED';
          }}
        >
          ← Back to Dashboard
        </button>
        {/* Top Profile Card */}
        <div style={{ ...cardStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontWeight: 800, fontSize: 32, marginBottom: 6, color: '#1C1C1E' }}>{senior.name}</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#5F6368', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              {senior.role}
              <span title={senior.company} style={{ color: '#1E88E5', fontSize: 22, display: 'inline-flex', alignItems: 'center' }}>🔵</span>
              <span style={{ color: '#5F6368', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 4 }}>🎓 {senior.grad}</span>
            </div>
            <div style={tagStyle}>{senior.domain}</div>
            <div style={{ fontStyle: 'italic', color: '#444', fontSize: 17, marginTop: 10, lineHeight: 1.6 }}>“{senior.quote}”</div>
          </div>
          <div style={{ minWidth: 120, textAlign: 'right' }}>
            <div style={greenText}>{senior.package}</div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, marginBottom: 40, alignItems: 'start' }}>
          {/* Left: Timeline & Projects & Internship */}
          <div>
            {/* Timeline */}
            <div style={cardStyle}>
              <div style={sectionTitle}>⏰ Journey Timeline</div>
              <div style={{ color: '#5F6368', fontSize: 15, marginBottom: 18 }}>The complete roadmap from student to professional</div>
              <div style={{ position: 'relative', marginLeft: 18 }}>
                {senior.timeline && senior.timeline.map((stage, idx) => (
                  <div key={stage.title} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: idx !== senior.timeline.length - 1 ? 32 : 0, position: 'relative' }}>
                    {/* Timeline vertical line */}
                    {idx !== senior.timeline.length - 1 && (
                      <span style={{ position: 'absolute', left: 7, top: 28, width: 3, height: 'calc(100% - 28px)', background: '#E2E8F0', borderRadius: 2, zIndex: 0 }} />
                    )}
                    {/* Tick icon */}
                    <span style={{ color: '#1E88E5', fontSize: 22, marginRight: 18, zIndex: 1 }}>●</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#1C1C1E', fontSize: 17 }}>{stage.title}</div>
                        <div style={{ color: '#5F6368', fontSize: 13, fontWeight: 500 }}>{stage.year}</div>
                      </div>
                      <div style={{ color: '#444', fontSize: 15, marginTop: 4 }}>{stage.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Projects */}
            <div style={cardStyle}>
              <div style={sectionTitle}>💻 Key Projects</div>
              <div style={{ color: '#5F6368', fontSize: 15, marginBottom: 18 }}>Projects that made a difference in the journey</div>
              {senior.projects && senior.projects.map((proj) => (
                <div key={proj.name} style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: '#1C1C1E', fontSize: 16, marginBottom: 2 }}>{proj.name}</div>
                  <div style={{ color: '#444', fontSize: 15, marginBottom: 6 }}>{proj.desc}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {proj.tech && proj.tech.map((t) => (
                      <span key={t} style={techTag}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Internship */}
            <div style={cardStyle}>
              <div style={sectionTitle}>🧳 Internship Experience</div>
              {senior.internships && senior.internships.map((intern) => (
                <div key={intern.company + intern.role} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, color: '#1C1C1E', fontSize: 15 }}>{intern.role}</span>
                    {intern.link ? (
                      <a href={intern.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1E88E5', textDecoration: 'underline', fontWeight: 600, fontSize: 15 }}>@ {intern.company}</a>
                    ) : (
                      <span style={{ color: '#1E88E5', fontWeight: 600, fontSize: 15 }}>@ {intern.company}</span>
                    )}
                    <span style={{ color: '#5F6368', fontSize: 13, fontWeight: 500 }}>{intern.duration}</span>
                  </div>
                  <div style={{ color: '#444', fontSize: 15, marginBottom: 4 }}>{intern.desc}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {intern.tech && intern.tech.map((t) => (
                      <span key={t} style={techTag}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Skills, Certifications, Resources, Interview Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Skills */}
            <div style={cardStyle}>
              <div style={sectionTitle}>🎯 Technical Skills</div>
              <ul style={{ color: '#1E88E5', fontWeight: 600, fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
                {senior.skills && senior.skills.map((s) => (
                  <li key={s} style={{ marginBottom: 6 }}>{s}</li>
                ))}
              </ul>
            </div>
            {/* Certifications */}
            <div style={cardStyle}>
              <div style={sectionTitle}>🎓 Certifications</div>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                {senior.certifications && senior.certifications.map((cert) => (
                  <li key={cert.title} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, color: '#1C1C1E', fontSize: 15 }}>{cert.title}</div>
                    <div style={{ color: '#5F6368', fontSize: 13 }}>{cert.org} • {cert.date}</div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Resources */}
            <div style={cardStyle}>
              <div style={sectionTitle}>📘 Learning Resources</div>
              {senior.resources && senior.resources.map((group) => (
                <div key={group.topic} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: '#1E88E5', fontSize: 15, marginBottom: 2 }}>{group.topic}</div>
                  <ul style={{ color: '#444', fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
                    {group.items && group.items.map((item) => (
                      <li key={item} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Interview Tips */}
            <div style={cardStyle}>
              <div style={sectionTitle}>💡 Interview Tips</div>
              <ul style={{ color: '#1E88E5', fontWeight: 500, fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
                {senior.interviewTips && senior.interviewTips.map((tip, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <span style={{ marginTop: 7, fontSize: 12, color: '#1E88E5' }}>●</span>
                    <span style={{ color: '#444', fontWeight: 400 }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Final Advice */}
        {senior.finalAdvice && (
          <div style={quoteBlock}>
            <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 10 }}>{senior.finalAdvice.title}</div>
            <div style={{ fontStyle: 'italic', fontSize: 19, marginBottom: 8 }}>“{senior.finalAdvice.quote}”</div>
            <div style={{ fontWeight: 600, fontSize: 17 }}>{senior.finalAdvice.signature}</div>
          </div>
        )}
      </div>
    </div>
  );
} 