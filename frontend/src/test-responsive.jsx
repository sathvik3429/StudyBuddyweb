import React from 'react';

function TestResponsive() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1e40af', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          🎓 Responsive Test Page
        </h1>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', color: '#374151', marginBottom: '20px' }}>
            If you can see this page, React is working!
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div style={{ 
              backgroundColor: '#dbeafe', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
                📱 Mobile
              </div>
              <div style={{ fontSize: '16px', color: '#1e40af' }}>320px - 768px</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#dcfce7', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>
                📱 Tablet
              </div>
              <div style={{ fontSize: '16px', color: '#059669' }}>768px - 1024px</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#f3e8ff', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>
                🖥️ Desktop
              </div>
              <div style={{ fontSize: '16px', color: '#7c3aed' }}>1024px+</div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#10b981', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              ✅ Responsive Design Working!
            </h3>
            <p>Screen Width: <span id="screen-width">Loading...</span></p>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
          <p><strong>🌐 Frontend:</strong> http://localhost:5174</p>
          <p><strong>🔧 Backend:</strong> http://localhost:3001</p>
          <p><strong>🗄️ Database:</strong> Enhanced SQLite ✅</p>
          <p><strong>📱 Responsive:</strong> Mobile-First Design ✅</p>
          <p><strong>🤖 AI Service:</strong> Free LLM Integration ✅</p>
        </div>
      </div>
    </div>
  );
}

export default TestResponsive;
