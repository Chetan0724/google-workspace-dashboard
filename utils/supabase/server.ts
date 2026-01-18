import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/env";

export const supabaseServer = createClient(
  supabaseEnv.supabaseUrl!,
  supabaseEnv.supabaseServiceRoleKey!
);
