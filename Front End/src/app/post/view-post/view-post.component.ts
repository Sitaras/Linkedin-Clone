import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostModel } from 'src/app/shared/post-model';
import { throwError } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentPayload } from 'src/app/comment/comment-payload';
import { CommentService } from 'src/app/comment/comment.service';
import {UserServiceService} from "../../user-service/user-service.service";
import {UserModel} from "../../user-service/user-model";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId: number;
  post!: PostModel;
  commentForm!: FormGroup;
  commentPayload: CommentPayload;
  comments!: CommentPayload[];
  profilePics!: Map<string, string>;
  user!: UserModel;

  constructor(private postService: PostService, private activateRoute: ActivatedRoute, private commentService: CommentService
              , private router: Router,private userService: UserServiceService) {
    this.postId = this.activateRoute.snapshot.params.id;
    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });



    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentPayload = {
      text: '',
      postId: this.postId,
      userName: ''
    };
  }

  ngOnInit(): void {
    this.getPostById();
    this.getCommentsForPost();
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text')!.value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text')!.setValue('');
      this.getCommentsForPost();
    }, error => {
      throwError(error);
    })
  }

  private getPostById() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });
  }

  private getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data;
      this.profilePics = new Map();
      for(let comment of this.comments){
        if(!this.profilePics.has(comment.userName)){
          let user= null;
          this.userService.getUserByUsername(comment.userName).subscribe(data => {
            user = data;
            if (user!= null && user.imageUrl != null && user.imageUrl!='' && user.imageUrl.startsWith('http')){
              this.profilePics.set(comment.userName,user.imageUrl);
            }else{
              this.profilePics.set(comment.userName,"/assets/default_profile_pic.png");
            }
          }, error => {
            throwError(error);
            this.profilePics.set(comment.userName,"/assets/default_profile_pic.png");
          });
        }
      }
    }, error => {
      throwError(error);
    });
  }

  hasImage(p: PostModel){
    if (p.url != null && p.url!='' && p.url.startsWith('http')){
      return true;
    }
    return false;
  }

  hasVideo(p: PostModel) {
    if (p.videoUploaded){
      console.log('IS VIDEO');
    }else{
       console.log('NOT IS VIDEO');
    }
    return p.videoUploaded;
  }

  getProfilePic(userName: string){
    if(this.profilePics.has(userName)){
      return this.profilePics.get(userName);
    }else{
      return "/assets/default_profile_pic.png";
    }

  }

  isAdmin(){
    if(this.user==undefined){
      this.userService.getUser().subscribe(data => {
        this.user = data;
      });
    }
    return this.user.admin;
  }

}
