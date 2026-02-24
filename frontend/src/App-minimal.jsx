import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function SimpleLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      <header style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>StudyBuddy</h1>
        <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Modern Learning Platform</p>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}

function SimpleDashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>📚 Courses</h2>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '8px' }}>3</p>
        <p style={{ color: '#6b7280' }}>Total courses created</p>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>📝 Notes</h2>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>12</p>
        <p style={{ color: '#6b7280' }}>Total notes created</p>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>✨ AI Summaries</h2>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>5</p>
        <p style={{ color: '#6b7280' }}>AI-powered summaries generated</p>
      </div>
    </div>
  );
}

function App() {
  console.log('Minimal StudyBuddy App is rendering...');
  
  return (
    <Router>
      <SimpleLayout>
        <Routes>
          <Route path="/" element={<SimpleDashboard />} />
          <Route path="/courses" element={<SimpleDashboard />} />
          <Route path="/notes" element={<SimpleDashboard />} />
        </Routes>
      </SimpleLayout>
    </Router>
  );
}

export default App;
