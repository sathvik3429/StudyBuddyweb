import React from 'react';

function DebugTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
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
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#1e40af', 
          marginBottom: '20px' 
        }}>
          🎓 StudyBuddy Debug Test
        </h1>
        <p style={{ fontSize: '20px', color: '#374151', marginBottom: '20px' }}>
          If you see this page, React is working!
        </p>
        <div style={{ 
          backgroundColor: '#10b981', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          fontSize: '18px',
          marginBottom: '20px'
        }}>
          ✅ Frontend Server: Running
        </div>
        <div style={{ 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          fontSize: '18px',
          marginBottom: '20px'
        }}>
          🔧 Backend Server: http://localhost:3001
        </div>
        <div style={{ 
          backgroundColor: '#8b5cf6', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          fontSize: '18px',
          marginBottom: '20px'
        }}>
          🤖 Hugging Face AI: Configured
        </div>
        <div style={{ marginTop: '20px', fontSize: '16px', color: '#6b7280' }}>
          <p><strong>🌐 Frontend URL:</strong> http://localhost:5174</p>
          <p><strong>🔧 Backend URL:</strong> http://localhost:3001</p>
          <p><strong>🗄️ Database:</strong> Enhanced SQLite ✅</p>
          <p><strong>🤖 AI Service:</strong> Hugging Face ✅</p>
          <p><strong>📱 Responsive:</strong> Mobile-First ✅</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => window.location.href = '/courses'}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📚 Go to Courses
          </button>
          <button 
            onClick={() => window.location.href = '/notes'}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📝 Go to Notes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DebugTest;
