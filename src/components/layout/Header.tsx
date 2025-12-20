'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, LogOut, Search, Settings, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  // Simple extraction of the current page name from the path
  const currentPage = pathname === '/' ? 'dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ') || 'dashboard';

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40 flex-shrink-0 transition-shadow duration-300 hover:shadow-md">
      <div className="flex items-center justify-between h-20 px-6 lg:px-8">
        <div className="flex items-center space-x-6">
           {/* Mobile Menu Trigger - Note: Sidebar component handles its own visibility state, 
               but for a separated Header, we might need a context or state management solution 
               if we want this button to control the Sidebar. For now, hiding on desktop. 
               The Sidebar itself has a mobile overlay/trigger logic built-in or needs to be lifted.
               In this simple migration, I'll rely on the Sidebar being present in Layout. 
               Ideally, we wrap Layout with a Context. 
               For MVP, I will just render the title here.
           */}
           
          <div className="animate-slide-right">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent capitalize">
              {currentPage}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {currentPage === 'dashboard' && 'Welcome back! Here\'s your learning overview'}
              {currentPage === 'tests' && 'Discover and take available tests'}
              {currentPage === 'subjects' && 'Organize your curriculum with subjects and modules'}
              {currentPage === 'questions' && 'Build and manage your question collection'}
              {currentPage === 'create' && 'Build engaging tests for students'}
              {currentPage === 'analytics' && 'Track your performance and progress'}
              {currentPage === 'settings' && 'Manage your account preferences'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block transition-all duration-300 focus-within:scale-105">
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
               style={{ padding: 8 }}
              className="relative hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
            </Button>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-white shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Premium Student</p>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-sm transform origin-top-right group-hover:translate-y-0 translate-y-2">
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
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group/item">
                    <User className="h-4 w-4 text-gray-500 group-hover/item:text-blue-600 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover/item:text-blue-700 transition-colors">View Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group/item">
                    <Settings className="h-4 w-4 text-gray-500 group-hover/item:text-blue-600 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover/item:text-blue-700 transition-colors">Settings</span>
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button 
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600 group/logout"
                  >
                    <LogOut className="h-4 w-4 group-hover/logout:scale-110 transition-transform" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
