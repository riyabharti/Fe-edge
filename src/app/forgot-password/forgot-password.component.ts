import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private router: Router,
    private ts: Title,
    private commonS: CommonService,
    private formBuilder: FormBuilder
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
      this.firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this.formBuilder.group({
        secondCtrl: ''
      });
    }
  }

  sendOTP()
  {
    alert('OTP');
  }

}
