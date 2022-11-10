import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  dashboardId='DASHBOARD_ID_HERE';
  appServer='APP_SERVER_HERE';
  apiHost='API_HOST_HERE';
  key?: string;
  token?: string;

  userAuthToken?: string;
  user?: {
    username: string;
    email: string;
    brand: string;
  }

  constructor(@Inject(DOCUMENT) public document: Document, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // We can use raw claims to send JWT token instead of cumulio object.
    const token = window.localStorage.getItem('authorization');

    if (token) {
      this.userAuthToken = token as string;
      this.user = this.parseJwt(token as string);
      // do an API call to authorize.
      this.http.get<{
        status: string;
        key?: string;
        token?: string;
      }>(`http://localhost:4001/`, {
        headers: {
          'authorization': 'Bearer ' + token as string 
        }
      })
      .subscribe((data) => {
        console.log(data);
        this.key = data.key;
        this.token = data.token;
      });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  logout() {
    window.localStorage.removeItem('authorization');
    this.router.navigateByUrl('/');
  }

  parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

}
