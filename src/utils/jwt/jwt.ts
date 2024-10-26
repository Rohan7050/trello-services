import { JWT_SECRET_KEY, JWT_EXP, JWT_REFRESH_EXP } from "../../config";

const jwt = require('jsonwebtoken');

export const createjwt = (body: any, expJwtTime: any = "access") => {
    const exp_time = expJwtTime === "refesh" ? JWT_REFRESH_EXP : JWT_EXP ;
    return jwt.sign(body, JWT_SECRET_KEY, { expiresIn: exp_time });
}

export const verifyjwt = (token: string) => {
    return jwt.verify(token, JWT_SECRET_KEY, (error: any, decoded: any) => {
        return decoded
    });
} 

export const decodeJwt = (token: string) => {
    return jwt.decode(token, JWT_SECRET_KEY);
} 