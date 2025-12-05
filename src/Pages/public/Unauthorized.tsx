import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Unauthorized = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        {user && (
          <p className="text-sm text-gray-500 mb-6">
            Current role: <span className="font-semibold">{user.role}</span>
          </p>
        )}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
          <button
            onClick={logout}
            className="block w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
