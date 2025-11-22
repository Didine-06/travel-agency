import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/common/Sidebar';
import TopBar from '../Components/common/TopBar';

const ClientLayout = () => {
  const menuItems = [
    { path: '/client/dashboard', label: 'Dashboard' },
    { path: '/client/profile', label: 'Profile' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar items={menuItems} role="Client" />
      <div className="flex-1 flex flex-col">
        <TopBar title="Client Dashboard" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
