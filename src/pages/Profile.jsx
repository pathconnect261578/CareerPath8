import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login');
      } else {
        setUser(firebaseUser);
        // Fetch extra user info from Firestore
        const ref = doc(db, 'Users', firebaseUser.uid);
        const snap = await getDoc(ref);
        setUserData(snap.exists() ? snap.data() : null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>
      <Navbar user={user} userData={userData} onLogout={handleLogout} />
      <main style={{ maxWidth: 480, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.06)', padding: 36, textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1C1C1E', marginBottom: 10 }}>Profile</h2>
        <div style={{ color: '#5F6368', fontWeight: 500, fontSize: 17, marginBottom: 28 }}>Your account details</div>
        {loading ? (
          <div style={{ color: '#7C3AED', fontWeight: 600, fontSize: 18 }}>Loading...</div>
        ) : (
          <>
            <div style={{ marginBottom: 18, fontSize: 18, color: '#1C1C1E', fontWeight: 700 }}>{userData?.name || user?.displayName || 'User'}</div>
            <div style={{ marginBottom: 18, fontSize: 16, color: '#5F6368' }}>{user?.email}</div>
            <div style={{ marginBottom: 18, fontSize: 16, color: '#5F6368' }}>College: {userData?.college || '-'}</div>
            <div style={{ marginBottom: 18, fontSize: 16, color: '#5F6368' }}>Year: {userData?.year || '-'}</div>
            <div style={{ marginBottom: 18, fontSize: 16, color: '#5F6368' }}>Branch: {userData?.branch || '-'}</div>
          </>
        )}
      </main>
    </div>
  );
} 