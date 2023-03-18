import { readFileSync } from 'fs';
import { Model } from 'mongoose';
import { Container } from 'typedi';
import LoggerInstance from './logger';
export default ({models}:{models:{name:string,model:any}[]}) => {

    for(const m of models) {
        Container.set(m.name,m.model);
    }

     Container.set("logger", LoggerInstance);

     const privateJWTRS256Key = readFileSync("./keys/jwtRS256.key");
     const publicJWTRS256Key = readFileSync("./keys/jwtRS256.key.pub");

     Container.set("publicKey", publicJWTRS256Key);
     Container.set("privateKey", privateJWTRS256Key);

}