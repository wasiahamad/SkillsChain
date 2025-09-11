import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getUserApplications} from '../../api/api';
import Loader from '../../components/Common/Loader';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await getUserProfile();
                const applicationsRes = await getUserApplications();
                // const certificatesRes = await getUserCertificates();
                setProfile(profileRes.data.user);
                setApplications(applicationsRes.data);
                // setCertificates(certificatesRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="dashboard-container">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="dashboard-card">
                    <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                    <p className="text-gray-600">Here's an overview of your account</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="dashboard-card stats-card">
                        <div className="stats-icon bg-indigo-100 text-indigo-600">
                            <i className="fas fa-briefcase text-xl"></i>
                        </div>
                        <div className="stats-content">
                            <p className="stats-title">Applications</p>
                            <p className="stats-value">{applications.length}</p>
                        </div>
                    </div>

                    <div className="dashboard-card stats-card">
                        <div className="stats-icon bg-green-100 text-green-600">
                            <i className="fas fa-certificate text-xl"></i>
                        </div>
                        <div className="stats-content">
                            <p className="stats-title">Certificates</p>
                            <p className="stats-value">{certificates.length}</p>
                        </div>
                    </div>

                    <div className="dashboard-card stats-card">
                        <div className="stats-icon bg-purple-100 text-purple-600">
                            <i className="fas fa-tools text-xl"></i>
                        </div>
                        <div className="stats-content">
                            <p className="stats-title">Skills</p>
                            <p className="stats-value">{profile?.skills?.length || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Applications */}
                    <div className="section-card">
                        <div className="section-header">
                            <h2 className="section-title">Recent Applications</h2>
                            <Link to="/applications" className="section-link">
                                View All
                            </Link>
                        </div>

                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.slice(0, 3).map((app) => (
                                    <div key={app._id} className="border-b pb-3 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{app.job.title}</h3>
                                                <p className="text-sm text-gray-500">{app.job.company}</p>
                                                <p className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs ${app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <i className="fas fa-file-alt"></i>
                                </div>
                                <p className="empty-state-text">No applications yet</p>
                            </div>
                        )}
                    </div>

                    {/* Your Skills */}
                    <div className="section-card">
                        <div className="section-header">
                            <h2 className="section-title">Your Skills</h2>
                            <Link to="/skills" className="section-link">
                                Manage
                            </Link>
                        </div>

                        {profile?.skills && profile.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.slice(0, 6).map((skill, index) => (
                                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                        {skill.name}
                                    </span>
                                ))}
                                {profile.skills.length > 6 && (
                                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                        +{profile.skills.length - 6} more
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <i className="fas fa-tools"></i>
                                </div>
                                <p className="empty-state-text">No skills added yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recommended Jobs Section */}
                <div className="section-card lg:col-span-2">
                    <div className="section-header">
                        <h2 className="section-title">Recommended Jobs</h2>
                        <Link to="/jobs" className="section-link">
                            Browse All
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Mock job recommendations */}
                        <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <h3 className="font-medium">Frontend Developer</h3>
                            <p className="text-sm text-gray-500">TechCorp • San Francisco, CA</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">React</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">JavaScript</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">CSS</span>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <h3 className="font-medium">Blockchain Developer</h3>
                            <p className="text-sm text-gray-500">CryptoStart • New York, NY</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Solidity</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Ethereum</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Web3</span>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <h3 className="font-medium">Full Stack Developer</h3>
                            <p className="text-sm text-gray-500">WebSolutions • Remote</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Node.js</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">React</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">MongoDB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;