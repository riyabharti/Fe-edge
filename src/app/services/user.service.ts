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

  register(data: User) {
    return this.http.post<any>(this.url + '/register', data);
  }

  login(user: {email, password}) {
    return this.http.post<any>(this.url + '/login', user);
  }

  fetchEmailsContacts() {
    return this.http.get<any>(this.url + '/fetchEmailsContacts');
  }

  eventRegister(event: {total: number, couponApplied: boolean, registerEvents: string} , paymentReceipt: File) {
    const formData = new FormData();
    formData.append('file', paymentReceipt, paymentReceipt.name);
    const keys = Object.keys(event);
    keys.forEach(key => {
      formData.append(key, event[key]);
    });
    return this.http.post<any>(this.url + '/eventRegister', formData);
  }


}
