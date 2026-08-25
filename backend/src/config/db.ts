import mongoose from 'mongoose';

import { env } from './env.ts';

export const db = await mongoose.connect(env.mongoUri)