import { createClient } from '@supabase/supabase-js';

// Domain types are imported at the component level via '@/types'.
// We intentionally omit the Database generic here because the Supabase SDK's
// internal inference resolves insert/update payloads to `never` when the
// generic schema doesn't exactly match the generated types. Component-level
// casts (e.g. `as Student`) preserve end-to-end type safety without fighting
// the SDK internals.

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
