import { socketObj } from './appData';


const chatMessage= (app: any,socket: any) => {

    const handlers = {
        [socketObj.ListenMessage]: listenMessage(app, socket) 
    }

    return handlers;

}

const listenMessage = (app,socket) => async(data) => {
       socket.brodcast.emit(socketObj.ListenMessage, data);
    console.log("send message event sent succesffully");
}

export default chatMessage;