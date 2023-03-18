import { AuthService } from './../../services/AuthService';
import { Logger } from 'winston';
import { IUser } from '../../Interface/IUser';
import { Router,Request,Response,NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi, Segments } from 'celebrate';
import middleware from '../middleware';

export default (app:Router) => {

    const router = Router();

    app.use('/auth',router);

    router.post(
      "/signUp",
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required().email(),
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          password: Joi.string().required(),
          passwordConfirm: Joi.string().required(),
          role: Joi.string().default("admin"),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get("logger");
        try {
          logger.debug("Calling Sign-up endpoint");
          const authService = await Container.get(AuthService);
          const { user, token,refreshToken, message } = await authService.signUp(req.body);

          return res.status(200).json({ user, token, refreshToken, message });
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
    );

    router.post(
      "/login",
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required().email(),
          password: Joi.string().required().min(7),
        }),
      }),
      async(req:Request,res:Response,next:NextFunction) => {
        const logger : Logger = Container.get("logger");
        try {
        const authServiceContainer= Container.get(AuthService);

        const userRespone:{user:IUser,token:string,refreshToken:string} = await authServiceContainer.login(req.body);

        res.status(200).json(userRespone);
        }catch (e) {
          logger.error(e);
          return next(e);
        }
      }
    );

    router.get("/me",middleware.auth, middleware.currentUser,async(req:any,res:Response,next:NextFunction) => {
      const user = req.currentUser;
      res.status(200).json({user})
    });

    router.post("/updatepassword",celebrate({
      [Segments.BODY] : Joi.object().keys({
        password: Joi.string().required().min(7),
        passwordConfirm:Joi.string().required().min(7)
      })
    }),middleware.auth,middleware.currentUser,async(req:Request,res:Response,next:NextFunction) => {
      try {

        const authServiceContainer = Container.get(AuthService);
        await authServiceContainer.updatePassword(req);

        res.status(200).json({data:null,message:'Password updated succesfuly'});

      }catch(e){
        throw e
      }
    })

    router.post(
      "/generateToken",
      celebrate({
        [Segments.BODY]:Joi.object({
          refreshToken: Joi.string().required()
        })
      }),
      middleware.auth,
      async(req:Request,res:Response,next:NextFunction) => {
        try {
          const authServiceContainer = Container.get(AuthService);
          const {token,refreshToken} = await authServiceContainer.refreshToken(req.body);
          res.status(200).json({token,refreshToken});
        }catch(e) {
          throw e;
        }
      }
    );

    router.post("/logout",
    celebrate({
      [Segments.BODY]:Joi.object({
        refreshToken: Joi.string().required()
      })
    }),middleware.auth,async(req,res,next) => {
      const authServiceContainer = Container.get(AuthService);
      await authServiceContainer.invalidateAllToken(req.body);
      res.status(201).json({
        data:null,
        message:"User logged out successfully"
      })
    })

}