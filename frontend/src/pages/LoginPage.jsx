import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Login successful!');
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        onLogin(result.data.user);
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '3rem', 
        borderRadius: '1rem', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
            🎓 StudyBuddy
          </h1>
          <p style={{ color: '#6b7280', margin: '0' }}>Sign in to your account</p>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.5rem',
            backgroundColor: message.includes('✅') ? '#10b981' : '#ef4444',
            color: 'white',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0' }}>
            Don't have an account?{' '}
            <button 
              onClick={() => alert('Sign up feature coming soon!')}
              style={{ 
                color: '#3b82f6', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign up
            </button>
          </p>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '0', textAlign: 'center' }}>
            Demo Credentials: john@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
