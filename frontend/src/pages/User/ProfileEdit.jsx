import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const [formData, setFormData] = useState({ name: '', email: '', resume: '', ethAddress: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = res.data.user;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          resume: user.resume || '',
          ethAddress: user.ethAddress || ''
        });
      } catch (err) {
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/profile');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="resume">Resume (URL)</label>
          <input type="text" id="resume" name="resume" value={formData.resume} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="ethAddress">Ethereum Address</label>
          <input type="text" id="ethAddress" name="ethAddress" value={formData.ethAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required placeholder="0x..." />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
