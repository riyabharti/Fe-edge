import { Component } from '@angular/core';
import { CommonService } from './services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fe-edge';
  userdata;

  constructor(private commonS: CommonService, private router: Router) {}

  isAdmin(): boolean {
    return this.commonS.isAdmin();
  }

  isLogin(): boolean {
    if (this.commonS.isLoggedIn()) {
      this.userdata = JSON.parse(localStorage.getItem('user'));
      return true;
    }
    return false;
  }

  logOut() {
    if (this.commonS.doLogout()) {
      this.navigator('home');
    }
  }

  navigator(url: string) {
    this.router.navigateByUrl('/' + url);
  }

}
