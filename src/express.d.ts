import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Or specify a more detailed type for the user
        }
    }
}