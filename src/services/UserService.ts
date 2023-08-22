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

    public async assignRoles(userId,roleInput):Promise<{data:null,message:string}> {
      try {
        const roleObj={roles:roleInput.roles};

        await this.userModel.findByIdAndUpdate(userId,roleObj);

        return {data:null,message:'Role assigned successfully'};
      }catch(e){
        throw e;
      }
    }

    public async fetchUser(userId):Promise<{user:IUser,message:string}>{
      try {
        const user = await this.userModel.findById(userId).populate({
          path:"roles",
          select:"name description"
        }).select("fullName email mobile");

       

        return {user,message:"User fetched succesfully"};
      }catch(e){
        throw e;
      }
    }

    public async fetchAllUsers(){
        const users = await this.userModel.aggregate([
          {
            $lookup: {
              from: "roles",
              localField: "roles",
              foreignField: "_id",
              as: "user_roles",
            },
          },
          {
            $unwind: "$user_roles",
          },
          {
            $lookup: {
              from: "permissions",
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
                permissions:{$addToSet:"$role_permissions.name"},
                allPermissionIds:{$addToSet:"$role_permissions._id"}
            }
          },
          {
            $project: {
              _id: 1,
              fullName: 1,
              email: 1,
              roles: {
                $map: {
                  input: "$roles",
                  as: "role",
                  in: {
                    _id: "$$role._id",
                    // Copy other properties from role except permissions
                    // ...
                    name: "$$role.name",
                    description: "$$role.description",
                  },
                },
              },
              permissions: {
                $reduce: {
                  input: "$permissions",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              },
              allPermissionIds:{
                $reduce: {
                  input: "$allPermissionIds",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              }
            },
          },
          {
            $unwind: "$permissions"
          },
          {
            $unwind: "$allPermissionIds"
          },
          {
            $group: {
              _id: "$_id",
              fullName: { $first: "$fullName" },
              email: { $first: "$email" },
              roles: { $first: "$roles" },
              allpermissions: { $addToSet: "$permissions" }, // Remove duplicates
              allpermissionsIds: { $addToSet: "$allPermissionIds" },
            },
          },
        ]);

        return{users,message:"Users fetched successfully"};
    }
}