import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section
                id="home"
                className="hero-gradient pt-32 pb-20 px-4 text-white"
            >
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Verify Skills with Blockchain Technology
                            </h1>
                            <p className="text-xl mb-8 opacity-90">
                                SkillChain helps employers verify skills and employees
                                showcase their verified achievements on the blockchain.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    to={localStorage.getItem("token") ? "/dashboard" : "/register"}
                                    className="btn-primary px-6 py-3 rounded-lg font-bold text-lg text-center"
                                >
                                    GET STARTED
                                </Link>
                                <Link
                                    to="/#features"
                                    className="btn-outline px-6 py-3 rounded-lg font-bold text-lg bg-white text-indigo-600 text-center"
                                >
                                    LEARN MORE
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="certificate-card rounded-xl p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <i className="fas fa-certificate"></i>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Verified
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Blockchain Developer Certificate
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Issued to John Doe for demonstrating advanced skills in
                                    blockchain development
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Issued by</p>
                                            <p className="font-medium text-gray-800">
                                                TechCorp Inc.
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="font-medium text-gray-800">
                                                Jun 15, 2023
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
                        How SkillChain Works
                    </h2>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                        SkillChain leverages blockchain technology and AI to create a
                        trusted ecosystem for skill verification
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="feature-card bg-gray-50 p-6 rounded-xl">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
                                <i className="fas fa-graduation-cap text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">
                                Skill Certification
                            </h3>
                            <p className="text-gray-600 text-center">
                                Earn verified certificates for your skills that are stored
                                on the blockchain for authenticity.
                            </p>
                        </div>
                        <div className="feature-card bg-gray-50 p-6 rounded-xl">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4">
                                <i className="fas fa-search text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">
                                AI Job Matching
                            </h3>
                            <p className="text-gray-600 text-center">
                                Our AI algorithm matches your verified skills with the
                                perfect job opportunities.
                            </p>
                        </div>
                        <div className="feature-card bg-gray-50 p-6 rounded-xl">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-4">
                                <i className="fas fa-shield-alt text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">
                                Blockchain Verification
                            </h3>
                            <p className="text-gray-600 text-center">
                                All certificates are hashed and stored on the blockchain
                                for immutable verification.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 hero-gradient text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Verify Your Skills?
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto mb-8">
                        Join thousands of professionals who are using SkillChain to
                        showcase their verified skills and advance their careers.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            to="/register"
                            className="btn-primary px-6 py-3 rounded-lg font-bold text-lg"
                        >
                            GET STARTED
                        </Link>
                        <Link
                            to="/#features"
                            className="btn-outline px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold text-lg"
                        >
                            LEARN MORE
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2">
                                    SC
                                </div>
                                <span className="text-xl font-bold">SkillChain</span>
                            </div>
                            <p className="text-gray-400">
                                Verifying skills with blockchain technology for a more
                                trustworthy future.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#features"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        Case Studies
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        Reviews
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        Press
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Connect</h4>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600"
                                >
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600"
                                >
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600"
                                >
                                    <i className="fab fa-github"></i>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600"
                                >
                                    <i className="fab fa-discord"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2023 SkillChain. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;