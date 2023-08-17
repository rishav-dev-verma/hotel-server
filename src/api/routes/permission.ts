import { Joi, Segments, celebrate } from "celebrate";
import { NextFunction, Response, Router } from "express";
import { Request } from "express-jwt";
import Container from "typedi";
import { PermissionService } from "../../services/PermissionService";







export default (app:Router) => {

    const router = Router();

    app.use('/permission',router);

    router.post('/',celebrate({
        [Segments.BODY]:Joi.object().keys({
            name:Joi.string().required(),
            description:Joi.string()
        })
    }),async(req:Request,res:Response,next:NextFunction) => {
        try {
             const permissionServiceInstance=Container.get(PermissionService);
            const {permission,message}=await permissionServiceInstance.createPermision(req.body);
            return res.status(201).json({permission:permission,message:message,code:201});
        }catch (e){
            next(e);
        }
       
    });

    router.put('/',celebrate({
        [Segments.BODY]:Joi.object().keys({
            name:Joi.string().required(),
            description:Joi.string()
        })
    }),async(req:Request,res:Response,next:NextFunction) => {
        try {
             const permissionServiceInstance=Container.get(PermissionService);
            const {permission,message}=await permissionServiceInstance.updatePermission(req.params.id,req.body);
            return res.status(200).json({permission:permission,message:message,code:200});
        }catch (e){
            next(e);
        }
       
    });

    router.get(
      "/",
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          id: Joi.string().required()
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const permissionServiceInstance = Container.get(PermissionService);
          const { permission, message } =
            await permissionServiceInstance.fetchPermission(
              req.params.id
            );
          return res
            .status(200)
            .json({ permission: permission, message: message, code: 200 });
        } catch (e) {
          next(e);
        }
      }
    );

    router.get(
      "/all",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const permissionServiceInstance = Container.get(PermissionService);
          const response =
            await permissionServiceInstance.fetchAllPermissions();
          return res
            .status(200)
            .json(response);
        } catch (e) {
          next(e);
        }
      }
    );

    

}