import { Component, OnInit } from '@angular/core';
import { User } from '../User';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData: User;
  eventReg: object = {};
  categoryDatas: [{
    '_id': '',
    'category': '',
    'description': '',
    'events': []
  }];

  total = 0;
  eventRegistered = false;

  constructor(
    private commonS: CommonService,
    private sB: MatSnackBar,
    private userS: UserService
  ) { }

  loading = true;
  newPassword: string;
  confirmNewPassword: string;

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.isEventRegister();
    this.commonS.fetchEvents().subscribe(
      result => {
        this.loading = false;
        if (result.status)
        {
          this.categoryDatas = result.data;
        }
        else
        {
          this.sB.open(result.message);
        }
      },
      problem => {
        this.loading = false;
        console.log(problem.error);
        this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
      }
    );
  }

  isAdmin(): boolean {
    return this.commonS.isLoggedIn();
  }

  eventRegistration(categoryId, event) {
    if (this.eventReg.hasOwnProperty(categoryId))
    {
      if (this.eventReg[categoryId].indexOf(event._id) === -1)
      {
        this.eventReg[categoryId] = [...this.eventReg[categoryId], event._id];
        this.total = this.total + event.fees;
      }
      else
      {
        this.eventReg[categoryId] = this.eventReg[categoryId].filter(
          (value, index, arr) => value !== event._id
        );
        this.total = this.total - event.fees;
      }
    }
    else
    {
      this.eventReg[categoryId] = [event._id];
      this.total += event.fees;
    }
  }

  eventPayment() {
    console.log(this.eventReg);
    if (this.total === 0)
    {
      this.sB.open('Select an event to register');
      return;
    }
    if (confirm('Sure For Payment?')) {
      this.loading = true;
      this.userS.eventRegister({total: this.total, registerEvents: this.eventReg}).subscribe(
        result => {
          if (result.status)
          {
            this.eventRegistered = true;
            this.loading = false;
            this.sB.open(result.message);
            delete result.user.admin;
            delete result.user.password;
            localStorage.setItem('user', JSON.stringify(result.user));
          }
          else
          {
            this.loading = false;
            this.sB.open(result.message);
          }
        },
        problem => {
          this.loading = false;
          console.log(problem.error);
          this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
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

}
