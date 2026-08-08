import type { IUser } from './user.types.ts';

declare global {
    // Express request augmentation uses namespace merging by design.
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export {};
