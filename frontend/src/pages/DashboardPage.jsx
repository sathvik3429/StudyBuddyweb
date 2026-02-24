import React, { useState, useEffect } from 'react';

function DashboardPage({ user }) {
  const [stats, setStats] = useState({
    courses: 0,
    notes: 0,
    summaries: 0,
    studyTime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats (without auth)
      const statsResponse = await fetch('http://localhost:3001/api/dashboard/stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      } else {
        // Set default stats if API fails
        setStats({
          courses: 0,
          notes: 0,
          summaries: 0,
          studyTime: 0
        });
      }

      // Fetch recent activity (without auth)
      const activityResponse = await fetch('http://localhost:3001/api/dashboard/activity');
      const activityData = await activityResponse.json();
      
      if (activityData.success) {
        setRecentActivity(activityData.data);
      }

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      // Set default values on error
      setStats({
        courses: 0,
        notes: 0,
        summaries: 0,
        studyTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #3b82f6', 
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
          Welcome back, {user.name}! 👋
        </h1>
        <p style={{ color: '#6b7280', margin: '0' }}>Here's your learning progress overview</p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
          <h3 style={{ color: '#3b82f6', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{stats.courses}</h3>
          <p style={{ color: '#6b7280', margin: '0' }}>Courses</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
          <h3 style={{ color: '#10b981', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{stats.notes}</h3>
          <p style={{ color: '#6b7280', margin: '0' }}>Notes</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
          <h3 style={{ color: '#8b5cf6', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{stats.summaries}</h3>
          <p style={{ color: '#6b7280', margin: '0' }}>AI Summaries</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏱️</div>
          <h3 style={{ color: '#f59e0b', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{stats.studyTime}h</h3>
          <p style={{ color: '#6b7280', margin: '0' }}>Study Time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>🚀 Quick Actions</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <button 
            onClick={() => window.location.hash = '#/courses/create'}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            ➕ Create Course
          </button>
          <button 
            onClick={() => window.location.hash = '#/notes/create'}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            ➕ Create Note
          </button>
          <button 
            onClick={() => window.location.hash = '#/flashcards'}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            🃏 Flashcards
          </button>
          <button 
            onClick={() => window.location.hash = '#/study'}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            📚 Study Session
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>📈 Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
            No recent activity. Start learning to see your progress here!
          </p>
        ) : (
          <div style={{ spaceY: '1rem' }}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: index < recentActivity.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>
                    {activity.type === 'course' ? '📚' : activity.type === 'note' ? '📝' : '🤖'}
                  </div>
                  <div>
                    <p style={{ color: '#1f2937', margin: '0', fontWeight: 'medium' }}>{activity.title}</p>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>{activity.description}</p>
                  </div>
                </div>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
