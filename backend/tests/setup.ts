import dotenv from 'dotenv';

dotenv.config({
    path: '.env.test',
});

console.log('TEST ENV:', {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
});
