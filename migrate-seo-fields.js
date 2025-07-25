import pkg from 'pg';
const { Pool } = pkg;
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
  const envVars = envFile.split('\n').filter(line => line.includes('=') && !line.startsWith('#'));
  
  envVars.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/"/g, '');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
  console.log('✅ Environment variables loaded');
} catch (error) {
  console.error('❌ Could not load .env.local file:', error);
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrateSEOFields() {
  const client = await pool.connect();
  
  try {
    console.log('Starting SEO fields migration...');
    
    // Check if columns already exist
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'event_translations' 
      AND column_name IN ('meta_title', 'meta_description', 'updated_at');
    `;
    
    const existingColumns = await client.query(checkQuery);
    const columnNames = existingColumns.rows.map(row => row.column_name);
    
    // Add meta_title column if it doesn't exist
    if (!columnNames.includes('meta_title')) {
      await client.query(`
        ALTER TABLE event_translations 
        ADD COLUMN meta_title VARCHAR(255);
      `);
      console.log('✓ Added meta_title column');
    } else {
      console.log('• meta_title column already exists');
    }
    
    // Add meta_description column if it doesn't exist
    if (!columnNames.includes('meta_description')) {
      await client.query(`
        ALTER TABLE event_translations 
        ADD COLUMN meta_description TEXT;
      `);
      console.log('✓ Added meta_description column');
    } else {
      console.log('• meta_description column already exists');
    }
    
    // Add updated_at column if it doesn't exist
    if (!columnNames.includes('updated_at')) {
      await client.query(`
        ALTER TABLE event_translations 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
      console.log('✓ Added updated_at column');
    } else {
      console.log('• updated_at column already exists');
    }
    
    console.log('SEO fields migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrateSEOFields()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
