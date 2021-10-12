import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/shared/auth.service';
import { UserServiceService } from '../user-service/user-service.service';
import { UpdateBioPayload } from './update-bio.payload';
import {UserModel} from "../user-service/user-model";

@Component({
  selector: 'app-update-bio',
  templateUrl: './update-bio.component.html',
  styleUrls: ['./update-bio.component.css']
})
export class UpdateBioComponent implements OnInit {

  workingExperienceForm!: FormGroup;
  workingExperiencePayload!: UpdateBioPayload;
  educationForm!: FormGroup;
  educationPayload!: UpdateBioPayload;
  skillsForm!: FormGroup;
  skillsPayload!: UpdateBioPayload;
  username!: string;
  currentUser!: UserModel;
  isSelected: string = "personal-info";

  constructor(private router: Router, private userService: UserServiceService, private toastr: ToastrService, private authService: AuthService) {
    this.workingExperiencePayload = {
      userName: '',
      workingExperience: '',
      education: '',
      skills: ''
    }
    this.educationPayload = {
      userName: '',
      workingExperience: '',
      education: '',
      skills: ''
    }
    this.skillsPayload = {
      userName: '',
      workingExperience: '',
      education: '',
      skills: ''
    }
  }

  ngOnInit(): void {
    this.workingExperienceForm = new FormGroup({
      workingExperience: new FormControl('', Validators.required),
    });
    this.educationForm = new FormGroup({
      education: new FormControl('', Validators.required),
    });
    this.skillsForm = new FormGroup({
      skills: new FormControl('', Validators.required),
    });
    this.authService.username.subscribe((data: string) => this.username = data);
    this.username = this.authService.getUserName();

    this.userService.getUser().subscribe(data => {
      this.currentUser = data;
    });

  }


  updateWorkingExperience(){
    if(this.workingExperienceForm.get('workingExperience')!.value=='' || this.workingExperienceForm.get('workingExperience')!.value==null){
      return;
    }
    this.workingExperiencePayload.workingExperience = this.workingExperienceForm.get('workingExperience')!.value;
    this.workingExperiencePayload.userName = this.username;
    this.userService.updateWorkingExperience(this.workingExperiencePayload).subscribe((data) => {
      this.toastr.success('Working Experience Changed Successfully');
      this.workingExperienceForm.reset();
      this.ngOnInit();

    }, error => {
      this.toastr.error('Working Experience Change Failed');
      throwError(error);
    });
  }

  discardWorkingExperience(){
    this.workingExperienceForm.reset();
  }

  updateEducation(){
    if(this.educationForm.get('education')!.value=='' || this.educationForm.get('education')!.value==null){
      return;
    }
    this.educationPayload.education = this.educationForm.get('education')!.value;
    this.educationPayload.userName = this.username;
    this.userService.updateEducation(this.educationPayload).subscribe((data) => {
      this.toastr.success('Education Changed Successfully');
      this.educationForm.reset();
      this.ngOnInit();
    }, error => {
      this.toastr.error('Education Change Failed');
      throwError(error);
    });
  }

  discardEducation(){
    this.educationForm.reset();
  }

  updateSkills(){
    if(this.skillsForm.get('skills')!.value=='' || this.skillsForm.get('skills')!.value==null){
      return;
    }
    this.skillsPayload.skills = this.skillsForm.get('skills')!.value;
    this.skillsPayload.userName = this.username;
    this.userService.updateSkills(this.skillsPayload).subscribe((data) => {
      this.toastr.success('Skills Changed Successfully');
      this.skillsForm.reset();
      this.ngOnInit();

    }, error => {
      this.toastr.error('Skills Change Failed');
      throwError(error);
    });
  }

  discardSkills(){
    this.skillsForm.reset();
  }

  changeWePrivacy(){
    this.userService.setWorkingExperiencePrivacy(!this.currentUser.publicWorkingExperience).subscribe((data) => {
      this.toastr.success('Working Experience Privacy Changed Successfully');
      this.currentUser.publicWorkingExperience=!this.currentUser.publicWorkingExperience;
    }, error => {
      this.toastr.error('Working Experience Privacy Change Failed');
      throwError(error);
    });
  }

  changeEducationPrivacy(){
    this.userService.setEducationPrivacy(!this.currentUser.publicEducation).subscribe((data) => {
      this.toastr.success('Education Privacy Changed Successfully');
      this.currentUser.publicEducation = !this.currentUser.publicEducation;
    }, error => {
      this.toastr.error('Education Privacy Change Failed');
      throwError(error);
    });
  }

  changeSkillsPrivacy(){
    this.userService.setSkillsPrivacy(!this.currentUser.publicSkills).subscribe((data) => {
      this.toastr.success('Skills Privacy Changed Successfully');
      this.currentUser.publicSkills=!this.currentUser.publicSkills;
    }, error => {
      this.toastr.error('Skills Privacy Change Failed');
      throwError(error);
    });
  }

  changeIsSelected(id: string) {
    this.isSelected = id;
    console.log(this.isSelected);
  }

  getWe(){
    return this.currentUser.workingExperience ?? "";
  }

  getEducation(){
    return this.currentUser.education ?? "";
  }

  getSkills(){
    return this.currentUser.skills ?? "";
  }

  wePublic(){
    return this.currentUser.publicWorkingExperience;
  }
  
  skillsPublic(){
    return this.currentUser.publicSkills;
  }
  educationPublic(){
    return this.currentUser.publicEducation;
  }

  getDefault(privacy: boolean){
    if(privacy){
      return 'Public';
    }else{
      return 'Private';
    }
  }

  getDropdown(privacy: boolean){
    if(!privacy){
      return 'Public';
    }else{
      return 'Private';
    }
  }


  
}
