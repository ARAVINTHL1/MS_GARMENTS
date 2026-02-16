import { Outlet } from 'react-router-dom';
import { EmployeeNavbar } from '@/components/EmployeeNavbar';
import { Chatbot } from '@/components/Chatbot';

const EmployeeLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EmployeeNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
};

export default EmployeeLayout;
