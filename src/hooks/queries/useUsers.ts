import { queryClient } from '@/lib/query-client';
import { AdminUser } from '@/app/admin/users/components/UserTable';
import { useAuth } from '@/contexts/authcontext';
import { useMutation, useQuery } from '@tanstack/react-query';

export const USERS_KEY = ['users'] as const;

async function fetchUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch('/api/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

async function patchUserRole(token: string, userId: string, role: string) {
  const res = await fetch('/api/admin/users', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, role }),
  });
  if (!res.ok) throw new Error('Failed to update role');
}

async function deleteUserApi(token: string, userId: string) {
  const res = await fetch(`/api/admin/users?userId=${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export function useUsers() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: () => fetchUsers(token),
    enabled: !!token,
  });
}

export function useUpdateUserRole() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => patchUserRole(token, userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useDeleteUser() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';
  return useMutation({
    mutationFn: (userId: string) => deleteUserApi(token, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}
