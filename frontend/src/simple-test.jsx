import React from 'react';

function SimpleTest() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Simple React Test</h1>
      <p>If you see this, React basic rendering works.</p>
      <div style={{ 
        backgroundColor: '#e0f2fe', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        color: 'white'
      }}>
        <p>React is working! ✅</p>
      </div>
    </div>
  );
}

export default SimpleTest;
