import React from 'react';

function BasicTest() {
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
        borderRadius: '16px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#1e40af', 
          marginBottom: '20px' 
        }}>
          🎓 StudyBuddy
        </h1>
        <p style={{ fontSize: '20px', color: '#374151', marginBottom: '20px' }}>
          If you see this page, React is working!
        </p>
        <div style={{ 
          backgroundColor: '#10b981', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          fontSize: '18px'
        }}>
          ✅ Frontend Working
        </div>
        <div style={{ marginTop: '20px', fontSize: '16px', color: '#6b7280' }}>
          <p><strong>🌐 Frontend:</strong> http://localhost:5174</p>
          <p><strong>🔧 Backend:</strong> http://localhost:3001</p>
          <p><strong>🗄️ Database:</strong> SQLite ✅</p>
          <p><strong>🎯 Status:</strong> React Rendering ✅</p>
        </div>
      </div>
    </div>
  );
}

export default BasicTest;
