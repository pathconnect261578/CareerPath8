import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const colleges = ["Vishnu Institute of Technology"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const branches = ["CSE", "ECE", "EEE", "IT", "MECH", "CIVIL", "AI & DS", "AIML"];

function validateVishnuEmail(email) {
  return /@vishnu\.edu\.in$/i.test(email);
}

export default function LoginRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(location.pathname === '/register' ? 'register' : 'login');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState({ email: '', password: '', general: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [register, setRegister] = useState({
    firstName: '', lastName: '', college: colleges[0], year: '', branch: '', email: '', password: ''
  });
  const [registerError, setRegisterError] = useState({});
  const [success, setSuccess] = useState('');

  // Keep tab in sync with URL
  useEffect(() => {
    setTab(location.pathname === '/register' ? 'register' : 'login');
  }, [location.pathname]);

  // Handlers
  const handleTab = (t) => {
    setTab(t);
    setSuccess('');
    setLoginError({});
    setRegisterError({});
    navigate(t === 'register' ? '/register' : '/login');
  };

  // Login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    let error = {};
    if (!login.email) error.email = 'Email is required.';
    else if (!validateVishnuEmail(login.email)) error.email = 'Use your @vishnu.edu.in email.';
    if (!login.password) error.password = 'Password is required.';
    setLoginError(error);
    if (Object.keys(error).length === 0) {
      try {
        await signInWithEmailAndPassword(auth, login.email, login.password);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => window.location.href = '/dashboard', 1200);
      } catch (err) {
        setLoginError({ general: err.message });
      }
    }
  };

  // Register logic
  const handleRegister = async (e) => {
    e.preventDefault();
    let error = {};
    if (!register.firstName) error.firstName = 'First name required.';
    if (!register.lastName) error.lastName = 'Last name required.';
    if (!register.year) error.year = 'Select year.';
    if (!register.branch) error.branch = 'Select branch.';
    if (!register.email) error.email = 'Email required.';
    else if (!validateVishnuEmail(register.email)) error.email = 'Use your @vishnu.edu.in email.';
    if (!register.password || register.password.length < 6) error.password = 'Password must be at least 6 characters.';
    setRegisterError(error);
    if (Object.keys(error).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, register.email, register.password);
        await updateProfile(userCredential.user, {
          displayName: `${register.firstName} ${register.lastName}`
        });
        // Save extra user info to Firestore
        await setDoc(doc(db, 'Users', userCredential.user.uid), {
          name: `${register.firstName} ${register.lastName}`,
          college: register.college,
          year: register.year,
          branch: register.branch,
          email: register.email
        });
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => window.location.href = '/dashboard', 1200);
      } catch (err) {
        setRegisterError({ general: err.message });
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, width: '100%',
        background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 68, marginBottom: 32
      }}>
        <div style={{ fontWeight: 800, fontSize: 26, color: '#7C3AED', letterSpacing: 1 }}>PathConnect</div>
      </nav>
      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
        padding: 32, maxWidth: 420, width: '100%', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', width: '100%', marginBottom: 28, borderBottom: '1px solid #E5E7EB' }}>
          <button
            aria-label="Login Tab"
            onClick={() => handleTab('login')}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontWeight: 700, fontSize: 18, color: tab === 'login' ? '#1C1C1E' : '#94A3B8',
              borderBottom: tab === 'login' ? '2px solid #1E88E5' : '2px solid transparent',
              padding: '12px 0', cursor: 'pointer', transition: 'color 0.2s, border-bottom 0.2s'
            }}
          >Login</button>
          <button
            aria-label="Register Tab"
            onClick={() => handleTab('register')}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontWeight: 700, fontSize: 18, color: tab === 'register' ? '#1C1C1E' : '#94A3B8',
              borderBottom: tab === 'register' ? '2px solid #1E88E5' : '2px solid transparent',
              padding: '12px 0', cursor: 'pointer', transition: 'color 0.2s, border-bottom 0.2s'
            }}
          >Register</button>
        </div>
        {/* Logo/Wordmark */}
        <div style={{ fontWeight: 800, fontSize: 22, color: '#7C3AED', marginBottom: 18, letterSpacing: 1 }}>PathConnect</div>
        {/* Success Toast */}
        {success && <div style={{ background: '#DCFCE7', color: '#166534', borderRadius: 8, padding: 10, marginBottom: 18, width: '100%', textAlign: 'center', fontWeight: 600 }}>{success}</div>}
        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <label htmlFor="login-email" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15 }}>College Email</label>
            <input
              id="login-email"
              aria-label="College Email"
              type="email"
              value={login.email}
              onChange={e => setLogin({ ...login, email: e.target.value })}
              placeholder="you@vishnu.edu.in"
              style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${loginError.email ? '#EF4444' : '#CBD5E1'}`,
                borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
            />
            {loginError.email && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{loginError.email}</div>}
            <label htmlFor="login-password" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginTop: 10, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                aria-label="Password"
                type={showPassword ? 'text' : 'password'}
                value={login.password}
                onChange={e => setLogin({ ...login, password: e.target.value })}
                placeholder="Password"
                style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${loginError.password ? '#EF4444' : '#CBD5E1'}`,
                  borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
              />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED', fontSize: 16 }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {loginError.password && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{loginError.password}</div>}
            <div style={{ textAlign: 'right', margin: '6px 0 14px 0' }}>
              <a href="#" style={{ color: '#00B8A9', fontSize: 14, textDecoration: 'underline', fontWeight: 500 }}>Forgot Password?</a>
            </div>
            <button type="submit" style={{
              width: '100%', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 10,
              padding: '12px 0', marginTop: 4, marginBottom: 10, cursor: 'pointer', transition: 'background 0.2s'
            }}
              onMouseOver={e => e.currentTarget.style.background = '#5B21B6'}
              onMouseOut={e => e.currentTarget.style.background = '#7C3AED'}
            >Login</button>
            {loginError.general && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{loginError.general}</div>}
          </form>
        )}
        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <label htmlFor="reg-fn" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15 }}>First Name</label>
            <input
              id="reg-fn"
              aria-label="First Name"
              type="text"
              value={register.firstName}
              onChange={e => setRegister({ ...register, firstName: e.target.value })}
              style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${registerError.firstName ? '#EF4444' : '#CBD5E1'}`,
                borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
            />
            {registerError.firstName && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{registerError.firstName}</div>}
            <label htmlFor="reg-ln" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginTop: 10, display: 'block' }}>Last Name</label>
            <input
              id="reg-ln"
              aria-label="Last Name"
              type="text"
              value={register.lastName}
              onChange={e => setRegister({ ...register, lastName: e.target.value })}
              style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${registerError.lastName ? '#EF4444' : '#CBD5E1'}`,
                borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
            />
            {registerError.lastName && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{registerError.lastName}</div>}
            <label htmlFor="reg-college" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginTop: 10, display: 'block' }}>College Name</label>
            <select
              id="reg-college"
              aria-label="College Name"
              value={register.college}
              onChange={e => setRegister({ ...register, college: e.target.value })}
              style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid #CBD5E1`, borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
            >
              {colleges.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label htmlFor="reg-year" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginTop: 10, display: 'block' }}>Year of Study</label>
            <select
              id="reg-year"
              aria-label="Year of Study"
              value={register.year}
              onChange={e => setRegister({ ...register, year: e.target.value })}
              style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${registerError.year ? '#EF4444' : '#CBD5E1'}`,
                borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
            >
              <option value="">Select Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {registerError.year && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{registerError.year}</div>}
            <label htmlFor="reg-branch" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginTop: 10, display: 'block' }}>Branch</label>
            <select
              id="reg-branch"
              aria-label="Branch"
              value={register.branch}
              onChange={e => setRegister({ ...register, branch: e.target.value })}
              style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${registerError.branch ? '#EF4444' : '#CBD5E1'}`,
                borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
            >
              <option value="">Select Branch</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {registerError.branch && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{registerError.branch}</div>}
            <label htmlFor="reg-email" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginTop: 10, display: 'block' }}>College Email</label>
            <input
              id="reg-email"
              aria-label="College Email"
              type="email"
              value={register.email}
              onChange={e => setRegister({ ...register, email: e.target.value })}
              placeholder="you@vishnu.edu.in"
              style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${registerError.email ? '#EF4444' : '#CBD5E1'}`,
                borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
            />
            {registerError.email && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{registerError.email}</div>}
            <label htmlFor="reg-password" style={{ fontWeight: 600, color: '#1C1C1E', fontSize: 15, marginTop: 10, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                aria-label="Password"
                type={showPassword ? 'text' : 'password'}
                value={register.password}
                onChange={e => setRegister({ ...register, password: e.target.value })}
                placeholder="Password"
                style={{ width: '100%', background: '#F1F5F9', border: `1.5px solid ${registerError.password ? '#EF4444' : '#CBD5E1'}`,
                  borderRadius: 8, padding: 12, fontSize: 16, margin: '8px 0 0 0', outline: 'none', marginBottom: 2 }}
              />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED', fontSize: 16 }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {registerError.password && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{registerError.password}</div>}
            {registerError.general && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>{registerError.general}</div>}
            <button type="submit" style={{
              width: '100%', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 10,
              padding: '12px 0', marginTop: 4, marginBottom: 10, cursor: 'pointer', transition: 'background 0.2s'
            }}
              onMouseOver={e => e.currentTarget.style.background = '#5B21B6'}
              onMouseOut={e => e.currentTarget.style.background = '#7C3AED'}
            >Register</button>
          </form>
        )}
      </div>
    </div>
  );
} 