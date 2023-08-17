import { RoleService } from './../../services/RoleService';
import { Joi, Segments, celebrate } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import Container from 'typedi';



export default (app:Router) => {
    const router=Router();

    app.use('/role',router);

    router.post('/',celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        permissions:Joi.array().required()
      }),
    }),async(req:Request,res:Response,next:NextFunction) => {
        try {
            const roleServiceInstance=Container.get(RoleService);
            const {role,message}=await roleServiceInstance.createRole(req.body);

            return res.status(201).json({role,message,code:201});
        }catch(e){
            next(e)
        }
    });

    router.put(
      "/:id",
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().required(),
          permissions:Joi.array().required()
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const roleServiceInstance = Container.get(RoleService);
          const { role, message } = await roleServiceInstance.updateRole(req.params.id,
            req.body
          );

          return res.status(200).json({ role, message, code: 201 });
        } catch (e) {
          next(e);
        }
      }
    );

    router.get(
      "/all",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const roleServiceInstance = Container.get(RoleService);
          const response = await roleServiceInstance.fetchRoles(
          );

          return res.status(200).json(response);
        } catch (e) {
          next(e);
        }
      }
    );

    router.get(
      "/:id",
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          id: Joi.string().required(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const roleServiceInstance = Container.get(RoleService);
          const { role, message } = await roleServiceInstance.fetchRole(
            req.params.id
          );

          return res.status(200).json({ role, message, code: 201 });
        } catch (e) {
          next(e);
        }
      }
    );
}