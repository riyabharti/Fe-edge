import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../User';
import { AdminService } from '../services/admin.service';
import { CommonService } from '../services/common.service';
import { Title } from '@angular/platform-browser';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private sB: MatSnackBar,
    private adminS: AdminService,
    private commonS: CommonService,
    private title: Title
  ) { title.setTitle('E-Edge | UserList'); }

  displayedColumns: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i'];
  dataSource: MatTableDataSource<User>;
  usersData = [];
  show = [true, true, true, true, true, true, true, false, true, false, false, false];
  userData;
  categoryData;

  url = environment.apiURL + '/common/getFile/';

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  loading = true;

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.getUsers();
  }

  getUsers() {
    this.dataSource = undefined;
    this.usersData = undefined;
    this.adminS.fetchUsers().subscribe(
      result => {
        this.loading = false;
        if (result.status) {
          this.usersData = result.users;
          this.usersData.forEach(userr => {
            userr.createdAt = new Date(userr.createdAt).toString().replace('GMT+0530 (India Standard Time)', 'Hrs IST');
          });
          this.dataSource = new MatTableDataSource<User>(this.usersData);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.commonS.fetchEvents().subscribe(
            result => {
              if (result.status)
              {
                this.categoryData = result.data;
                /**
                 * Do the impossible task
                 */
                this.usersData.forEach(user => {
                  const regEvents = [];
                  if (user.events != undefined)
                  {
                    const eventIds = Object.keys(user.events);
                    eventIds.forEach((e, i) => {
                    eventIds[i] = e.split('_')[0];
                  });
                    this.categoryData.forEach(cat => {
                    if (eventIds.indexOf(cat._id) != -1) {
                      const t = cat.category, ei = user.events[cat._id];
                      cat.events.forEach(ee => {
                        if (ei.indexOf(ee._id) != -1) {
                          regEvents.push({
                            cn: t,
                            en: ee.name
                          });
                        }
                      });
                    }
                  });
                  }
                  user.regEvents = regEvents;
                });
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
        else {
          this.sB.open(result.message);
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

  toggle(id: string) {
    const index = this.displayedColumns.indexOf(id);
    if (index === -1) {
      this.displayedColumns.push(id);
      this.displayedColumns.sort();
    }
    else {
      this.displayedColumns.splice(index, 1);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verifyUser(user)
  {
    let msg = '';
    if (user.verified === true)
    {
      msg = 'Un-';
    }
    if (confirm('Sure to ' + msg + 'Verify User with Name: ' + user.name))
    {
      this.loading = true;
      this.adminS.verifyUser(user._id).subscribe(
        result => {
          if (result.status)
          {
            this.loading = false;
            this.sB.open(result.message);
            this.getUsers();
          }
          else {
            this.loading = false;
            this.sB.open(result.message);
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

  deleteUser(user) {
    if (this.commonS.isAdmin()) {
      if (user.admin)
      {
        this.sB.open('You cannot delete an admin user!');
        return;
      }
      if (confirm('Sure to Delete User with email ' + user.email + '? This action can\'t be undone!!!')) {
        this.loading = true;
        this.adminS.deleteUser(user._id).subscribe(
          result => {
            if (result.status) {
              this.loading = false;
              this.sB.open(result.message);
              this.getUsers();
            }
            else {
              this.loading = false;
              this.sB.open(result.message);
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
    else {
      this.sB.open('Some problem occurred :/ Please log in again');
      this.commonS.doLogout();
    }
  }

}
