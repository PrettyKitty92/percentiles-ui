import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Baby} from '../../_models/baby';
import {User} from '../../_models/user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {BabyAge} from '../../_models/baby-age';
import {AlertService} from '../../_services/alert.service';
import {BabyService} from '../../_services/baby.service';

@Component({
  selector: 'app-user-baby',
  templateUrl: './baby.component.html',
  styleUrls: ['./baby.component.scss']
})
export class UserBabyComponent implements OnInit {


  currentUser: User;
  baby: Baby = {
    name: null,
    dateOfBirth: null,
    sex: null,
  };

  babyAge: BabyAge = {
    days: null,
    months: null,
    years: null,
    allInDays: null
  };

  loading = true;
  contentIsLoading = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService,
              private babyService: BabyService) {

    this.ngOnInit();
  }


  ngOnInit(): void {
    // this.sampleDataLoaded = false;
    this.loading = true;
    this.contentIsLoading = true;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.params.subscribe(params => {
      console.log(params['name']);
      console.log(this.currentUser.babies);
      this.baby = this.currentUser.babies.filter(baby => baby.name.toUpperCase() === params['name'])[0];
      console.log(this.baby);
      this.userService.getBabyAge(params['name']).then(
        result => {
        //  this.alertService.success('Success');
          console.log(result);
          this.babyAge = result;
          this.babyService.currentBaby = this.baby;
          this.babyService.currentBabyAge = this.babyAge;
          this.loading = false;
          this.contentIsLoading = false;
        },
        error => {
          console.log('Siema');
          this.contentIsLoading = false;
          this.alertService.error(error['_body']);
          //    this.sampleDataLoaded = false;
          this.loading = false;
        });
    });

  }

}

