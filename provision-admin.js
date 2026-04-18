const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function provisionAdmin() {
  const email = 'victorstudios365@gmail.com';
  const password = 'Salmanali202008#';

  console.log(`Setting up admin user: ${email}...`);

  // 1. Create or update the user in the Auth module
  const { data: userData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // bypass email confirmation requirement
  });

  let userId;

  if (authError) {
    if (authError.message.includes("already exist") || authError.message.includes("already been registered") || authError.code === 'email_exists') {
      console.log("User already exists in Auth. Looking up ID...");
      // For service role, we need to list users and find them if they exist
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error("Failed to list users:", listError);
        process.exit(1);
      }
      
      const existingUser = usersData.users.find(u => u.email === email);
      if (!existingUser) {
        console.error("User claims to exist but couldn't be found via listUsers");
        process.exit(1);
      }
      userId = existingUser.id;
      
      // Update their password just in case it doesn't match
      await supabase.auth.admin.updateUserById(userId, { password });
      console.log("Updated password for existing auth user.");
    } else {
      console.error("Auth Error:", authError);
      process.exit(1);
    }
  } else {
      userId = userData.user.id;
      console.log("Created new auth user.");
  }

  // 2. Insert into our custom admin_users table (Bypasses RLS because of service key)
  const { error: dbError } = await supabase
    .from('admin_users')
    .upsert({ id: userId, email });

  if (dbError) {
    console.error("Failed to insert into admin_users table:", dbError);
    process.exit(1);
  }

  console.log("✅ Successfully configured admin! You can now login.");
}

provisionAdmin();
