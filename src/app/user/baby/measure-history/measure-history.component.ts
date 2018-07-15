import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../_services/user.service';
import {MeasurementOptionsService} from '../../../measurement/measurement-option.service';
import {Baby} from '../../../_models/baby';
import {BabyService} from '../../../_services/baby.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ChartData} from '../../../_models/chart-data';
import {AlertService} from '../../../_services';

@Component({
  selector: 'app-user-measure-history',
  templateUrl: './measure-history.component.html',
  styleUrls: ['./measure-history.component.scss']
})
export class UserBabyMeasureHistoryComponent implements OnInit {

  measurementTypes = MeasurementOptionsService.getOptions();

  measurementType;
  from;
  to;
  filtered = false;
  filteredBy = 'DAYS';

  baby: Baby = {
    name: '',
    dateOfBirth: null,
    sex: null,
  };

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  fromDay;
  toDay;

  title = 'UserBabyMeasureHistoryComponent';

  option: string;

  measurements;

  /*table data*/


  settings = {
    actions: false,
    columns: {
      measurementType: {
        title: 'Kategoria pomiaru',
        editable: false
      },
      dataOfBabiesLife: {
        title: 'Dzień zycia dziecka',
        editable: false
      },
      parameterXUnitType: {
        title: 'Typ parametru X',
        editable: false
      },
      parameterYUnitType: {
        title: 'Typ parametru Y',
        editable: false
      },
      parameterXUnitValue: {
        title: 'Wartośc parametru X',
        editable: false
      },
      parameterYUnitValue: {
        title: 'Wartośc parametru Y',
        editable: false
      },
      percentile: {
        title: 'Centyl',
        editable: false
      }
    }
  };
  /*chart data*/

  chartType = 'line';
  chartColors = [undefined];
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };

  chartData: ChartData = {
    labels: [],
    samples: [{
      data: [],
      label: ''
    }],
    measurementType: null,
    startUnitValue: null,
    finalUnitValue: null,
  };

  dataIsLoaded = false;
  noData = false;
  contentIsLoading = false;

  // private data: Array<any> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService,
              private babyService: BabyService) {
    //  this.source = new LocalDataSource(this.data);
  }

  setFilteredType(value) {
    this.filteredBy = value;
  }

  load() {
    this.dataIsLoaded = false;
    this.contentIsLoading = true;
    if (!this.filtered) {
      this.userService.getAllBabyMeasurements(this.baby.name, this.measurementType).then(
        data => {
          const d = data;
          console.log(d);
          this.measurements = this.parseMeasurement(data);
          this.userService.getAllBabyMeasurementsChart(this.baby.name, this.measurementType).then(
            chartData => {
              this.chartData = chartData;
              if (chartData.samples === null) {
                this.noData = true;
                this.contentIsLoading = false;
              } else {
                console.log(chartData);
                this.prepareChartData();
                this.dataIsLoaded = true;
                this.noData = false;
                this.contentIsLoading = false;
              }
            }, error => {
              this.contentIsLoading = false;
              this.alertService.error(error['_body']);
              console.log(error);
            }
          );
        },
        error => {
          this.contentIsLoading = false;
          this.alertService.error(error['_body']);
          console.log(error);
        });
    } else {
      if (this.filteredBy === 'DAYS') {
        this.userService.getBabyMeasurementsFromDayToDay(this.baby.name, this.measurementType, this.fromDay, this.toDay).then(
          data => {
            console.log(data);
            this.measurements = this.parseMeasurement(data);
            this.userService.getBabyMeasurementsFromDayToDayChart(this.baby.name, this.measurementType, this.fromDay, this.toDay).then(
              chartData => {
                this.chartData = chartData;
                if (chartData.samples === null) {
                  this.noData = true;
                  this.contentIsLoading = false;
                } else {
                  console.log(chartData);
                  this.prepareChartData();
                  this.dataIsLoaded = true;
                  this.noData = false;
                  this.contentIsLoading = false;
                }
              }, error => {
                this.contentIsLoading = false;
                this.alertService.error(error['_body']);
                console.log(error);
              }
            );
          },
          error => {
            this.contentIsLoading = false;
            this.alertService.error(error['_body']);
            console.log(error);
          });
      } else {
        const dateFrom: string = this.formatDate(this.fromDate);
        const dateTo: string = this.formatDate(this.toDate);

        this.userService.getBabyMeasurementsFromDateToDate(this.baby.name, this.measurementType, dateFrom, dateTo).then(
          data => {
            this.measurements = this.parseMeasurement(data);
            this.userService.getBabyMeasurementsFromDateToDateChart(this.baby.name, this.measurementType, dateFrom, dateTo).then(
              chartData => {
                this.chartData = chartData;
                if (chartData.samples === null) {
                  this.noData = true;
                } else {
                  console.log(chartData);
                  this.prepareChartData();
                  this.chartData.samples.filter(sample => sample.label !== '1' && sample.label !== '99');
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
          },
          error => {
            this.contentIsLoading = false;
            this.alertService.error(error['_body']);
            console.log(error);
          });
      }
    }
  }

  private parseMeasurement(data: any) {
    data.map(sample => {
      const measurement = this.measurementTypes.filter(ms => ms.type === sample.measurementType)[0];
      sample.measurementType = measurement.description;
      sample.parameterXUnitType = (MeasurementOptionsService.getParameters(measurement.type)).getParameterX().placeholder;
      sample.parameterYUnitType = (MeasurementOptionsService.getParameters(measurement.type)).getParameterY().placeholder;
    });
    return data;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.option = params['option'];
    });
    this.baby = this.babyService.currentBaby;
  }

  private formatDate(dateOfBirth: NgbDateStruct): string {
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

  private prepareChartData() {
    this.chartData.samples.map(sample => {
      sample.fill = false;
      sample.pointRadius = 1;
      if (sample.label === '3' || sample.label === '97') {
        sample.pointBackgroundColor = '#ff8375';
        sample.pointBorderColor = '#ff8375';
        sample.borderColor = '#ff8375';
        sample.backgroundColor = '#ff8375';
      }
      if (sample.label === '15' || sample.label === '85') {
        sample.pointBackgroundColor = '#4699cc';
        sample.pointBorderColor = '#4699cc';
        sample.borderColor = '#4699cc';
        sample.backgroundColor = '#4699cc';
      }
      if (sample.label === '50') {
        sample.pointBackgroundColor = '#5fcc9a';
        sample.pointBorderColor = '#5fcc9a';
        sample.borderColor = '#5fcc9a';
        sample.backgroundColor = '#5fcc9a';
      }
      if (sample.label === 'Your baby') {
        sample.label = 'Twoje dziecko';
        sample.pointBackgroundColor = 'red';
        sample.pointBorderColor = 'red';
        sample.borderColor = 'red';
        sample.backgroundColor = 'red';
        sample.pointRadius = 2;
      }
    });
  }
}

