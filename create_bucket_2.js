require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setup() {
  const { data, error } = await supabase.storage.createBucket('videos', {
    public: true
  });
  console.log(error ? error : "Bucket created!");
}
setup();
