// Client Component - User management table
'use client';

import { useAuth } from '@/contexts/authcontext';
import { useState } from 'react';

type Role = 'admin' | 'teacher' | 'student';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt: string;
}

interface Props {
  users: AdminUser[];
  onRefresh: () => void;
}

const ROLE_COLORS: Record<Role, string> = {
  admin:   'bg-purple-100 text-purple-700 border-purple-200',
  teacher: 'bg-blue-100 text-blue-700 border-blue-200',
  student: 'bg-green-100 text-green-700 border-green-200',
};

export function UserTable({ users, onRefresh }: Props) {
  const { session } = useAuth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const changeRole = async (userId: string, role: Role) => {
    if (!session?.access_token) return;
    setUpdatingId(userId);
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ userId, role }),
    });
    setUpdatingId(null);
    onRefresh();
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    if (!session?.access_token) return;
    setDeletingId(userId);
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ userId }),
    });
    setDeletingId(null);
    onRefresh();
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const initials = (name: string, email: string) => (name || email).slice(0, 2).toUpperCase();

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--text-secondary)]">
        <div className="text-4xl mb-3">👤</div>
        <p className="font-medium">No users yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-primary)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            {['User', 'Email', 'Role', 'Joined', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className={`border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors ${i % 2 === 0 ? '' : 'bg-[var(--bg-secondary)]/30'}`}>
              {/* Avatar + name */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{initials(u.fullName, u.email)}</span>
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">{u.fullName || '—'}</span>
                </div>
              </td>

              {/* Email */}
              <td className="px-4 py-3 text-[var(--text-secondary)]">{u.email}</td>

              {/* Role selector */}
              <td className="px-4 py-3">
                <select
                  value={u.role}
                  disabled={updatingId === u.id}
                  onChange={e => changeRole(u.id, e.target.value as Role)}
                  className={`px-2.5 py-1 rounded-full border text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${ROLE_COLORS[u.role]} ${updatingId === u.id ? 'opacity-50' : ''}`}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              {/* Joined */}
              <td className="px-4 py-3 text-[var(--text-muted)]">{fmt(u.createdAt)}</td>

              {/* Delete */}
              <td className="px-4 py-3">
                <button
                  onClick={() => deleteUser(u.id, u.email)}
                  disabled={deletingId === u.id}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--accent-red)] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors disabled:opacity-40"
                >
                  {deletingId === u.id ? '…' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
