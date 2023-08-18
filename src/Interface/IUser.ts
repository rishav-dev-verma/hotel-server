import { ObjectId } from 'mongoose';
export interface IUser {
  _id:ObjectId
  email: string;
  fullName: string;
  mobile:number;
  password: string;
  passwordConfirm: string;
}


export interface IUserInputDTO {
  email: string;
  fullName: string;
  mobile:number;
  password: string;
  passwordConfirm: string;
}