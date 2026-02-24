import React from 'react';

function App() {
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
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1e40af', 
          marginBottom: '16px' 
        }}>
          🎓 StudyBuddy
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
          Your Learning Platform is Working!
        </p>
        <div style={{ 
          backgroundColor: '#10b981', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          ✅ All Systems Operational
        </div>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
          <p>🌐 Frontend: <strong>http://localhost:5174</strong></p>
          <p>🔧 Backend: <strong>http://localhost:3001</strong></p>
          <p>🗄️ Database: <strong>SQLite</strong></p>
        </div>
      </div>
    </div>
  );
}

export default App;
