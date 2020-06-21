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

  getEvent(id: string) {
    return this.http.get<any>(this.url + '/getCategory/' + id);
  }

  getAllQueries() {
    return this.http.get<any>(this.url + '/getAllQueries');
  }

  addMessageQuery(messageData: {categoryName, message})
  {
    return this.http.post<any>(this.url + '/addMessage', messageData);
  }

  deleteMessageQuery(messageData: {categoryName, index, msg})
  {
    return this.http.post<any>(this.url + '/deleteMessage', messageData);
  }

  loadMoreMessages(id: string, lotNumber: number) {
    return this.http.get<any>(this.url + '/getQuery/' + id + '/' + lotNumber);
  }
}
