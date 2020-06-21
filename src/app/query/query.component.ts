import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('chatArena') private chatArena: ElementRef;

  queriesData;
  loading = true;
  loadingMessages = false;
  queryId = -1;
  message = '';
  userData;
  LOT_SIZE: number = 1;

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.commonS.getAllQueries().subscribe(
      result => {
        if (result.status)
        {
          this.queriesData = result.data;
          this.LOT_SIZE = result.lotSize;
          this.queriesData.forEach(queryData => {
            // queryData.messages.reverse();
            switch(queryData._id) {
              case "5eeb94397c2c0d13713afc94":
                queryData.imageUrl = "https://edg.co.in/assets/events/infocus.svg";
                break;
              case "5eeb94397c2c0d13713afc95":
                queryData.imageUrl = "https://edg.co.in/assets/events/compute-aid.svg";
                break;
              case "5eeb94397c2c0d13713afc96":
                queryData.imageUrl = "https://edg.co.in/assets/events/newron.svg";
                break;
              case "5eeb94397c2c0d13713afc97":
                queryData.imageUrl = "https://edg.co.in/assets/events/design-event.svg";
                break;
              case "5eeb94397c2c0d13713afc98":
                queryData.imageUrl = "https://edg.co.in/assets/events/elevation.svg";
                break;
              case "5eeb94397c2c0d13713afc99":
                queryData.imageUrl = "https://edg.co.in/assets/events/cyber-crusade.svg";
                break;
              case "5eeb94397c2c0d13713afc9a":
                queryData.imageUrl = "https://edg.co.in/assets/events/food-for-fun.svg";
                break;
              case "5eeb94397c2c0d13713afc9b":
                queryData.imageUrl = "https://edg.co.in/assets/events/money-matters.svg";
                break;
              case "5eeb94397c2c0d13713afc9c":
                queryData.imageUrl = "https://edg.co.in/assets/events/create-it.svg";
                break;
              case "5eeb94397c2c0d13713afc9d":
                queryData.imageUrl = "https://edg.co.in/assets/events/robotics.svg";
                break;
            }
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

  scrollToBottom(): void {
      try {
          this.chatArena.nativeElement.scrollTop = this.chatArena.nativeElement.scrollHeight;
      } catch(err) { console.log(err);
       }                 
  }

  setDefault()
  {
    this.queryId = -1;
    this.message = '';
    this.ngOnInit();
  }

  selectQuery(i)
  {
    if(this.queryId != i)
      setTimeout(() => this.scrollToBottom());
    this.queryId = i;
    
  }

  isAdmin()
  {
    return this.commonS.isAdmin();
  }

  loadMessages()
  {    
    this.loadingMessages = true;
    this.commonS.loadMoreMessages(this.queriesData[this.queryId]._id, this.queriesData[this.queryId].messages.length/this.LOT_SIZE).subscribe(
      result => {
        if (result.status)
        {
          this.sB.open('Message loaded');
          this.queriesData[this.queryId].last = result.data.last;
          this.queriesData[this.queryId].messages = [...result.data.messages,...this.queriesData[this.queryId].messages];
          this.loadingMessages = false;
        }
        else
        {
          this.sB.open(result.message);
        }
      },
      problem => {
        this.loadingMessages = false;
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

  addMessage()
  {
    this.loading = true;
    const queryIndex = this.queryId;
    this.commonS.addMessageQuery({categoryName: this.queriesData[this.queryId].categoryName, message: this.message}).subscribe(
      result => {
        if (result.status)
        {
          this.sB.open('Message added');
          this.setDefault();
          this.selectQuery(queryIndex);
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

  deleteMessage(msgIndex)
  {
    const queryIndex = this.queryId;
    const newMsgIndex = msgIndex;
    // console.log(this.queriesData[this.queryId])
    if (confirm('Are you sure to delete ' + this.queriesData[this.queryId].messages[msgIndex].msg))
    {
      this.loading = true;
      this.commonS.deleteMessageQuery({
        categoryName: this.queriesData[this.queryId].categoryName,
        index: newMsgIndex,
        msg: this.queriesData[this.queryId].messages[msgIndex].msg
      }).subscribe(
        result => {
          if (result.status)
          {
            this.sB.open('Message deleted');
            this.loading = false;
            this.setDefault();
            this.selectQuery(queryIndex);
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




