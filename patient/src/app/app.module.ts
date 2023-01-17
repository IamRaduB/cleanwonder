import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from '@core/interceptors/auth.interceptor'
import { CoreModule } from '@core/core.module'
import { SharedModule } from '@shared/shared.module';
import { DashboardComponent } from '@app/dashboard/dashboard.component';
import { IndexComponent } from './index/index.component'
import { AuthModule } from '@app/auth/auth.module';
import { ProfileComponent } from './dashboard/profile/profile.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    IndexComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AuthModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
