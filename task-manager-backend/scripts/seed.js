require('dotenv').config();
const mongoose = require('mongoose');
const { 
  connectDB, 
  seedDatabase, 
  clearDatabase, 
  getDatabaseStats 
} = require('../src/config/database');

// Command line arguments
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    console.log('Task Manager Database Seeder');
    console.log('=============================\n');

    // Connect to database
    await connectDB();

    switch (command) {
      case 'seed':
        await seedDatabase();
        break;
      case 'clear':
        await clearDatabase();
        break;
      case 'stats':
        await getDatabaseStats();
        break;
      case 'reset':
        await clearDatabase();
        await seedDatabase();
        break;
      default:
        console.log('Usage: node seed.js [command]');
        console.log('Commands:');
        console.log('  seed   - Seed database with dummy data');
        console.log('  clear  - Clear all data from database');
        console.log('  stats  - Show database statistics');
        console.log('  reset  - Clear and reseed database');
        break;
    }

    // Disconnect from database
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
