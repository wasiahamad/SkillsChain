import React from 'react';
import MyApplications from '../../components/Applications/MyApplications';

const UserApplicationsPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Applications</h1>
            <MyApplications />
        </div>
    );
};

export default UserApplicationsPage;