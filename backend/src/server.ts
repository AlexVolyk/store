import { app } from './app.ts';
import { db } from './config/db.ts';
import { env } from './config/env.ts';

const startServer = async (): Promise<void> => {
    try {
        await db;
        app.listen(env.port, () => {
            console.log(`Server is running on port ${env.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

void startServer();
