import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function GoalTracker() {
  const [goal, setGoal] = useState({ title: '', description: '', deadline: '' });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchGoals();
  }, [navigate]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error.response?.data?.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.title.trim() || !goal.description.trim() || !goal.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const formattedDeadline = new Date(goal.deadline).toISOString();
      const response = await api.post('/goals', {
        title: goal.title.trim(),
        description: goal.description.trim(),
        deadline: formattedDeadline
      });
      setGoals([response.data, ...goals]);
      setGoal({ title: '', description: '', deadline: '' });
      setSuccess('Goal added successfully!');
    } catch (error) {
      console.error('Error saving goal:', error);
      setError(error.response?.data?.message || 'Failed to save goal');
    }
  };

  const toggleGoal = async (id) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await api.put(`/goals/${id}`);
      setGoals(goals.map(goal => 
        goal._id === id ? response.data : goal
      ));
      setSuccess('Goal updated successfully!');
    } catch (error) {
      console.error('Error updating goal:', error);
      setError(error.response?.data?.message || 'Failed to update goal');
    }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
      setSuccess('Goal deleted successfully!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError(error.response?.data?.message || 'Failed to delete goal');
    }
  };

  if (loading) {
    return <div className="loading">Loading goals...</div>;
  }

  return (
    <div className="goals-container">
      <h2>My Goals</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={goal.title}
            onChange={handleChange}
            placeholder="Enter goal title"
            required
            maxLength={200}
          />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={goal.description}
            onChange={handleChange}
            placeholder="Describe your goal..."
            required
            rows="3"
            maxLength={1000}
          />
        </div>
        <div className="form-group">
          <label>Deadline *</label>
          <input
            type="datetime-local"
            name="deadline"
            value={goal.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading || !goal.title.trim() || !goal.description.trim() || !goal.deadline}>
          Add Goal
        </button>
      </form>

      <div className="goals-list">
        {goals.length === 0 ? (
          <p className="no-goals">No goals yet. Add your first goal above!</p>
        ) : (
          goals.map((goal) => (
            <div key={goal._id} className="goal-item">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal._id)}
                disabled={loading}
              />
              <div className="goal-content">
                <h3 className={goal.completed ? 'completed' : ''}>{goal.title}</h3>
                <p className={goal.completed ? 'completed' : ''}>{goal.description}</p>
                <div className="goal-meta">
                  <span className="goal-deadline">
                    Deadline: {new Date(goal.deadline).toLocaleString()}
                  </span>
                  <span className="goal-date">
                    Created: {new Date(goal.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="goal-timeline">
                  <strong>Timeline:</strong>
                  <ul>
                    {goal.timeline && goal.timeline.length > 0 ? (
                      goal.timeline.map((event, idx) => (
                        <li key={idx}>
                          <span>[{new Date(event.date).toLocaleString()}]</span> {event.message}
                        </li>
                      ))
                    ) : (
                      <li>No timeline events yet.</li>
                    )}
                  </ul>
                </div>
              </div>
              <button 
                className="delete-button"
                onClick={() => deleteGoal(goal._id)}
                title="Delete goal"
                disabled={loading}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GoalTracker; 