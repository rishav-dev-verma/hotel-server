import { IRoleDTO,IRoles } from './../Interface/IRoles';
import { Inject, Service } from "typedi";



@Service()
export class RoleService {
  constructor(@Inject("roleModel") private roleModel: Models.RoleModel) {}

  public async createRole(
    roleInputDto: IRoleDTO
  ): Promise<{ role: IRoles; message: string }> {
    try {
      const roleDoc = await this.roleModel.create({ ...roleInputDto });

      if (!roleDoc) {
        throw new Error("Unable to create role");
      }

      const role = roleDoc.toObject();

      return { role, message: "Role created successfully" };
    } catch (e) {
      throw e;
    }
  }

  public async updateRole(
    roleId: any,
    roleInputDto: IRoleDTO
  ): Promise<{ role: IRoles; message: string }> {
    try {
      const roleDoc = await this.roleModel.findByIdAndUpdate(
        roleId,
        {
          ...roleInputDto
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!roleDoc) {
        throw new Error("Unable to update role");
      }

      const role = roleDoc.toObject();

      return { role, message: "Role updated successfully" };
    } catch (e) {
      throw e;
    }
  }


  public async syncRoles(roleId:string,roleInput): Promise<{data:null,message:string}> {

    try {

      await this.roleModel.findByIdAndUpdate(roleId,
        {$addToSet:{roles:{$each:roleInput.roles}}}
      ,{new:true});

      return {data:null,message:"Permissions synced successfully"};

    }catch(e){

      throw e;
    }

  }

  

  public async fetchRole(
    roleId: any
  ): Promise<{ role: IRoles; message: string }> {
    try {
      const roleDoc = await this.roleModel.findById(roleId).populate({
        path: "permissions",
        select: "name description",
      });

      if (!roleDoc) {
        throw new Error("Unable to fetch role");
      }

      const role = roleDoc.toObject();

      return { role, message: "Role fetched successfully" };
    } catch (e) {
      throw e;
    }
  }

  public async fetchRoles(
  ): Promise<{ roles: [{IRoles}]; message: string }> {
    try {
      
      const roles:any = await this.roleModel.find().populate({
        path: "permissions",
        select: "name description",
      });
     

      return { roles:roles, message: "Roles fetched successfully" };
    } catch (e) {
      throw e;
    }
  }
}

