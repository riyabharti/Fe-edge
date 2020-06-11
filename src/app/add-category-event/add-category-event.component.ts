import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../services/admin.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-category-event',
  templateUrl: './add-category-event.component.html',
  styleUrls: ['./add-category-event.component.css']
})
export class AddCategoryEventComponent implements OnInit {

  categoryDatas: [{
    '_id': '',
    'category': '',
    'description': '',
    'events': [{
      '_id': '',
      'name': '',
      'fees': 0,
      'description': '',
      'couponApplicable': boolean,
      'extra': boolean,
      'extraMoney': number
    }]
  }];
  newEventName = '';
  newEventDescription = '';
  newEventFees = 0;
  newEventCoupon = false;
  newEventExtra = false;
  newEventExtraMoney = 0;
  errors = {
    event: false,
    category: false
  };

  categoryName = '';
  categoryDescription = '';
  categoryId = -1;

  constructor(
    private commonS: CommonService,
    private sB: MatSnackBar,
    private adminS: AdminService,
    private title: Title
  ) { title.setTitle('E-Edge | Add Events')}

  loading = true;
  eventLoading = true;

  ngOnInit(): void {
    this.changeToDefault();
    this.getCategories();
  }

  changeToDefault()
  {
    this.newEventName = '';
    this.newEventDescription = '';
    this.newEventFees = 0;
    this.newEventCoupon = false;
    this.newEventExtra = false;
    this.newEventExtraMoney = 0;
    this.categoryName = '';
    this.categoryDescription = '';
    this.categoryId = -1;
  }

  getCategories() {
    this.commonS.fetchEvents().subscribe(
      result => {
        if (result.status)
        {
          this.categoryDatas = result.data;
          this.loading = false;
        }
        else
        {
          this.sB.open(result.message);
          this.loading = false;
        }
      },
      problem => {
        this.loading = false;
        if (problem.error.error && problem.error.error.message && problem.error.error.message === 'jwt expired')
        {
          this.sB.open('Your session has expired !!! Please log in again :)');
          this.commonS.doLogout();
        }
        else {
          console.log(problem.error);
          this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
        }
      }
    );
  }

  selectCategory(i)
  {
    if (this.categoryId === i)
    {
      this.categoryId = -1;
    }
    else
    {
      this.categoryId = i;
    }
  }

  deleteEvent(event, eIndex)
  {
    if (confirm('Sure For Deleting Event ' + event.name))
    {
      this.loading = true;
      this.adminS.deleteEvent({category: this.categoryDatas[this.categoryId].category, eventName: event.name, index: eIndex}).subscribe(
        result => {
          if (result.status)
          {
            this.loading = false;
            this.sB.open(result.message);
            this.ngOnInit();
          }
          else
          {
            this.loading = false;
            this.sB.open(result.message);
            this.categoryId = -1;
          }
        },
        problem => {
          this.loading = false;
          if (problem.error.error && problem.error.error.message && problem.error.error.message === 'jwt expired') {
            this.sB.open('Your session has expired !!! Please log in again :)');
            this.commonS.doLogout();
          }
          else {
            console.log(problem.error);
            this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
          }
        }
      );
    }
  }

  deleteCategory(cIndex)
  {
    if (confirm('Sure For Deleting Category ' + this.categoryDatas[cIndex].category))
    {
      this.loading = true;
      this.adminS.deleteCategory({category: this.categoryDatas[cIndex].category}).subscribe(
        result => {
          if (result.status)
          {
            this.loading = false;
            this.sB.open(result.message);
            this.ngOnInit();
          }
          else
          {
            this.loading = false;
            this.sB.open(result.message);
            this.categoryId = -1;
          }
        },
        problem => {
          this.loading = false;
          if (problem.error.error && problem.error.error.message && problem.error.error.message === 'jwt expired') {
            this.sB.open('Your session has expired !!! Please log in again :)');
            this.commonS.doLogout();
          }
          else {
            console.log(problem.error);
            this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
          }
        }
      );
    }
  }

  addEvent()
  {
    if (confirm('Sure For Additing Event?'))
    {
      this.loading = true;
      this.adminS.addEvent({category: this.categoryDatas[this.categoryId].category, events: [{
        name: this.newEventName,
        description: this.newEventDescription,
        fees: this.newEventFees,
        couponApplicable: this.newEventCoupon,
        extra: this.newEventExtra,
        extraMoney: this.newEventExtraMoney
      }]}).subscribe(
        result => {
          if (result.status)
          {
            this.loading = false;
            this.sB.open(result.message);
            this.ngOnInit();
          }
          else
          {
            this.loading = false;
            this.sB.open(result.message);
            this.categoryId = -1;
          }
        },
        problem => {
          this.loading = false;
          if (problem.error.error && problem.error.error.message && problem.error.error.message === 'jwt expired') {
            this.sB.open('Your session has expired !!! Please log in again :)');
            this.commonS.doLogout();
          }
          else {
            console.log(problem.error);
            this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
          }
        }
      );
    }
  }

  addCategory()
  {
    console.log(this.categoryName, this.categoryDescription);
    if (confirm('Sure For Adding Category?'))
    {
      this.loading = true;
      this.adminS.addCategory({category: this.categoryName, description: this.categoryDescription}).subscribe(
        result => {
          if (result.status)
          {
            this.loading = false;
            this.sB.open(result.message);
            this.ngOnInit();
          }
          else
          {
            this.loading = false;
            this.sB.open(result.message);
            this.categoryId = -1;
          }
        },
        problem => {
          this.loading = false;
          if (problem.error.error && problem.error.error.message && problem.error.error.message === 'jwt expired') {
            this.sB.open('Your session has expired !!! Please log in again :)');
            this.commonS.doLogout();
          }
          else {
            console.log(problem.error);
            this.sB.open(problem.error instanceof ProgressEvent ? 'Failed Connecting the Server. Check your Internet Connection or Try again later' : problem.error.message);
          }
        }
      );
    }
  }

  isEventRedundant()
  {
    this.errors.event = !!this.categoryDatas[this.categoryId].events.find(e => e.name === this.newEventName);
  }

  isCategoryRedundant()
  {
    this.errors.category = !!this.categoryDatas.find(e => e.category === this.categoryName);
    console.log(this.errors);
  }

}
