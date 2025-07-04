const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function debugDoctorRegistration() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('medimate');
    const usersCollection = db.collection('users');

    // Find all doctors
    const doctors = await usersCollection.find({ role: 'doctor' }).toArray();
    console.log('\n=== DOCTORS IN DATABASE ===');
    console.log(`Found ${doctors.length} doctors`);
    
    doctors.forEach((doctor, index) => {
      console.log(`\nDoctor ${index + 1}:`);
      console.log(`  Name: ${doctor.name}`);
      console.log(`  Email: ${doctor.email}`);
      console.log(`  Specialization: ${doctor.specialization || 'NOT SET'}`);
      console.log(`  Experience: ${doctor.experience || 'NOT SET'}`);
      console.log(`  License Number: ${doctor.licenseNumber || 'NOT SET'}`);
      console.log(`  Age: ${doctor.age || 'NOT SET'}`);
      console.log(`  Gender: ${doctor.gender || 'NOT SET'}`);
      console.log(`  Phone: ${doctor.phone || 'NOT SET'}`);
      console.log(`  Address: ${doctor.address || 'NOT SET'}`);
      console.log(`  Rating: ${doctor.rating || 'NOT SET'}`);
      console.log(`  Created At: ${doctor.createdAt}`);
    });

    // Find all patients
    const patients = await usersCollection.find({ role: 'patient' }).toArray();
    console.log('\n=== PATIENTS IN DATABASE ===');
    console.log(`Found ${patients.length} patients`);
    
    patients.forEach((patient, index) => {
      console.log(`\nPatient ${index + 1}:`);
      console.log(`  Name: ${patient.name}`);
      console.log(`  Email: ${patient.email}`);
      console.log(`  Age: ${patient.age || 'NOT SET'}`);
      console.log(`  Gender: ${patient.gender || 'NOT SET'}`);
      console.log(`  Phone: ${patient.phone || 'NOT SET'}`);
      console.log(`  Address: ${patient.address || 'NOT SET'}`);
      console.log(`  Blood Group: ${patient.bloodGroup || 'NOT SET'}`);
      console.log(`  Created At: ${patient.createdAt}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugDoctorRegistration();
