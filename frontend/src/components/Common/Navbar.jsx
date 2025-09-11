import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LogoutButton from './LogoutButton';

const Navbar = ({ onMenuToggle}) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 w-full z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2">
                                    SC
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    SkillChain
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links - Only visible on medium screens and up */}
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link
                                to="/"
                                className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                            >
                                Home
                            </Link>
                            <Link
                                to="/jobs"
                                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                            >
                                Browse Jobs
                            </Link>
                            <Link
                                to="/certificates/verify"
                                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                            >
                                Verify Certificate
                            </Link>
                        </div>
                    </div>

                    {/* Right side buttons */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {/* Theme Toggle */}
                        <button
                            type="button"
                            className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>

                        {user ? (
                            <div className="ml-3 flex items-center space-x-4">
                                {/* User Profile Dropdown */}
                                <div className="relative">
                                    <div>
                                        <button
                                            type="button"
                                            className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            id="user-menu-button"
                                            aria-expanded={isUserMenuOpen}
                                            aria-haspopup="true"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                                                {user?.role === "employer" ? user?.employerName?.charAt(0) : user?.name?.charAt(0)}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Dropdown menu */}
                                    {isUserMenuOpen && (
                                        <div
                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="user-menu-button"
                                            tabIndex="-1"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                                                <p className="text-sm text-gray-900 dark:text-white">Signed in as</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to={user.role === "employer" ? "/employer/dashboard" : "/dashboard"}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                role="menuitem"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                role="menuitem"
                                            >
                                                Your Profile
                                            </Link>
                                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                            <LogoutButton />
                                        </div>
                                    )}
                                </div>

                                {/* Mobile menu button - Only visible on small screens */}
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
                                    aria-expanded="false"
                                    onClick={onMenuToggle}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. Only visible on small screens */}
            <div className="md:hidden">
                <div className={`${onMenuToggle ? 'block' : 'hidden'} px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 shadow-lg`}>
                    <Link
                        to="/"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Home
                    </Link>
                    <Link
                        to="/jobs"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Browse Jobs
                    </Link>
                    <Link
                        to="/certificates/verify"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Verify Certificate
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === "employer" ? "/employer/dashboard" : "/dashboard"}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Profile
                            </Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;