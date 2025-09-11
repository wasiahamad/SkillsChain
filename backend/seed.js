import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Employer from "./models/Employer.js";
import User from "./models/User.js";
import Job from "./models/Job.js";
import AppliedJob from "./models/AppliedJobs.js";
import Skill from "./models/Skill.js";

const seedData = async () => {
    try {
        // 1️⃣ Connect to MongoDB
        await connectDB();
        console.log("MongoDB connected ✅");

        // 2️⃣ Create Employer
        const employer = await Employer.create({
            employerName: "ABC Pvt Ltd",
            email: "abc@example.com",
            password: "123456",
            companyName: "ABC Pvt Ltd",
            companyDescription: "We do cool stuff",
            website: "https://abc.com"
        });
        console.log("✅ Employer created");

        // 3️⃣ Create User
        const user = await User.create({
            name: "Wasi Ahmad",
            email: "wasi@example.com",
            password: "123456",
            skills: [] // Temp empty, populate after creating Skills
        });
        console.log("✅ User created");

        // 4️⃣ Create Skills owned by User
        const skillDocs = await Skill.insertMany([
            { name: "MERN", description: "MERN Stack", owner: user._id },
            { name: "JavaScript", description: "JS Skills", owner: user._id },
            { name: "React", description: "React Skills", owner: user._id }
        ]);
        console.log("✅ Skills created");

        // 5️⃣ Update User.skills with ObjectId references
        user.skills = skillDocs.map(skill => skill._id);
        await user.save();
        console.log("✅ User skills updated");

        // 6️⃣ Create Job with real Employer ID
        const job = await Job.create({
            title: "Full Stack Developer",
            description: "Work on MERN projects",
            location: "Remote",
            salaryRange: { min: 50000, max: 70000, currency: "USD" },
            employer: employer._id,
            skillsRequired: skillDocs.map(skill => skill.name)
        });
        console.log("✅ Job created");

        // 7️⃣ Create AppliedJob
        const appliedJob = await AppliedJob.create({
            user: user._id,
            job: job._id,
            coverLetter: "I am really interested in this position and I have MERN experience.",
            status: "applied"
        });
        console.log("✅ AppliedJob created");

        // 8️⃣ Populate AppliedJob for verification
        const populatedAppliedJob = await AppliedJob.findById(appliedJob._id)
            .populate({
                path: "user",
                select: "name email skills",
                populate: { path: "skills", select: "name level owner" }
            })
            .populate({
                path: "job",
                populate: {
                    path: "employer",
                    select: "companyName companyDescription website"
                }
            });

        console.log("✅ AppliedJob with full details:", populatedAppliedJob);

        process.exit(0); // Successful exit
    } catch (err) {
        console.error("❌ Error seeding data:", err);
        process.exit(1);
    }
};

seedData();
