import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center">
                    <div className="text-9xl font-bold text-indigo-600">404</div>
                </div>
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
                    Page not found
                </h1>
                <p className="mt-6 text-base text-gray-500">
                    Sorry, we couldn't find the page you're looking for.
                </p>
                <div className="mt-10">
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;