import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userS: UserService,
    private sB: MatSnackBar,
    private router: Router,
    private tS: Title,
    private commonS: CommonService
  )
  {
    tS.setTitle('E-Edge | Home');
  }


  username: string;
  password: string;
  loading = true;
  registration = false;
  settings = {
    title: 'Cannot Fetch Title',
    description: 'Cannot Fetch Description',
    startTime: 'Cannot Fetch start time',
    endTime: 'Cannot Fetch end time',
    registration_ends: '',
    banner: ''
  };

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.commonS.doLogout();
      this.loading = false;
      // this.router.navigateByUrl('events');
    }
    else{
      this.loading = false;
    }
  }

  login(e: any) {
    this.loading = true;
    this.userS.login({ username: this.username, password: this.password }).subscribe(
      result => {
        this.loading = false;
        if (result.status) {
          this.sB.open('Login Successfull !!!');
          e.reset();
          localStorage.setItem('token', result.token);
          if (result.user.admin) {
            localStorage.setItem('admin', 'e-edge');
          }
          delete result.user.admin;
          delete result.user.password;
          localStorage.setItem('user', JSON.stringify(result.user));
          this.router.navigateByUrl('mysubmission');
        }
        else {
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
