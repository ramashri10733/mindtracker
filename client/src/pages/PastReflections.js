import React, { useState, useEffect } from 'react';
import api from '../services/api';

function PastReflections() {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/reflections');
      setReflections(response.data);
    } catch (error) {
      console.error('Error fetching reflections:', error);
      setError('Failed to load reflections');
    } finally {
      setLoading(false);
    }
  };

  const filteredReflections = reflections
    .filter(reflection => filter === 'all' || reflection.mood === filter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getMoodEmoji = (mood) => {
    const emojis = {
      great: '😊',
      good: '🙂',
      neutral: '😐',
      bad: '😔',
      terrible: '😢'
    };
    return emojis[mood] || '❓';
  };

  if (loading) {
    return <div className="loading">Loading reflections...</div>;
  }

  return (
    <div className="reflections-container">
      <h2>Past Reflections</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <div className="filter-group">
          <label>Filter by mood:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Moods</option>
            <option value="great">Great 😊</option>
            <option value="good">Good 🙂</option>
            <option value="neutral">Neutral 😐</option>
            <option value="bad">Bad 😔</option>
            <option value="terrible">Terrible 😢</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="reflections-list">
        {filteredReflections.length === 0 ? (
          <p className="no-reflections">No reflections found.</p>
        ) : (
          filteredReflections.map((reflection) => (
            <div key={reflection._id} className="reflection-card">
              <div className="reflection-header">
                <span className="reflection-date">
                  {new Date(reflection.createdAt).toLocaleDateString()}
                </span>
                <span className="reflection-mood">
                  {getMoodEmoji(reflection.mood)} {reflection.mood}
                </span>
              </div>
              
              <div className="reflection-content">
                <div className="reflection-section">
                  <h4>Gratitude</h4>
                  <p>{reflection.gratitude}</p>
                </div>
                
                <div className="reflection-section">
                  <h4>Challenges</h4>
                  <p>{reflection.challenges}</p>
                </div>
                
                <div className="reflection-section">
                  <h4>Lessons</h4>
                  <p>{reflection.lessons}</p>
                </div>
                
                <div className="reflection-section">
                  <h4>Goals</h4>
                  <p>{reflection.goals}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PastReflections; 