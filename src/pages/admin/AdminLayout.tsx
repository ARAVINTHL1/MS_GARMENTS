import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
