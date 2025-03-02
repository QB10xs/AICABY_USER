const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createAdmin(email, password) {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin', {
      body: { email, password },
    });

    if (error) throw error;
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Please provide email and password');
  console.log('Usage: node invoke-create-admin.js <email> <password>');
  process.exit(1);
}

createAdmin(email, password); 