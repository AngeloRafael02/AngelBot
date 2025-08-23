import { Schema } from 'mongoose';

export interface IUser {
  discordId: string;
  username: string;
  habits: Schema.Types.ObjectId[]; // This will store an array of ObjectIDs from the Habit model
}

export interface IHabit {
  name: string;
  description?: string;
  ownerId: Schema.Types.ObjectId; // This will reference the User model's ID
  streak: number;
  lastCompleted: Date;
  history: Date[]; // An array to store the dates the habit was completed
}