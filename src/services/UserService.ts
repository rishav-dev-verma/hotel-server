import { Inject, Service } from "typedi";
import { IUser, IUserInputDTO } from "../Interface/IUser";
import { RoleService } from "./RoleService";



@Service()

export class UserService {
    constructor(@Inject('userModel') private userModel : Models.UserModel){

    }


    public async createUser(userInputDTO:IUserInputDTO):Promise<{user:IUser,message:string}>{
      try {
        const user = await this.userModel.create(userInputDTO);

        if(!user){
          throw new Error("Cannot create user");
        }

        return {user,message:"User added succesfully"};
      }catch(e){
        throw e;
      }
    }

    public async updateUser(userId,userInputDTO:IUserInputDTO):Promise<{user:IUser,message:string}>{
      try {
        const user = await this.userModel.findByIdAndUpdate(userId,userInputDTO,{new:true,runValidators:true});

        if(!user){
          throw new Error("Cannot update user");
        }

        return {user,message:"User updated succesfully"};
      }catch(e){
        throw e;
      }
    }

    public async fetchUser(userId,userInputDTO:IUserInputDTO):Promise<{user:IUser,message:string}>{
      try {
        const user = (await this.userModel.findById(userId)).populate({
          path:"roles",
          select:"name description",
          populate:{path:"permission",select:"name description"}
        }).select("fullName email mobile");

        if(!user){
          throw new Error("Cannot update user");
        }

        return {user,message:"User updated succesfully"};
      }catch(e){
        throw e;
      }
    }

    public async fetchAllUsers(){
        const users = await this.userModel.aggregate([
          {
            $lookup: {
              from: "Roles",
              localField: "roles",
              foreignField: "_id",
              as: "user_roles",
            },
          },
          {
            $unwind: "user_roles",
          },
          {
            $lookup: {
              from: "Permissions",
              localField: "user_roles.permissions",
              foreignField: "_id",
              as: "role_permissions",
            },
          },
          {
            $group:{
                _id:"$_id",
                fullName:{$first:"$fullName"},
                email:{$first:"$email"},
                roles:{$push:"$user_roles"},
                permissions:{$addToSet:"$role_permissions.name"}
            }
          }
        ]);

        return{users,message:"Users fetched successfully"};
    }
}