import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/env";

export const supabaseClient = createClient(
  supabaseEnv.supabaseUrl!,
  supabaseEnv.supabaseKey!
);
