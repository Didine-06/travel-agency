import { Outlet } from 'react-router-dom';
import Navbar from '../Components/common/Navbar';
import Footer from '../Components/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
