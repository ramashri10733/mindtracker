import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('all');
  const [type, setType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    type: 'link',
    category: '',
    tags: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      // Validate required fields
      if (!newResource.title || !newResource.url || !newResource.type || !newResource.category) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate URL format
      try {
        new URL(newResource.url);
      } catch (err) {
        setError('Please enter a valid URL');
        return;
      }

      // Prepare resource data
      const resourceData = {
        ...newResource,
        // Handle tags properly - if it's a string, split it; if it's an array, use it; if empty, use empty array
        tags: typeof newResource.tags === 'string' 
          ? newResource.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : Array.isArray(newResource.tags) 
            ? newResource.tags 
            : []
      };

      console.log('Submitting resource:', resourceData);

      const response = await api.post('/resources', resourceData);
      console.log('Resource created successfully:', response.data);
      
      setResources([response.data, ...resources]);
      setNewResource({
        title: '',
        description: '',
        url: '',
        type: 'link',
        category: '',
        tags: ''
      });
      setShowAddForm(false);
      setSuccess('Resource added successfully!');
    } catch (error) {
      console.error('Error adding resource:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(error.response.data.message || 'Failed to add resource');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server. Please try again.');
      } else {
        console.error('Error message:', error.message);
        setError(error.message || 'An error occurred');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await api.delete(`/resources/${id}`);
      setResources(resources.filter(resource => resource._id !== id));
      setSuccess('Resource deleted successfully!');
    } catch (error) {
      console.error('Error deleting resource:', error);
      setError(error.response?.data?.message || 'Failed to delete resource');
    }
  };

  const filteredResources = resources
    .filter(resource => {
      const matchesFilter = filter === 'all' || resource.category === filter;
      const matchesType = type === 'all' || resource.type === type;
      const matchesSearch = searchTerm === '' || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const categories = [...new Set(resources.map(resource => resource.category))];

  if (loading) {
    return <div className="loading">Loading resources...</div>;
  }

  return (
    <div className="resource-library">
      <h2>Resource Library</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="resource-controls">
        <button 
          className="add-resource-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Resource'}
        </button>

        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="article">Articles</option>
              <option value="pdf">PDFs</option>
              <option value="link">Links</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-resource-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={newResource.title}
              onChange={(e) => setNewResource({...newResource, title: e.target.value})}
              required
              placeholder="Resource title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newResource.description}
              onChange={(e) => setNewResource({...newResource, description: e.target.value})}
              placeholder="Brief description of the resource"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>URL *</label>
            <input
              type="url"
              value={newResource.url}
              onChange={(e) => setNewResource({...newResource, url: e.target.value})}
              required
              placeholder="https://..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                required
              >
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="pdf">PDF</option>
                <option value="link">Link</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={newResource.category}
                onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                required
                placeholder="e.g., Math, Science, etc."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              value={newResource.tags}
              onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
              placeholder="Comma-separated tags"
            />
          </div>

          <button type="submit" className="submit-btn">Save Resource</button>
        </form>
      )}

      <div className="resources-grid">
        {filteredResources.length === 0 ? (
          <p className="no-resources">No resources found. Add your first resource!</p>
        ) : (
          filteredResources.map((resource) => (
            <div key={resource._id} className="resource-card">
              <div className="resource-header">
                <span className="resource-type">{resource.type}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(resource._id)}
                  title="Delete resource"
                >
                  ×
                </button>
              </div>

              <h3 className="resource-title">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title}
                </a>
              </h3>

              {resource.description && (
                <p className="resource-description">{resource.description}</p>
              )}

              <div className="resource-meta">
                <span className="resource-category">{resource.category}</span>
                <span className="resource-date">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>

              {resource.tags.length > 0 && (
                <div className="resource-tags">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResourceLibrary; 