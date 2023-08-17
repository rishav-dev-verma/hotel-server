import "reflect-metadata"; // We need this in order to use @Decorators

import config from "./config";

import express from "express";
import Logger from "./loaders/logger";

import socketIOHandlers from '../socketIOHandlers/index';








async function startserver() {
    const app = express();

     await require("./loaders").default({ expressApp: app });
     
    const server = app.listen(config.port,() => {console.log(`
      ################################################
      🛡️  ${process.env.NODE_ENV} Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    }).on('error',(err) => {
       Logger.error(err);
       process.exit(1);
    });

    console.log(server);


    const io = require('socket.io')(server,{
      cors:{
        origin:"*",
        methods:["GET","POST"]
      }
    });

    socketIOHandlers(io);

    
}
startserver();
