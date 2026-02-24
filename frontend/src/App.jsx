import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import NotesPage from './pages/NotesPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/new" element={<CoursesPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/new" element={<NotesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
