import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {AlertService} from '../../_services/alert.service';

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.scss']
})
export class UserWelcomeComponent implements OnInit{

  isNavbarCollapsed = false;
  currentUser: User;
  title = 'Witaj drogi rodzicu: ';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService) {
    console.log('inConstructor');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  setBaby(babyName): void {
    /*    this.baby = this.currentUser.babies.filter(baby => baby.name === babyName)[0];*/
    console.log(babyName);
    this.router.navigate(['pages/user/baby', babyName.toUpperCase()]);
  }

  ngOnInit(): void {

  }

}
