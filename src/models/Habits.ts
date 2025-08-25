// src/models/Habit.ts
import { Schema, model } from 'mongoose';
import { IHabit } from '../interfaces/Habits.js';

const HabitSchema = new Schema<IHabit>({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description:{
    type:String,
    required: false
  },

  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },

  streak: {
    type: Number,
    default: 0,
  },

  lastAdded: {
    type: Date,
    required: true,
    default: Date.now()
  },

  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now()
  },

  lastCompleted: {
    type: Date,
    required: false,
  },
  
  history: {
    type:[Date],
    required: false
  },
});

export const Habit = model<IHabit>('Habit', HabitSchema);