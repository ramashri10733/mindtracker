import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function GoalTracker() {
  const [goal, setGoal] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError('Goal content cannot be empty');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const response = await api.post('/goals', { content: goal.trim() });
      setGoals([response.data, ...goals]);
      setGoal('');
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

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Add a new goal..."
          disabled={loading}
          maxLength={500}
        />
        <button type="submit" disabled={loading || !goal.trim()}>
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
              <span className={goal.completed ? 'completed' : ''}>
                {goal.content}
              </span>
              <span className="goal-date">
                {new Date(goal.createdAt).toLocaleDateString()}
              </span>
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