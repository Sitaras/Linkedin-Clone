import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/shared/auth.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserModel} from "../user-service/user-model";
import {UserServiceService} from "../user-service/user-service.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  isLoggedIn!: boolean;
  username!: string;
  searchForm!: FormGroup;
  user!: UserModel;

  constructor(private authService: AuthService, private router: Router,private userService: UserServiceService) {
    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.authService.username.subscribe((data: string) => this.username = data);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserName();


    this.searchForm = new FormGroup({
      searchUser: new FormControl('')
    });
  }

  goToUserProfile() {
    console.log("HEADER = "+ this.username);
    this.router.navigateByUrl('/user-profile/' + this.username);
  }
  goToUserSettings() {
    this.router.navigateByUrl('/user-settings');
  }

  goToNetwork(){
    this.router.navigateByUrl('/network');
  }

  goToJobPosts(){
    this.router.navigateByUrl('/jobposts');
  }

  goToNotifications(){
    this.router.navigateByUrl('/notifications');
  }

  goToMessages(){
    this.router.navigateByUrl('/messages');
  }

  goToFriendRequests(){
    this.router.navigateByUrl('/friend-requests');
  }
  goToPersonalInfo(){
    this.router.navigateByUrl('/update-bio');
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('').then(() => {
      window.location.reload();
    })
  }

  searchUser(){
    if(this.searchForm.get('searchUser')!.value==''){
      return;
    }
    this.router.navigateByUrl('/search-user/'+this.searchForm.get('searchUser')!.value);
    this.searchForm.reset();
  }

  isAdmin(){
    if(this.isLoggedIn){
      return this.user.admin;
    }else{
      return false;
    }

  }

  getRouterLink(){
    if(this.isAdmin()){
      return "/network";
    }else{
      return "/";
    }
  }

}
