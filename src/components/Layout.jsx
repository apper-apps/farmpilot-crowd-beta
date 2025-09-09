import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Layout = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">FarmPilot</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;