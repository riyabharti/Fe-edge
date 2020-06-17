import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationStudentComponent } from './registration-student/registration-student.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { UserGuard } from './guards/user.guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminGuard } from './guards/admin.guard';
import { UserListComponent } from './user-list/user-list.component';
import { AddCategoryEventComponent } from './add-category-event/add-category-event.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { QueryComponent } from './query/query.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegistrationStudentComponent },
  { path: 'account', component: AccountComponent, canActivate: [UserGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [UserGuard]},
  { path: 'userlist', component: UserListComponent, canActivate: [AdminGuard]},
  { path: 'addcategoryevent', component: AddCategoryEventComponent , canActivate: [AdminGuard]},
  { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [AdminGuard]},
  {path: 'queries', component: QueryComponent, canActivate: [UserGuard]},
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
