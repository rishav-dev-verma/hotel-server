import mongoose from "mongoose";
import { IPermissions } from "../Interface/IPermissions";


const Permissions=new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        }
    
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPermissions & mongoose.Document>('Permission',Permissions);