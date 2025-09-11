import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployerJobs, deleteJob } from '../../api/api';
import Loader from '../../components/Common/Loader';

const EmployerJobsPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // useEffect(() => {
    //     const fetchJobs = async () => {
    //         try {
    //             const response = await getEmployerJobs();
    //             console.log(response.data);
    //             setJobs(response.data);
    //         } catch (error) {
    //             setError('Failed to fetch jobs');
    //             console.error('Error fetching jobs:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchJobs();
    // }, []);

    // useEffect(() => {
    //     const fetchJobs = async () => {
    //         try {
    //             const response = await getEmployerJobs();
    //             // Ensure jobs is always an array
    //             setJobs(Array.isArray(response.data) ? response.data : []);
    //         } catch (error) {
    //             setError('Failed to fetch jobs');
    //             console.error('Error fetching jobs:', error);
    //             setJobs([]); // fallback to empty array on error
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchJobs();
    // }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getEmployerJobs();
                // 🔑 KEY: Handle response structure
                setJobs(response.data.jobs || []);
            } catch (error) {
                setError('Failed to fetch jobs');
                console.error('Error:', error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await deleteJob(id);
                setJobs(jobs.filter(job => job._id !== id));
            } catch (error) {
                setError('Failed to delete job');
                console.error('Error deleting job:', error);
            }
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Jobs</h1>
                <button
                    onClick={() => navigate('/employer/jobs/new')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Post New Job
                </button>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">You haven't posted any jobs yet</p>
                    <p className="text-gray-400 mb-6">Create your first job posting to start receiving applications</p>
                    <button
                        onClick={() => navigate('/employer/jobs/new')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Post Your First Job
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applications
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Posted Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Array.isArray(jobs) && jobs.map(job => (
                                    <tr key={job._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{job.location}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {job.applicationsCount || 0} applications
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a
                                                href={`/employer/jobs/${job._id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Edit
                                            </a>
                                            <a
                                                href={`/employer/jobs/${job._id}/applications`}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                View Applications
                                            </a>
                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerJobsPage;