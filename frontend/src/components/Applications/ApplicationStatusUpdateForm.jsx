import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployerApplications, updateApplicationStatus } from '../../api/api';

const ApplicationStatusUpdateForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // In a real app, we would have an API to get a single application
        // For now, we'll get all applications for the job and find the one we need
        const fetchApplication = async () => {
            try {
                // This is a workaround since we don't have an endpoint to get a single application
                // We'll assume we can get the job ID from the application
                const response = await getEmployerApplications('dummy-job-id');
                const app = response.data.applications.find(app => app._id === id);

                if (app) {
                    setApplication(app);
                    setStatus(app.status);
                } else {
                    setError('Application not found');
                }
            } catch (error) {
                setError('Failed to fetch application');
                console.error('Error fetching application:', error);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateApplicationStatus(id, status);
            navigate('/employer/applications');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update application status');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error && !application) {
        return (
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Update Application Status</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {application && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-4">
                            {application.user.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">{application.user.name}</h3>
                            <p className="text-gray-600">{application.user.email}</p>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Applying for:</h4>
                        <p className="font-medium">{application.job.title} at {application.job.company}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</h4>
                        <p className="text-gray-800 bg-white p-3 rounded border">{application.coverLetter}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="status">
                        Application Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate('/employer/applications')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationStatusUpdateForm;