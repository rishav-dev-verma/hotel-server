import { promisify } from 'util';
import { readFileSync } from 'fs';
import jwt from "jsonwebtoken";


const isAuth= async(req:any,res:any,next:any) => {
    try{
        const publicJWTRS256Key = readFileSync("./keys/jwtRS256.key.pub");
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' || req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {

            req.token=jwt.verify(
            req.headers.authorization.split(" ")[1],
            publicJWTRS256Key
            );
            next();
        }
        
    }catch(e){
        next(e);
    }
}

export default isAuth;



