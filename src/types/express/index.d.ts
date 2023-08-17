import { Document, Model } from 'mongoose';
import { IComment } from '../../Interface/IComment';
import { IFeed } from '../../Interface/IFeed';
import IRefreshToken from '../../Interface/IRefreshToken';
import { IUser } from '../../Interface/IUser';
import { IRoles } from '../../Interface/IRoles';
import { IPermissions } from '../../Interface/IPermissions';
declare global{

  


    namespace Models {

       export type UserModel=Model<IUser & Document>;
       export type RefreshTokeModel=Model<IRefreshToken & Document>
       export type FeedModel = Model<IFeed & Document>
       export type CommentModel = Model<IComment & Document>
       export type RoleModel=Model<IRoles & Document>
       export type PermissionModel=Model<IPermissions & Document>

    }
}