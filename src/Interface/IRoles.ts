import { ObjectId } from "mongoose";

export interface IRoles {
    name:string,
    description:string,
    permissions:[ObjectId]

}


export interface IRoleDTO {
    name:string,
    description:string

}