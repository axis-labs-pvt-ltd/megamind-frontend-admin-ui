'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bell, Lock, Paintbrush, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account preferences and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation (Mock) */}
        <div className="lg:col-span-1 space-y-2">
          <Card className="p-2">
            {[
              { name: 'Profile', icon: User, active: true },
              { name: 'Notifications', icon: Bell, active: false },
              { name: 'Appearance', icon: Paintbrush, active: false },
              { name: 'Security', icon: Lock, active: false },
            ].map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-4 w-4 ${item.active ? 'text-blue-500' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50">
                    <Paintbrush className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Profile Photo</h4>
                  <p className="text-sm text-gray-500 mb-3">Update your profile picture.</p>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">Change</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="John" />
                <Input label="Last Name" defaultValue="Doe" />
                <Input label="Email" defaultValue="john.doe@example.com" disabled />
                <Input label="Role" defaultValue="Administrator" disabled />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                 <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows={4}
                    defaultValue="Passionate educator and administrator."
                 />
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
