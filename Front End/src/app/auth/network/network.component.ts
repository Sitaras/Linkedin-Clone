import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { UserModel } from 'src/app/user-service/user-model';
import { UserServiceService } from 'src/app/user-service/user-service.service';
import { AuthService } from '../shared/auth.service';
import { UserView } from './UserView';
import {FriendsService} from "../../shared/friends.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  network: Array<UserModel> = [];
  users: Array<UserView> = [];
  currentUserName!: string;
  currentUser!: UserModel;
  friends!: string[];
  name!: string;

  retrievedImage: any;
  test: any;
  base64Data: any;
  retrieveResonse: any;
  imageWasRead!: boolean;

  constructor(private userService: UserServiceService, private authService: AuthService, private httpClient: HttpClient,
                private friendsService: FriendsService,private activatedRoute: ActivatedRoute) {

    this.name = this.activatedRoute.snapshot.params.name;
    this.authService.username.subscribe((data: string) => this.currentUserName = data);
    this.currentUserName = this.authService.getUserName();
    this.userService.getUserByUsername(this.currentUserName).subscribe(data => {
      this.currentUser=data;
    });

    if(this.name==undefined || this.name==null || this.name==''){
      this.userService.getNetwork().subscribe(data => {
        this.network = data;
      });
      this.friendsService.getFriendsOfUser(this.currentUserName).subscribe(data => {
        this.friends = data;
      });
      this.name=this.currentUserName;
    }else{
      this.userService.getNetworkOfUser(this.name).subscribe(data => {
        this.network = data;
      });
      this.friendsService.getFriendsOfUser(this.name).subscribe(data => {
        this.friends = data;
      });
    }
   }

  ngOnInit(): void {

  }

  hasImage(u: UserModel){
    if (u.imageUrl == null) {
      return false;
    }
    return u.imageUrl.startsWith('https');
  }

  notEmpty(str: string){
    return !(str=='' || str==null);
  }

  showProfile(username: string){
    return this.friends.includes(username) || (this.currentUser.admin && (this.name==undefined || this.name==null || this.name=='' || this.name==this.currentUserName));
  }

  hasNoFriends(){
    return this.friends.length <= 0 && (this.currentUser.admin && this.currentUser.username!=this.name);
  }


}
