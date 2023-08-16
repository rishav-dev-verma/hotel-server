import { Inject, Service } from "typedi";



@Service()
export  class  RoleService {

    constructor(@Inject('roleModel') private roleModel:Models.RoleModel) {

    }

    public async createRole(){
        
    }

}