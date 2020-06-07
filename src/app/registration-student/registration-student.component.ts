import { Component, OnInit } from '@angular/core';

import {User} from '../User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-registration-student',
  templateUrl: './registration-student.component.html',
  styleUrls: ['./registration-student.component.css']
})
export class RegistrationStudentComponent implements OnInit {

  loading = true;
  user = new User();
  errors = {
    email: false,
    password: false,
    contact: false
  };
  // stores previous registered emails
  checkEmail = [];
  checkContact = [];
  temp = '';
  temp2 = '';
  deadline = '';
  photo: File = undefined;
  registration = false;

  constructor(
    private router: Router,
    private sB: MatSnackBar,
    private tS: Title,
    private userS: UserService,
    private commonS: CommonService
  )
  {
    tS.setTitle('E-Edge2020 | Register');
  }

  ngOnInit(): void {
    if (this.commonS.isLoggedIn()) {
      this.loading = false;
      this.router.navigateByUrl('account');
    }
    else{
      this.userS.fetchEmailsContacts().subscribe(
        result => {
          this.loading = false;
          if (result.status) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < result.user.length; i++)
            {
              this.checkEmail.push(result.user[i].email);
              this.checkContact.push(result.user[i].contact);
            }
          }
          else {
            this.sB.open(result.message);
          }
        },
        problem => {
          this.loading = false;
          console.log(problem.error);
          this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message + ' | Try reloading the page.');
          this.router.navigateByUrl('/home');
        }
      );
    }
  }

  register(e: any) {
    if (confirm('Sure to Register?')) {
      console.log(this.user);
      this.loading = true;
      this.userS.register(this.user, this.photo).subscribe(
        result => {
          this.loading = false;
          if (result.status) {
            e.reset();
            this.router.navigateByUrl('/home');
          }
          this.sB.open(result.message);
        },
        problem => {
          this.loading = false;
          console.log(problem.error);
          this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
        }
      );
    }
  }


  fileRead(e: FileList) {
    const temp: File = e.item(0);
    if (temp && temp.type.split('/')[1] !== 'jpg' && temp.type.split('/')[1] !== 'jpeg' && temp.type.split('/')[1] !== 'png')
    {
      this.sB.open('Sorry, only .jpg, .jpeg and .png extension is allowed');
      this.photo = null;
    }
    else
    {
      this.photo = temp;
    }
  }

  compare() {
    if (this.temp2 !== this.user.password && this.temp2 !== '') {
      this.errors.password = true;
    }
    else {
      this.errors.password = false;
    }
  }

  isEmailRedundant() {
    this.errors.email = this.checkEmail.indexOf(this.user.email) !== -1;
  }

  isContactRedundant() {
    this.errors.contact = this.checkContact.indexOf(this.user.contact) !== -1;
  }

}
