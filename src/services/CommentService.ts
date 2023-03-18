import { IFeed } from './../Interface/IFeed';
import { IUser } from './../Interface/IUser';
import { IComment } from './../Interface/IComment';
import { Service } from 'typedi';
import { Inject } from 'typedi';
@Service() 
export class CommentService {
    constructor(@Inject('commentModel') private commentModel:Models.CommentModel,@Inject('feedModel') private feedModel: Models.FeedModel){

    }

    public async createComment(commentInputDTO:IComment,currentUser:IUser): Promise<{comment: IComment , message : string}>{
        try {

            const comment = await this.commentModel.create({...commentInputDTO,user:currentUser._id});

            await this.feedModel.findByIdAndUpdate(
                commentInputDTO.feed,
                {
                    $inc:{noOfComments:1}
                });

            return {comment,message:"Comment added successfully"};

        }catch (e) {
            throw e;
        }

    }
}