import mongoose from "mongoose";
import { IUser } from "../Interface/IUser";
import bcrypt from 'bcrypt'
import { randomBytes } from "crypto";
import argon2 from "argon2";
import Role from "./Role";

const Schema = mongoose.Schema;

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      index: { unique: true, dropDups: true },
    },
    fullName: {
      type: String,
      required: [true, "Please tell us your full name!"],
    },

    mobile:{
      type:Number,
    },
    roles:[{type:Schema.Types.ObjectId,ref:'Roles'}],
    password: {
      type: String,
      required:true,
      select:false
    },
    passwordConfirm: {
      type: String,
      required:true,
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strictPopulate: false
  }
);


User.set('toJSON',{
  virtuals:true,
  versionKey:true,
  transform:(doc,ret) => {
      delete ret.password,
      delete ret.salt
  }
})

User.pre('save',async function(next){
    if (!this.isModified("password")) return next();

   const salt = randomBytes(32);

   this.password = await argon2.hash(this.password, { salt });
   this.passwordConfirm=undefined;
   next();

})

User.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

User.statics.assignDefaultRole=async function(userId){
  try {
    const defaultRole='admin';
    
    const roleDetails=await Role.findOne({name:defaultRole});


    await this.findByIdAndUpdate(userId,{$addToSet:{roles:roleDetails._id}});
  }catch(e){
    throw e;
  }
}

export default  mongoose.model<IUser & mongoose.Document>("User", User);
