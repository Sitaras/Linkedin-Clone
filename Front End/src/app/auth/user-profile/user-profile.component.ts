import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommentPayload } from 'src/app/comment/comment-payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';
import { UserModel } from 'src/app/user-service/user-model';
import { UserServiceService } from 'src/app/user-service/user-service.service';
import {AuthService} from "../shared/auth.service";
import {Subscription, throwError} from "rxjs";
import {FriendsService} from "../../shared/friends.service";
import {FriendsModel} from "../../shared/friends-model";
import {ToastrService} from "ngx-toastr";
import {JobPostModel} from "../../shared/jobpost-model";
import {JobPostService} from "../../shared/jobpost.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  name: string;
  bio!: string;
  posts!: PostModel[];
  comments!: CommentPayload[];
  jobPosts!: JobPostModel[];
  user!: UserModel;
  currentUser!: UserModel;
  postLength!: number;
  commentLength!: number;
  currentUserName!: string;
  friendshipStatus!: FriendsModel;
  profilePics!: Map<string, string>;
  isSelected: string = "bio";
  user_friends!: string[];

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService,
              private commentService: CommentService,private userService: UserServiceService,private router: Router,
              private authService: AuthService,private friendsService: FriendsService, private toastr: ToastrService, private jobPostService: JobPostService) {

    this.name = this.activatedRoute.snapshot.params.name;

    this.authService.username.subscribe((data: string) => this.currentUserName = data);
    this.currentUserName = this.authService.getUserName();

    this.userService.getUserByUsername(this.name).subscribe(data => {
      this.user=data;
    });

    // this.userService.getUser().subscribe(data => {
    //   this.user = data;
    // });
    this.postService.getAllPostsByUser(this.name).subscribe(data => {
      this.posts = data;
      this.postLength = data.length;
    });

    this.userService.getUserByUsername(this.currentUserName).subscribe(data => {
      this.currentUser=data;
    });

    if(this.notMyProfile()){
      this.friendsService.getFriendshipStatus(this.name).subscribe(data => {
        this.friendshipStatus = data;
      });
    }

    this.commentService.getAllCommentsByUser(this.name).subscribe(data => {
      this.comments = data;
      this.commentLength = data.length;
      this.profilePics = new Map();

      for (let comment of this.comments) {
        if (!this.profilePics.has(comment.userName)) {
          let user = null;
          this.userService.getUserByUsername(comment.userName).subscribe(data => {
            user = data;
            if (user != null && user.imageUrl != null && user.imageUrl != '' && user.imageUrl.startsWith('http')) {
              this.profilePics.set(comment.userName, user.imageUrl);
            } else {
              this.profilePics.set(comment.userName, "/assets/default_profile_pic.png");
            }
          }, error => {
            throwError(error);
            this.profilePics.set(comment.userName, "/assets/default_profile_pic.png");
          });
        }
    }


    });
    this.jobPostService.getAllJobPostsByUser(this.name).subscribe(data => {
      this.jobPosts=data;
    });


    this.friendsService.getFriendsOfUser(this.name).subscribe(data => {
      this.user_friends = data;
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {

  }

  getProfilePic(userName: string) {
    if (this.profilePics.has(userName)) {
      return this.profilePics.get(userName);
    } else {
      return "/assets/default_profile_pic.png";
    }

  }

  changeIsSelected(id: string) {
    this.isSelected = id;
    console.log(this.isSelected);
  }

  goToSendMessage(){
    this.router.navigateByUrl('/sendmessage/'+this.name);
  }

  notMyProfile(){
    return this.currentUserName!=this.name;
  }

  sendFriendRequest(){
    this.friendsService.sendFriendRequest(this.name).subscribe(data => {
      this.toastr.success("Friend Request Sent")
      this.updateFriendshipStatus();
    }, error => {
      this.toastr.error("Error on sending friend request")
      throwError(error);
    })
  }

  acceptFriendRequest(){
    this.friendsService.acceptFriendRequest(this.name).subscribe(data => {
      this.toastr.success("Friend Request Accepted")
      this.updateFriendshipStatus();
    }, error => {
      this.toastr.error("Error on accepting friend request")
      throwError(error);
    })
  }

  declineFriendRequest(){
    this.friendsService.declineFriendRequest(this.name).subscribe(data => {
      this.toastr.success("Friend Request Was Declined")
      this.updateFriendshipStatus();
    }, error => {
      this.toastr.error("Error on declining friend request")
      throwError(error);
    })
  }

  cancelFriendRequest(){
    this.friendsService.cancelFriendRequest(this.name).subscribe(data => {
      this.toastr.success("Friend Request Was Cancelled")
      this.updateFriendshipStatus();
    }, error => {
      this.toastr.error("Error on canceling friend request")
      throwError(error);
    })
  }

  updateFriendshipStatus(){
    if(this.notMyProfile()){
      this.friendsService.getFriendshipStatus(this.name).subscribe(data => {
        this.friendshipStatus = data;
      });
    }
  }

  waitingForAccept(){
    return (this.notMyProfile() && this.friendshipStatus.exists && this.friendshipStatus.pendingRequest && this.friendshipStatus.sentRequestName==this.currentUserName);
  }

  needToRespond(){
    return (this.notMyProfile() && this.friendshipStatus.exists && this.friendshipStatus.pendingRequest && this.friendshipStatus.sentRequestName!=this.currentUserName);
  }

  noFriendshipStatus(){
    return (this.notMyProfile() && !this.friendshipStatus.exists);
  }

  friends(){
    return (this.notMyProfile() && this.friendshipStatus.exists && !this.friendshipStatus.pendingRequest);
  }

  notEmpty(str: string){
    return !(str=='' || str==null);
  }

  goToJobPost(id: number): void {
    this.router.navigateByUrl('/view-jobpost/' + id);
  }


  downloadJson(){
    let temp = {
      "user-info":  this.user ,
      "user-posts":  this.posts ,
      "user-jobPosts":  this.jobPosts ,
      "user-comments": this.comments,
      "user-network": this.user_friends
    }
    const content = JSON.stringify(temp);
    const fileName = 'user-profile-'+this.name+'.json';
    const contentType = 'text/plain';
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  goToNetwork(){
    this.router.navigateByUrl('/network/' + this.name);
  }

  downloadXML(){
    let js2xmlparser = require("js2xmlparser");
    let temp = {
      "user-info":  this.user ,
      "user-posts":  this.posts ,
      "user-jobPosts":  this.jobPosts ,
      "user-comments": this.comments,
      "user-network": this.user_friends
    }
    const content = js2xmlparser.parse("user-profile",temp);
    const fileName = 'user-profile-'+this.name+'.xml';
    const contentType = 'text/plain';
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  hasImage(): boolean {
    if (typeof (this.user) == 'undefined' || this.user.imageUrl == null) {
      console.log("sss");
      return false;
    }
    return this.user.imageUrl.startsWith('https');
  }

  getImage() {
    return this.user.imageUrl;
  }

  postsExist(){
    return this.posts!=undefined && this.posts!=null && this.posts.length>0;
  }

  wePublic(){
    return this.user.publicWorkingExperience;
  }

  skillsPublic(){
    return this.user.publicSkills;
  }
  educationPublic(){
    return this.user.publicEducation;
  }


}
