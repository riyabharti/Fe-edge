import { Component, OnInit } from '@angular/core';
import { User } from '../User';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData: User;

  constructor(private commonS: CommonService) { }

  loading = true;
  newPassword: string;
  confirmNewPassword: string;

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log(this.userData);
    this.loading = false;
  }

  isAdmin(): boolean {
    return this.commonS.isLoggedIn();
  }

}
