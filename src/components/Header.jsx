import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Brand/Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    LinkHub
                </Link>

                {/* Navigation Links */}
                <nav className="flex gap-4">
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Sign Up Free
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;