import dotenv from "dotenv";

process.env.environment = process.env.environment || 'development';

const config = dotenv.config();

if(!config){
    throw new Error('Config file not found');
    
}
export default {
  port: process.env.PORT,
  host: process.env.HOST || "localhost",
  mongodbUri: process.env.MONGODB_URI,
  api: {
    prefix: "/api",
  },
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
};
