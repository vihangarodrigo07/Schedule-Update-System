import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin@123') {
      navigate('/dashboard'); // Go to the main system
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: '#002855' }}>Academic Central University</h2>
        <p>System Administrator Portal</p>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username" 
            style={styles.input}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={styles.input}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

// Quick styles to mimic a professional look
const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f7f9' },
  card: { padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
  input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#002855', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;