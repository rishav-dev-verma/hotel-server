import { ObjectId } from "mongoose";

export interface IFeed {

    body:string;
    user:string;
    likes:[ObjectId];
    noOfLikes:number;
    noOfComments:number;
    comments:[ObjectId];
    noOfShares:number;
    shares:[{
        name:string,
        profileImage:string,
        id:ObjectId
    }];
    status:string;

}


export interface IFeedDTO {
    body:string

}

