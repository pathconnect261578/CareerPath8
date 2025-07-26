import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const domains = [
  'All Domains',
  'Frontend',
  'Backend',
  'Data Science',
  'DevOps',
  'AI&ML',
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login');
      } else {
        setUser(firebaseUser);
        // Fetch extra user info from Firestore
        const ref = doc(db, 'Users', firebaseUser.uid);
        const snap = await getDoc(ref);
        setUserData(snap.exists() ? snap.data() : null);
      }
    });
    async function fetchSeniors() {
      setLoading(true);
      const colRef = collection(db, 'seniors');
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeniors(data);
      setLoading(false);
    }
    fetchSeniors();
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Filtering logic
  let filtered = seniors;
  if (selectedDomain !== 'All Domains') filtered = filtered.filter(s => s.domain === selectedDomain);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.company && s.company.toLowerCase().includes(q)) ||
      (s.skills && s.skills.some(skill => skill.toLowerCase().includes(q)))
    );
  }
  const total = filtered.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Pagination controls
  const Pagination = () => (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '32px 0 0 0' }}>
      {Array.from({ length: pageCount }).map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: page === i + 1 ? '#7C3AED' : '#E0E7FF',
            color: page === i + 1 ? '#fff' : '#1C1C1E',
            border: 'none', fontWeight: 700, fontSize: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s', outline: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseOver={e => {
            if (page !== i + 1) e.currentTarget.style.background = '#5B21B6', e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={e => {
            if (page !== i + 1) e.currentTarget.style.background = '#E0E7FF', e.currentTarget.style.color = '#1C1C1E';
          }}
        >{i + 1}</button>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>
      <Navbar user={user} userData={userData} onLogout={handleLogout} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        {/* Welcome + CTA */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1C1C1E', marginBottom: 12, opacity: fadeIn ? 1 : 0, transform: fadeIn ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.7s, transform 0.7s' }}>
            Welcome, {user?.displayName || 'Guest'}! Ready to explore your future?
          </div>
          <button
            style={{ background: '#7C3AED', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s', minWidth: 180 }}
            onMouseOver={e => e.currentTarget.style.background = '#5B21B6'}
            onMouseOut={e => e.currentTarget.style.background = '#7C3AED'}
            onClick={() => window.location.href = '/generate-roadmap'}
          >AI Roadmap Generator</button>
        </div>
        {/* Filter Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="domain" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginBottom: 6, display: 'block' }}>Domain</label>
            <div style={{ position: 'relative' }}>
              <select
                id="domain"
                aria-label="Domain"
                value={selectedDomain}
                onChange={e => { setSelectedDomain(e.target.value); setPage(1); }}
                style={{
                  width: '100%', background: '#fff', border: '1.5px solid #CBD5E1', borderRadius: 10, padding: '12px 40px 12px 16px', fontSize: 16,
                  color: '#1C1C1E', outline: 'none', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.border = '1.5px solid #7C3AED'}
                onBlur={e => e.target.style.border = '1.5px solid #CBD5E1'}
              >
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M6 8l4 4 4-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label htmlFor="search" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginBottom: 6, display: 'block' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <input
                id="search"
                aria-label="Search by name, company, or skills"
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, company, or skills..."
                style={{
                  width: '100%', background: '#fff', border: '1.5px solid #CBD5E1', borderRadius: 10, padding: '12px 40px 12px 16px', fontSize: 16,
                  color: '#1C1C1E', outline: 'none', transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.border = '1.5px solid #7C3AED'}
                onBlur={e => e.target.style.border = '1.5px solid #CBD5E1'}
              />
              <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="7" stroke="#7C3AED" strokeWidth="2" />
                <path d="M16 16l-3-3" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
        {loading ? <div style={{textAlign: 'center', marginTop: 40}}>Loading seniors...</div> : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, width: '100%',
        }}>
          {paged.map((senior, idx) => (
            <div key={senior.id} style={{
              background: '#fff', borderRadius: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.06)', padding: 20, display: 'flex', flexDirection: 'column', minHeight: 210,
              transition: 'background 0.2s, transform 0.2s, opacity 0.7s', cursor: 'pointer', opacity: fadeIn ? 1 : 0, transform: fadeIn ? 'translateY(0)' : 'translateY(16px)',
            }}
              tabIndex={0}
              aria-label={`View story for ${senior.name}`}
              onClick={() => window.location.href = `/senior/${slugify(senior.name)}`}
              onMouseOver={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
            >
              {/* Name & Company */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {senior.company && senior.company[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1C1C1E' }}>{senior.name}</div>
                  <div style={{ color: '#5F6368', fontSize: 15 }}>{senior.role} <span style={{ color: '#CBD5E1', margin: '0 6px' }}>|</span> <span style={{ color: '#1E88E5', fontWeight: 700 }}>{senior.company}</span></div>
                </div>
              </div>
              {/* Grad Year, Package */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                <span style={{ color: '#5F6368', fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18" style={{ marginRight: 2 }}><path d="M3 6.75L9 3l6 3.75v6.75A2.25 2.25 0 0 1 12.75 15h-7.5A2.25 2.25 0 0 1 3 13.5V6.75Z" stroke="#5F6368" strokeWidth="1.5"/></svg>
                  {senior.grad}
                </span>
                <span style={{ color: '#10B981', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18" style={{ marginRight: 2 }}><path d="M9 2v14M4 7h10" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {senior.package}
                </span>
              </div>
              {/* Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {senior.skills && senior.skills.slice(0, 3).map(skill => (
                  <span key={skill} style={{ background: '#E0F2FE', color: '#1E88E5', borderRadius: 999, fontSize: 13, padding: '4px 10px', fontWeight: 600 }}>{skill}</span>
                ))}
                {senior.skills && senior.skills.length > 3 && (
                  <span style={{ background: '#E0F2FE', color: '#1E88E5', borderRadius: 999, fontSize: 13, padding: '4px 10px', fontWeight: 600 }}>+{senior.skills.length - 3} more</span>
                )}
              </div>
              {/* View Story Button */}
              <button style={{
                background: '#7C3AED', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer',
                alignSelf: 'flex-end', marginTop: 'auto', transition: 'background 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.background = '#5B21B6'}
                onMouseOut={e => e.currentTarget.style.background = '#7C3AED'}
                onClick={e => { e.stopPropagation(); window.location.href = `/senior/${slugify(senior.name)}`; }}
              >View Story</button>
            </div>
          ))}
        </div>
        )}
        {/* Pagination */}
        <Pagination />
      </main>
    </div>
  );
} 