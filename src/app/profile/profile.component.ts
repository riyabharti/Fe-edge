import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  
  userData;
  receiptUrl = environment.apiURL + '/common/getFile/';

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.receiptUrl = environment.apiURL + '/common/getFile/' + this.userData._id + '/receipt.' + this.userData.receipt;
  }

}
