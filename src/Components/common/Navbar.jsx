import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              Travel Agency
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                Home
              </Link>
              <Link to="/about" className="hover:bg-blue-700 px-3 py-2 rounded">
                About
              </Link>
              <Link to="/services" className="hover:bg-blue-700 px-3 py-2 rounded">
                Services
              </Link>
              <Link to="/destinations" className="hover:bg-blue-700 px-3 py-2 rounded">
                Destinations
              </Link>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="hover:bg-blue-700 px-4 py-2 rounded">
              Login
            </Link>
            <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
