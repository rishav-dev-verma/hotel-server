import { Logger } from 'winston';
import { IUser } from './../../Interface/IUser';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
const getCurrentuser = async(req:any,res:Response,next:NextFunction) => {
    const logger:Logger = Container.get('logger');
    try {

        const userModel : Models.UserModel= Container.get("userModel");
        const user = await userModel.findById(req.token._id);
        user.password=undefined;

        if(!user) {
        res.sendStatus(401);
        }
        req.currentUser= user;

        next();
    }
    catch (e){
        return next(e)
    }
}

export default getCurrentuser;