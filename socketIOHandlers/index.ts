import { AppData } from './appData';
import { Socket } from "dgram";
import chatMessage from './chatMessage';
import { Server } from 'socket.io';



export default (io:Server) => {
    const chatNamespace = io.of('/chat');

    const app:AppData = {
        allSockets: []
    }

    chatNamespace.on('connect', async(socket:any) => {

         console.log("chat socket connected succesfully");
        

         socket.on('new_message',(data) => {
             socket.emit('new_message', data);
            
         });

       

        const eventHandlers =[chatMessage(app,socket)];


        eventHandlers.forEach((handler:any) => {
            for(const eventName in handler) {
                socket.on(eventName, handler[eventName]);
                 console.log(`listening to ${eventName} successfully`);
            }
        })

        socket.on('disconnect',() =>{
            console.log("chat disconnected succesfully");
        });

        app.allSockets.push(socket);
    })
}