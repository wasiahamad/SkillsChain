import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEmployerProfile, getEmployerJobs } from '../../api/api';
import Loader from '../../components/Common/Loader';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await getEmployerProfile();
                const jobsRes = await getEmployerJobs();

                setProfile(profileRes.data);
                setJobs(jobsRes.data.jobs || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // const totalApplications = Array.isArray(jobs)
    //     ? jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)
    //     : 0;

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2">Welcome, {user?.employerName}!</h1>
                <p className="text-gray-600">Here's an overview of your employer profile: <span className="font-bold">{user?.companyName}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                            <i className="fas fa-briefcase text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Posted Jobs</p>
                            <p className="text-2xl font-bold">{jobs.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <i className="fas fa-file-alt text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Applications</p>
                            <p className="text-2xl font-bold"> {jobs.reduce((total, job) => total + (job.appliedJobsByUser?.length || 0), 0)} </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <i className="fas fa-certificate text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Certificates Issued</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Jobs</h2>
                        <a href="/employer/jobs" className="text-indigo-600 hover:text-indigo-800 text-sm">
                            View All
                        </a>
                    </div>

                    {Array.isArray(jobs) && jobs.map(job => (
                        <div key={job._id} className="space-y-4">
                                <div key={job._id} className="border-b border-black mb-4 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">{job.title}</h3>
                                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                                            {job.applicationsCount || 0} applications
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{job.location || 'N/A'}</p>
                                    <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                                </div>
                        </div>
                    ))}

                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Quick Actions</h2>
                    </div>

                    <div className="space-y-3">
                        <a
                            href="/employer/jobs/new"
                            className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                        >
                            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                                <i className="fas fa-plus"></i>
                            </div>
                            <span>Post a New Job</span>
                        </a>

                        <a
                            href="/employer/certificates/issue"
                            className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100"
                        >
                            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                                <i className="fas fa-certificate"></i>
                            </div>
                            <span>Issue Certificate</span>
                        </a>

                        <a
                            href="/employer/profile"
                            className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100"
                        >
                            <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                                <i className="fas fa-user"></i>
                            </div>
                            <span>Edit Company Profile</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;