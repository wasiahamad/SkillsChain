import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applyForJob } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const JobApplyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [jobDetails, setJobDetails] = useState(null);

    // In a real app, we would fetch job details, but for now we'll use mock data
    React.useEffect(() => {
        // This would normally be an API call to get job details
        setJobDetails({
            title: "Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA"
        });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await applyForJob(id, coverLetter);
            setSuccess('Application submitted successfully!');
            // Redirect to applications page after a short delay
            setTimeout(() => {
                navigate('/applications');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to apply for job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Apply for Job</h2>

            {jobDetails && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{jobDetails.title}</h3>
                    <p className="text-gray-600">{jobDetails.company} • {jobDetails.location}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        value={user?.name || ''}
                        readOnly
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        value={user?.email || ''}
                        readOnly
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="coverLetter">
                        Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="coverLetter"
                        rows="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Introduce yourself and explain why you're a good fit for this position. Highlight your relevant skills, experience, and what you can bring to the role."
                        required
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">
                        A well-written cover letter can significantly increase your chances of getting hired.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Tips for a great cover letter:</h4>
                    <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                        <li>Address the hiring manager by name if possible</li>
                        <li>Mention specific skills from the job description</li>
                        <li>Provide examples of your relevant experience</li>
                        <li>Explain why you're interested in this company</li>
                        <li>Keep it concise and focused (3-4 paragraphs)</li>
                    </ul>
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate(`/jobs/${id}`)}
                    >
                        Back to Job
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobApplyForm;