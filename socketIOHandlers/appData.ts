import { Socket } from "socket.io";

export type AppData = {
  allSockets: Socket<any, any>[];
};

export enum socketObj {
    ListenMessage ="sendMessage",
    RecieveMessage ="recieveMessage"
}
