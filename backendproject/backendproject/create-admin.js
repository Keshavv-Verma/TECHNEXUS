/**
 * Script to create an admin user
 * Run: node create-admin.js
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');

    // Admin credentials
    const adminEmail = 'admin@technexus.com';
    const adminName = 'Admin User';
    const adminPassword = 'Admin@Technexus123'; // Change this to a stronger password!

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists:', adminEmail);
      return;
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    console.log('📝 Creating admin in database...');
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📋 Admin Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('');
    console.log('⚠️  IMPORTANT:');
    console.log('   Change the password in production!');
    console.log('   Update .env.production with a secure password.');
    console.log('');
    console.log('🧪 Test Login:');
    console.log(`   curl -X POST http://localhost:5000/api/login \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"email":"${adminEmail}","password":"${adminPassword}"}'`);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
