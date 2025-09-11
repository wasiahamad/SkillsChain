import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../api/api';

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Executive'];
const jobStatusOptions = ['Active', 'Closed', 'Draft'];

const JobPostForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'USD',
        employmentType: 'Full-time',
        experienceLevel: 'Mid',
        status: 'Active',
        applicationDeadline: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        const skillsArray = formData.skillsRequired
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill !== '');

        // Prepare salaryRange object
        const salaryRange = {
            min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
            max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
            currency: formData.salaryCurrency || 'USD'
        };

        try {
            await createJob({
                title: formData.title,
                description: formData.description,
                skillsRequired: skillsArray,
                location: formData.location,
                salaryRange,
                employmentType: formData.employmentType,
                experienceLevel: formData.experienceLevel,
                status: formData.status,
                applicationDeadline: formData.applicationDeadline || undefined,
            });
            navigate('/employer/jobs');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

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
                        <label className="block text-gray-700 mb-2" htmlFor="employmentType">
                            Employment Type
                        </label>
                        <select
                            id="employmentType"
                            name="employmentType"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.employmentType}
                            onChange={handleChange}
                        >
                            {employmentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
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

                    <div className="mb-4 flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-2" htmlFor="salaryMin">
                                Salary Min
                            </label>
                            <input
                                type="number"
                                id="salaryMin"
                                name="salaryMin"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                placeholder="e.g. 70000"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-2" htmlFor="salaryMax">
                                Salary Max
                            </label>
                            <input
                                type="number"
                                id="salaryMax"
                                name="salaryMax"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                placeholder="e.g. 90000"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-2" htmlFor="salaryCurrency">
                                Currency
                            </label>
                            <select
                                id="salaryCurrency"
                                name="salaryCurrency"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                value={formData.salaryCurrency}
                                onChange={handleChange}
                            >
                                <option value="USD">USD</option>
                                <option value="INR">INR</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="experienceLevel">
                            Experience Level
                        </label>
                        <select
                            id="experienceLevel"
                            name="experienceLevel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.experienceLevel}
                            onChange={handleChange}
                        >
                            {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="status">
                            Job Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            {jobStatusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="applicationDeadline">
                            Application Deadline
                        </label>
                        <input
                            type="date"
                            id="applicationDeadline"
                            name="applicationDeadline"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 mb-2" htmlFor="skillsRequired">
                            Required Skills (comma separated)
                        </label>
                        <input
                            type="text"
                            id="skillsRequired"
                            name="skillsRequired"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={formData.skillsRequired}
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
                        {loading ? 'Creating...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobPostForm;