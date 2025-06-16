import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', bio: '', location: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/users/profile');
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          bio: res.data.bio || '',
          location: res.data.location || ''
        });
        setAvatarPreview(res.data.avatar || '');
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      if (avatarFile) formDataToSend.append('avatar', avatarFile);

      const res = await api.put('/users/profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      setIsEditing(false);
      setError('');
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div>No profile data found.</div>;

  return (
    <div className="profile-container" style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <h2 style={{ textAlign: 'center' }}>My Profile</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
        <img
          src={avatarPreview || '/default-avatar.png'}
          alt="Profile"
          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '2px solid #eee' }}
        />
        {isEditing && (
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginBottom: 8 }} />
        )}
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Bio:</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input name="location" value={formData.location} onChange={handleChange} className="form-input" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData({ name: user.name || '', bio: user.bio || '', location: user.location || '' }); setAvatarPreview(user.avatar || ''); setAvatarFile(null); }}>Cancel</button>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 16 }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default Profile; 