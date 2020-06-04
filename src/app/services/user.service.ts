import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {User} from '../User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL + '/users';

  register(data: User, photo: File, idcard: File) {
    // const formData = new FormData();
    // formData.append('files[]', photo, photo.name);
    // formData.append('files[]', idcard, idcard.name);
    // const keys = Object.keys(data);
    // keys.forEach(key => {
    //   formData.append(key, data[key]);
    // });
    return this.http.post<any>(this.url + '/register', data);
  }

  login(user: {username, password}) {
    return this.http.post<any>(this.url + '/login', user);
  }

  fetchEmails() {
    return this.http.get<any>(this.url + '/fetchEmails');
  }

}
