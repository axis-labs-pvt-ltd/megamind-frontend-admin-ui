import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  User,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  GraduationCap,
  HelpCircle,
  BookOpen,
  Layers
} from 'lucide-react';

interface LayoutProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onPageChange, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', page: 'dashboard', icon: Home, description: 'Overview & stats' },
    { name: 'Available Tests', page: 'tests', icon: FileText, description: 'Browse tests' },
    { name: 'Subject Management', page: 'subjects', icon: BookOpen, description: 'Organize curriculum' },
    { name: 'Question Bank', page: 'questions', icon: HelpCircle, description: 'Manage questions' },
    { name: 'Create Test', page: 'create-test', icon: PlusCircle, description: 'Build new tests' },
    { name: 'Analytics', page: 'analytics', icon: BarChart3, description: 'Performance insights' },
    { name: 'Settings', page: 'settings', icon: Settings, description: 'Account settings' },
  ];

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transform transition-all duration-300 ease-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TestPlatform</span>
              <p className="text-xs text-gray-500 font-medium">Learning Hub</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden hover:bg-gray-100"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  onPageChange(item.page);
                  setIsSidebarOpen(false);
                }}
                className={`group w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-[1.01]'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  currentPage === item.page
                    ? 'bg-white/20'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <item.icon className={`h-5 w-5 ${
                    currentPage === item.page ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold ${currentPage === item.page ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs ${currentPage === item.page ? 'text-blue-100' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </nav>

      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center justify-between h-20 px-6 lg:px-8">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                icon={Menu}
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent capitalize">
                  {currentPage.replace('-', ' ')}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {currentPage === 'dashboard' && 'Welcome back! Here\'s your learning overview'}
                  {currentPage === 'tests' && 'Discover and take available tests'}
                  {currentPage === 'subjects' && 'Organize your curriculum with subjects and modules'}
                  {currentPage === 'questions' && 'Build and manage your question collection'}
                  {currentPage === 'create-test' && 'Build engaging tests for students'}
                  {currentPage === 'analytics' && 'Track your performance and progress'}
                  {currentPage === 'settings' && 'Manage your account preferences'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <Input
                  type="search"
                  placeholder="Search tests, questions..."
                  icon={Search}
                  className="w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={Bell} 
                  className="relative hover:bg-gray-100"
                >
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="relative">
                      <img
                        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                        alt="Profile"
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">Premium Student</p>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                            alt="Profile"
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">John Doe</p>
                          <p className="text-xs text-gray-500">Premium Student</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">View Profile</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Settings</span>
                      </button>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};