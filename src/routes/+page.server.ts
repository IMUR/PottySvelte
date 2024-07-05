// src/routes/form/+page.server.ts
import { supabase } from "e:/PottySnitch/PottySvelte/src/lib/supabaseClient";

export async function load() {
  const { data: pottyRules } = await supabase.from('PottyRules').select('pottyRule');
  const { data: pottyTypes } = await supabase.from('PottyTypes').select('pottyType');
  return {
    pottyRules: pottyRules ?? [],
    pottyTypes: pottyTypes ?? [],
  };
}
