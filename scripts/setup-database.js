#!/usr/bin/env node

/**
 * Database Setup Script
 * This script creates all necessary tables in the database
 */

import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
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

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }
  
  console.log('🔗 Connecting to database...');
  console.log('Database URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Create tables
    console.log('📦 Creating tables...');
    
    // Events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        event_date DATE NOT NULL,
        event_time TIME,
        location TEXT,
        tags TEXT[],
        media_urls TEXT[],
        video_urls TEXT[],
        document_urls TEXT[],
        visibility VARCHAR(20) DEFAULT 'public',
        published BOOLEAN DEFAULT false,
        featured_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Events table created');

    // Event translations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_translations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        locale VARCHAR(5) NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, locale)
      )
    `);
    console.log('✅ Event translations table created');

    // Media files table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media_files (
        id VARCHAR(255) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        url TEXT NOT NULL,
        bucket VARCHAR(100) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Media files table created');

    // Contact submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contact submissions table created');

    // Admin users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);
    console.log('✅ Admin users table created');

    // Site settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Site settings table created');

    // Create default admin user
    console.log('👤 Creating default admin user...');
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@vanarsena.org';

    // Check if admin user already exists
    const existingUser = await pool.query('SELECT id FROM admin_users WHERE username = $1', [defaultUsername]);
    
    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcryptjs.hash(defaultPassword, 10);
      await pool.query(
        'INSERT INTO admin_users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        [defaultUsername, defaultEmail, hashedPassword, 'admin']
      );
      console.log('✅ Default admin user created');
      console.log('📝 Admin credentials:');
      console.log(`   Username: ${defaultUsername}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log(`   Email: ${defaultEmail}`);
    } else {
      console.log('ℹ️  Default admin user already exists');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('🌐 You can now start your application with: npm run dev');
    console.log('🔐 Admin panel: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
