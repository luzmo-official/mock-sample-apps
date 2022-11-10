import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  showLoader = true;

  constructor(@Inject(DOCUMENT) public document: Document, public router: Router) {
    this.showLoader = false;
    // if (true) {
    //   router.navigateByUrl('/portal')
    // }
  }
}
