import mongoose from 'mongoose';

import { env } from './env.js';

export const db = await mongoose.connect(env.mongoUri)