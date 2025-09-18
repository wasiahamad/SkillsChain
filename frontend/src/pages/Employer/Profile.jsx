import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerProfile = () => {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/employers/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployer(res.data.employer);
      } catch (err) {
        setError('Failed to fetch employer profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!employer) return <div>No employer data found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Employer Profile</h2>
      <div className="mb-2"><strong>Name:</strong> {employer.employerName}</div>
      <div className="mb-2"><strong>Company:</strong> {employer.companyName}</div>
      <div className="mb-2"><strong>Email:</strong> {employer.email}</div>
      <div className="mb-2"><strong>Description:</strong> {employer.companyDescription || 'Not set'}</div>
      <div className="mb-2"><strong>Website:</strong> {employer.website ? <a href={employer.website} target="_blank" rel="noopener noreferrer">Visit</a> : 'Not set'}</div>
      <div className="mb-2"><strong>Posted Jobs:</strong> {employer.postedJobs && employer.postedJobs.length > 0 ? employer.postedJobs.length : 'No jobs posted'}</div>
    </div>
  );
};

export default EmployerProfile;
