import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSkills, updateUserSkill } from '../../api/api';

const SkillEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        level: 'Intermediate',
        projects: [{ name: '', description: '', link: '' }],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchLoading, setFetchLoading] = useState(true);

    // Fetch skill details
    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const response = await getUserSkills();
                const skill = response.data;
                if (skill) {
                    setFormData({
                        name: skill.name,
                        description: skill.description,
                        level: skill.level,
                        projects: skill.projects.length > 0 ? skill.projects : [{ name: '', description: '', link: '' }],
                    });
                } else {
                    setError('Skill not found');
                }
            } catch (err) {
                setError('Failed to fetch skill details');
                console.error(err);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchSkill();
    }, [id]);

    // Handle main skill input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle project field change
    const handleProjectChange = (index, e) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index][e.target.name] = e.target.value;
        setFormData({ ...formData, projects: updatedProjects });
    };

    // Add new project field
    const addProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, { name: '', description: '', link: '' }],
        });
    };

    // Remove project field
    const removeProject = (index) => {
        const updatedProjects = formData.projects.filter((_, i) => i !== index);
        setFormData({ ...formData, projects: updatedProjects });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateUserSkill(id, formData);
            navigate('/skills');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update skill');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Skill</h2>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Skill Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label>Level</label>
                    <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="font-semibold mb-2 block">Projects</label>
                    {formData.projects.map((project, index) => (
                        <div key={index} className="border p-3 mb-2 rounded">
                            <input
                                type="text"
                                name="name"
                                placeholder="Project Name"
                                value={project.name}
                                onChange={(e) => handleProjectChange(index, e)}
                                className="w-full border p-1 mb-1 rounded"
                                required
                            />
                            <input
                                type="text"
                                name="description"
                                placeholder="Project Description"
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, e)}
                                className="w-full border p-1 mb-1 rounded"
                                required
                            />
                            <input
                                type="text"
                                name="link"
                                placeholder="Project Link"
                                value={project.link}
                                onChange={(e) => handleProjectChange(index, e)}
                                className="w-full border p-1 mb-1 rounded"
                            />
                            <button type="button" onClick={() => removeProject(index)} className="text-red-600 mt-1">
                                Remove Project
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addProject} className="text-blue-600 mt-2">
                        + Add Another Project
                    </button>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate('/skills')}
                    >
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                        {loading ? 'Updating...' : 'Update Skill'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SkillEditForm;
