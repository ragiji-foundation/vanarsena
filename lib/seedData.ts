import { pool } from './db';

export const seedEvents = [
  {
    title_hi: 'स्वतंत्रता दिवस समारोह 2025',
    title_en: 'Independence Day Celebration 2025',
    description_hi: '<p>हमारे राष्ट्रीय त्योहार स्वतंत्रता दिवस के अवसर पर हम एक भव्य समारोह का आयोजन कर रहे हैं। इस कार्यक्रम में तिरंगा फहराना, राष्ट्रगान, सांस्कृतिक कार्यक्रम और देशभक्ति के गीत शामिल होंगे।</p><p>समुदाय के सभी सदस्यों को इस गौरवशाली दिन को मनाने के लिए आमंत्रित किया जाता है। हमारे स्वतंत्रता सेनानियों को श्रद्धांजलि दी जाएगी और युवाओं को देश सेवा के लिए प्रेरित किया जाएगा।</p>',
    description_en: '<p>We are organizing a grand celebration on the occasion of our national festival Independence Day. This program will include flag hoisting, national anthem, cultural programs and patriotic songs.</p><p>All community members are invited to celebrate this glorious day. Our freedom fighters will be paid tribute and youth will be inspired for national service.</p>',
    meta_title_hi: 'स्वतंत्रता दिवस समारोह 2025 - वानरसेना',
    meta_title_en: 'Independence Day Celebration 2025 - VanarSena',
    meta_description_hi: 'वानरसेना द्वारा आयोजित स्वतंत्रता दिवस समारोह में शामिल हों। तिरंगा फहराना, सांस्कृतिक कार्यक्रम और देशभक्ति के गीत।',
    meta_description_en: 'Join the Independence Day celebration organized by VanarSena. Flag hoisting, cultural programs and patriotic songs.',
    event_date: '2025-08-15',
    event_time: '08:00',
    location: 'राम लीला मैदान, नई दिल्ली',
    tags: ['स्वतंत्रता दिवस', 'राष्ट्रीय पर्व', 'सांस्कृतिक', 'देशभक्ति'],
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1628624747186-a88c0f48a658?w=800&h=400&fit=crop',
    slug: 'independence-day-celebration-2025'
  },
  {
    title_hi: 'वृक्षारोपण अभियान - हरित पृथ्वी',
    title_en: 'Tree Plantation Drive - Green Earth',
    description_hi: '<p>पर्यावरण संरक्षण के लिए हमारा वृक्षारोपण अभियान "हरित पृथ्वी" शुरू हो रहा है। इस अभियान में हम 1000 पेड़ लगाने का लक्ष्य रखा है।</p><p>यह कार्यक्रम बच्चों और युवाओं के लिए विशेष रूप से डिज़ाइन किया गया है ताकि वे पर्यावरण के महत्व को समझ सकें। प्रत्येक सहभागी को एक पौधा और उसकी देखभाल की जानकारी दी जाएगी।</p>',
    description_en: '<p>Our tree plantation drive "Green Earth" is starting for environmental conservation. We have set a target of planting 1000 trees in this campaign.</p><p>This program is specially designed for children and youth so that they can understand the importance of environment. Each participant will be given a plant and information about its care.</p>',
    meta_title_hi: 'वृक्षारोपण अभियान - हरित पृथ्वी | वानरसेना',
    meta_title_en: 'Tree Plantation Drive - Green Earth | VanarSena',
    meta_description_hi: 'पर्यावरण संरक्षण के लिए वानरसेना का वृक्षारोपण अभियान। 1000 पेड़ लगाने का लक्ष्य। हमारे साथ जुड़ें।',
    meta_description_en: 'VanarSena tree plantation drive for environmental conservation. Target of planting 1000 trees. Join us.',
    event_date: '2025-08-05',
    event_time: '06:00',
    location: 'यमुना बायो-डायवर्सिटी पार्क, दिल्ली',
    tags: ['पर्यावरण', 'वृक्षारोपण', 'हरियाली', 'युवा'],
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
    slug: 'tree-plantation-drive-green-earth'
  },
  {
    title_hi: 'गरीब बच्चों के लिए शिक्षा सहायता कार्यक्रम',
    title_en: 'Education Support Program for Underprivileged Children',
    description_hi: '<p>गरीब और वंचित बच्चों के लिए हमारा शिक्षा सहायता कार्यक्रम शुरू हो रहा है। इस कार्यक्रम में मुफ्त किताबें, कॉपियां, पेन और अन्य शैक्षिक सामग्री वितरित की जाएगी।</p><p>हमारा उद्देश्य यह सुनिश्चित करना है कि कोई भी बच्चा आर्थिक कमी के कारण शिक्षा से वंचित न रहे। इस कार्यक्रम में स्थानीय स्कूलों के शिक्षक भी सहयोग करेंगे।</p>',
    description_en: '<p>Our education support program for poor and underprivileged children is starting. Free books, notebooks, pens and other educational materials will be distributed in this program.</p><p>Our aim is to ensure that no child is deprived of education due to financial constraints. Local school teachers will also cooperate in this program.</p>',
    meta_title_hi: 'शिक्षा सहायता कार्यक्रम - गरीब बच्चों के लिए | वानरसेना',
    meta_title_en: 'Education Support Program - For Underprivileged Children | VanarSena',
    meta_description_hi: 'गरीब बच्चों के लिए मुफ्त शैक्षिक सामग्री वितरण। वानरसेना का शिक्षा सहायता कार्यक्रम।',
    meta_description_en: 'Free educational material distribution for poor children. VanarSena education support program.',
    event_date: '2025-07-20',
    event_time: '10:00',
    location: 'सरकारी प्राथमिक विद्यालय, करोल बाग',
    tags: ['शिक्षा', 'बच्चे', 'सहायता', 'गरीबी उन्मूलन'],
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop',
    slug: 'education-support-program-underprivileged-children'
  },
  {
    title_hi: 'स्वच्छता अभियान - साफ़ दिल्ली हरी दिल्ली',
    title_en: 'Cleanliness Drive - Clean Delhi Green Delhi',
    description_hi: '<p>स्वच्छ भारत मिशन के तहत हमारा स्वच्छता अभियान "साफ़ दिल्ली हरी दिल्ली" शुरू हो रहा है। इस अभियान में हम सड़कों, पार्कों और सार्वजनिक स्थानों की सफाई करेंगे।</p><p>स्वयंसेवक समुदाय को स्वच्छता के महत्व के बारे में जागरूक करेंगे और साफ-सफाई के तरीकों के बारे में शिक्षित करेंगे। प्लास्टिक मुक्त पर्यावरण बनाने पर विशेष जोर दिया जाएगा।</p>',
    description_en: '<p>Our cleanliness drive "Clean Delhi Green Delhi" is starting under the Swachh Bharat Mission. In this campaign we will clean roads, parks and public places.</p><p>Volunteers will make the community aware about the importance of cleanliness and educate about cleaning methods. Special emphasis will be given on creating plastic free environment.</p>',
    meta_title_hi: 'स्वच्छता अभियान - साफ़ दिल्ली हरी दिल्ली | वानरसेना',
    meta_title_en: 'Cleanliness Drive - Clean Delhi Green Delhi | VanarSena',
    meta_description_hi: 'स्वच्छ भारत मिशन के तहत वानरसेना का स्वच्छता अभियान। सड़कों और पार्कों की सफाई।',
    meta_description_en: 'VanarSena cleanliness drive under Swachh Bharat Mission. Cleaning of roads and parks.',
    event_date: '2025-10-02',
    event_time: '07:00',
    location: 'इंडिया गेट परिसर, नई दिल्ली',
    tags: ['स्वच्छता', 'पर्यावरण', 'सफाई', 'गांधी जयंती'],
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop',
    slug: 'cleanliness-drive-clean-delhi-green-delhi'
  },
  {
    title_hi: 'निःशुल्क स्वास्थ्य जांच शिविर',
    title_en: 'Free Health Check-up Camp',
    description_hi: '<p>गरीब और जरूरतमंद लोगों के लिए निःशुल्क स्वास्थ्य जांच शिविर का आयोजन किया जा रहा है। इस शिविर में डॉक्टर, नर्स और स्वास्थ्य कर्मी उपलब्ध रहेंगे।</p><p>रक्तचाप, शुगर, वजन और सामान्य स्वास्थ्य जांच निःशुल्क की जाएगी। आवश्यकता पड़ने पर मुफ्त दवाइयां भी वितरित की जाएंगी। स्वास्थ्य के बारे में जागरूकता भी फैलाई जाएगी।</p>',
    description_en: '<p>Free health check-up camp is being organized for poor and needy people. Doctors, nurses and health workers will be available in this camp.</p><p>Blood pressure, sugar, weight and general health check-up will be done free of cost. Free medicines will also be distributed if needed. Health awareness will also be spread.</p>',
    meta_title_hi: 'निःशुल्क स्वास्थ्य जांच शिविर | वानरसेना',
    meta_title_en: 'Free Health Check-up Camp | VanarSena',
    meta_description_hi: 'गरीब और जरूरतमंद लोगों के लिए निःशुल्क स्वास्थ्य जांच। डॉक्टर और मुफ्त दवाइयां उपलब्ध।',
    meta_description_en: 'Free health check-up for poor and needy people. Doctors and free medicines available.',
    event_date: '2025-09-15',
    event_time: '09:00',
    location: 'कम्यूनिटी सेंटर, लाजपत नगर',
    tags: ['स्वास्थ्य', 'निःशुल्क', 'जांच', 'चिकित्सा'],
    published: true,
    featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    slug: 'free-health-checkup-camp'
  }
];

