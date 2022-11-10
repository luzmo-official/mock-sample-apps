import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  login(username?: string) {
    console.log(this.email, this.password);
    if (username === 'brad') {
      this.email = 'brad@mars-boots.com';
      this.password = 'brad';
    } else if (username === 'angelina') {
      this.email = 'angelina@earthly-shoes.com';
      this.password = 'angelina';
    }
    this.http.post<{
      token?: string;
    }>(`http://localhost:4001/login`, {
      email: this.email,
      password: this.password
    })
    .subscribe((data) => {
      console.log(data);
      window.localStorage.setItem('authorization', data.token as string);
      this.router.navigateByUrl('/portal');
    });
  }

}
