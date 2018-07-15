import {Component} from '@angular/core';
import {AlertService} from '../../_services/alert.service';
import {UserService} from '../../_services/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-add-baby',
  templateUrl: './add-baby.component.html',
  styleUrls: ['./add-baby.component.scss']
})
export class AddBabyComponent {
  baby = {
    name: null,
    dateOfBirth: null,
    sex: null
  }

  loading = false;
  contentIsLoading = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService) {
  }

  addBaby() {
    this.loading = true;
    this.contentIsLoading = true;
    this.baby.dateOfBirth = this.formatDate(this.baby.dateOfBirth);
    this.userService.addBaby(this.baby).then(
      details => {
        if (details) {
          localStorage.setItem('currentUser', JSON.stringify(details));
          this.contentIsLoading = false;
    //      this.router.navigate(['pages/user/welcome']);
          this.router.navigate(['pages/user/baby', this.baby.name.toUpperCase()]);
        }
      },
      error => {
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        this.loading = false;
      }
    );
  }

  private formatDate(dateOfBirth: {year: number, month: number, day: number}): string {
    let day;
    let month;
    console.log(dateOfBirth);
    const yaer = dateOfBirth.year;
    if (dateOfBirth['day'].toString().length < 2) {
      console.log('wtf');
      day = '0'.concat(dateOfBirth['day'].toString());
    } else {
      day = dateOfBirth['day'].toString();
    }

    if (dateOfBirth['month'].toString().length < 2) {
      month = '0'.concat(dateOfBirth['month'].toString());
    } else {
      month = dateOfBirth['month'].toString();
    }
    return day.concat('-').concat(month).concat('-').concat(yaer);
  }
}


