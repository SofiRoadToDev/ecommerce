const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars manually
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                env[match[1].trim()] = match[2].trim();
            }
        });
        return env;
    } catch (err) {
        console.error('Error loading .env.local:', err.message);
        return {};
    }
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
// Hide most of the key for security
console.log('Key:', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // 1. Test Auth (REAL credentials)
        console.log('\n1. Testing Auth (SignIn with REAL credentials)...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'sofi@admin.com',
            password: 'sofi'
        });

        if (authError) {
            console.log('Auth Response (Error):', authError.message);
            if (authError.message === 'Database error querying schema') {
                console.error('🚨 CRITICAL: Reproduced "Database error querying schema" in Auth!');
            }
        } else {
            console.log('✅ Auth Successful!');
            console.log('User ID:', authData.user.id);
            console.log('Metadata:', authData.user.user_metadata || authData.user.app_metadata);
        }

        // 2. Test Public Table Access
        console.log('\n2. Testing Public Table Access (products)...');
        const { data: tableData, error: tableError } = await supabase
            .from('products')
            .select('count')
            .limit(1);

        if (tableError) {
            console.error('❌ Table Access Error:', tableError.message);
        } else {
            console.log('✅ Table Access Successful');
        }

    } catch (err) {
        console.error('💥 Unexpected Error:', err);
    }
}

testConnection();
