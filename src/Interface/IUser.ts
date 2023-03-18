import { ObjectId } from 'mongoose';
export interface IUser {
  _id:ObjectId
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
  passwordConfirm: string;
}


export interface IUserInputDTO {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
  passwordConfirm: string;
}