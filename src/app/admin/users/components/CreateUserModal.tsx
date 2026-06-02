// Client Component - Create user modal for admin panel
'use client';

import { useAuth } from '@/contexts/authcontext';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateUserModal({ onClose, onCreated }: Props) {
  const { session } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'teacher' | 'admin' | 'student'>('teacher');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ email, password, fullName, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? 'Failed to create user'); return; }
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--border-primary)] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Create user</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Account is immediately active, no email confirmation needed.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
            <X className="h-5 w-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Full name">
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Jane Smith"
              className={inputCls}
            />
          </Field>

          <Field label="Email address" required>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@school.lk"
              required
              className={inputCls}
            />
          </Field>

          <Field label="Password" required>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
              required
              className={inputCls}
            />
          </Field>

          <Field label="Role" required>
            <select value={role} onChange={e => setRole(e.target.value as typeof role)} className={inputCls}>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </Field>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-primary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-sm">
              {loading ? 'Creating…' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
