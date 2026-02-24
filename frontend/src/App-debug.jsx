import React, { useState, useEffect } from 'react';

function App() {
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState('');

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCORS = async () => {
    try {
      addLog('Testing GET request...');
      
      // Test GET request
      const getResponse = await fetch('http://localhost:3001/api/courses', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        addLog(`✅ GET Success: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        addLog(`❌ GET Failed: ${getResponse.status} ${getResponse.statusText}`);
      }

      // Test POST request
      addLog('Testing POST request...');
      
      const postResponse = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Course ' + Date.now(),
          description: 'CORS test course'
        })
      });
      
      if (postResponse.ok) {
        const data = await postResponse.json();
        addLog(`✅ POST Success: ${JSON.stringify(data).substring(0, 100)}...`);
        setTestResult('✅ Both GET and POST work!');
      } else {
        addLog(`❌ POST Failed: ${postResponse.status} ${postResponse.statusText}`);
        addLog(`Response body: ${await postResponse.text()}`);
        setTestResult('❌ POST request failed - check CORS');
      }
      
    } catch (error) {
      addLog(`❌ Network Error: ${error.message}`);
      setTestResult('❌ Network error - check console');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#dc2626', 
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          🔧 CORS & API Debug Tool
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={testCORS}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🧪 Test API Calls (GET + POST)
          </button>
        </div>
        
        {testResult && (
          <div style={{ 
            backgroundColor: testResult.includes('✅') ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {testResult}
          </div>
        )}
        
        <div style={{ 
          backgroundColor: '#1f2937', 
          color: '#f3f4f6',
          padding: '16px', 
          borderRadius: '8px', 
          marginTop: '16px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>📋 Debug Logs:</div>
          {logs.map((log, index) => (
            <div key={index} style={{ 
              borderBottom: '1px solid #374151', 
              padding: '4px 0',
              fontSize: '11px'
            }}>
              {log}
            </div>
          ))}
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <div style={{ marginBottom: '4px' }}>
            <strong>🌐 Frontend:</strong> http://localhost:5174
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>🔧 Backend:</strong> http://localhost:3001
          </div>
          <div>
            <strong>💡 Instructions:</strong> Click the test button above
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
