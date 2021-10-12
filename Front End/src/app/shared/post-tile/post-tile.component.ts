import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../post-model';
import { PostService } from '../post.service';
import {AuthService} from "../../auth/shared/auth.service";
import {UserModel} from "../../user-service/user-model";
import {UserServiceService} from "../../user-service/user-service.service";
import {VoteService} from "../vote.service";
import {FriendsService} from "../friends.service";

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.css']
})
export class PostTileComponent implements OnInit {

  // @Input() data!: Array<PostModel>;
  @Input()
  posts!: PostModel[];
  posts2!: PostModel[];
  faComments = faComments;
  currentUserName!: string;
  user!: UserModel;
  tempNameList!: string[];
  friendsOfCurrentUser!: string[];
  likesOfPost!: Map<number,string[]>;
  isfullbool!: boolean;
  isfullurl!: string;
  title = 'angulartoastr';
  showModal!: boolean;
  showurl!:string;

  show(url: string) {
    this.showModal = true;
    this.showurl = url;
  }

  hide() {
    this.showModal = false;
    this.showurl = "";
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute,private authService: AuthService,private userService: UserServiceService,
              private voteService: VoteService,private friendsService: FriendsService,private postService:PostService) {
    this.authService.username.subscribe((data: string) => this.currentUserName = data);
    this.currentUserName = this.authService.getUserName();

    this.postService.getAllPosts().subscribe(data => {
      this.posts2 = data;
      this.likesOfPost = new Map<number,string[]>();
      for(let post of this.posts2){
        this.voteService.getAllInterested(post.id).subscribe(data => {
          this.likesOfPost.set(post.id,data);
        });
      }
    });
    this.userService.getUserByUsername(this.currentUserName).subscribe(data => {
      this.user=data;
      this.activatedRoute.queryParams
        .subscribe(params => {
          if (params.loggedin !== undefined && params.loggedin === 'true' && this.user.admin) {
            this.router.navigateByUrl('/network');
          }
        });
    });
    this.friendsService.getFriendsOfUser(this.currentUserName).subscribe(data => {
      this.friendsOfCurrentUser = data;
    });

  }

  ngOnInit(): void {

  }

  goToPost(id: number): void {
    this.router.navigateByUrl('/view-post/' + id);
  }

  hasImage(p: PostModel) {
    if (p.url!=null && p.url != '' && p.url.startsWith('http')) {
      return true;
    }
    return false;
  }

  hasVideo(p: PostModel){
    return p.videoUploaded;
  }

  isfull(url: string) {
    this.isfullbool = true;
    this.isfullurl = url;
  }

  closefull(url: string) {
    this.isfullbool = false;
    this.isfullurl = "";
  }

  showPost(post: PostModel){
    if(this.user.admin){
      return true;
    }
    if(post.userName==this.currentUserName){
      return true;
    }
    if(this.friendsOfCurrentUser.includes(post.userName)){
      return true;
    }
    let likes = this.likesOfPost.get(post.id);
    if(likes==undefined){
      return false;
    }
    for(let username of likes){
      if(this.friendsOfCurrentUser.includes(username)){
        return true;
      }
    }
    return false;
  }

  isAdmin(){
    return this.user.admin;
  }



}
