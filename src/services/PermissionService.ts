import { Inject, Service } from "typedi";
import { IPermissionsDTO,IPermissions } from "../Interface/IPermissions"; 

@Service()

export class PermissionService {

    constructor(@Inject('permissionModel') private permissionModel: Models.PermissionModel) {

    }


    public async createPermision(IPermissionsDTO: IPermissionsDTO):Prmosie<{permission:IPermissions,message:string}>
    {
        try {
            const permissionObj = await this.permissionModel.create({...IPermissionsDTO});

            if(!permissionObj) {
                throw new Error('Unable to create permission object');
            }

            const permission=permissionObj.toObject();

            return{permission,message:"Permission added succesfully"}
        }catch(e) {
            throw e;
        }

    }


    public async updatePermission(permisisonId,IPermissionDTO):Promise<{permission:IPermissions,message:string}> {
        try {
            const permission=this.permissionModel.findByIdAndUpdate(permisisonId,{...IPermissionDTO},{
                new:true,
                runValidators:true
            });

            if(!permission) {
                throw new Error('Unable to update the permisison');
            }

            return {permission,message:"Permission updated successfully"};
        }catch(e){
            throw e;
        }
    }

    public async fetchPermission(permisisonId:string):Promise<{permission:IPermissions,message:string}> {
        try {
            const permission=this.permissionModel.findById(permisisonId);

            if(!permission) {
                throw new Error('Unable to update the permisison');
            }

            return {permission,message:"Permission updated successfully"};
        }catch(e){
            throw e;
        
        }
    }


    public async fetchAllPermissions(): Promise<{permissions:[{IPermissions}],message:string}>{
        try {
            const permissions:any=this.permissionModel.find({name:1,description:1});

            if(permissions.length === 0) {
                throw new Error('Unable to update the permisison');
            }

            return {permissions,message:"Permission updated successfully"};
        }catch(e){
            throw e;
        
        }
    }
}