export const seedMediaFiles = [
  {
    filename: 'independence-day-2024.jpg',
    original_name: 'independence-day-celebration-2024.jpg',
    file_type: 'image/jpeg',
    file_size: 245760,
    url: 'https://images.unsplash.com/photo-1628624747186-a88c0f48a658?w=800&h=600&fit=crop',
    bucket: 'vanarsena-images'
  },
  {
    filename: 'tree-plantation-drive.jpg',
    original_name: 'tree-plantation-environmental-drive.jpg',
    file_type: 'image/jpeg',
    file_size: 189420,
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
    bucket: 'vanarsena-images'
  },
  {
    filename: 'education-support.jpg',
    original_name: 'education-support-children.jpg',
    file_type: 'image/jpeg',
    file_size: 156800,
    url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
    bucket: 'vanarsena-images'
  },
  {
    filename: 'cleanliness-drive.jpg',
    original_name: 'cleanliness-drive-delhi.jpg',
    file_type: 'image/jpeg',
    file_size: 234560,
    url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    bucket: 'vanarsena-images'
  },
  {
    filename: 'health-camp.jpg',
    original_name: 'free-health-checkup-camp.jpg',
    file_type: 'image/jpeg',
    file_size: 198640,
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    bucket: 'vanarsena-images'
  }
];

