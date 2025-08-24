// src/models/User.ts
import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/Habits.js';

const UserSchema = new Schema<IUser>({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  habits: [{
    type: Schema.Types.ObjectId,
    ref: 'Habit',
  }],
},{
    timestamps:true
});

export const User = model<IUser>('User', UserSchema);