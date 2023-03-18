import { ObjectId } from "mongoose";

export interface IComment {
    body:string,
    feed:string;
    user: ObjectId;

}

export interface ICommentDTO {
    body:string,
    feed:string;
}