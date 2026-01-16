import React from 'react';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  Home,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearUserData, getCurrentUserName } from '../utils/auth';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const navigate = useNavigate();
  const userName = getCurrentUserName();

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', active: false },
    { icon: <User className="h-5 w-5" />, label: 'Profile', active: true },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Courses', active: false },
    { icon: <Calendar className="h-5 w-5" />, label: 'Schedule', active: false },
    { icon: <Bell className="h-5 w-5" />, label: 'Notifications', active: false },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', active: false },
  ];

  const handleLogout = () => {
    clearUserData();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-university-blue to-blue-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-xl font-bold flex items-center">
          <BookOpen className="h-6 w-6 mr-2" />
          Agile University
        </h1>
        <p className="text-blue-200 text-sm mt-1">Student Portal</p>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-blue-400 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="font-semibold">{userName}</h2>
            <p className="text-blue-200 text-sm">Student</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-200 hover:bg-blue-800 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;