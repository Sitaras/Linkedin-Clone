import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup-request.payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  signupRequestPayload: SignupRequestPayload;

  retrievedImage: any;  
  base64Data: any;  
  retrieveResonse: any;  
  message!: string;  
  imageName: any;  

  tempEmail!: string;

  title = "cloudsSorage";
  selectedFile!: File;
  fb: any;
  downloadURL!: Observable<string>;
  lastUploadedImage: any;


  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private httpClient: HttpClient,
    private storage: AngularFireStorage) {

    this.signupRequestPayload = {
      username: '',
      email: '',
      password: '',
      passwordValid: '',
      name: '',
      surname: '',
      phone: '',
      imageUrl: ''
    };
   }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('',Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',Validators.required),
      passwordValid: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required)
    });
  }

  signup() {

    this.signupRequestPayload.username = this.signupForm.get('username')!.value;
    this.signupRequestPayload.email = this.signupForm.get('email')!.value;
    this.tempEmail = this.signupForm.get('email')!.value;
    this.signupRequestPayload.password = this.signupForm.get('password')!.value;
    this.signupRequestPayload.passwordValid = this.signupForm.get('passwordValid')!.value;
    this.signupRequestPayload.name = this.signupForm.get('name')!.value;
    this.signupRequestPayload.surname = this.signupForm.get('surname')!.value;
    this.signupRequestPayload.phone = this.signupForm.get('phone')!.value;
    this.signupRequestPayload.imageUrl = this.fb;
    this.fb = 'NoImage';
    this.authService.signup(this.signupRequestPayload).subscribe(() => {
      this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
    }, () => {
      this.toastr.error('Registration Failed! Please try again');
    });
  }


  onFileChanged(event: any) {
    this.toastr.warning('Wait for the image to upload before signup!');
    var n = Date.now();
    const file = event.target.files[0];

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
              this.toastr.success('Image was uploaded, ready to signup!');
              this.fb = url;
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


}

