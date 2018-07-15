import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {isUndefined} from 'util';

@Component({
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  contentIsLoading = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.contentIsLoading = true;
    this.authenticationService.login(this.model.username, this.model.password).then(
      result => {
        const response = result;
        console.log(response);
        console.log(response.headers);
        const authorizationToken = response.headers.get('Authorization');
        if (!isUndefined(authorizationToken)) {
          localStorage.setItem('authToken', JSON.stringify(authorizationToken));
          console.log(localStorage);
          this.authenticationService.loadUserDetail().then(
            details => {
              if (details) {
                localStorage.setItem('currentUser', JSON.stringify(details));
                if (details.authorities.indexOf('USER') >= 0) {
                  this.router.navigate(['pages/home']);
                } else if (details.authorities.indexOf('ADMIN') >= 0) {
                  this.router.navigate(['pages/admin/welcome']);
                }
              }
            }
          );
        }
        this.contentIsLoading = true;
      },
      error => {
        console.log('Siema');
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        this.loading = false;
      });
  }
}

