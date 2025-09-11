import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployerJobs, issueCertificate } from '../../api/api';

const CertificateIssueForm = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        jobId: '',
        userId: '',
        skillName: '',
        title: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getEmployerJobs();
                setJobs(response.data);
            } catch (error) {
                setError('Failed to fetch jobs');
                console.error('Error fetching jobs:', error);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await issueCertificate(formData);
            navigate('/employer/certificates');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to issue certificate');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Issue Certificate</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="jobId">
                        Select Job
                    </label>
                    <select
                        id="jobId"
                        name="jobId"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={formData.jobId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a job</option>
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id}>
                                {job.title} - {job.company}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="userId">
                        User ID
                    </label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={formData.userId}
                        onChange={handleChange}
                        placeholder="Enter user ID"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="skillName">
                        Skill Name
                    </label>
                    <input
                        type="text"
                        id="skillName"
                        name="skillName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={formData.skillName}
                        onChange={handleChange}
                        placeholder="e.g. JavaScript, Blockchain"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="title">
                        Certificate Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. JavaScript Developer Certificate"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of the certificate"
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate('/employer/certificates')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? 'Issuing...' : 'Issue Certificate'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificateIssueForm;