import { JWT_SECRET_KEY, JWT_EXP } from "../../config";

import jwt from 'jsonwebtoken';

export const createjwt = (body: any): string => {
    return jwt.sign(body, JWT_SECRET_KEY, { expiresIn: JWT_EXP });
}

export const verifyjwt = (token: string): any => {
    return jwt.verify(token, JWT_SECRET_KEY, (error: any, decoded: any) => {
        return decoded
    });
} 

export const decodeJwt = (token: string): any => {
    return jwt.decode(token, { complete: true, json: true });
} 