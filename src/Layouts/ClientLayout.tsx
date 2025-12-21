import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/common/Sidebar';
import TopBar from '../Components/common/TopBar';

const ClientLayout = () => {
  const menuItems = [
    { path: '/client/dashboard', label: 'Dashboard' },
    { path: '/client/reservations', label: 'Bookings' },
    { path: '/client/consultations', label: 'Consultations' },
    { path: '/client/planes', label: 'Planes' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar items={menuItems} role="Client" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
