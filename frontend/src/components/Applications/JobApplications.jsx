import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobApplications } from '../../api/api';
import Loader from '../Common/Loader';
import { useAuth } from '../../context/AuthContext';

const JobApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getJobApplications(jobId);
                setApplications(response.data.applications);
                if (response.data.applications && response.data.applications.length > 0) {
                    setJob(response.data.applications[0].job);
                } else {
                    setJob(null);
                }

                console.log(response.data.applications);
            } catch (error) {
                setError('Failed to fetch applications');
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            case 'Reviewed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
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
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-2">Applications for {job?.title || 'Job'} at {job?.employer?.companyName}</h1>
                <p className="text-gray-600">{job?.employer?.companyName} • {job?.location}</p>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg">No applications yet</p>
                    <p className="text-gray-400">Check back later for new applications</p>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applicant
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applied Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cover Letter
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((application) => (
                                    <tr key={application._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                                                        {application.user.name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{application.user.name}</div>
                                                    <div className="text-sm text-gray-500">{application.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(application.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {application.coverLetter}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a
                                                href={`/employer/applications/${application._id}/update`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Update Status
                                            </a>
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

export default JobApplications;
