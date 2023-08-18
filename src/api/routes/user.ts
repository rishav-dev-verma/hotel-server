import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { UserService } from "../../services/UserService";
import { Joi, Segments, celebrate } from "celebrate";



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


    router.post('/',celebrate({
        [Segments.BODY]:Joi.object({
            fullName:Joi.string().required(),
            email:Joi.string(),
            mobile:Joi.number(),
            password:Joi.string().required(),
            passwordConfirm:Joi.string().required()
        })
    }),async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userServiceInstance=Container.get(UserService);
            const {user,message}=await userServiceInstance.createUser(req.body);
            return res.status(201).json({user,message,code:201});

        }catch(e){
            next(e);
        }
    });

    router.put('/:id',celebrate({
        [Segments.BODY]:Joi.object({
            fullName:Joi.string().required(),
            email:Joi.string(),
            mobile:Joi.number(),
        })
    }),async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userServiceInstance=Container.get(UserService);
            const {user,message}=await userServiceInstance.updateUser(req.params.id,req.body);
            return res.status(200).json({user,message,code:200});

        }catch(e){
            next(e);
        }
    });

    router.patch('/:id',celebrate({
        [Segments.BODY]:Joi.object({
            roles:Joi.array().required(),
        })
    }),async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userServiceInstance=Container.get(UserService);
            const {user,message}=await userServiceInstance.assignRoles(req.params.id,req.body);
            return res.status(200).json({user,message,code:200});

        }catch(e){
            next(e);
        }
    });

    router.get('/:id',celebrate({
        [Segments.PARAMS]:Joi.object({
            id:Joi.string().required(),
        })
    }),async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userServiceInstance=Container.get(UserService);
            const {user,message}=await userServiceInstance.fetchUser(req.params.id);
            return res.status(200).json({user,message,code:200});

        }catch(e){
            next(e);
        }
    });


}