import mongoose from 'mongoose';

import { env } from './env.js';

export const db = await mongoose.connect(env.mongoUri)

// export const connectDB = async (): Promise<void> => {

//   if (!env.mongoUri) {
//     throw new Error('MONGO_URI is required');
//   }

//   await mongoose.connect(env.mongoUri);
//   console.log('MongoDB connected');
// };
