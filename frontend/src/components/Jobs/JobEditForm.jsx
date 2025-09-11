import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobDetails, updateJob } from '../../api/api';

const JobEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Full-time',
        location: '',
        salary: '',
        experience: '',
        requiredSkills: '',
        companyDescription: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await getJobDetails(id);
                const job = response.data;
                setFormData({
                    title: job.title,
                    description: job.description,
                    type: job.type,
                    location: job.location,
                    salary: job.salary || '',
                    experience: job.experience || '',
                    requiredSkills: job.requiredSkills.join(', '),
                    companyDescription: job.companyDescription || '',
                });
            } catch (error) {
                setError('Failed to fetch job details');
                console.error('Error fetching job details:', error);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchJob();
    }, [id]);

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

        // Convert skills string to array
        const skillsArray = formData.requiredSkills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill !== '');

        try {
            await updateJob(id, {
                ...formData,
                requiredSkills: skillsArray,
            });
            navigate('/employer/jobs');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update job');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Job</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="title">
                            Job Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="type">
                            Job Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="location">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. New York, NY or Remote"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="salary">
                            Salary
                        </label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g. $70,000 - $90,000"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="experience">
                            Experience Required
                        </label>
                        <input
                            type="text"
                            id="experience"
                            name="experience"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g. 2+ years"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="requiredSkills">
                            Required Skills (comma separated)
                        </label>
                        <input
                            type="text"
                            id="requiredSkills"
                            name="requiredSkills"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                            placeholder="e.g. JavaScript, React, Node.js"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="description">
                        Job Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="companyDescription">
                        Company Description
                    </label>
                    <textarea
                        id="companyDescription"
                        name="companyDescription"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={formData.companyDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate('/employer/jobs')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobEditForm;