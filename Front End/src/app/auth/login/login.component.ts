import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { LoginRequestPayload } from './login-request.payload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginRequestPayload!: LoginRequestPayload;
  registerSuccessMessage!: string;
  isError!: boolean;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    this.loginRequestPayload = {
      email: '',
      password: ''
    };
  }

  ngOnInit(): void{
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = '';
        }
      });
  }


  login() {
    this.loginRequestPayload.email = this.loginForm.get('email')!.value;
    this.loginRequestPayload.password = this.loginForm.get('password')!.value;

    this.authService.login(this.loginRequestPayload).subscribe(data => {
      this.isError = false;
      this.router.navigate([''], { queryParams: { loggedin: 'true' } }).then(() => {
        window.location.reload();
      })
      this.toastr.success('Login Successful');
    }, error => {
      this.isError = true;
      this.toastr.error('Login Failed');
      throwError(error);
    });
  }

}
