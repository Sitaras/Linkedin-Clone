import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommentService} from "../../comment/comment.service";
import {JobPostService} from "../../shared/jobpost.service";
import {throwError} from "rxjs";
import {PostModel} from "../../shared/post-model";
import {JobPostModel} from "../../shared/jobpost-model";
import {AuthService} from "../../auth/shared/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {JobApplicationPayload} from "./jobapplication-payload";
import {VoteService} from "../../shared/vote.service";
import {JobapplicationService} from "../../shared/jobapplication.service";
import {PostService} from "../../shared/post.service";
import {ToastrService} from "ngx-toastr";
import {CommentPayload} from "../../comment/comment-payload";
import {JobApplicationResponse} from "../../shared/jobapplication-model";
import {UserServiceService} from "../../user-service/user-service.service";
import {UserModel} from "../../user-service/user-model";

@Component({
  selector: 'app-view-jobpost',
  templateUrl: './view-jobpost.component.html',
  styleUrls: ['./view-jobpost.component.css']
})
export class ViewJobpostComponent implements OnInit {

  username!: string;
  jobPostId: number;
  jobPost!: JobPostModel;
  applyEnabled!: boolean;
  user!: UserModel;

  applicationForm!: FormGroup;
  jobApplicationPayload!: JobApplicationPayload;

  applications!: JobApplicationResponse[];
  showApplications!: boolean;

  constructor(private jobPostService: JobPostService, private activateRoute: ActivatedRoute, private toastr: ToastrService,
      private authService: AuthService, private router: Router,private jobApplicationService: JobapplicationService,private userService: UserServiceService) {
    this.username = this.authService.getUserName();
    this.jobPostId = this.activateRoute.snapshot.params.id;
    this.jobPostService.getJobPost(this.jobPostId).subscribe(data => {
      this.jobPost = data;
    }, error => {
      throwError(error);
    });
    this.userService.getUser().subscribe(data => {
      this.user=data;
    });
    this.applyEnabled=false;
    this.showApplications=false;
    this.jobApplicationPayload = {
      jobPostId: -1,
      applicationText: ''
    }

  }

  ngOnInit(): void {
    this.applicationForm = new FormGroup({
      jobApplication: new FormControl('', Validators.required),
    });
  }

  notEmpty(str: string){
    return str!='';
  }

  isMyPost(jp: JobPostModel){
    return jp.userName==this.username;
  }

  applyForJob(){
    this.applyEnabled=true;
  }

  discardApplication(){
    this.applyEnabled=false;
  }

  sendApplication(){
    this.jobApplicationPayload.jobPostId = this.jobPost.id;
    this.jobApplicationPayload.applicationText = this.applicationForm.get('jobApplication')!.value;
    this.jobApplicationService.apply(this.jobApplicationPayload).subscribe(() => {
      this.toastr.success("Job application sent successfully");
      this.applyEnabled=false;
    }, error => {
      this.toastr.error("You have already applied for this job");
      this.applyEnabled=false;
      throwError(error);
    });
  }

  getApplications(){
    this.jobApplicationService.getApplications(this.jobPostId).subscribe(data => {
      this.applications = data;
      this.showApplications = true;
    }, error => {
      throwError(error);
    });
  }

  isAdmin(){
    return this.user.admin;
  }


}
