import React from 'react';
import JobList from '../../components/Jobs/JobList';

const UserJobsPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>
            <JobList />
        </div>
    );
};

export default UserJobsPage;