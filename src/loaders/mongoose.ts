import mongoose, { ConnectOptions } from "mongoose";
import { Db } from "mongodb";
import config from "../config";

export default async (): Promise<Db> => {
  const DbUri = config.mongodbUri;
  const connection = await mongoose.connect(DbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  return connection.connection.db;
};