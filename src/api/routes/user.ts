import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { UserService } from "../../services/UserService";



export default (app:Router) => {
    const router=Router();
    app.use('/users',router);

    router.get('/all',async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userServiceInstance=Container.get(UserService);
            const response=await userServiceInstance.fetchAllUsers();
            return res.status(200).json(response);
        }catch(e){
            next(e);
        }
    })
}