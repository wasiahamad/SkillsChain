import React, { useState, useEffect } from 'react';
// import { getUserCertificates } from '../../api/api';
import Loader from '../Common/Loader';

const CertificateList = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await getUserCertificates();
                setCertificates(response.data);
            } catch (error) {
                setError('Failed to fetch certificates');
                console.error('Error fetching certificates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">My Certificates</h2>

            {certificates.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You don't have any certificates yet</p>
                    <p className="text-gray-600">Certificates will be issued by employers when you complete jobs or projects.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                        <div key={certificate._id} className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold">{certificate.title}</h3>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Verified
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-600 mb-1">Issued by: {certificate.issuedBy.name}</p>
                                <p className="text-gray-600">Issued on: {new Date(certificate.issuedDate).toLocaleDateString()}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Skill:</h4>
                                <p className="text-gray-900">{certificate.skill.name}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <a
                                    href={certificate.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                    View Certificate
                                </a>
                                <a
                                    href={`/certificates/verify/${certificate._id}`}
                                    className="text-gray-600 hover:text-gray-800 text-sm"
                                >
                                    Verify
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CertificateList;