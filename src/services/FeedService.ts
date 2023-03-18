
import { ObjectId, Model } from 'mongoose';
import { Logger } from 'winston';
import { IUser } from './../Interface/IUser';
import { IFeed } from './../Interface/IFeed';
import { Service } from 'typedi';
import { Inject } from 'typedi';
import { IFeedDTO } from '../Interface/IFeed';
@Service()

export class FeedService {
    constructor(@Inject('feedModel') private feedModel:Models.FeedModel,@Inject('logger') private loggerModel:Logger){

    }

    public async createFeed(feedInputDto:IFeedDTO,currentUser:IUser):Promise<{feed:IFeed ,message : string}>{
        try {
            this.loggerModel.debug("feed service called");

            const feed = await this.feedModel.create({ ...feedInputDto ,user:currentUser._id});

            if(!feed) {
                throw new Error('Unable to create feed');
            }

            return {feed,message:"Feed created successfully"}
        }catch (e) {
            throw e;
        }
    }

    public async deleteFeed(feedId:ObjectId,currentUser:IUser):Promise<{feed:any,message:string}>{
        try {

        await this.feedModel.deleteOne({user:currentUser._id,_id:feedId});

        return {feed:null,message:'Feed deleted successfully'}

        }catch (e) {
            throw e;
        }
    }


    public async fetchFeed(): Promise<{feeds:IFeed[] , message:string}>{

        try {

            const feeds = await this.feedModel
              .find()
              .populate({
                path: "commentSchema",
                populate: { path: "user",select:"email firstName" },
              })
              .populate({path: "user"}).populate({path:"likes",select:"email firstName"});

            return{feeds,message:'Feeds fetched successfully'};

        }catch (e) {
            throw e;
        }

    }

    public async updateFeed(feedId:string,feedInputDTO:IFeedDTO): Promise<{feed: IFeed, message: string}> {

        try {
            const feed = await this.feedModel.findByIdAndUpdate(feedId,feedInputDTO, {new: true, runValidators: true});

            if(!feed) {
                throw new Error("Feed not present");
            }

            return {feed:feed,message:"Feed updated successfully"};


        }catch(e){
            throw e;
        }

    }

    public async likeFeed(likeFeedDto:any,currentUser:IUser): Promise<{feed: IFeed, message:string}>{

        try {

            const objectKey = likeFeedDto.isLiked ? '$addToSet' : '$pull';

            const likeObj =likeFeedDto.isLiked ?  {
              $inc: { noOfLikes:  1 },
              $addToSet: { likes: currentUser._id },
            }: {
              $inc: { noOfLikes:  -1 },
              $pull: { likes: currentUser._id },
            };

            const feed = await this.feedModel.findByIdAndUpdate(likeFeedDto.feedId,
                likeObj,{new:true,runValidators:true});

            feed.likes.push(currentUser._id);

            return {feed,message:"Feed Liked Successfully"};

        }catch (e){

            throw e;

        }

    }
}