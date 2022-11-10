import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PortalComponent } from './portal/portal.component';
import { HomeComponent } from './home/home.component';
import { InvestorComponent } from './investor/investor.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { NgxCumulioDashboardModule } from '@cumul.io/ngx-cumulio-dashboard';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [		
    AppComponent,
    PortalComponent,
    HomeComponent,
      InvestorComponent,
      LoginComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxCumulioDashboardModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
