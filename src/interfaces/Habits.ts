import { Schema, Document, } from 'mongoose';

export interface IUser extends Document<any, any, IUser> {
  discordId: string;
  username: string;
  dateJoined: Date;
  habits: Schema.Types.ObjectId[]; // This will store an array of ObjectIDs from the Habit model
}

export interface IHabit extends Document<any, any, IHabit> {
  name: string;
  description?: string;
  ownerId: Schema.Types.ObjectId; // This will reference the User model's ID
  streak: number;
  lastAdded: Date;
  lastUpdate: Date;
  lastCompleted: Date;
  history: Date[]; // An array to store the dates the habit was completed
}