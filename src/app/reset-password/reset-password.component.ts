import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private adminS: AdminService,
    private title: Title,
    private sB: MatSnackBar,
    private commonS: CommonService
  ) {title.setTitle('E-Edge | Reset Password'); }

  loading = true;
  usersData;
  id = '';
  selectedUser = undefined;
  newPassword: string;
  confirmNewPassword: string;
  userData;

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.getUsers();
  }

  getUsers() {
    this.adminS.fetchUsers(0).subscribe(
      result => {
        if (result.status) {
          this.usersData = result.users;
          this.usersData.sort((u1, u2) => {
            return u1.name.localeCompare(u2.name);
          });
          this.usersData.forEach(async (userr) => {
            delete userr.password;
            delete userr.admin;
            delete userr.createdAt;
            delete userr.updatedAt;
          });
        }
        else {
          this.sB.open(result.message);
        }
        this.loading = false;
      },
      problem => {
        this.loading = false;
        if (problem.error.error && problem.error.error.message && problem.error.error.message == 'jwt expired') {
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

  searchUser() {
    this.selectedUser = this.usersData.find(user => {
      return user._id === this.id;
    });
  }

  resetPassword(e: any) {
    if (confirm('Sure to Reset password for the user with Name ' + this.selectedUser.name))
    {
      this.loading = true;
      this.adminS.resetPassword({ id: this.id, password: this.newPassword }).subscribe(
        result => {
          this.loading = false;
          this.sB.open(`${result.message}`);
          this.newPassword = '';
          this.confirmNewPassword = '';
          e.reset();
        },
        problem => {
          this.loading = false;
          e.reset();
          if (problem.error.error && problem.error.error.message && problem.error.error.message == 'jwt expired') {
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
