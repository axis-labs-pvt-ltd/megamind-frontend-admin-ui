// Server-side API route — uses service_role key, never exposed to client
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Verify the calling user is an admin via their JWT
async function requireAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const sa = adminClient();
  const { data: { user }, error } = await sa.auth.getUser(token);
  if (error || !user) return null;
  const { data: profile } = await sa.from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'admin' ? user : null;
}

// GET /api/admin/users — list all users with profiles
export async function GET(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const sa = adminClient();
  const [{ data: profiles, error: pe }, { data: { users }, error: ae }] = await Promise.all([
    sa.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }),
    sa.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (pe || ae) return NextResponse.json({ error: (pe ?? ae)!.message }, { status: 500 });

  const emailMap = Object.fromEntries(users.map(u => [u.id, u.email ?? '']));
  const result = (profiles ?? []).map(p => ({
    id: p.id,
    fullName: p.full_name ?? '',
    email: emailMap[p.id] ?? '',
    role: p.role,
    createdAt: p.created_at,
  }));

  return NextResponse.json(result);
}

// POST /api/admin/users — create a new user
export async function POST(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email, password, fullName, role } = await req.json();
  if (!email || !password || !role) {
    return NextResponse.json({ error: 'email, password and role are required' }, { status: 400 });
  }

  const sa = adminClient();
  const { data: { user }, error } = await sa.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName ?? '', role },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Ensure profile has correct role (trigger may create it as 'student')
  await sa.from('profiles').update({ role, full_name: fullName ?? '' }).eq('id', user!.id);

  return NextResponse.json({ success: true, userId: user!.id }, { status: 201 });
}

// PATCH /api/admin/users — update a user's role
export async function PATCH(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId, role } = await req.json();
  if (!userId || !role) return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });

  const sa = adminClient();
  const { error } = await sa.from('profiles').update({ role }).eq('id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/users — delete a user
export async function DELETE(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

  const sa = adminClient();
  const { error } = await sa.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
