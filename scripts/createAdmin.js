const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  throw new Error('Missing environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

async function createAdminUser(email, password) {
  try {
    console.log('Creating user with email:', email);
    
    // Create user
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error('Error creating user:', createError);
      throw createError;
    }

    console.log('User created successfully:', user.user.id);

    // Add admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert([{ user_id: user.user.id, role: 'ai_admin' }]);

    if (roleError) {
      console.error('Error assigning role:', roleError);
      // Rollback user creation if role assignment fails
      await supabaseAdmin.auth.admin.deleteUser(user.user.id);
      throw roleError;
    }

    console.log('Admin role assigned successfully');

    // Enable 2FA requirement
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.user.id,
      { app_metadata: { requires_2fa: true } }
    );

    if (updateError) {
      console.error('Error enabling 2FA:', updateError);
      throw updateError;
    }

    console.log('2FA requirement enabled');
    console.log('Admin user setup completed successfully');
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please save these credentials securely');

    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Please provide email and password as arguments');
  console.log('Usage: node createAdmin.js <email> <password>');
  process.exit(1);
}

createAdminUser(email, password)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }); 