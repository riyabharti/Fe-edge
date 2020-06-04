import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

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

}
