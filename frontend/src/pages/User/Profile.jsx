import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch (err) {
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="mb-2"><strong>Name:</strong> {user.name}</div>
      <div className="mb-2"><strong>Email:</strong> {user.email}</div>
      <div className="mb-2"><strong>Ethereum Address:</strong> {user.ethAddress || 'Not set'}</div>
      <div className="mb-2"><strong>Resume:</strong> {user.resume ? <a href={user.resume} target="_blank" rel="noopener noreferrer">View Resume</a> : 'Not uploaded'}</div>
      <div className="mb-2"><strong>Skills:</strong> {user.skills && user.skills.length > 0 ? user.skills.map(skill => skill.name).join(', ') : 'No skills added'}</div>
      <div className="mb-2"><strong>Certificates:</strong> {user.certificates && user.certificates.length > 0 ? user.certificates.length : 'No certificates'}</div>
    </div>
  );
};

export default UserProfile;
