import { IFeed } from './../Interface/IFeed';

import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

const Feed = new mongoose.Schema(
  {
    body: {
      type: String,
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    noOfLikes: {
      type: Number,
      default: 0,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    noOfComments: {
      type: Number,
      default: 0,
    },

    sharedBy: [
      {
        name: String,
        profileImage: String,
        _id: Schema.Types.ObjectId,
      },
    ],

    noOfShares: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Block"],
      default: "Active",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Feed.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: "user",
    select: "email firstName",
  });
  next();
});

Feed.virtual("commentSchema", {
  ref: "commentSchema",
  foreignField: "feed",
  localField: "_id",
});

export default mongoose.model<IFeed & Document>('feedSchema',Feed)