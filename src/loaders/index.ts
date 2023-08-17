

import expressLoader from './express';
import express from 'express';
import mongooseLoader from './mongoose'
import Logger from "./logger";
import dependencyInjector from './dependencyInjector';


export default async ({ expressApp }:any ): Promise<void> => {

    await mongooseLoader();

    Logger.info("DB connected succesfully");

   

    const userModel = {
      name: "userModel",
      model: require("../models/User").default
    };

    const refreshTokenModel = {
      name: "resfreshTokenModel",
      model: require("../models/refreshToken").default,
    };

    const feedModel = {
      name: "feedModel",
      model: require("../models/Feed").default,
    };

    const commentModel = {
      name: "commentModel",
      model: require("../models/Comment").default,
    };

    const roleModel={
      name:"roleModel",
      model: require("../models/Role").default
    };

    const permissionModel={
      name:"permissionModel",
      model: require("../models/Permission").default
    }

    

    dependencyInjector(
      { models: 
        [
          userModel, 
          refreshTokenModel,
          feedModel,
          commentModel,
          roleModel,
          permissionModel
        ] 
      });

     Logger.info("Dependency injector loaded succesfully");

      await expressLoader({ app: expressApp });

      Logger.info("Express laoded succesfully");

}