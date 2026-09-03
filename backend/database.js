const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

let dbInstance = null;

async function getDB() {
  if (dbInstance) return dbInstance;

  let dbPath = path.join(__dirname, 'database.sqlite');

  if (process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'database.sqlite');
    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tmpDbPath);
      }
    } catch (e) {
      console.warn('Vercel tmp DB copy warning:', e.message);
    }
    dbPath = tmpDbPath;
  }

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await dbInstance.run('PRAGMA foreign_keys = ON');

  // Create tables
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leaders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position TEXT NOT NULL,
      name TEXT NOT NULL,
      photo_url TEXT,
      description TEXT,
      phone TEXT,
      display_order INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photo_url TEXT,
      role TEXT DEFAULT 'Active Member',
      description TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT,
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      caption TEXT,
      category TEXT DEFAULT 'Events',
      activity_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      committee_name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      about TEXT NOT NULL,
      vision TEXT NOT NULL,
      mission TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      map_url TEXT,
      facebook_url TEXT,
      instagram_url TEXT,
      hero_image TEXT,
      logo TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if empty
  await seedDatabase(dbInstance);

  return dbInstance;
}

async function seedDatabase(db) {
  // 1. Admin User
  const admin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [
      'admin',
      passwordHash,
      'admin'
    ]);
    console.log('Seeded default admin user (admin / admin123)');
  }

  // 2. Settings
  const settings = await db.get('SELECT * FROM settings WHERE id = 1');
  if (!settings) {
    await db.run(
      `INSERT INTO settings (
        id, committee_name, tagline, about, vision, mission, address, phone, email, map_url, facebook_url, instagram_url, hero_image, logo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        1,
        'MAA AMBIKA YOUTH CLUB BARAPADA',
        'Unity • Service • Youth • Community',
        'Maa Ambika Youth Club Barapada is a community-focused youth organization dedicated to unity, social service, cultural activities, sports, and the overall development of our village.',
        'To build a united, active and progressive village community through youth participation and collective effort.',
        'Promote unity among villagers\nEncourage youth participation\nOrganize cultural and sports activities\nSupport social and community initiatives\nContribute to village development\nPreserve local traditions and values',
        'At: Barapada, Po: Saudia, District: Jajpur, Odisha - 754279',
        '+91 98765 43210',
        'maaambikayouthclub@gmail.com',
        'https://maps.google.com/?q=Barapada,Saudia,Jajpur,Odisha',
        'https://facebook.com',
        'https://instagram.com',
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
        '/uploads/logo.jpg'
      ]
    );
    console.log('Seeded default settings');
  }

  // 3. Leaders (Exactly 4 fixed roles)
  const leaderCount = await db.get('SELECT COUNT(*) as count FROM leaders');
  if (leaderCount.count === 0) {
    const leadersData = [
      {
        position: 'PRESIDENT',
        name: 'Shri Abhinas Das (Guru)',
        photo_url: '/uploads/president.jpg',
        description: 'Leading Maa Ambika Youth Club Barapada with dedication, responsibility, and a vision for village progress.',
        phone: '+91 9078063788',
        display_order: 1
      },
      {
        position: 'VICE PRESIDENT',
        name: 'Shri Bikash Parida',
        photo_url: '/uploads/vice_president.jpg',
        description: 'Dedicated to empowering local youth, coordinating community welfare drives, and expanding youth participation.',
        phone: '+91 9692114457',
        display_order: 2
      },
      {
        position: 'MANAGER',
        name: 'Shri Bishal Nayak',
        photo_url: '/uploads/manager.jpg',
        description: 'Managing overall operations, logistics, event execution, and social media outreach for the committee.',
        phone: '+91 7751912778',
        display_order: 3
      },
      {
        position: 'MANAGER',
        name: 'Shri Soumya Ranjan Parida',
        photo_url: '/uploads/manager2.jpg',
        description: 'Managing overall operations, youth activities, event coordination, and logistics for the committee.',
        phone: '+91 6370053662',
        display_order: 4
      }
    ];

    for (const leader of leadersData) {
      await db.run(
        `INSERT INTO leaders (position, name, photo_url, description, phone, display_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [leader.position, leader.name, leader.photo_url, leader.description, leader.phone, leader.display_order]
      );
    }
    console.log('Seeded 4 committee leaders');
  }

  // 4. Members
  const memberCount = await db.get('SELECT COUNT(*) as count FROM members');
  if (memberCount.count === 0) {
    const membersData = [
      {
        name: 'Shri Jyoti',
        photo_url: '/uploads/member_1.jpg',
        role: 'Sports Coordinator',
        description: 'Organizes cricket tournaments, volleyball competitions, and annual athletics meet for Barapada youth.',
        display_order: 1
      },
      {
        name: 'Shri Biranchi',
        photo_url: '/uploads/member_2.jpg',
        role: 'Cultural Secretary',
        description: 'Directs drama programs, festival pujas, and traditional music events during village celebrations.',
        display_order: 2
      },
      {
        name: 'Shri Prakash',
        photo_url: '/uploads/member_3.jpg',
        role: 'Social Welfare Head',
        description: 'Leads blood donation drives, tree plantation initiatives, and emergency relief support in the region.',
        display_order: 3
      },
      {
        name: 'Shri Nirmalya',
        photo_url: '/uploads/member_4.jpg',
        role: 'Cleanliness Drive Lead',
        description: 'Spearheads Swachh Barapada sanitation campaigns and waste management drives across all hamlets.',
        display_order: 4
      },
      {
        name: 'Kumari Lipsa Rani Rout',
        photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        role: 'Women Empowerment Lead',
        description: 'Coordinates self-help group workshops, education drives, and health camps for women and young girls.',
        display_order: 5
      },
      {
        name: 'Shri Vicky',
        photo_url: '/uploads/member_5.jpg',
        role: 'Youth Volunteer',
        description: 'Active coordinator in student mentorship, career counseling sessions, and exam preparation guidance.',
        display_order: 6
      },
      {
        name: 'Shri Alok Kumar Samal',
        photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        role: 'Media & Photography',
        description: 'Captures committee activities, maintains photo records, and handles digital media publications.',
        display_order: 7
      },
      {
        name: 'Shri Sanjeev Mohapatra',
        photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
        role: 'Executive Member',
        description: 'Dedicated active volunteer contributing to all village development projects and temple restoration efforts.',
        display_order: 8
      }
    ];

    for (const member of membersData) {
      await db.run(
        `INSERT INTO members (name, photo_url, role, description, display_order)
         VALUES (?, ?, ?, ?, ?)`,
        [member.name, member.photo_url, member.role, member.description, member.display_order]
      );
    }
    console.log('Seeded 8 committee members');
  }

  // 5. Activities
  const activityCount = await db.get('SELECT COUNT(*) as count FROM activities');
  if (activityCount.count === 0) {
    const activitiesData = [
      {
        title: 'Annual Barapada Premier League (Cricket Tournament)',
        description: 'A 3-day inter-village cricket tournament uniting 12 local teams to foster sportsmanship, discipline, and healthy competition among village youth.',
        date: '2026-01-15',
        location: 'Barapada High School Ground',
        photo_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Swachh Barapada Cleanliness & Greenery Drive',
        description: 'Comprehensive sanitation and tree plantation initiative across all village roads, temple premises, and pond surroundings with participation from 100+ volunteers.',
        date: '2026-02-10',
        location: 'Maa Ambika Temple Grounds & Main Road',
        photo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Grand Raja Mahotsav Cultural Night',
        description: 'Celebration of Odisha’s traditional Raja festival featuring swings, traditional Odia pithas, folk dance performances, and youth talent showcase.',
        date: '2026-06-14',
        location: 'Barapada Community Hall Auditorium',
        photo_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Voluntary Mega Blood Donation Camp',
        description: 'Organized in association with District Red Cross Blood Bank, collecting 85 units of blood to save lives in nearby government hospitals.',
        date: '2026-07-20',
        location: 'Youth Club Building, Barapada',
        photo_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Youth Career Guidance & Digital Literacy Workshop',
        description: 'An interactive seminar for 10th and +2 students providing career pathways, competitive exam guidance, and basic computer awareness.',
        date: '2026-08-12',
        location: 'Barapada Gram Panchayat Hall',
        photo_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
      }
    ];

    for (const act of activitiesData) {
      await db.run(
        `INSERT INTO activities (title, description, date, location, photo_url)
         VALUES (?, ?, ?, ?, ?)`,
        [act.title, act.description, act.date, act.location, act.photo_url]
      );
    }
    console.log('Seeded 5 village activities');
  }

  // 6. Gallery
  const galleryCount = await db.get('SELECT COUNT(*) as count FROM gallery');
  if (galleryCount.count === 0) {
    const galleryData = [
      {
        image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
        caption: 'Trophy Distribution Ceremony at Barapada Cricket Tournament',
        category: 'Sports'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        caption: 'Youth Volunteers Planting Neem & Banyan Saplings',
        category: 'Village Activities'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        caption: 'Traditional Folk Dance Performance during Raja Mahotsav',
        category: 'Cultural Programs'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
        caption: 'Doctor Certifying Blood Donors at Barapada Camp',
        category: 'Events'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        caption: 'Maa Ambika Youth Committee Executive Body Meeting',
        category: 'Committee'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        caption: 'President & Committee Leaders inaugurating new village solar lamps',
        category: 'Leaders'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        caption: 'Interactive Session with High School Students',
        category: 'Members'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
        caption: 'Distribution of Warm Blankets to Village Elders in Winter',
        category: 'Events'
      }
    ];

    for (const item of galleryData) {
      await db.run(
        `INSERT INTO gallery (image_url, caption, category)
         VALUES (?, ?, ?)`,
        [item.image_url, item.caption, item.category]
      );
    }
    console.log('Seeded 8 gallery photos');
  }
}

module.exports = { getDB };
