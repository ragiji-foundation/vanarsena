#!/usr/bin/env node

/**
 * Seed Data Script for VanarSena Website
 * This script populates the database with sample content for development and testing
 */

import pkg from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
  const envVars = envFile.split('\n').filter(line => line.includes('=') && !line.startsWith('#'));
  
  envVars.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/"/g, '');
    if (key && value) {
      process.env[key] = value;
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

// Sample events data
const sampleEvents = [
  {
    slug: 'tree-plantation-drive-2024',
    event_date: '2024-12-15',
    event_time: '09:00:00',
    location: 'Central Park, Delhi',
    tags: ['environment', 'plantation', 'awareness'],
    visibility: 'published',
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    translations: {
      hi: {
        title: 'वृक्षारोपण अभियान 2024',
        description: '<p>हमारे <strong>वृक्षारोपण अभियान 2024</strong> में शामिल हों और पर्यावरण संरक्षण में अपना योगदान दें। इस कार्यक्रम में हम 1000 पौधे लगाएंगे और स्थानीय समुदाय को पर्यावरण संरक्षण के बारे में जागरूक करेंगे।</p><h3>कार्यक्रम की मुख्य बातें:</h3><ul><li>1000 पौधों का रोपण</li><li>पर्यावरण जागरूकता सत्र</li><li>स्थानीय समुदाय की भागीदारी</li><li>निःशुल्क भोजन व्यवस्था</li></ul><p>कृपया सुबह 9 बजे तक पहुंचें। अधिक जानकारी के लिए संपर्क करें।</p>',
        meta_title: 'वृक्षारोपण अभियान 2024 - वानरसेना',
        meta_description: 'वानरसेना के वृक्षारोपण अभियान 2024 में शामिल हों। 1000 पौधे लगाकर पर्यावरण संरक्षण में योगदान दें। 15 दिसंबर 2024, सेंट्रल पार्क दिल्ली में।'
      },
      en: {
        title: 'Tree Plantation Drive 2024',
        description: '<p>Join our <strong>Tree Plantation Drive 2024</strong> and contribute to environmental conservation. In this program, we will plant 1000 saplings and raise awareness about environmental protection in the local community.</p><h3>Key highlights of the program:</h3><ul><li>Plantation of 1000 saplings</li><li>Environmental awareness session</li><li>Local community participation</li><li>Free meal arrangement</li></ul><p>Please arrive by 9 AM. Contact us for more information.</p>',
        meta_title: 'Tree Plantation Drive 2024 - VanarSena',
        meta_description: 'Join VanarSena\'s Tree Plantation Drive 2024. Plant 1000 saplings and contribute to environmental conservation. December 15, 2024, at Central Park Delhi.'
      }
    }
  },
  {
    slug: 'education-support-program',
    event_date: '2024-12-20',
    event_time: '10:30:00',
    location: 'Government School, Noida',
    tags: ['education', 'children', 'support'],
    visibility: 'published',
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    translations: {
      hi: {
        title: 'शिक्षा सहायता कार्यक्रम',
        description: '<p><strong>गुणवत्तापूर्ण शिक्षा</strong> हर बच्चे का अधिकार है। हमारे शिक्षा सहायता कार्यक्रम में हम जरूरतमंद बच्चों को मुफ्त शिक्षा सामग्री, किताबें और छात्रवृत्ति प्रदान करते हैं।</p><h3>कार्यक्रम में शामिल:</h3><ul><li>निःशुल्क पुस्तकें और कॉपियां</li><li>शिक्षा सामग्री वितरण</li><li>छात्रवृत्ति योजना</li><li>करियर काउंसलिंग सत्र</li></ul><p>शिक्षा के क्षेत्र में हमारे साथ जुड़ें और बच्चों के उज्ज्वल भविष्य में योगदान दें।</p>',
        meta_title: 'शिक्षा सहायता कार्यक्रम - वानरसेना',
        meta_description: 'वानरसेना का शिक्षा सहायता कार्यक्रम। जरूरतमंद बच्चों को मुफ्त शिक्षा सामग्री, किताबें और छात्रवृत्ति। 20 दिसंबर 2024।'
      },
      en: {
        title: 'Education Support Program',
        description: '<p><strong>Quality education</strong> is every child\'s right. In our Education Support Program, we provide free educational materials, books, and scholarships to needy children.</p><h3>Program includes:</h3><ul><li>Free books and notebooks</li><li>Educational material distribution</li><li>Scholarship scheme</li><li>Career counseling sessions</li></ul><p>Join us in the field of education and contribute to the bright future of children.</p>',
        meta_title: 'Education Support Program - VanarSena',
        meta_description: 'VanarSena\'s Education Support Program. Free educational materials, books, and scholarships for needy children. December 20, 2024.'
      }
    }
  },
  {
    slug: 'community-health-camp',
    event_date: '2025-01-10',
    event_time: '08:00:00',
    location: 'Community Center, Gurgaon',
    tags: ['health', 'medical', 'community'],
    visibility: 'published',
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    translations: {
      hi: {
        title: 'सामुदायिक स्वास्थ्य शिविर',
        description: '<p>हमारे <strong>निःशुल्क स्वास्थ्य शिविर</strong> में आकर अपनी और अपने परिवार की स्वास्थ्य जांच कराएं। योग्य डॉक्टरों द्वारा मुफ्त चिकित्सा सेवा और स्वास्थ्य परामर्श।</p><h3>उपलब्ध सेवाएं:</h3><ul><li>सामान्य स्वास्थ्य जांच</li><li>रक्तचाप और मधुमेह जांच</li><li>नेत्र परीक्षण</li><li>मुफ्त दवाइयां</li><li>स्वास्थ्य जागरूकता सत्र</li></ul><p>सुबह 8 बजे से शाम 5 बजे तक। कोई फीस नहीं।</p>',
        meta_title: 'सामुदायिक स्वास्थ्य शिविर - वानरसेना',
        meta_description: 'वानरसेना का निःशुल्क स्वास्थ्य शिविर। मुफ्त चिकित्सा जांच, दवाइयां और स्वास्थ्य परामर्श। 10 जनवरी 2025, गुड़गांव।'
      },
      en: {
        title: 'Community Health Camp',
        description: '<p>Visit our <strong>free health camp</strong> and get health checkups for you and your family. Free medical services and health consultation by qualified doctors.</p><h3>Available services:</h3><ul><li>General health checkup</li><li>Blood pressure and diabetes screening</li><li>Eye examination</li><li>Free medicines</li><li>Health awareness sessions</li></ul><p>From 8 AM to 5 PM. No fees.</p>',
        meta_title: 'Community Health Camp - VanarSena',
        meta_description: 'VanarSena\'s free health camp. Free medical checkups, medicines, and health consultation. January 10, 2025, Gurgaon.'
      }
    }
  },
  {
    slug: 'women-empowerment-workshop',
    event_date: '2025-01-25',
    event_time: '11:00:00',
    location: 'Women\'s Center, Mumbai',
    tags: ['women', 'empowerment', 'skills'],
    visibility: 'published',
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
    translations: {
      hi: {
        title: 'महिला सशक्तिकरण कार्यशाला',
        description: '<p><strong>महिला सशक्तिकरण</strong> हमारी प्राथमिकता है। इस कार्यशाला में महिलाओं को आत्मनिर्भर बनने के लिए विभिन्न कौशल विकास प्रशिक्षण दिया जाएगा।</p><h3>प्रशिक्षण मॉड्यूल:</h3><ul><li>सिलाई-कढ़ाई प्रशिक्षण</li><li>कंप्यूटर बेसिक कोर्स</li><li>वित्तीय साक्षरता</li><li>स्वास्थ्य और पोषण</li><li>उद्यमिता विकास</li></ul><p>केवल महिलाओं के लिए। निःशुल्क प्रमाणपत्र और रिफ्रेशमेंट।</p>',
        meta_title: 'महिला सशक्तिकरण कार्यशाला - वानरसेना',
        meta_description: 'वानरसेना की महिला सशक्तिकरण कार्यशाला। कौशल विकास प्रशिक्षण, वित्तीय साक्षरता और उद्यमिता। 25 जनवरी 2025, मुंबई।'
      },
      en: {
        title: 'Women Empowerment Workshop',
        description: '<p><strong>Women empowerment</strong> is our priority. In this workshop, women will be given various skill development training to become self-reliant.</p><h3>Training modules:</h3><ul><li>Sewing and embroidery training</li><li>Computer basic course</li><li>Financial literacy</li><li>Health and nutrition</li><li>Entrepreneurship development</li></ul><p>For women only. Free certificate and refreshments.</p>',
        meta_title: 'Women Empowerment Workshop - VanarSena',
        meta_description: 'VanarSena\'s Women Empowerment Workshop. Skill development training, financial literacy, and entrepreneurship. January 25, 2025, Mumbai.'
      }
    }
  },
  {
    slug: 'food-distribution-drive',
    event_date: '2025-02-05',
    event_time: '12:00:00',
    location: 'Railway Station, Kolkata',
    tags: ['food', 'hunger', 'charity'],
    visibility: 'draft',
    published: false,
    featured_image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
    translations: {
      hi: {
        title: 'भोजन वितरण अभियान',
        description: '<p><strong>भूख मिटाना</strong> हमारा मिशन है। इस अभियान में हम जरूरतमंद लोगों, बेघर व्यक्तियों और दैनिक मजदूरों को पौष्टिक भोजन प्रदान करेंगे।</p><h3>वितरण शामिल:</h3><ul><li>गर्म भोजन पैकेट</li><li>पानी की बोतलें</li><li>फल और बिस्कुट</li><li>सैनिटाइजर और मास्क</li></ul><p>स्वयंसेवकों का स्वागत है। कृपया साफ-सुथरे कपड़े पहनकर आएं।</p>',
        meta_title: 'भोजन वितरण अभियान - वानरसेना',
        meta_description: 'वानरसेना का भोजन वितरण अभियान। जरूरतमंदों को मुफ्त पौष्टिक भोजन। 5 फरवरी 2025, कोलकाता रेलवे स्टेशन।'
      },
      en: {
        title: 'Food Distribution Drive',
        description: '<p><strong>Eliminating hunger</strong> is our mission. In this campaign, we will provide nutritious food to needy people, homeless individuals, and daily wage workers.</p><h3>Distribution includes:</h3><ul><li>Hot meal packets</li><li>Water bottles</li><li>Fruits and biscuits</li><li>Sanitizer and masks</li></ul><p>Volunteers are welcome. Please come in clean clothes.</p>',
        meta_title: 'Food Distribution Drive - VanarSena',
        meta_description: 'VanarSena\'s Food Distribution Drive. Free nutritious food for the needy. February 5, 2025, Kolkata Railway Station.'
      }
    }
  }
];

// Sample contact submissions
const sampleContacts = [
  {
    name: 'राहुल शर्मा',
    email: 'rahul.sharma@email.com',
    phone: '+91-9876543210',
    subject: 'वृक्षारोपण कार्यक्रम में भाग लेना',
    message: 'मैं आपके वृक्षारोपण कार्यक्रम में भाग लेना चाहता हूं। कृपया मुझे विस्तृत जानकारी भेजें।',
    status: 'unread'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91-9123456789',
    subject: 'Volunteering Opportunity',
    message: 'I would like to volunteer for your NGO activities. Please let me know how I can contribute to your social causes.',
    status: 'read'
  },
  {
    name: 'अमित कुमार',
    email: 'amit.kumar@email.com',
    phone: '+91-8765432109',
    subject: 'डोनेशन के बारे में',
    message: 'मैं आपके संगठन को दान देना चाहता हूं। कृपया बैंक खाता विवरण साझा करें।',
    status: 'unread'
  },
  {
    name: 'Sneha Gupta',
    email: 'sneha.gupta@email.com',
    phone: '+91-7654321098',
    subject: 'Partnership Proposal',
    message: 'Our organization would like to partner with VanarSena for community development projects. Can we schedule a meeting?',
    status: 'read'
  }
];

// Sample media files
const sampleMediaFiles = [
  {
    id: 'seed-img-001',
    filename: 'tree-plantation-banner.jpg',
    original_name: 'Tree Plantation Banner.jpg',
    file_type: 'image/jpeg',
    file_size: 245760,
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    bucket: 'vanarsena-media'
  },
  {
    id: 'seed-img-002',
    filename: 'education-program.jpg',
    original_name: 'Education Program.jpg',
    file_type: 'image/jpeg',
    file_size: 189440,
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    bucket: 'vanarsena-media'
  },
  {
    id: 'seed-img-003',
    filename: 'health-camp.jpg',
    original_name: 'Health Camp.jpg',
    file_type: 'image/jpeg',
    file_size: 167936,
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    bucket: 'vanarsena-media'
  },
  {
    id: 'seed-img-004',
    filename: 'women-empowerment.jpg',
    original_name: 'Women Empowerment.jpg',
    file_type: 'image/jpeg',
    file_size: 203520,
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
    bucket: 'vanarsena-media'
  },
  {
    id: 'seed-img-005',
    filename: 'food-distribution.jpg',
    original_name: 'Food Distribution.jpg',
    file_type: 'image/jpeg',
    file_size: 221184,
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
    bucket: 'vanarsena-media'
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    await client.query('BEGIN');
    
    // Clear existing data (in reverse order due to foreign key constraints)
    console.log('🧹 Clearing existing seed data...');
    await client.query('DELETE FROM event_translations WHERE event_id IN (SELECT id FROM events WHERE slug LIKE \'%seed%\' OR slug IN ($1, $2, $3, $4, $5))', 
      sampleEvents.map(e => e.slug));
    await client.query('DELETE FROM events WHERE slug LIKE \'%seed%\' OR slug IN ($1, $2, $3, $4, $5)', 
      sampleEvents.map(e => e.slug));
    await client.query('DELETE FROM contact_submissions WHERE email LIKE \'%.email.com\'');
    await client.query('DELETE FROM media_files WHERE id LIKE \'seed-%\'');
    
    // Seed Events
    console.log('📅 Seeding events...');
    for (const event of sampleEvents) {
      // Insert event
      const eventResult = await client.query(`
        INSERT INTO events (slug, event_date, event_time, location, tags, media_urls, video_urls, document_urls, visibility, published, featured_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        event.slug,
        event.event_date,
        event.event_time,
        event.location,
        event.tags,
        [],
        [],
        [],
        event.visibility,
        event.published,
        event.featured_image
      ]);
      
      const eventId = eventResult.rows[0].id;
      
      // Insert Hindi translation
      await client.query(`
        INSERT INTO event_translations (event_id, locale, title, description, meta_title, meta_description)
        VALUES ($1, 'hi', $2, $3, $4, $5)
      `, [
        eventId,
        event.translations.hi.title,
        event.translations.hi.description,
        event.translations.hi.meta_title,
        event.translations.hi.meta_description
      ]);
      
      // Insert English translation
      await client.query(`
        INSERT INTO event_translations (event_id, locale, title, description, meta_title, meta_description)
        VALUES ($1, 'en', $2, $3, $4, $5)
      `, [
        eventId,
        event.translations.en.title,
        event.translations.en.description,
        event.translations.en.meta_title,
        event.translations.en.meta_description
      ]);
      
      console.log(`✅ Event created: ${event.slug}`);
    }
    
    // Seed Contact Submissions
    console.log('📧 Seeding contact submissions...');
    for (const contact of sampleContacts) {
      await client.query(`
        INSERT INTO contact_submissions (name, email, phone, subject, message, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        contact.name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
        contact.status
      ]);
      console.log(`✅ Contact submission created: ${contact.name}`);
    }
    
    // Seed Media Files
    console.log('🖼️ Seeding media files...');
    for (const media of sampleMediaFiles) {
      await client.query(`
        INSERT INTO media_files (id, filename, original_name, file_type, file_size, url, bucket)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        media.id,
        media.filename,
        media.original_name,
        media.file_type,
        media.file_size,
        media.url,
        media.bucket
      ]);
      console.log(`✅ Media file created: ${media.filename}`);
    }
    
    await client.query('COMMIT');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Seeded data summary:`);
    console.log(`   • ${sampleEvents.length} events (with translations)`);
    console.log(`   • ${sampleContacts.length} contact submissions`);
    console.log(`   • ${sampleMediaFiles.length} media files`);
    console.log('\n🌐 You can now view the seeded content in your admin panel');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seeding if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedDatabase()
    .then(() => {
      console.log('Seeding script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding script failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await pool.end();
    });
}

export { seedDatabase };
