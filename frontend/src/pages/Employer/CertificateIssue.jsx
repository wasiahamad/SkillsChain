import React from 'react';
import CertificateIssueForm from '../../components/Certificates/CertificateIssueForm';

const EmployerCertificateIssuePage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Issue Certificate</h1>
            <CertificateIssueForm />
        </div>
    );
};

export default EmployerCertificateIssuePage;