import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../../api/api';
import Loader from '../Common/Loader';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        location: '',
    });

    // useEffect(() => {
    //     const fetchJobs = async () => {
    //         try {
    //             const response = await getAllJobs();
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

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getAllJobs();
                setJobs(response.data.jobs || []);
            } catch (error) {
                setError('Failed to fetch jobs');
                console.error('Error fetching jobs:', error);
                setJobs([]); // fallback to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const filteredJobs = Array.isArray(jobs)
        ? jobs.filter(job => {
            return (
                job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
                (filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase()))
            );
        })
        : [];

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search jobs..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={filters.location}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
                    <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job._id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold">{job.title}</h3>
                                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                                        {job.employmentType}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-2">{job.company}</p>
                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    <span>{job.location}</span>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {/* {job.requiredSkills.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))} */}

                                        {Array.isArray(job.skillsRequired) && job.skillsRequired.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                        {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 3 && (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                                +{job.skillsRequired.length - 3} more
                                            </span>
                                        )}

                                        {/* {job.requiredSkills.length > 3 && (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                                +{job.requiredSkills.length - 3} more
                                            </span>
                                        )} */}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-indigo-600 font-medium">
                                        {job.salaryRange && typeof job.salaryRange.min === "number" && typeof job.salaryRange.max === "number"
                                            ? `${job.salaryRange.currency || 'USD'} ${job.salaryRange.min} - ${job.salaryRange.max}`
                                            : 'Competitive'}
                                    </span>
                                    <a
                                        href={`/jobs/${job._id}`}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobList;