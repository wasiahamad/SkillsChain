import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserSkills, deleteUserSkill, endorseUserSkill } from "../../api/api";
import Loader from "../Common/Loader";

const SkillList = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [endorseLoading, setEndorseLoading] = useState(null);

    // New states for popup
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await getUserSkills();
                setSkills(response.data.skills || []);
            } catch (err) {
                setError("Failed to fetch skills");
                console.error("Error fetching skills:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this skill?")) {
            setDeleteLoading(id);
            try {
                await deleteUserSkill(id);
                setSkills((prevSkills) => prevSkills.filter((skill) => skill._id !== id));
            } catch (err) {
                setError("Failed to delete skill");
                console.error("Error deleting skill:", err);
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    const handleOpenEndorsePopup = (skill) => {
        setSelectedSkill(skill);
        setComment("");
        setShowPopup(true);
    };

    const handleEndorseSubmit = async () => {
        if (!selectedSkill) return;

        setEndorseLoading(selectedSkill._id);
        try {
            const response = await endorseUserSkill(selectedSkill._id, comment);
            setSkills((prevSkills) =>
                prevSkills.map((skill) =>
                    skill._id === selectedSkill._id
                        ? { ...skill, endorsements: response.data.endorsements }
                        : skill
                )
            );
            setShowPopup(false);
        } catch (err) {
            setError("Failed to endorse skill");
            console.error("Error endorsing skill:", err);
        } finally {
            setEndorseLoading(null);
        }
    };

    const getLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case "beginner":
                return "bg-red-100 text-red-800";
            case "elementary":
                return "bg-orange-100 text-orange-800";
            case "intermediate":
                return "bg-yellow-100 text-yellow-800";
            case "advanced":
                return "bg-green-100 text-green-800";
            case "expert":
                return "bg-indigo-100 text-indigo-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Skills</h2>
                <Link
                    to="/skills/new"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Add New Skill
                </Link>
            </div>

            {/* Empty state */}
            {skills.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">
                        You haven't added any skills yet
                    </p>
                    <p className="text-gray-400 mb-6">
                        Add your skills to showcase your expertise to employers
                    </p>
                    <Link
                        to="/skills/new"
                        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Add Your First Skill
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill) => (
                        <div
                            key={skill._id}
                            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="p-6">
                                {/* Skill name + level */}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold">{skill.name}</h3>
                                    {skill.level && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${getLevelColor(
                                                skill.level
                                            )}`}
                                        >
                                            {skill.level}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {skill.description && (
                                    <p className="text-gray-600 mb-4">{skill.description}</p>
                                )}

                                {/* Projects */}
                                {skill.projects?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Projects:
                                        </h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {skill.projects.slice(0, 3).map((project, index) => (
                                                <li key={index}>
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:underline"
                                                    >
                                                        {project.name}
                                                    </a>{" "}
                                                    – {project.description}
                                                </li>
                                            ))}
                                            {skill.projects.length > 3 && (
                                                <li className="text-gray-400">
                                                    +{skill.projects.length - 3} more
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Verification + Endorsements + Actions */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-sm text-gray-500">
                                        {skill.verified ? (
                                            <>
                                                <i className="fas fa-check-circle text-green-500 mr-1"></i>
                                                <span>Verified</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-clock text-yellow-500 mr-1"></i>
                                                <span>Pending Verification</span>
                                            </>
                                        )}
                                        {skill.endorsements?.length > 0 && (
                                            <span className="ml-2 text-xs text-indigo-600">
                                                {skill.endorsements.length} endorsements
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex space-x-3">
                                        {/* Endorse Button */}
                                        <button
                                            onClick={() => handleOpenEndorsePopup(skill)}
                                            className="text-green-600 hover:text-green-800 text-sm flex items-center"
                                        >
                                            <i className="fas fa-thumbs-up mr-1"></i>
                                            Endorse
                                        </button>

                                        {/* Edit Button */}
                                        <Link
                                            to={`/skills/${skill._id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Link>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(skill._id)}
                                            className="text-red-600 hover:text-red-800"
                                            disabled={deleteLoading === skill._id}
                                        >
                                            {deleteLoading === skill._id ? (
                                                <i className="fas fa-spinner fa-spin"></i>
                                            ) : (
                                                <i className="fas fa-trash"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Endorse Popup */}
            {showPopup && selectedSkill && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-lg font-bold mb-4">
                            Endorse {selectedSkill.name}
                        </h3>
                        <textarea
                            className="w-full border rounded-md p-2 mb-4"
                            placeholder="Write a comment (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                onClick={handleEndorseSubmit}
                                disabled={endorseLoading === selectedSkill._id}
                            >
                                {endorseLoading === selectedSkill._id ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillList;
