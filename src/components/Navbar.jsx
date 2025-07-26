import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, userData, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 68
    }}>
      <div style={{ fontWeight: 800, fontSize: 26, color: '#7C3AED', letterSpacing: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>PathConnect</div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{ color: '#1C1C1E', fontWeight: 600, fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard</span>
        <span style={{ color: '#1C1C1E', fontWeight: 600, fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/generate-roadmap')}>AI Roadmap Generator</span>
        <div style={{ position: 'relative' }}>
          <button
            style={{
              color: '#7C3AED', fontWeight: 700, fontSize: 16, cursor: 'pointer', border: 'none', background: 'none',
              borderBottom: '2px solid #7C3AED', paddingBottom: 2
            }}
            onClick={() => setShowDropdown((v) => !v)}
          >
            Profile
          </button>
          {showDropdown && (
            <div style={{
              position: 'absolute', right: 0, top: 36, background: '#fff', boxShadow: '0 8px 20px rgba(0,0,0,0.10)', borderRadius: 12, minWidth: 220, padding: 20, zIndex: 200
            }}>
              <div style={{ marginBottom: 12, fontSize: 18, color: '#1C1C1E', fontWeight: 700 }}>{userData?.name || user?.displayName || 'User'}</div>
              <div style={{ marginBottom: 8, fontSize: 15, color: '#5F6368' }}>{user?.email}</div>
              <div style={{ marginBottom: 8, fontSize: 15, color: '#5F6368' }}>College: {userData?.college || '-'}</div>
              <div style={{ marginBottom: 8, fontSize: 15, color: '#5F6368' }}>Year: {userData?.year || '-'}</div>
              <div style={{ marginBottom: 8, fontSize: 15, color: '#5F6368' }}>Branch: {userData?.branch || '-'}</div>
              <button
                onClick={onLogout}
                style={{ background: '#EF4444', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, padding: '10px 24px', marginTop: 10, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#B91C1C'}
                onMouseOut={e => e.currentTarget.style.background = '#EF4444'}
              >Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 