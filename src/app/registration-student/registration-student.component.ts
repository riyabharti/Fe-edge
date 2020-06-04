import { Component, OnInit } from '@angular/core';

import {User} from '../User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../services/user.service';

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
    password: false
  };
  checkEmail = [];
  checkUsername = [];
  temp = '';
  temp2 = '';
  deadline = '';
  photo: File = undefined;
  idcard: File = undefined;
  registration = false;

  constructor(private router: Router, private sB: MatSnackBar, private tS: Title, private userS: UserService)
  {
    tS.setTitle('E-Edge2020 | Register');
  }

  ngOnInit(): void {
  }

  register(e: any) {
    if (confirm('Sure to Register?')) {
      console.log(this.user);
      this.loading = true;
      this.userS.register(this.user, this.photo, this.idcard).subscribe(
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


  fileRead(e: FileList, type: boolean) {
    if (type) {
      this.photo = e.item(0);
    }
    else {
      this.idcard = e.item(0);
    }
  }

  compare() {
    if (this.temp2 != this.user.password && this.temp2 != '') {
      this.errors.password = true;
    }
    else {
      this.errors.password = false;
    }
  }

}
