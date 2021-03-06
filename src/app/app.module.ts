import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationStudentComponent } from './registration-student/registration-student.component';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { UserService } from './services/user.service';
import { CommonService } from './services/common.service';
import { TokenizeService } from './services/tokenize.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminService } from './services/admin.service';
import { UserListComponent } from './user-list/user-list.component';
import { AddCategoryEventComponent } from './add-category-event/add-category-event.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { QueryComponent } from './query/query.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { RegistrationLogsComponent } from './registration-logs/registration-logs.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationStudentComponent,
    HomeComponent,
    AccountComponent,
    ErrorPageComponent,
    UserListComponent,
    AddCategoryEventComponent,
    ResetPasswordComponent,
    PaymentDialogComponent,
    ProfileComponent,
    QueryComponent,
    AddContactComponent,
    RegistrationLogsComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularEditorModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatCardModule,
    MatExpansionModule,
    MatChipsModule,
    MatDialogModule,
    MatStepperModule
  ],
  entryComponents: [PaymentDialogComponent],
  providers: [
    UserService, CommonService, AdminService, AccountComponent, {provide: HTTP_INTERCEPTORS, useClass: TokenizeService, multi: true},
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000, panelClass: ['blackySnack'] } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
