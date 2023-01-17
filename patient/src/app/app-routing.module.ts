import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '@app/not-found/not-found.component'
import { DashboardComponent } from '@app/dashboard/dashboard.component'
import { ConfirmationComponent } from '@app/auth/confirmation/confirmation.component'
import { IndexComponent } from '@app/index/index.component'
import { LoginComponent } from '@app/auth/login/login.component'
import { ProfileComponent } from '@app/dashboard/profile/profile.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'auth/complete-registration',
    component: ConfirmationComponent,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'dashboard/profile',
    component: ProfileComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
