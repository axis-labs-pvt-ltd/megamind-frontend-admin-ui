// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Bypass navigator.locks to prevent 10s lock-timeout errors that occur
      // when multiple tabs are open or on rapid page transitions.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lock: (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
    },
  }
);
