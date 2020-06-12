import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
      'couponApplicable': boolean,
      'extra': boolean,
      'extraMoney': number
      'extraAmount': number,
      'show': boolean,
      'visible': boolean
    }]
  }];

  temp = 0;
  totalC = 0;
  totalO = 0;
  eventRegistered = false;

  constructor(
    private commonS: CommonService,
    private sB: MatSnackBar,
    private userS: UserService,
    private title: Title,
    public dialog: MatDialog
  ) { title.setTitle('E-Edge | Account'); }

  loading = true;
  couponApplied = false;
  couponApplicable = 0;
  newPassword: string;
  confirmNewPassword: string;
  cCode = '';
  upiId: number;
  coupon = {
    couponCode: '',
    discountValue: 0,
    email: ''
  };
  paymentReceipt: File = undefined;
  photoUrl = environment.apiURL + '/common/getFile/';
  receiptUrl = environment.apiURL + '/common/getFile/';

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.photoUrl = environment.apiURL + '/common/getFile/' + this.userData._id + '/photo.' + this.userData.photo;
    this.receiptUrl = environment.apiURL + '/common/getFile/' + this.userData._id + '/receipt.' + this.userData.receipt;
    if (!this.isEventRegister())
    {
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
                  if (couponResult.coupon != null) {
                    this.coupon = couponResult.coupon;
                  }
                  console.log(this.coupon);
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
    else
    {
      this.loading = false;
    }
  }

  isAdmin(): boolean {
    return this.commonS.isLoggedIn();
  }

  apply() {
    if (this.coupon.couponCode.toLocaleLowerCase() === this.cCode.toLocaleLowerCase()) {
      this.cCode = this.coupon.couponCode;
      this.workOnCoupon();
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
    if (event.visible === true)
    {
      event.extraAmount = 0;
    }
    event.visible = !event.visible;
    let addedextraAmount = 0;
    if (this.eventReg.hasOwnProperty(categoryId))
    {
      if ( this.eventReg[categoryId].find(e => e.split('_')[0] === event._id) === undefined)
      {
        if (event.fees >= this.coupon.discountValue && event.couponApplicable) {
          this.couponApplicable++;
        }
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
        if (event.fees >= this.coupon.discountValue && event.couponApplicable) {
          this.couponApplicable--;
          if(this.couponApplied)
            this.remove();
        }
        this.eventReg[categoryId] = this.eventReg[categoryId].filter(
          (value, index, arr) =>
          {
            if (value.split('_')[0] !== event._id)
            {
              return value;
            }
            else
            {
              addedextraAmount = value.split('_')[1];
              if (addedextraAmount === undefined)
              {
                addedextraAmount = 0;
              }
            }
          }
        );
        if (event.couponApplicable) {
          this.totalC = this.totalC - event.fees - addedextraAmount * event.extraMoney ;
        }
        else {
          this.totalO = this.totalO - event.fees - addedextraAmount * event.extraMoney;
        }
      }
    }
    else
    {
      if (event.fees >= this.coupon.discountValue && event.couponApplicable) {
        this.couponApplicable++;
      }
      this.eventReg[categoryId] = [event._id];
      if (event.couponApplicable) {
        this.totalC += event.fees;
      }
      else {
        this.totalO += event.fees;
      }
    }
    if (this.couponApplied) {
      this.workOnCoupon();
    }
  }

  addAmount(categoryId, event) {
    let addedextraAmount = 0;
    this.eventReg[categoryId].forEach((value, index) => {
      if (value.split('_')[0] === event._id)
      {
        addedextraAmount = value.split('_')[1];
        if (addedextraAmount === undefined)
        {
          addedextraAmount = 0;
        }
        if (event.extraAmount === null)
        {
          event.extraAmount = 0;
        }
        this.eventReg[categoryId][index] = event._id + '_' + event.extraAmount;
      }
    });
    if (event.couponApplicable)
    {
      this.totalC += (event.extraAmount - addedextraAmount) * event.extraMoney;
    }
    else
    {
      this.totalO += (event.extraAmount - addedextraAmount) * event.extraMoney;
    }
  }

  workOnCoupon() {
    switch (this.temp) {
      case 0:
        this.temp += (this.couponApplicable >= 2 ? 2 : this.couponApplicable ) * this.coupon.discountValue;
        this.totalC -= this.temp;
        break;
      case this.coupon.discountValue:
        if (this.couponApplicable >= 2) {
          this.temp += this.coupon.discountValue;
          this.totalC -= this.coupon.discountValue;
        }
        if (this.couponApplicable === 0) {
          this.totalC += this.temp;
          this.temp = 0;
        }
        break;
      case this.coupon.discountValue * 2:
        if (this.couponApplicable === 0) {
          this.totalC += this.temp;
          this.temp = 0;
        }
        if (this.couponApplicable === 1) {
          this.totalC += this.coupon.discountValue;
          this.temp -= this.coupon.discountValue;
        }
        break;
    }
  }

  checkAlphabet(e) {
    if (isNaN(this.upiId))
    {
      alert('Enter the 12 digit UPI Transaction ID/UTR');
      this.upiId = null;
    }
  }

  eventPayment() {
    console.log(this.eventReg);
    if (confirm('Sure For Payment?')) {
      this.loading = true;
      this.userS.eventRegister({
        total: this.totalC + this.totalO,
        couponApplied: this.couponApplied,
        registerEvents: JSON.stringify(this.eventReg),
        upiId: this.upiId
      },
      this.paymentReceipt).subscribe(
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
      return true;
    }
    else
    {
      this.eventRegistered = false;
      return false;
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

  openDialog() {
    this.dialog.open(PaymentDialogComponent, {
      width: '500px',
    });
  }

}
