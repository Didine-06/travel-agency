import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/common/Sidebar';
import TopBar from '../Components/common/TopBar';

const AgentLayout = () => {
  const menuItems = [
    { path: '/agent/dashboard', label: 'Dashboard' },
    { path: '/agent/bookings', label: 'Bookings' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar items={menuItems} role="Agent" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Agent Dashboard" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;
