import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateJobPostPayload} from "./create-jobpost.payload";
import {Router} from "@angular/router";
import {PostService} from "../../shared/post.service";
import {ToastrService} from "ngx-toastr";
import {JobPostService} from "../../shared/jobpost.service";
import {throwError} from "rxjs";

@Component({
  selector: 'app-create-jobpost',
  templateUrl: './create-jobpost.component.html',
  styleUrls: ['./create-jobpost.component.css']
})
export class CreateJobpostComponent implements OnInit {

  createJobPostForm!: FormGroup;
  jobPostPayload!: CreateJobPostPayload;

  constructor(private router: Router, private jobPostService: JobPostService, private toastr: ToastrService) {
    this.jobPostPayload = {
      jobPostName: '',
      companyName: '',
      salary: '',
      skills: '',
      benefits: '',
      otherInfo: ''
    }
  }

  ngOnInit(): void {
    this.createJobPostForm = new FormGroup({
      jobPostName: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      salary: new FormControl('', Validators.required),
      skills: new FormControl('', Validators.required),
      benefits: new FormControl('', Validators.required),
      otherInfo: new FormControl('', Validators.required),
    });
  }

  createJobPost() {
    this.jobPostPayload.jobPostName = this.createJobPostForm.get('jobPostName')!.value;
    this.jobPostPayload.companyName = this.createJobPostForm.get('companyName')!.value;
    this.jobPostPayload.salary = this.createJobPostForm.get('salary')!.value;
    this.jobPostPayload.skills = this.createJobPostForm.get('skills')!.value;
    this.jobPostPayload.benefits = this.createJobPostForm.get('benefits')!.value;
    this.jobPostPayload.otherInfo = this.createJobPostForm.get('otherInfo')!.value;

    this.jobPostService.createJobPost(this.jobPostPayload).subscribe((data) => {
      this.router.navigate(['/jobposts'], { queryParams: { createdpost: 'true' } });
    }, error => {
      this.toastr.success('Error on creating job post!');
      throwError(error);
    });
  }

  discardPost() {
    this.router.navigateByUrl('/jobposts');
  }

}
