import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobDetails, applyForJob } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Common/Loader';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await getJobDetails(id);
                setJob(response.data.job || null);
                console.log(response.data);
            } catch (error) {
                setError('Failed to fetch job details');
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        setError('');
        setSuccess('');

        try {
            await applyForJob(id, coverLetter);
            setSuccess('Application submitted successfully!');
            setShowApplyForm(false);
            setCoverLetter('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to apply for job');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <Loader />;

    if (error && !job) {
        return (
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                        <div className="flex items-center text-gray-600">
                            <span className="mr-4 font-bold">{job.employer?.companyName || 'Unknown Employer'}</span>
                            <div className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                <span>{job.location || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="mt-4 md:mt-0">
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                {job.employmentType}
                            </span>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                {job.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Salary</h3>
                        <p className="text-lg font-semibold">
                            {job.salaryRange && typeof job.salaryRange.min === "number" && typeof job.salaryRange.max === "number"
                                ? `${job.salaryRange.currency || 'USD'} ${job.salaryRange.min} - ${job.salaryRange.max}`
                                : 'Competitive'}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
                        <p className="text-lg font-semibold">{job.experienceLevel || 'Not specified'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Applications</h3>
                        <p className="text-lg font-semibold">{job.applicationsCount || 0}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Application Deadline</h3>
                        <p className="text-lg font-semibold">{job.applicationDeadline.split('T')[0] || 'Not specified'}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>

                {/* Skills */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0 ? (
                            job.skillsRequired.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No skills specified</span>
                        )}
                    </div>
                </div>

                {/* Apply Button */}
                {user && user.role === 'user' && (
                    <div className="flex justify-end">
                        {!showApplyForm ? (
                            <button
                                onClick={() => setShowApplyForm(true)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Apply for this Job
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowApplyForm(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Apply Form */}
            {showApplyForm && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Apply for this Position</h2>
                    <form onSubmit={handleApply}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="coverLetter">
                                Cover Letter
                            </label>
                            <textarea
                                id="coverLetter"
                                rows="6"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Introduce yourself and explain why you're a good fit for this position..."
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                disabled={applying}
                            >
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Employer Info */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">About Employer</h2>
                <p className="text-gray-700 mb-4">{job.employer?.companyDescription || 'No company description available.'}</p>

                <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-4">
                        {job.employer?.companyName?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <h3 className="font-semibold">{job.employer?.companyName || 'Unknown Employer'}</h3>
                        <a href={job.employer?.website} className="text-indigo-600 hover:underline">Visit Website</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
