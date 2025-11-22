import { Outlet } from 'react-router-dom';
import Navbar from '../Components/common/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Travel Agency. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
