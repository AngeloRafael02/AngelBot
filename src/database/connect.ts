// src/database/connect.ts
import mongoose from 'mongoose';

export async function connectToDatabase(mongoUri: string): Promise<void> {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1);
  }
}

