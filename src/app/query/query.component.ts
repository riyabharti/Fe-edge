import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  constructor(
    private commonS: CommonService,
    private title: Title,
    private sB: MatSnackBar,
    private dialog: MatDialog,
    private adminS: AdminService
  ) { title.setTitle('E-Edge | Queries'); }

  queriesData;
  loading = true;
  queryId = -1;
  message = '';
  userData;

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.commonS.getAllQueries().subscribe(
      result => {
        if (result.status)
        {
          this.queriesData = result.data;
          this.queriesData.forEach(queryData => {
            queryData.messages.reverse();
          });
          this.loading = false;
          this.sB.open(result.message);
        }
        else
        {
          this.loading = false;
          this.sB.open(result.message);
        }
      },
      problem => {
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
  }

  setDefault()
  {
    this.queryId = -1;
    this.message = '';
    this.ngOnInit();
  }

  selectQuery(i)
  {
    if (this.queryId === i)
    {
      this.queryId = -1;
    }
    else
    {
      this.queryId = i;
    }
  }

  isAdmin()
  {
    return this.commonS.isAdmin();
  }

  addMessage()
  {
    const queryIndex = this.queryId;
    this.commonS.addMessageQuery({categoryName: this.queriesData[this.queryId].categoryName, message: this.message}).subscribe(
      result => {
        if (result.status)
        {
          this.sB.open('Message added');
          this.loading = true;
          this.setDefault();
          this.selectQuery(queryIndex);
        }
        else
        {
          this.sB.open(result.message);
        }
      },
      problem => {
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
  }

  deleteMessage(msgIndex)
  {
    const queryIndex = this.queryId;
    const newMsgIndex = this.queriesData[this.queryId].messages.length - msgIndex - 1;
    // console.log(this.queriesData[this.queryId])
    if (confirm('Are you sure to delete ' + this.queriesData[this.queryId].messages[msgIndex].msg))
    {
      this.commonS.deleteMessageQuery({
        categoryName: this.queriesData[this.queryId].categoryName,
        index: newMsgIndex,
        msg: this.queriesData[this.queryId].messages[msgIndex].msg
      }).subscribe(
        result => {
          if (result.status)
          {
            this.sB.open('Message deleted');
            this.loading = true;
            this.setDefault();
            this.selectQuery(queryIndex);
          }
          else
          {
            this.sB.open(result.message);
          }
        },
        problem => {
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
    }
  }

  openAddContact(i)
  {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '250px',
      data: {
        status: false,
        contact: {
          name: '',
          phone: ''
        },
        category: this.queriesData[i].categoryName
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.status)
      {
        this.loading = true;
        this.adminS.addContact({categoryName: dialogResult.category, contact: dialogResult.contact}).subscribe(
          result => {
            if (result.status)
            {
              this.sB.open(result.message);
              this.setDefault();
              this.ngOnInit();
            }
            else
            {
              this.loading = false;
              this.sB.open(result.message);
            }
          },
          problem => {
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
      }
    });
  }

}




