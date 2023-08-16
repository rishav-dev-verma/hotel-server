import mongoose, { Schema, SchemaType } from "mongoose";
import { IRoles } from "../Interface/IRoles";


const Roles= new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        permissions:[{type:Schema.Types.ObjectId,ref:'Permisisons'}]

    },
    {
        timestamp:true
    }
);


export default mongoose.model<IRoles & mongoose.Document>('Roles',Roles);