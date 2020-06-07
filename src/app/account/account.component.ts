import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData;
  eventReg: object = {};
  categoryDatas: [{
    '_id': '',
    'category': '',
    'description': '',
    'events': [{
      '_id': '',
      'name': '',
      'fees': 0,
      'description': '',
      'couponApplicable': boolean
    }]
  }];

  temp = 0;
  totalC = 0;
  totalO = 0;
  eventRegistered = false;

  constructor(
    private commonS: CommonService,
    private sB: MatSnackBar,
    private userS: UserService
  ) { }

  loading = true;
  couponApplied = false;
  newPassword: string;
  confirmNewPassword: string;
  cCode = '';
  coupon = {
    couponCode: '',
    discountValue: 0,
    email: ''
  };
  paymentReceipt: File = undefined;
  baseUrl = environment.apiURL + '/common/getFile/';

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.baseUrl += this.userData._id + '/';
    this.isEventRegister();
    this.commonS.fetchEvents().subscribe(
      result => {
        if (result.status)
        {
          this.categoryDatas = result.data;
          // this.loading = false;
          this.commonS.getCoupon().subscribe(
            couponResult => {
              if (couponResult.status)
              {
                if(couponResult.coupon != null)
                  this.coupon = couponResult.coupon;
                console.log(this.coupon)
                this.loading = false;
              }
              else
              {
                this.sB.open(result.message);
                this.loading = false;
              }
            },
            couponProblem => {
              this.loading = false;
              if (couponProblem.error.error && couponProblem.error.error.message && couponProblem.error.error.message === 'jwt expired') {
                this.sB.open('Your session has expired !!! Please log in again :)');
                this.commonS.doLogout();
              }
              else {
                console.log(couponProblem.error);
                this.sB.open(couponProblem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : couponProblem.error.message);
              }
            }
          );
        }
        else
        {
          this.loading = false;
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

  isAdmin(): boolean {
    return this.commonS.isLoggedIn();
  }

  apply() {
    if (this.coupon.couponCode === this.cCode) {
      if (this.totalC > this.coupon.discountValue) {
        this.totalC -= this.coupon.discountValue;
        this.temp = this.coupon.discountValue;
      }
      else {
        this.temp = this.totalC;
        this.totalC = 0;
      }
    } else {
      this.sB.open('Invalid Coupon Code!');
    }
    this.couponApplied = true;
  }

  remove() {
    this.totalC += this.temp;
    this.temp = 0;
    this.cCode = '';
    this.couponApplied = false;
  }

  eventRegistration(categoryId, event) {
    if (this.eventReg.hasOwnProperty(categoryId))
    {
      if (this.eventReg[categoryId].indexOf(event._id) === -1)
      {
        this.eventReg[categoryId] = [...this.eventReg[categoryId], event._id];
        if (event.couponApplicable) {
          this.totalC += event.fees;
        }
        else {
          this.totalO += event.fees;
        }
      }
      else
      {
        this.eventReg[categoryId] = this.eventReg[categoryId].filter(
          (value, index, arr) => value !== event._id
        );
        if (event.couponApplicable) {
          this.totalC -= event.fees;
        }
        else {
          this.totalO -= event.fees;
        }
      }
    }
    else
    {
      this.eventReg[categoryId] = [event._id];
      if (event.couponApplicable) {
        this.totalC += event.fees;
      }
      else {
        this.totalO += event.fees;
      }
    }
    if(this.totalC < 0) {
      this.temp += this.totalC;
      this.totalC = 0;
    }
    if(this.totalC + this.temp > this.coupon.discountValue && this.couponApplied) {
      let d = this.coupon.discountValue - this.temp;
      this.temp += d;
      this.totalC -= d;
    }
    if (this.totalC < 0 && this.temp == 0) {
      this.remove();
    }
  }

  eventPayment() {
    console.log(this.eventReg);
    if (confirm('Sure For Payment?')) {
      this.loading = true;
      this.userS.eventRegister({total: this.totalC + this.totalO, registerEvents: JSON.stringify(this.eventReg)}, this.paymentReceipt).subscribe(
        result => {
          if (result.status)
          {
            this.loading = false;
            this.sB.open(result.message);
            delete result.user.admin;
            delete result.user.password;
            localStorage.setItem('user', JSON.stringify(result.user));
            this.ngOnInit();
          }
          else
          {
            this.loading = false;
            this.sB.open(result.message);
            console.log(result.error);
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

  isEventRegister() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.total > 0)
    {
      this.eventRegistered = true;
    }
    else
    {
      this.eventRegistered = false;
    }
  }

  fileRead(e: FileList)
  {
    const temp: File = e.item(0);
    if (
      temp &&
      temp.type.split('/')[1] !== 'jpg' &&
      temp.type.split('/')[1] !== 'jpeg' &&
      temp.type.split('/')[1] !== 'png' &&
      (temp.type.split('/')[1] !== 'pdf'
    ))
    {
      this.sB.open('Sorry, only image .jpg, .jpeg ,.png and .pdf extension is allowed');
      this.paymentReceipt = null;
    }
    else
    {
      this.paymentReceipt = temp;
    }
  }

}
