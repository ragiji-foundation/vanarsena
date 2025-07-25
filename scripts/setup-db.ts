import { initializeTables } from '../lib/db';
import { createAdminUser } from '../lib/auth';

// Load environment variables manually
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env.local file
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
  const envVars = envFile.split('\n').filter(line => line.includes('=') && !line.startsWith('#'));
  
  envVars.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/"/g, '');
    process.env[key.trim()] = value.trim();
  });
} catch (error) {
  console.log('Could not load .env.local file');
}

async function setupDatabase() {
  console.log('Setting up database...');
  console.log('Database URL:', process.env.DATABASE_URL ? 'Connected' : 'Not found');
  
  try {
    // Initialize tables
    await initializeTables();
    
    // Create default admin user
    const adminExists = await createAdminUser('admin', 'admin@vanarsena.org', 'admin123');
    
    if (adminExists) {
      console.log('✅ Database setup completed');
      console.log('📝 Default admin credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   Email: admin@vanarsena.org');
      console.log('');
      console.log('⚠️  Please change the default password after first login!');
    } else {
      console.log('✅ Database setup completed');
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

setupDatabase();
