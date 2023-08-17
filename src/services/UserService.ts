import { Inject, Service } from "typedi";



@Service()

export class UserService {
    constructor(@Inject('userModel') private userModel : Models.UserModel){

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