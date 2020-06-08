import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL + '/admin';

  fetchUsers()
  {
    return this.http.get<any>(this.url + '/fetchUsers');
  }

  addCategory(categoryData: {category, description})
  {
    return this.http.post<any>(this.url + '/addCategory', categoryData);
  }

  addEvent(categoryEventData)
  {
    return this.http.post<any>(this.url + '/addEvent', categoryEventData);
  }

  deleteCategory(categoryData: {category})
  {
    return this.http.post<any>(this.url + '/deleteCategory', categoryData);
  }

  deleteEvent(eventData: {category, eventName, index})
  {
    return this.http.post<any>(this.url + '/deleteEvent', eventData);
  }

  deleteUser(uid: string) {
    return this.http.get<any>(this.url + '/deleteUser/' + uid);
  }

  resetPassword(user: {id, password})
  {
    return this.http.post<any>(this.url + '/resetPassword', user);
  }

  verifyUser(uid: string)
  {
    return this.http.get<any>(this.url + '/verifyUser/' + uid);
  }
}
