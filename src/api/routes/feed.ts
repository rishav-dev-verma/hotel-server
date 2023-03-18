
import { Logger } from 'winston';
import { FeedService } from './../../services/FeedService';
import { Joi,celebrate, Segments } from 'celebrate';
import { Router, NextFunction, Response, Request } from 'express';
import middleware from '../middleware';
import Container from 'typedi';
import Feed from '../../models/Feed';


export default (app:Router) => {

    const router = Router();

    app.use('/feed',router);

    router.post('/',celebrate({
        [Segments.BODY]:Joi.object({
            body:Joi.string().required(),
        })
    }),
    middleware.auth,
    middleware.currentUser,
    async(req:any,res:Response,next:NextFunction) => {
        const logger:Logger = Container.get("logger");
        try {
            logger.info('Feed create endpoint called');
            const feedServiceContainer = Container.get(FeedService);
            const { feed, message } = await feedServiceContainer.createFeed(
              req.body,
              req.currentUser
            );
            res.status(200).json({feed,message});
        }catch (e){
            next(e);
        }
    });

    router.delete('/:feedId',
    celebrate({
        [Segments.PARAMS]:Joi.object({
            feedId:Joi.string().required()
        })
    }),
    middleware.auth,
    middleware.currentUser,
    middleware.isAdmin,
    async(req:any,res:Response,next:NextFunction) => {
         const logger: Logger = Container.get("logger");
        try {
            logger.info("Feed delete endpoint called");
           const  feedServiceContainer = Container.get(FeedService);
           const {feed,message}  = await feedServiceContainer.deleteFeed(req.params.feedId,req.currentUser);
           res.status(202).json({data:feed,message:message});
        }catch (e) {
            next(e);
        }
    });

    router.get('/',middleware.auth,middleware.currentUser,async(req:any,res:Response,next:NextFunction) => {
        const logger:Logger=Container.get('logger');
        try {
            logger.info('feed fetch endpoint called')
            const feedServiceContainer = Container.get(FeedService);
            const {feeds,message} = await feedServiceContainer.fetchFeed();
            res.status(201).json({feeds,message});
        }catch (e){
            next(e);
        }
    })

    router.patch('/:feedId',
    celebrate({
        [Segments.PARAMS]:Joi.object({
            feedId: Joi.string().required()
        }),
        [Segments.BODY]:Joi.object({
            body: Joi.string().required()
        })
    }),
    middleware.auth,
    middleware.currentUser,
    async(req:any,res:Response,next:NextFunction)=> {
         const logger:Logger=Container.get('logger');
        try {
           logger.info("feed patch endpoint called");
           const feedServiceContainer = Container.get(FeedService);
           const {feed,message} = await feedServiceContainer.updateFeed(req.params.feedId,req.body);
           res.status(200).json({data:feed,message}); 
        }catch(e) {
            next(e);
        }

    })

    router.post("/like",
    celebrate({
        [Segments.BODY]:Joi.object({
            isLiked: Joi.boolean().required(),
            feedId:Joi.string().required()
        })
    }),
    middleware.auth,
    middleware.currentUser,
    async(req:any,res:Response,next:NextFunction) => {
        try {
            const feedServiceContainer = Container.get(FeedService);
            const {feed,message} = await feedServiceContainer.likeFeed(req.body,req.currentUser);
            res.status(200).json({feed,message})
        }catch(e) {
            next(e);
        }
    })

}