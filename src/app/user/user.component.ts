import {Component, OnInit, Output} from '@angular/core';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';
import {AuthenticationService} from '../_services/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {BabyService} from '../_services/baby.service';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  isNavbarCollapsed = false;
  currentUser: User;
  _opened = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private babyService: BabyService) {
    console.log('inConstructor');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    /*    this.router.navigate(['pages/user/welcome']);*/
  }

  logout(): void {
    this.authenticationService.logout();
    this.babyService.clean();
    this.router.navigate(['/']);
  }

  setBaby(babyName): void {
    /*    this.baby = this.currentUser.babies.filter(baby => baby.name === babyName)[0];*/
    console.log(babyName);
    this.router.navigate(['pages/user/baby', babyName]);
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    /*if (this.currentUser.babies.length < 1) {*/
      this.router.navigate(['pages/user/welcome']);
    /*}*/
  }
}
