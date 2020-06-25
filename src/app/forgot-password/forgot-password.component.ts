import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  password1 = '';
  password2 = '';
  otpEntered = '';
  otpGenerated = '';
  loading = false;
  otpSent = false;
  validOTP = false;

  constructor(
    private router: Router,
    private ts: Title,
    private commonS: CommonService,
    private formBuilder: FormBuilder,
    private userS: UserService,
    private sB: MatSnackBar
  )
  {
    ts.setTitle('E-Edge2020 | Forgot Password');
  }

  ngOnInit(): void {
    if (this.commonS.isLoggedIn())
    {
      this.router.navigateByUrl('profile');
    }
    else
    {
      this.setDefault();
    }
  }

  setDefault()
  {
    this.email = '';
    this.otpEntered = '';
    this.otpSent = false;
    this.otpGenerated = '';
    this.validOTP = false;
    this.loading = false;
  }

  sendOTP(stepper: MatStepper)
  {
    console.log(stepper);
    // stepper.steps._results[0].completed =true
    if ( this.email !== '')
    {
      this.loading = true;
      this.userS.sendOTP(this.email).subscribe(
        result => {
          if (result.status)
          {
            this.otpSent = true;
            stepper.next(); // Not Working
            this.loading = false;
            this.otpGenerated = result.secret;
            this.sB.open(result.message);
          }
          else
          {
            this.loading = false;
            console.log(result);
            this.sB.open(result.message);
          }
        },
        problem => {
          this.loading = false;
          if (problem.error.error && problem.error.error.message && problem.error.error.message === 'jwt expired') {
            this.sB.open('Your session has expired !!! Please log in again :)');
            this.commonS.doLogout();
          }
          else {
            console.log(problem.error);
            this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
          }
        }
    );
    }
  }

  validateOTP()
  {
    if (this.otpEntered === this.otpGenerated)
    {
      this.validOTP = true;
      this.sB.open('OTP validated!');
      return;
    }
    else
    {
      this.validOTP = false;
      this.sB.open('Invalid OTP!!!');
      this.otpEntered = '';
    }
  }

  resetPassword()
  {
    this.loading = true;
    this.userS.resetPassword({email: this.email, otp: this.otpEntered,password: this.password1}).subscribe(
      result => {
        if (result.status)
        {
          this.loading = false;
          this.sB.open(result.message);
          this.router.navigateByUrl('home');
        }
        else
        {
          this.loading = false;
          this.sB.open(result.message);
          this.setDefault();
        }
      },
      problem => {
        this.loading = false;
        if (problem.error.error && problem.error.error.message && problem.error.error.message === 'jwt expired') {
          this.sB.open('Your session has expired !!! Please log in again :)');
          this.commonS.doLogout();
        }
        else {
          console.log(problem.error);
          this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
        }
      }
    );
  }

}
