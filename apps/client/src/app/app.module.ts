import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pagenotfound/PageNotFound.component';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';
import { HomeModule } from './home/home.module';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
    HomeModule
  ],
  providers: [HttpErrorHandler, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
