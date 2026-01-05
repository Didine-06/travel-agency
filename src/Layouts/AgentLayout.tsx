import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/common/Sidebar';
import TopBar from '../Components/common/TopBar';

const AgentLayout = () => {
  const menuItems = [
    { path: '/agent/dashboard', label: 'Dashboard' },
    { path: '/agent/destinations', label: 'Destinations' },
    { path: '/agent/flight-tickets', label: 'Flight Tickets' },
    { path: '/agent/bookings', label: 'Bookings' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar items={menuItems} role="Agent" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;
