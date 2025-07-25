import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;
export { pool };

// Initialize database tables
export async function initializeTables() {
  try {
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

    // Site settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Database helper functions
export async function getEvents(locale: 'hi' | 'en' = 'hi', limit?: number) {
  const query = `
    SELECT 
      e.id,
      e.slug,
      e.event_date,
      e.event_time,
      e.location,
      e.tags,
      e.media_urls,
      e.video_urls,
      e.document_urls,
      e.visibility,
      e.created_at,
      et.title,
      et.description,
      et.meta_title,
      et.meta_description
    FROM events e
    LEFT JOIN event_translations et ON e.id = et.event_id AND et.locale = $1
    WHERE e.visibility = 'published'
    ORDER BY e.event_date DESC
    ${limit ? `LIMIT ${limit}` : ''}
  `;
  
  const result = await pool.query(query, [locale]);
  return result.rows;
}

export async function getEventBySlug(slug: string, locale: 'hi' | 'en' = 'hi') {
  const query = `
    SELECT 
      e.id,
      e.slug,
      e.event_date,
      e.event_time,
      e.location,
      e.tags,
      e.media_urls,
      e.video_urls,
      e.document_urls,
      e.visibility,
      e.created_at,
      et.title,
      et.description,
      et.meta_title,
      et.meta_description
    FROM events e
    LEFT JOIN event_translations et ON e.id = et.event_id AND et.locale = $2
    WHERE e.slug = $1 AND e.visibility = 'published'
  `;
  
  const result = await pool.query(query, [slug, locale]);
  return result.rows[0];
}

export async function getAllEventsAdmin(filter: 'all' | 'published' | 'draft' = 'all') {
  let whereClause = '';
  if (filter === 'published') {
    whereClause = 'WHERE e.published = true';
  } else if (filter === 'draft') {
    whereClause = 'WHERE e.published = false';
  }
  
  const query = `
    SELECT 
      e.id,
      e.slug,
      e.event_date,
      e.event_time,
      e.location,
      e.tags,
      e.media_urls,
      e.video_urls,
      e.document_urls,
      e.visibility,
      e.published,
      e.featured_image,
      e.created_at,
      et_hi.title as title_hi,
      et_hi.description as description_hi,
      et_en.title as title_en,
      et_en.description as description_en
    FROM events e
    LEFT JOIN event_translations et_hi ON e.id = et_hi.event_id AND et_hi.locale = 'hi'
    LEFT JOIN event_translations et_en ON e.id = et_en.event_id AND et_en.locale = 'en'
    ${whereClause}
    ORDER BY e.created_at DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

export async function createEvent(eventData: any) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert event
    const eventResult = await client.query(
      `INSERT INTO events (slug, event_date, event_time, location, tags, media_urls, video_urls, document_urls, visibility, featured_image, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        eventData.slug,
        eventData.event_date,
        eventData.event_time,
        eventData.location,
        eventData.tags,
        eventData.media_urls || [],
        eventData.video_urls || [],
        eventData.document_urls || [],
        eventData.visibility,
        eventData.featured_image,
        eventData.visibility === 'published'
      ]
    );
    
    const eventId = eventResult.rows[0].id;
    
    // Insert translations
    if (eventData.title_hi || eventData.description_hi) {
      await client.query(
        `INSERT INTO event_translations (event_id, locale, title, description, meta_title, meta_description)
         VALUES ($1, 'hi', $2, $3, $4, $5)`,
        [eventId, eventData.title_hi, eventData.description_hi, eventData.meta_title_hi, eventData.meta_description_hi]
      );
    }
    
    if (eventData.title_en || eventData.description_en) {
      await client.query(
        `INSERT INTO event_translations (event_id, locale, title, description, meta_title, meta_description)
         VALUES ($1, 'en', $2, $3, $4, $5)`,
        [eventId, eventData.title_en, eventData.description_en, eventData.meta_title_en, eventData.meta_description_en]
      );
    }
    
    await client.query('COMMIT');
    return eventId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function saveContactSubmission(contactData: any) {
  const query = `
    INSERT INTO contact_submissions (name, email, phone, subject, message)
    VALUES ($1, $2, $3, $4, $5) RETURNING id
  `;
  
  const result = await pool.query(query, [
    contactData.name,
    contactData.email,
    contactData.phone,
    contactData.subject,
    contactData.message
  ]);
  
  return result.rows[0].id;
}
