import { Logger } from 'winston';
import { Container } from 'typedi';
import { Router, Response, NextFunction } from 'express';
import middleware from '../middleware';
import { celebrate, Joi, Segments } from 'celebrate';
import { CommentService } from '../../services/CommentService';
export default (app:Router) => {

    const router = Router();

    app.use('/comments',router);

    router.post('/',celebrate({
        [Segments.BODY]:Joi.object({
            body: Joi.string().required(),
            feed: Joi.string().required()
        })
    }),middleware.auth,middleware.currentUser,async(req:any,res:Response,next:NextFunction) => {

        try {
            const logger: Logger=Container.get('logger');
            const commentServiceContainer = Container.get(CommentService);
            logger.info(`Comment create endpoint`);

            const {comment,message} = await commentServiceContainer.createComment(req.body,req.currentUser);
            res.status(200).json({data:comment,message});
        }catch(e){
            next(e);
        }
    });

   
    
}