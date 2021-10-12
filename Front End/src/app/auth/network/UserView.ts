import { UserModel } from "src/app/user-service/user-model";

export class UserView{
    user!: UserModel;
    retrievedImage: any;

    constructor(u: UserModel,ri: any){
        this.user=u;
        this.retrievedImage=ri;
    }
}