import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RegisterService} from './register.service';
import {AlertService} from '../_services/alert.service';

@Component({
  moduleId: module.id,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  model: any = {};
  loading = false;
  contentIsLoading = false;

  constructor(private router: Router,
              private registerService: RegisterService,
              private alertService: AlertService) {
  }

  register() {
    this.loading = true;
    this.contentIsLoading = true;
    this.registerService.singUpUser(this.model).then(
      response => {
        console.log(response.status);
        if (response.status === 201) {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/pages/home']);
        } else {
          this.alertService.error(response.message);
          this.loading = false;
          this.router.navigate(['/pages/sign-up']);
        }
        this.contentIsLoading = false;
      }
    ).catch(
      error => {
        {
          this.contentIsLoading = false;
          this.alertService.error(error['_body']);
          console.log(error);
          this.loading = false;
        }
      }
    );
  }
}
