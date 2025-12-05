import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/common/Sidebar';
import TopBar from '../Components/common/TopBar';

const AdminLayout = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar items={menuItems} role="Admin" />
      <div className="flex-1 flex flex-col">
        <TopBar title="Admin Dashboard" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
