import React, { useState, useEffect } from 'react';
import api from '../services/api';

function DailyReflection() {
  const [reflection, setReflection] = useState({
    mood: '',
    gratitude: '',
    challenges: '',
    lessons: '',
    goals: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate required fields
      if (!reflection.mood) {
        setError('Please select your mood');
        return;
      }

      if (!reflection.gratitude.trim()) {
        setError('Please write what you are grateful for');
        return;
      }

      console.log('Submitting reflection:', reflection);

      const response = await api.post('/reflections', reflection);
      console.log('Reflection saved successfully:', response.data);

      setReflection({
        mood: '',
        gratitude: '',
        challenges: '',
        lessons: '',
        goals: ''
      });
      setSuccess('Reflection saved successfully!');
    } catch (error) {
      console.error('Error saving reflection:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(error.response.data.message || 'Failed to save reflection');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server. Please try again.');
      } else {
        console.error('Error message:', error.message);
        setError(error.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReflection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="daily-reflection">
      <h2>Daily Reflection</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="reflection-form">
        <div className="form-group">
          <label>How are you feeling today? *</label>
          <select
            name="mood"
            value={reflection.mood}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select your mood</option>
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="neutral">Neutral</option>
            <option value="bad">Bad</option>
            <option value="terrible">Terrible</option>
          </select>
        </div>

        <div className="form-group">
          <label>What are you grateful for today? *</label>
          <textarea
            name="gratitude"
            value={reflection.gratitude}
            onChange={handleChange}
            required
            placeholder="Write about what you're grateful for..."
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>What challenges did you face today?</label>
          <textarea
            name="challenges"
            value={reflection.challenges}
            onChange={handleChange}
            placeholder="Write about any challenges you faced..."
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>What lessons did you learn today?</label>
          <textarea
            name="lessons"
            value={reflection.lessons}
            onChange={handleChange}
            placeholder="Write about any lessons you learned..."
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>What are your goals for tomorrow?</label>
          <textarea
            name="goals"
            value={reflection.goals}
            onChange={handleChange}
            placeholder="Write about your goals for tomorrow..."
            rows="3"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Reflection'}
        </button>
      </form>
    </div>
  );
}

export default DailyReflection; 