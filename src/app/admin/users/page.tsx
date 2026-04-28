// Client Component - User management page (admin only)
'use client';

import { AdminOnlyGate } from '@/components/layout/AdminGuard';
import { useAuth } from '@/contexts/authcontext';
import { UserPlus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CreateUserModal } from './components/CreateUserModal';
import { AdminUser, UserTable } from './components/UserTable';

function UsersPageContent() {
  const { session } = useAuth();
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState('');

  const loadUsers = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, [session]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleCreated = () => { setShowModal(false); loadUsers(); };

  const filtered = users.filter(u =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total:   users.length,
    admin:   users.filter(u => u.role === 'admin').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    student: users.filter(u => u.role === 'student').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h2>
          <p className="text-[var(--text-secondary)] mt-0.5">Create accounts and assign roles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all"
        >
          <UserPlus className="h-4 w-4" /> Create user
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total users', value: counts.total, color: 'text-[var(--text-primary)]' },
          { label: 'Admins',      value: counts.admin,   color: 'text-purple-600' },
          { label: 'Teachers',    value: counts.teacher, color: 'text-blue-600' },
          { label: 'Students',    value: counts.student, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-4">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-[var(--text-secondary)] text-sm">Loading users…</div>
      ) : (
        <UserTable users={filtered} onRefresh={loadUsers} />
      )}

      {showModal && <CreateUserModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </div>
  );
}

export default function UsersPage() {
  return <AdminOnlyGate><UsersPageContent /></AdminOnlyGate>;
}
