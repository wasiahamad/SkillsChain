import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth APIs
export const userLogin = (email, password) => api.post('/users/login', { email, password });
export const userRegister = (userData) => api.post('/users/register', userData);
export const employerLogin = (email, password) => api.post('/employers/login', { email, password });
export const employerRegister = (userData) => api.post('/employers/register', userData);

// User APIs
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);
export const getUserSkills = () => api.get('/skills');
export const addUserSkill = (skillData) => api.post('/skills', skillData);
export const updateUserSkill = (id, skillData) => api.put(`/skills/${id}`, skillData);
export const deleteUserSkill = (id) => api.delete(`/skills/${id}`);
export const getUserApplications = () => api.get('/applications/my');
// Add new function
export const endorseUserSkill = (id, comment = "") => api.post(`/skills/${id}/endorse`, { comment });


// Employer APIs
export const getEmployerProfile = () => api.get('/employers/profile');
export const updateEmployerProfile = (userData) => api.put('/employers/profile', userData);
export const getEmployerJobs = () => api.get('/jobs');
export const createJob = (jobData) => api.post('/jobs', jobData);
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getEmployerApplications = () => api.get(`/applications`);
export const updateApplicationStatus = (id, status) => api.put(`/applications/status/${id}`, { status });
export const issueCertificate = (certData) => api.post('/certificates', certData);
export const getJobApplications = (jobId) => api.get(`/applications/job/${jobId}`);

// Common APIs
export const getJobDetails = (id) => api.get(`/jobs/${id}`);
export const applyForJob = (jobId, coverLetter) => api.post(`/applications/apply`, { coverLetter, jobId });
export const verifyCertificate = (id) => api.get(`/certificates/verify/${id}`);
export const getAllJobs = (filters) => api.get('/jobs', { params: filters });
export default api;