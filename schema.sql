-- Database schema for VanarSena NGO Website

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    event_date TIMESTAMP NOT NULL,
    event_time VARCHAR(10),
    location TEXT,
    tags TEXT[],
    media_urls TEXT[],
    video_urls TEXT[],
    document_urls TEXT[],
    visibility VARCHAR(20) DEFAULT 'published' CHECK (visibility IN ('draft', 'published')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Create event_translations table for i18n content
CREATE TABLE IF NOT EXISTS event_translations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL CHECK (locale IN ('en', 'hi')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, locale)
);

-- Create media_files table
CREATE TABLE IF NOT EXISTS media_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    url TEXT NOT NULL,
    bucket_name VARCHAR(100),
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    tags TEXT[],
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    locale VARCHAR(5) DEFAULT 'hi',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_visibility ON events(visibility);
CREATE INDEX IF NOT EXISTS idx_event_translations_locale ON event_translations(locale);
CREATE INDEX IF NOT EXISTS idx_media_files_event_id ON media_files(event_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Insert default admin user (password: admin123 - change in production!)
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@vanarsena.org', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value, locale) VALUES
('site_name', 'VanarSena', 'hi'),
('site_name', 'VanarSena', 'en'),
('hero_title', 'वानरसेना - समाज सेवा के लिए प्रतिबद्ध', 'hi'),
('hero_title', 'VanarSena - Committed to Social Service', 'en'),
('hero_subtitle', 'हमारे साथ जुड़िए और समाज में बदलाव लाइए', 'hi'),
('hero_subtitle', 'Join us and make a difference in society', 'en'),
('about_mission', 'समाज में सकारात्मक बदलाव लाना और जरूरतमंदों की सेवा करना', 'hi'),
('about_mission', 'To bring positive change in society and serve those in need', 'en'),
('contact_email', 'contact@vanarsena.org', 'hi'),
('contact_phone', '+91-XXXXXXXXXX', 'hi'),
('contact_address', 'वानरसेना कार्यालय, भारत', 'hi'),
('contact_address', 'VanarSena Office, India', 'en')
ON CONFLICT (key) DO NOTHING;