export const seedContactSubmissions = [
  {
    name: 'राहुल शर्मा',
    email: 'rahul.sharma@example.com',
    phone: '+91-9876543210',
    subject: 'स्वयंसेवक के रूप में जुड़ना चाहता हूं',
    message: 'नमस्ते, मैं आपके संगठन के साथ स्वयंसेवक के रूप में काम करना चाहता हूं। मैं शिक्षा और पर्यावरण संरक्षण के क्षेत्र में काम करने में रुचि रखता हूं। कृपया मुझे बताएं कि मैं कैसे योगदान दे सकता हूं।',
    status: 'unread'
  },
  {
    name: 'प्रिया गुप्ता',
    email: 'priya.gupta@example.com',
    phone: '+91-9123456789',
    subject: 'शिक्षा कार्यक्रम में सहयोग',
    message: 'मैं एक शिक्षिका हूं और आपके शिक्षा सहायता कार्यक्रम में योगदान देना चाहती हूं। मेरे पास 10 साल का अनुभव है और मैं गरीब बच्चों को मुफ्त शिक्षा देना चाहती हूं।',
    status: 'read'
  },
  {
    name: 'अमित कुमार',
    email: 'amit.kumar@example.com',
    phone: '+91-9988776655',
    subject: 'वृक्षारोपण अभियान में भाग लेना',
    message: 'आपका वृक्षारोपण अभियान बहुत अच्छा है। मैं अपने दोस्तों के साथ इसमें भाग लेना चाहता हूं। हमारे पास 20 लोगों का एक समूह है जो पर्यावरण संरक्षण में रुचि रखता है।',
    status: 'replied'
  },
  {
    name: 'सुनीता देवी',
    email: 'sunita.devi@example.com',
    phone: '+91-9876543211',
    subject: 'स्वास्थ्य शिविर के बारे में जानकारी',
    message: 'मैं जानना चाहती हूं कि आपका अगला स्वास्थ्य शिविर कब और कहां लगेगा। मेरे क्षेत्र में कई लोगों को मुफ्त स्वास्थ्य जांच की जरूरत है।',
    status: 'unread'
  },
  {
    name: 'विकास अग्रवाल',
    email: 'vikas.agarwal@example.com',
    phone: '+91-9123456788',
    subject: 'दान देना चाहता हूं',
    message: 'मैं आपके संगठन को कुछ दान देना चाहता हूं। कृपया मुझे बताएं कि मैं किस तरीके से दान दे सकता हूं और पैसा कैसे पहुंचा सकता हूं।',
    status: 'read'
  }
];

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Check if events already exist
    const existingEvents = await pool.query('SELECT COUNT(*) as count FROM events');
    if (existingEvents.rows[0].count > 0) {
      console.log('Events already exist. Skipping event seeding.');
    } else {
      // Seed Events
      console.log('Seeding events...');
      for (const event of seedEvents) {
        // Insert into events table
        const eventResult = await pool.query(`
          INSERT INTO events (
            slug, event_date, event_time, location, tags, published, featured_image, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          RETURNING id
        `, [
          event.slug,
          event.event_date,
          event.event_time,
          event.location,
          event.tags,
          event.published,
          event.featured_image
        ]);

        const eventId = eventResult.rows[0].id;

        // Insert Hindi translation
        await pool.query(`
          INSERT INTO event_translations (
            event_id, language, title, description, meta_title, meta_description
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          eventId,
          'hi',
          event.title_hi,
          event.description_hi,
          event.meta_title_hi,
          event.meta_description_hi
        ]);

        // Insert English translation
        await pool.query(`
          INSERT INTO event_translations (
            event_id, language, title, description, meta_title, meta_description
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          eventId,
          'en',
          event.title_en,
          event.description_en,
          event.meta_title_en,
          event.meta_description_en
        ]);

        console.log(`Seeded event: ${event.title_en}`);
      }
    }

    // Check if media files already exist
    const existingMedia = await pool.query('SELECT COUNT(*) as count FROM media_files');
    if (existingMedia.rows[0].count > 0) {
      console.log('Media files already exist. Skipping media seeding.');
    } else {
      // Seed Media Files
      console.log('Seeding media files...');
      for (const media of seedMediaFiles) {
        await pool.query(`
          INSERT INTO media_files (
            filename, original_name, file_type, file_size, url, bucket, uploaded_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `, [
          media.filename,
          media.original_name,
          media.file_type,
          media.file_size,
          media.url,
          media.bucket
        ]);

        console.log(`Seeded media file: ${media.original_name}`);
      }
    }

    // Check if contact submissions exist
    const contactResult = await pool.query('SELECT COUNT(*) as count FROM contact_submissions');
    const contactCount = parseInt(contactResult.rows[0].count);

    if (contactCount > 0) {
      console.log(`Contact submissions already exist (${contactCount} found). Skipping contact seeding.`);
    } else {
      // Seed Contact Submissions
      console.log('Seeding contact submissions...');
      for (const contact of seedContactSubmissions) {
        await pool.query(`
          INSERT INTO contact_submissions (
            name, email, phone, subject, message, status, submitted_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `, [
          contact.name,
          contact.email,
          contact.phone,
          contact.subject,
          contact.message,
          contact.status
        ]);

        console.log(`Seeded contact submission from: ${contact.name}`);
      }
    }

    console.log('Database seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
