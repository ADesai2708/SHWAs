// One-time script to drop corrupted MongoDB indexes
// Run: node fix_indexes.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SHAWS';

async function fixIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Show current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Drop all non-_id indexes
    await collection.dropIndexes();
    console.log('All non-_id indexes dropped successfully!');

    // Also delete any users with null email/phone that are causing issues
    const result = await collection.deleteMany({ 
      role: { $nin: ['admin'] },
      $or: [
        { email: null, phone: null },
        { email: null, phone: { $exists: false } },
        { phone: null, email: { $exists: false } }
      ]
    });
    console.log(`Cleaned up ${result.deletedCount} corrupted user documents`);

    console.log('\nDone! Restart your server now — Mongoose will recreate proper sparse indexes.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixIndexes();
