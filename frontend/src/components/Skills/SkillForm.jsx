import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUserSkill } from '../../api/api';

const SkillForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        level: 'Intermediate',
        projects: [{ name: '', description: '', link: '' }], // array of objects
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle main skill input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle project change
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await addUserSkill(formData);
            navigate('/skills');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add skill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Skill</h2>

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

                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
                    {loading ? 'Adding...' : 'Add Skill'}
                </button>
            </form>
        </div>
    );
};

export default SkillForm;
