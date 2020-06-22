import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../services/admin.service';
import { CommonService } from '../services/common.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-registration-logs',
  templateUrl: './registration-logs.component.html',
  styleUrls: ['./registration-logs.component.css']
})
export class RegistrationLogsComponent implements OnInit {

  constructor(
    private sB: MatSnackBar,
    private adminS: AdminService,
    private commonS: CommonService,
    private title: Title
  ) {
    title.setTitle('E-Edge | UserList');
  }

  usersData = [];
  userData;
  categoryData;
  loading = true;
  totalCount: number = 0;

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.getUsers();
  }

  getUsers() {
    this.totalCount = 0;
    this.usersData = undefined;
    this.adminS.fetchUsers(0).subscribe(
      (result) => {
        if (result.status) {
          this.usersData = result.users;
          this.usersData.forEach((userr) => {
            userr.createdAt = new Date(userr.createdAt)
              .toString()
              .replace('GMT+0530 (India Standard Time)', 'Hrs IST');
              this.totalCount += userr.eventRegDetails.total.length ? 1 : 0;
          });
          this.loading = false;
          this.commonS.fetchEvents().subscribe(
            (result) => {
              if (result.status) {
                this.categoryData = result.data;
                this.categoryData.forEach((cat) => {
                  cat.rCount = 0;
                  cat.events.forEach((ee) => {
                    ee.rCount = 0
                  });
                });
                /**
                 * Do the impossible task
                 */
                this.usersData.forEach((user) => {
                  const regEvents = [];
                  if (user.events) {
                    const eventIds = Object.keys(user.events);
                    eventIds.forEach((e, i) => {
                      eventIds[i] = e.split('_')[0];
                    });
                    this.categoryData.forEach((cat) => {
                      if (eventIds.indexOf(cat._id) >= 0) {
                        cat.rCount++;
                        const t = cat.category;
                        const ei = user.events[cat._id].map((eid) => {
                          return eid.split('_')[0];
                        });
                        cat.events.forEach((ee) => {
                          if (ei.indexOf(ee._id) >= 0) {
                            ee.rCount++;
                            regEvents.push({
                              cn: t,
                              en: ee.name,
                            });
                          }
                        });
                      }
                    });
                  }
                  user.regEvents = regEvents;
                });

                this.loading = false;
              } else {
                this.sB.open(result.message);
                this.loading = false;
              }
            },
            (problem) => {
              this.loading = false;
              if (
                problem.error.error &&
                problem.error.error.message &&
                problem.error.error.message === 'jwt expired'
              ) {
                this.sB.open(
                  'Your session has expired !!! Please log in again :)'
                );
                this.commonS.doLogout();
              } else {
                console.log(problem.error);
                this.sB.open(
                  problem.error instanceof ProgressEvent
                    ? 'Failed Connecting the Server. Check your Internet Connection or Try again later'
                    : problem.error.message
                );
              }
            }
          );
        } else {
          this.sB.open(result.message);
        }
      },
      (problem) => {
        this.loading = false;
        if (
          problem.error.error &&
          problem.error.error.message &&
          problem.error.error.message === 'jwt expired'
        ) {
          this.sB.open('Your session has expired !!! Please log in again :)');
          this.commonS.doLogout();
        } else {
          console.log(problem.error);
          this.sB.open(
            problem.error instanceof ProgressEvent
              ? 'Failed Connecting the Server. Check your Internet Connection or Try again later'
              : problem.error.message
          );
        }
      }
    );
  }
}
