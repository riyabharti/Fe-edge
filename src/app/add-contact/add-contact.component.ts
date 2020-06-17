import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddContactComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

              }

  ngOnInit(): void {
  }

  cancel()
  {
    this.data.status = false;
    this.dialogRef.close(this.data);
  }

  saveContact(){
    if (confirm('Are you sure to add contact ' + this.data.contact.name + '(' + this.data.contact.phone + ')'))
    {
      this.data.status = true;
      this.dialogRef.close(this.data);
    }
  }

}
