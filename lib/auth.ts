import bcryptjs from 'bcryptjs';
import { pool } from './db';

export async function verifyAdmin(username: string, password: string) {
  try {
    // First try database authentication
    const query = 'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = $1';
    const result = await pool.query(query, [username]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isValidPassword = await bcryptjs.compare(password, user.password_hash);
      
      if (isValidPassword) {
        // Update last login
        await pool.query('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
        
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    }
  } catch (error) {
    console.error('Database authentication failed, trying fallback credentials:', error);
  }
  
  // Fallback to environment variables if database fails or user not found
  const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME;
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@vanarsena.org';
  
  if (defaultUsername && defaultPassword && 
      username === defaultUsername && password === defaultPassword) {
    return {
      id: 'default-admin',
      username: defaultUsername,
      email: defaultEmail,
      role: 'admin',
    };
  }
  
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcryptjs.hash(password, saltRounds);
}

export async function createAdminUser(username: string, email: string, password: string, role: string = 'admin') {
  const hashedPassword = await hashPassword(password);
  
  const query = `
    INSERT INTO admin_users (username, email, password_hash, role)
    VALUES ($1, $2, $3, $4) RETURNING id, username, email, role
  `;
  
  const result = await pool.query(query, [username, email, hashedPassword, role]);
  return result.rows[0];
}
