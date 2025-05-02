// seedOwner.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

async function seed() {
  // 1) Connect
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🗄️  MongoDB connected for seeding');

  // 2) Define your initial Owner credentials
  const email    = 'owner@youremail.com';
  const password = 'SuperSecret123';

  // 3) Check if it already exists
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('🟡 Owner user already exists, skipping seed.');
    return process.exit(0);
  }

  // 4) Hash & create
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed, role: 'owner' });
  console.log(`✅ Seeded Owner: ${email} / ${password}`);

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
