import React from 'react';

const whyCards = [
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="18" fill="#1E88E5"/><path d="M12 24l6-12 6 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Follow Real Journeys',
    desc: 'See the exact steps your seniors took to land top jobs. No more guesswork, just proven paths.'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="18" fill="#7C3AED"/><path d="M12 24h12M18 12v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Certifications That Matter',
    desc: 'Discover which certifications actually helped seniors get noticed and hired.'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="18" fill="#1E88E5"/><path d="M12 18h12M18 12v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'No More Unanswered Messages',
    desc: 'Get all the info you need—no more waiting for replies on WhatsApp or LinkedIn.'
  }
];

export default function Landing() {
  // Simulate auth state (replace with real auth logic)
  const isLoggedIn = false;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F5F7FA', minHeight: '100vh', color: '#1C1C1E' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 68
      }} aria-label="Main Navigation">
        <div style={{ fontWeight: 800, fontSize: 26, color: '#7C3AED', letterSpacing: 1 }}>PathConnect</div>
        {!isLoggedIn && (
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="/login" style={{ color: '#1E88E5', fontWeight: 600, fontSize: 16, textDecoration: 'none', padding: '8px 16px', borderRadius: 6, transition: 'background 0.2s' }}>Login</a>
            <a href="/register" style={{ background: '#7C3AED', color: '#fff', fontWeight: 600, fontSize: 16, textDecoration: 'none', padding: '8px 20px', borderRadius: 8, boxShadow: '0 2px 8px rgba(124,58,237,0.08)', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#5B21B6'}
              onMouseOut={e => e.currentTarget.style.background = '#7C3AED'}
            >Register</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '64px 0 32px 0', gap: 48, background: '#F5F7FA' }}>
        <div style={{ flex: '1 1 340px', maxWidth: 500, minWidth: 280 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1C1C1E', marginBottom: 18, lineHeight: 1.15 }}>PathConnect: Real Journeys, Real Results</h1>
          <div style={{ fontSize: 20, fontWeight: 500, color: '#5F6368', marginBottom: 32, lineHeight: 1.4 }}>
            Stop guessing. Follow proven paths, learn from real journeys, and build your future with confidence.
          </div>
          <a href="/register" style={{
            display: 'inline-block', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 18,
            borderRadius: 8, padding: '12px 24px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            transition: 'background 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.background = '#5B21B6'}
            onMouseOut={e => e.currentTarget.style.background = '#7C3AED'}
            aria-label="Register Now"
          >Register Now</a>
        </div>
        <div style={{ flex: '1 1 320px', maxWidth: 400, minWidth: 220, display: 'flex', justifyContent: 'center' }}>
          <img
            src="/undraw_career-progress.svg"
            alt="Career progress illustration"
            style={{ width: '100%', maxWidth: 360, height: 'auto', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
            loading="lazy"
          />
        </div>
      </section>

      {/* Why PathConnect Section */}
      <section style={{ background: '#fff', padding: '56px 0 40px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#1C1C1E', marginBottom: 36 }}>Why PathConnect?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
          {whyCards.map((card, i) => (
            <div key={i} style={{
              background: '#F8FAFC', borderRadius: 12, padding: 20, minWidth: 240, maxWidth: 320,
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center',
              transition: 'background 0.2s, transform 0.2s', cursor: 'pointer'
            }}
              tabIndex={0}
              aria-label={card.title}
              onMouseOver={e => { e.currentTarget.style.background = '#EDF2F7'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#1C1C1E', marginBottom: 8, textAlign: 'center' }}>{card.title}</div>
              <div style={{ color: '#5F6368', fontSize: 15, textAlign: 'center' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 0 32px 0' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: '32px 40px', textAlign: 'center', maxWidth: 480 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', marginBottom: 18 }}>Start your journey with confidence</h3>
          <a href="/register" style={{
            display: 'inline-block', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 18,
            borderRadius: 8, padding: '12px 24px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            transition: 'background 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.background = '#5B21B6'}
            onMouseOut={e => e.currentTarget.style.background = '#7C3AED'}
            aria-label="Register Now"
          >Register Now</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1C1C1E', color: '#fff', padding: '32px 0 16px 0', textAlign: 'center' }}>
        
        <div style={{ fontSize: 15, color: '#fff', opacity: 0.85 }}>Made with <span aria-label="love" role="img">❤️</span> for ambitious students.</div>
      </footer>
    </div>
  );
} 