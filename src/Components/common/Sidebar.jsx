import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Sidebar = ({ items, role }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">{role} Panel</h2>
        <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
