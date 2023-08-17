import { ObjectId } from "mongoose";


export interface IPermissions {
    name:string,
    description:string

}

export interface IPermissionsDTO {
    name:string,
    description:string;
}