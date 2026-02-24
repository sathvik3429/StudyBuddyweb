import React from 'react';

function ButtonTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f9ff', 
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
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#1e40af', 
          marginBottom: '30px' 
        }}>
          🎓 Button Test
        </h1>
        
        <p style={{ fontSize: '18px', color: '#374151', marginBottom: '30px' }}>
          Testing button visibility
        </p>
        
        {/* Test different button styles */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onClick={() => alert('Button 1 clicked!')}
          >
            Button 1
          </button>
          
          <button 
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onClick={() => alert('Button 2 clicked!')}
          >
            Button 2
          </button>
          
          <button 
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={() => alert('Button 3 clicked!')}
          >
            Button 3
          </button>
        </div>
        
        {/* Test inline styles */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onClick={() => alert('Red button clicked!')}
          >
            Red Button
          </button>
          
          <button 
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={() => alert('Orange button clicked!')}
          >
            Orange Button
          </button>
        </div>
        
        {/* Test simple div as button */}
        <div style={{ marginBottom: '20px' }}>
          <div 
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-block',
              marginRight: '10px'
            }}
            onClick={() => alert('Div button clicked!')}
          >
            Div Button
          </div>
          
          <div 
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-block'
            }}
            onClick={() => alert('Green div clicked!')}
          >
            Green Div
          </div>
        </div>
        
        {/* Test with hover */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            style={{
              backgroundColor: '#1e40af',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#1e40af';
            }}
            onClick={() => alert('Hover button clicked!')}
          >
            Hover Button
          </button>
        </div>
        
        <div style={{ marginTop: '30px', fontSize: '14px', color: '#6b7280' }}>
          <p><strong>🌐 URL:</strong> http://localhost:5174</p>
          <p><strong>🎯 Status:</strong> Testing button visibility</p>
          <p><strong>💡 Click any button to test</strong></p>
          <p><strong>🔍 Check console (F12) for errors</strong></p>
        </div>
      </div>
    </div>
  );
}

export default ButtonTest;
