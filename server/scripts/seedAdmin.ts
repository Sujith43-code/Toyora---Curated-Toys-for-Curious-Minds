import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { Admin } from '../models/Admin';

dotenv.config();

async function seedAdmin() {
  try {
    await connectDB();

    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      console.log(`[Seed Admin] Admin accounts already exist (${existingCount} found). Skipping seeding.`);
      process.exit(0);
    }

    const email = process.env.ADMIN_EMAIL || 'admin@toyora.in';
    const password = process.env.ADMIN_PASSWORD || 'ToyoraAdmin2026!';
    const name = 'Toyora Store Manager';

    console.log(`[Seed Admin] Seeding initial admin user: ${email}`);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'admin',
      active: true,
    });

    console.log(`[Seed Admin] Success! Initial admin account created with ID: ${admin._id}`);
    console.log(`[Seed Admin] Login email: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Admin] Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
