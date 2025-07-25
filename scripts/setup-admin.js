#!/usr/bin/env node

/**
 * Setup Default Admin User
 * This script creates the default admin user in the database using environment variables
 */

const { createAdminUser } = require('../lib/auth');

async function setupDefaultAdmin() {
  try {
    const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@vanarsena.org';
    
    console.log('Setting up default admin user...');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    
    const user = await createAdminUser(username, email, password, 'admin');
    
    console.log('✅ Default admin user created successfully!');
    console.log('User details:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    console.log('\n📝 You can now login with:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('\n⚠️  Don\'t forget to change the default password in production!');
    
  } catch (error) {
    if (error.code === '23505') {
      console.log('ℹ️  Default admin user already exists in database');
      console.log('You can still use the environment variable credentials as fallback');
    } else {
      console.error('❌ Error setting up default admin user:', error.message);
    }
  }
  
  process.exit(0);
}

setupDefaultAdmin();
