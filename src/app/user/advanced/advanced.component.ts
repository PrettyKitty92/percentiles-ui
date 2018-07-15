import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {ChartData} from '../../_models/chart-data';
import {MeasurementOptionsService} from "../../measurement/measurement-option.service";
import {AlertService} from '../../_services/alert.service';

@Component({
  selector: 'app-user-advanced-welcome',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class UserAdvancedComponent implements OnInit {

  currentUser: User;

  measurementTypes = MeasurementOptionsService.getOptions();
  measurementType;

  optionsModel: number[] = [];
  myOptions: IMultiSelectOption[] = [];

  chartData: ChartData = {
    labels: [],
    samples: [{
      data: [],
      label: '',
      fill: '',
      borderWidth: '',
      pointStyle: '',
      borderColor: '',
      backgroundColor: ''
    }],
    measurementType: null,
    startUnitValue: null,
    finalUnitValue: null,
  };

  chartType = 'line';
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };

  dataIsLoaded = false;
  noData = false;
  contentIsLoading = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  onChange() {
    console.log(this.optionsModel);
  }

  loadData() {
    this.dataIsLoaded = false;
    this.contentIsLoading = true;
    const babies: string[] = [];
    this.optionsModel.map(
      option => {
        babies.push(this.myOptions[option].name);
      }
    );

    this.userService.compareBabies(babies, this.measurementType).then(
      chartData => {
        this.chartData = chartData;
        if (chartData.samples === null) {
          this.noData = true;
        } else {
          console.log(chartData);
          this.chartData.samples.map(sample => {
            sample.fill = false;
          });
          this.dataIsLoaded = true;
          this.noData = false;
        }
        this.contentIsLoading = false;
      }, error => {
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        console.log(error);
      }
    );
    console.log('babies: ');
    console.log(babies);
  }


  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser.babies.length < 1) {
      this.router.navigate(['pages/user/welcome']);
    } else {
      this.currentUser.babies.map(
        baby => {
          console.log(this.currentUser.babies.indexOf(baby));
          this.myOptions.push({id: this.currentUser.babies.indexOf(baby), name: baby.name});
        }
      );
    }
  }
}
