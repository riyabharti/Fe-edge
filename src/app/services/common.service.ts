import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  eventUrl = environment.apiURL + '/events';
  commonUrl = environment.apiURL + '/common';

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
    return true;
  }

  fetchEvents() {
    return this.http.get<any>(this.eventUrl);
  }

  getSettings() {
    return this.http.get<any>(this.commonUrl + '/getSettings');
  }

}
