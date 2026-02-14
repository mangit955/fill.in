import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function getUsersByIds(ids: string[]) {
  if (!ids.length) return [];

  const { data } = await admin.auth.admin.listUsers();

  return (data.users || []).filter((u) => ids.includes(u.id));
}
