import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, private router: Router) { }

  url = environment.apiURL + '/common';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && localStorage.getItem('admin') && localStorage.getItem('admin') === 'e-edge';
  }

  doLogout(): boolean {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    this.router.navigateByUrl('/');
    return true;
  }

  fetchEvents() {
    return this.http.get<any>(this.url + '/getAllEvents');
  }

  getSettings() {
    return this.http.get<any>(this.url + '/getSettings');
  }

  getCoupon() {
    return this.http.get<any>(this.url + '/getCoupon');
  }


}
