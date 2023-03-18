import { IComment } from './../Interface/IComment';
import mongoose, { Document } from "mongoose";

const Schema= mongoose.Schema;

const Comment = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    feed: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



export default mongoose.model<IComment & Document>('commentSchema',Comment)