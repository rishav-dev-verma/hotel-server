import { Mongoose } from 'mongoose';

export default interface IRefreshToken {
    refreshToken:string,
    user:string,
    expiresAt:Date,
    revoked:Date
}