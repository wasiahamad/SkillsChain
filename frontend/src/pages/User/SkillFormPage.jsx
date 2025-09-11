import React from 'react';
import SkillForm from '../../components/Skills/SkillForm';

const SkillFormPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Add New Skill</h1>
            <SkillForm />
        </div>
    );
};

export default SkillFormPage;