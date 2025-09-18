import Skill from "../models/Skill.js";
import User from "../models/User.js";

// Create Skill
export const createSkill = async (req, res) => {
    try {
        const { name, description, level, endorsements, projects } = req.body;

        const skill = new Skill({
            name,
            description,
            level,
            endorsements,
            projects,
            owner: req.user._id
        });

        await skill.save();

        // ✅ Link skill with user and return updated user with skills
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { skills: skill._id } },
            { new: true }  // ✅ options should be separate
        ).populate("skills");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(201).json({
            message: "Skill created successfully",
            success: true,
            skill,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get All Skills of Logged-in User
export const getUserSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ owner: req.user._id }).populate("owner").sort({ createdAt: -1 });
        res.status(200).json({ success: true, skills });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Update Skill
export const updateSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const skill = await Skill.findOne({ _id: skillId, owner: req.user._id });

        if (!skill) {
            return res.status(404).json({ message: "Skill not found", success: false });
        }

        // Update fields
        skill.name = req.body.name || skill.name;
        skill.description = req.body.description || skill.description;
        skill.level = req.body.level || skill.level;
        skill.endorsements = req.body.endorsements || skill.endorsements;
        skill.projects = req.body.projects || skill.projects;

        await skill.save();

        res.status(200).json({
            message: "Skill updated successfully",
            success: true,
            skill
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Delete Skill
export const deleteSkill = async (req, res) => {
    try {
        const { skillId } = req.params;

        const skill = await Skill.findOneAndDelete({
            _id: skillId,
            owner: req.user._id
        });

        if (!skill) {
            return res.status(404).json({ message: "Skill not found", success: false });
        }

        // Remove from user as well
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { skills: skill._id }
        });

        res.status(200).json({
            message: "Skill deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ Endorse a skill
// export const endorseSkill = async (req, res) => {
//     try {
//         const skillId = req.params.id;
//         const userId = req.user._id; // 🔑 user from auth middleware

//         const skill = await Skill.findById(skillId);
//         if (!skill) {
//             return res.status(404).json({ success: false, message: "Skill not found" });
//         }

//         // 🚫 Prevent endorsing your own skill
//         if (skill.owner.toString() === userId.toString()) {
//             return res.status(400).json({ success: false, message: "You cannot endorse your own skill" });
//         }

//         // 🚫 Prevent duplicate endorsements
//         const alreadyEndorsed = skill.endorsements.some(
//             (endorsement) => endorsement.endorser.toString() === userId.toString()
//         );
//         if (alreadyEndorsed) {
//             return res.status(400).json({ success: false, message: "You already endorsed this skill" });
//         }

//         // ✅ Add endorsement
//         skill.endorsements.push({
//             endorser: userId,
//             comment: req.body.comment || "",
//         });

//         await skill.save();

//         // Populate for frontend
//         await skill.populate("endorsements.endorser", "name email");

//         res.status(200).json({
//             success: true,
//             message: "Skill endorsed successfully",
//             endorsements: skill.endorsements,
//         });
//     } catch (error) {
//         console.error("Error endorsing skill:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

export const endorseSkill = async (req, res) => {
    try {
        const { comment } = req.body;  // may be empty
        const userId = req.user._id;
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        const existing = skill.endorsements.find(
            (e) => e.endorser.toString() === userId.toString()
        );

        if (existing) {
            existing.comment = comment || existing.comment;
        } else {
            skill.endorsements.push({ endorser: userId, comment: comment || "" });
        }
        await skill.save();

        res.json({ endorsements: skill.endorsements });
    } catch (err) {
        console.error("Endorse error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSkillsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const skills = await Skill.find({ owner: userId });
        res.json({ skills });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


