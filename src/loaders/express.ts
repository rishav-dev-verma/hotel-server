import express from "express";
import { i18n } from "i18next";
import Backend from "i18next-fs-backend";
import { isCelebrateError } from "celebrate";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import  config  from "../config";
import routes from "../api"

export default async ({
  app,
}: {
  app: express.Application;
}): Promise<any> => {
  //to allow the use from trusted proxies

   app.enable('trust proxy');

  app.use(cors({origin:(origin,callback) => callback(null,true),credentials:true}));
  //parse request body data to json

  app.use(express.json({ limit: "50mb" }));
  //parse request body data from html post form

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(cookieParser());

  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  });
   app.use(config.api.prefix, limiter);



  app.use(config.api.prefix, routes());

  app.use((req, res, next) => {
    const err: any = new Error("Not found");
    err.status = 404;
    next(err);
  });

  

// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });
 

  //  app.use((err: any, req: any, res: any, next: any) => {
  //    if (err.name == "Token not found") {
  //      res.status(403).send({ message: err.message }).end();
  //    }
  //  });

   app.use((err, req, res, next) => {

    if (isCelebrateError(err)) {
      let message = "";
      for (const value of err.details.values()) {
        message += value.message + "; ";
      }
      return res.status(400).json({ message });
    }


    if(err.message === 'This route can only be accessed by admin role') {
      res.status(401).json({message:err.message});
    }


     res.status(err.status || 500);
     const json: any = {
       message: err.message,
     };
     if (err.data) {
       json.data = err.data;
     }
     res.json(json);
   });
};
