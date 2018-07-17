import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {AlertService} from '../_services/alert.service';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  title = 'Admin !';

  isNavbarCollapsed = false;
  currentUser: User;

  loading = false;
  users: User[];

  _opened = false;




  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.currentUser) {
      this.router.navigate(['/pages/sign-in']);
    }
    if (this.currentUser) {
      if (!(this.currentUser.authorities.indexOf('ADMIN') >= 0)) {
        console.log('nie jestes zalogowany jako administrator !!');
        this.logout();
        this.router.navigate(['/pages/sign-in']);
      }
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/pages/home']);
  }
}
