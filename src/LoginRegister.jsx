import React, { useState } from 'react';

const API = 'http://localhost:5000';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a2e',
    fontFamily: 'Arial, sans-serif',
  },
  box: {
    background: '#16213e',
    padding: '40px',
    borderRadius: '16px',
    width: '400px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  logo: { textAlign: 'center', fontSize: '40px', marginBottom: '8px' },
  title: {
    textAlign: 'center',
    color: '#7c6af7',
    letterSpacing: '4px',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '13px',
    marginBottom: '24px',
  },
  tabs: {
    display: 'flex',
    background: '#0f3460',
    borderRadius: '30px',
    marginBottom: '24px',
    padding: '4px',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    background: 'transparent',
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  tabActive: {
    background: '#7c6af7',
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: '14px',
    marginBottom: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#0f3460',
    color: '#fff',
    fontSize: '15px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #7c6af7, #5a9cf8)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: '10px', fontSize: '14px' },
  success: { color: '#51cf66', textAlign: 'center', marginBottom: '10px', fontSize: '14px' },
  link: { textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '16px' },
  linkBtn: { color: '#7c6af7', cursor: 'pointer', background: 'none', border: 'none', fontSize: '13px' },
};

export default function LoginRegister({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage('❌ ' + data.message);
      } else {
        setIsError(false);
        setMessage('✅ Registration successful! Ab login karo.');
        setIsLogin(true);
      }
    } catch {
      setIsError(true);
      setMessage('❌ Server se connect nahi ho pa raha!');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage('❌ ' + data.message);
      } else {
        setIsError(false);
        setMessage('✅ Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
      }
    } catch {
      setIsError(true);
      setMessage('❌ Server se connect nahi ho pa raha!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logo}>🤟</div>
        <div style={styles.title}>SIGN BRIDGE</div>
        <div style={styles.subtitle}>Sign Language Learning Platform</div>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(isLogin ? styles.tabActive : {}) }}
            onClick={() => { setIsLogin(true); setMessage(''); }}
          >Login</button>
          <button
            style={{ ...styles.tab, ...(!isLogin ? styles.tabActive : {}) }}
            onClick={() => { setIsLogin(false); setMessage(''); }}
          >Register</button>
        </div>

        {!isLogin && (
          <input
            style={styles.input}
            placeholder="👤 Apna naam likho"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}
        <input
          style={styles.input}
          placeholder="📧 Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="🔒 Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {message && (
          <div style={isError ? styles.error : styles.success}>{message}</div>
        )}

        <button style={styles.button} onClick={isLogin ? handleLogin : handleRegister}>
          {isLogin ? '🚀 Login' : '✅ Register'}
        </button>

        <div style={styles.link}>
          {isLogin ? (
            <>Account nahi hai? <button style={styles.linkBtn} onClick={() => { setIsLogin(false); setMessage(''); }}>Register karo</button></>
          ) : (
            <>Already account hai? <button style={styles.linkBtn} onClick={() => { setIsLogin(true); setMessage(''); }}>Login karo</button></>
          )}
        </div>
      </div>
    </div>
  );
}