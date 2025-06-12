import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Journal() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/journal');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry.trim()) {
      setError('Journal entry cannot be empty');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const response = await api.post('/journal', { content: entry.trim() });
      setEntries([response.data, ...entries]);
      setEntry('');
      setSuccess('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setError(error.response?.data?.message || 'Failed to save journal entry');
    }
  };

  if (loading) {
    return <div className="loading">Loading journal entries...</div>;
  }

  return (
    <div className="journal-container">
      <h2>My Journal</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Journal Entry Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="How are you feeling today?"
          rows="6"
          maxLength={1000}
        />
        <button type="submit" disabled={!entry.trim()}>Save Entry</button>
      </form>

      {/* Journal Entries Section */}
      <div className="journal-entries">
        <h3>Journal Entries</h3>
        {entries.length === 0 ? (
          <p className="no-entries">No journal entries yet. Start writing!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className="journal-entry">
              <div className="entry-date">
                {new Date(entry.createdAt).toLocaleDateString()}
              </div>
              <div className="entry-content">{entry.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Journal; 