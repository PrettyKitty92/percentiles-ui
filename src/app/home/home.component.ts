import {Component, OnInit} from '@angular/core';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';
import {AuthenticationService} from '../_services/authentication.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isNavbarCollapsed = false;
  currentUser: User;
  users: User[] = [];
  loggedUserSrc = '';

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService) {
    console.log(localStorage);
    console.log(localStorage.getItem('currentUser'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);
    console.log(this.userIsParent());
    window.addEventListener('resize', function () {});
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  logout(): void {
    this.authenticationService.logout();
    location.reload();
  }

  getWindowSize = function () {
    return window.innerWidth;
  };
  userIsParent = () => this.currentUser !== null && this.currentUser.authorities.includes('USER');
}
