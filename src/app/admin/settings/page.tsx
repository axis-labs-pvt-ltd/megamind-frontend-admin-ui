'use client';

import { AdminOnlyGate } from '@/components/layout/AdminGuard';
import { ProfileForm } from '@/components/features/settings/ProfileForm';
import { Card } from '@/components/ui/card';
import { Bell, Shield, User } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Account Settings</h2>
        <p className="text-[var(--text-secondary)]">Manage your profile preferences and account security</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <Card className="w-full lg:w-64 h-fit p-2 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-[var(--accent-blue)] text-white shadow-md shadow-blue-500/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-white' : ''}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </Card>

        {/* Content Area */}
        <Card className="flex-1 flex flex-col justify-center items-center p-6 lg:p-8 min-h-[500px]">
          {activeTab === 'profile' && (
            <ProfileForm 
              initialData={{
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                bio: 'Passionate educator and learner.'
              }} 
            />
          )}

          {activeTab === 'notifications' && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Notifications</h3>
              <p>Notification settings coming soon.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Security</h3>
              <p>Security settings coming soon.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <AdminOnlyGate><SettingsPageContent /></AdminOnlyGate>;
}
