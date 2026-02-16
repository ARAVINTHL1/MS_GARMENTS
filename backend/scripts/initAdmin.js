import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// This script initializes the admin user with fixed credentials
const initializeAdmin = async () => {
  try {
    const adminEmail = 'mohanms@gmail.com';
    const adminPassword = 'mohan@123';

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: adminEmail });

    if (!adminExists) {
      // Create the admin user
      await Admin.create({
        name: 'Mohan M.S.',
        email: adminEmail,
        password: adminPassword, // Will be hashed by the pre-save hook
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error.message);
  }
};

export default initializeAdmin;
