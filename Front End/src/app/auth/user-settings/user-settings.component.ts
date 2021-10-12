import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UpdateBioPayload } from 'src/app/update-bio/update-bio.payload';
import { UserModel } from 'src/app/user-service/user-model';
import { UserServiceService } from 'src/app/user-service/user-service.service';
import { AuthService } from '../shared/auth.service';
import { UpdateEmailPayload } from './change-email.payload';
import { ChangePasswordPayload } from './change-password.payload';
import { UpdateUsernamePayload } from './change-username.payload';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  fileUploaded: any;
  username!: string;
  email!: string;
  user!: UserModel;

  title = "cloudsSorage";
  selectedFile!: File;
  fb: any;
  downloadURL!: Observable<string>;
  lastUploadedImage: any;
  profilePicPayload!: UpdateBioPayload;

  usernameForm!: FormGroup;
  updateUsernamePayload!: UpdateUsernamePayload;
  emailForm!: FormGroup;
  updateEmailPayload!: UpdateEmailPayload;
  passwordForm!: FormGroup;
  changePasswordPayload!: ChangePasswordPayload;
  isSelected: string = "account-general";

  profilePics!: Map<string, string>;


  constructor(private storage: AngularFireStorage, private authService: AuthService, private httpClient: HttpClient, private userService: UserServiceService, private toastr: ToastrService) {

    this.userService.getUser().subscribe(data => {
      this.user = data;
    });


    this.profilePicPayload = {
      userName: '',
      workingExperience: '',
      education: '',
      skills: ''
    }
    this.updateUsernamePayload = {
      oldUserName: '',
      newUserName: ''
    }
    this.updateEmailPayload = {
      oldEmail: '',
      newEmail: ''
    }
    this.changePasswordPayload = {
      newPassword: ''
    }
  }

  ngOnInit(): void {
    this.authService.username.subscribe((data: string) => this.username = data);
    this.username = this.authService.getUserName();
    this.email = this.authService.getEmail();

    this.usernameForm = new FormGroup({
      user_name: new FormControl('', Validators.required)
    });

    this.emailForm = new FormGroup({
      email: new FormControl('', Validators.required)
    });
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      passwordValid: new FormControl('', Validators.required)
    });

    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
  }

  onFileChanged(event: any) {
    this.fileUploaded = event.target.files[0];
    this.toastr.info('Profile Photo Was Selected, Ready To Upload');
  }

  hasImage(): boolean {
    if (typeof (this.user) == 'undefined' || this.user.imageUrl == null) {
      return false;
    }
    return this.user.imageUrl.startsWith('https');
  }

  getImage() {
    return this.user.imageUrl;
  }

  onUpload() {
    var n = Date.now();
    const file = this.fileUploaded;
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
              this.profilePicPayload.skills = this.fb;
              this.profilePicPayload.userName = this.username;
              this.userService.updateProfilePic(this.profilePicPayload).subscribe((data) => {
                this.toastr.success('Profile Picture Changed Successfully');
                location.reload();
              }, error => {
                this.toastr.error('Profile Picture Upload Failed');
                throwError(error);
              });
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
          this.lastUploadedImage = url;
        }
      });

  }

  changeIsSelected(id: string) {
    this.isSelected = id;
    console.log(this.isSelected);
  }

  getUsername(){
    return this.user.username;
  }

  changeUsername() {
    this.updateUsernamePayload.oldUserName = this.username;
    this.updateUsernamePayload.newUserName = this.usernameForm.get('user_name')!.value;
    this.userService.updateUsername(this.updateUsernamePayload).subscribe((data) => {
      this.authService.setUserName(this.updateUsernamePayload.newUserName);
      this.toastr.success('Username Changed Successfully');
      this.usernameForm.reset();
      this.ngOnInit();
    }, error => {
      this.toastr.error('Username Already Taken');
      this.usernameForm.reset();
      throwError(error);
    });
  }

  getEmail() {
    return this.user.email;
  }

  changeEmail() {
    this.updateEmailPayload.oldEmail = this.email;
    this.updateEmailPayload.newEmail = this.emailForm.get('email')!.value;
    this.userService.updateEmail(this.updateEmailPayload).subscribe((data) => {
      this.toastr.success('Email Changed Successfullly');
      this.authService.setEmail(this.updateEmailPayload.newEmail);
      this.emailForm.reset();
      this.ngOnInit();
    }, error => {
      this.toastr.error('Email is already used by another user');
      this.emailForm.reset();
      throwError(error);
    });
  }

  changePassword() {
    if (this.passwordForm.get('password')!.value != this.passwordForm.get('passwordValid')!.value) {
      this.passwordForm.reset();
      this.toastr.error('The two passwords dont match. Try again!');
    } else {
      this.changePasswordPayload.newPassword = this.passwordForm.get('password')!.value;
      this.userService.changePassword(this.changePasswordPayload).subscribe((data) => {
        this.toastr.success('Password Changed Successfully');
        this.passwordForm.reset();
      }, error => {
        this.toastr.error('Password Change Failed');
        this.passwordForm.reset();
        throwError(error);
      });
    }
  }

}
