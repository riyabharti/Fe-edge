import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private commonS: CommonService,
              private sB: MatSnackBar,
              private title: Title,
              private userS: UserService
  ) { title.setTitle('E-Edge | Profile'); }

  loading = true;
  userData;
  receiptUrl = environment.apiURL + '/common/getFile/';
  categories = [];
  registeredEvents = [];
  temp2 = '';
  newPassword = '';
  oldPassword = '';
  errorPassword = false;
  changePassword = false;

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    if (this.userData.events) {
      this.categories = Object.keys(this.userData.events);
    }
    console.log(this.categories);

    if (this.categories.length) {
      this.getCategory(0);
    }
    else
    {
      this.loading = false;
    }
  }

  setDefaultValue() {
    this.temp2 = '';
    this.newPassword = '';
    this.oldPassword = '';
    this.errorPassword = false;
    this.changePassword = false;
  }

  getCategory(id: number) {
    this.commonS.getEvent(this.categories[id]).subscribe(
      result => {
        if (result.status)
        {
          let eventIds = this.userData.events[this.categories[id]];
          eventIds.forEach((e, i) => {
            eventIds[i] = eventIds[i].split('_')[0];
          });
          console.log(eventIds);
          const regEventIds = result.data.events.filter(e => {
            delete e.couponApplicable;
            if (!e.name.toLowerCase().includes('combo')) {
              delete e.description;
            }
            delete e.extra;
            delete e.extraMoney;
            delete e.fees;
            delete e.show;
            return eventIds.indexOf(e._id) != -1;
          });
          regEventIds.forEach(rei => {
            this.registeredEvents = [...this.registeredEvents, {
              category: result.data.category,
              name: rei.name + (rei.description ? ' (' + rei.description + ')' : '')
            }];
          });
          if (id < this.categories.length - 1) {
            this.getCategory(id + 1);
          }
          else {
            this.loading = false;
            console.log(this.registeredEvents);
            this.sB.open(result.message);
          }
        }
        else
        {
          this.loading = false;
          this.sB.open(result.message);
          console.log(this.registeredEvents);

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

  compare() {
    if (this.temp2 !== this.newPassword && this.temp2 !== '') {
      this.errorPassword = true;
    }
    else {
      this.errorPassword = false;
    }
  }

  changeUserPassword() {
    if (confirm('Are you sure to change password?'))
    {
      this.loading = true;
      this.userS.changePassword({id: this.userData._id, oldPassword: this.oldPassword, newPassword: this.newPassword}).subscribe(
        result => {
          if (result.status)
          {
            this.sB.open(result.message);
            this.setDefaultValue();
            this.loading = false;
          }
          else
          {
            this.sB.open(result.message + ' Try Again!');
            this.loading = false;
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

}
