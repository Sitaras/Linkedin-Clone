import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { UserModel } from 'src/app/user-service/user-model';
import { UserServiceService } from 'src/app/user-service/user-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isLoggedIn!: boolean;
  retrievedImage: any;  //new
  retrieveResonse: any;  //new
  message!: string;  //new
  imageName: any;  //new
  email!: string;
  imageWasRead!: boolean;
  user!: UserModel;

  constructor(private router: Router, private authService: AuthService, private httpClient: HttpClient, private userService: UserServiceService) {
    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
   }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn){
      this.authService.email.subscribe((data: string) => this.email = data);
      this.email = this.authService.getEmail();
      this.retrievedImage = '';
      this.imageWasRead=false;
      // this.getImage(this.email);
    }
  }

  goToCreatePost() {
    this.router.navigateByUrl('/create-post');
  }
  goToUpdateBio() {
    this.router.navigateByUrl('/update-bio');
  }

  hasImage():boolean{
    if ( typeof(this.user) == 'undefined' ||this.user.imageUrl==null){
      return false;
    }
    return this.user.imageUrl.startsWith('https');
  }

  getImage(){
    return this.user.imageUrl;
  }

  inJobPosts(){

    return (this.router.url === '/jobposts') || (this.router.url.startsWith('/view-jobpost'));
  }

  goToCreateJobPost(){
    this.router.navigateByUrl('/create-jobpost');
  }

  notEmpty(str: string){
    return !(str=='' || str==null);
  }

}
