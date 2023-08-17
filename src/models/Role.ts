import mongoose from "mongoose";
import { IRoles } from "../Interface/IRoles";

const Schema = mongoose.Schema;


const Roles= new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        permissions:[{type:Schema.Types.ObjectId,ref:'Permission'}]

    },
    {
        timestamp:true
    }
);


export default mongoose.model<IRoles & mongoose.Document>('Roles',Roles);