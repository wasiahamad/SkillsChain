import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { verifyCertificate } from '../../api/api';
import Loader from '../Common/Loader';

const CertificateVerify = () => {
    const { certificateId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await verifyCertificate(certificateId);
                setCertificate(response.data);
                setVerified(true);
            } catch (error) {
                setError('Certificate verification failed');
                console.error('Error verifying certificate:', error);
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [certificateId]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Certificate Verification</h2>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
                <p className="text-gray-600">The certificate could not be verified. Please check the certificate ID and try again.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Certificate Verification</h2>

            {verified && (
                <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <i className="fas fa-check text-2xl"></i>
                        </div>
                    </div>
                    <p className="text-center text-green-600 font-medium">This certificate is valid and verified on the blockchain</p>
                </div>
            )}

            <div className="certificate-card rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <i className="fas fa-certificate"></i>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Verified
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{certificate.title}</h3>
                <p className="text-gray-600 mb-4">{certificate.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Issued to</p>
                            <p className="font-medium text-gray-800">{certificate.issuedTo.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Issued by</p>
                            <p className="font-medium text-gray-800">{certificate.issuedBy.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-gray-800">{new Date(certificate.issuedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Skill</p>
                            <p className="font-medium text-gray-800">{certificate.skill.name}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Blockchain Verification Hash</p>
                    <p className="text-xs text-gray-700 break-all">{certificate.blockchainHash}</p>
                </div>
            </div>

            <div className="text-center">
                <a
                    href={certificate.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    View Certificate
                </a>
            </div>
        </div>
    );
};

export default CertificateVerify;