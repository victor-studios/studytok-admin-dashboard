require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('count', { count: 'exact' });
  const { data: stdProfiles, error: sErr } = await supabase.from('student_profiles').select('count', { count: 'exact' });
  console.log("profiles:", pErr ? pErr.message : profiles);
  console.log("student_profiles:", sErr ? sErr.message : stdProfiles);
}
check();
