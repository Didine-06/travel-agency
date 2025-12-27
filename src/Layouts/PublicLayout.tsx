import { Outlet } from 'react-router-dom';
import Navbar from '../Components/common/Navbar';
import Footer from '../Components/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
