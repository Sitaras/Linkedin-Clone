import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { faComments } from '@fortawesome/free-solid-svg-icons';
import {PostModel} from "../post-model";
import {PostService} from "../post.service";
import {JobPostService} from "../jobpost.service";
import {JobPostModel} from "../jobpost-model";
import {AuthService} from "../../auth/shared/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-jobpost-tile',
  templateUrl: './jobpost-tile.component.html',
  styleUrls: ['./jobpost-tile.component.css']
})
export class JobpostTileComponent implements OnInit {

  faComments = faComments;
  jobPosts: Array<JobPostModel> = [];
  username!: string;
  showMyPosts!: boolean;
  myJobPosts: Array<JobPostModel> = [];

  constructor(private router: Router,private jobPostService: JobPostService, private authService: AuthService, private activatedRoute: ActivatedRoute,
              private toastr: ToastrService) {
    this.username = this.authService.getUserName();
    this.jobPostService.getAllJobPosts().subscribe(post => {
      this.jobPosts = post;
    });
    this.jobPostService.getAllJobPostsByUser(this.username).subscribe(post => {
      this.myJobPosts = post;
    });
    this.showMyPosts = false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.createdpost !== undefined && params.createdpost === 'true') {
          this.toastr.success('Job Post created successfully!');
        }
      });
  }

  goToJobPost(id: number): void {
    this.router.navigateByUrl('/view-jobpost/' + id);
  }

  isMyPost(jp: JobPostModel){
    return jp.userName==this.username;
  }

  showMyJobPosts(){
    this.showMyPosts = !this.showMyPosts;
  }

  showPost(jp: JobPostModel){
    if(!this.showMyPosts){
      return true;
    }else{
      return jp.userName==this.username
    }
  }
  getPosts(){
    if(!this.showMyPosts){
      return this.jobPosts;
    }else{
      return this.myJobPosts;
    }
  }

  notEmpty(str: string){
    return str!='';
  }

}
