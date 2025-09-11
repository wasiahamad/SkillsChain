import React from 'react';
import CertificateList from '../../components/Certificates/CertificateList';

const UserCertificatesPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Certificates</h1>
            <CertificateList />
        </div>
    );
};

export default UserCertificatesPage;