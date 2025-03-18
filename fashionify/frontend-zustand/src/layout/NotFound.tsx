import { Link } from "react-router";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
            <p className="text-gray-500 mb-8">
                The page you are looking for might have been removed or doesn't
                exist.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
