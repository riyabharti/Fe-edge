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
}
