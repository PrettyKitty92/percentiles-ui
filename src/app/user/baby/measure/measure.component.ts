import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../_services/user.service';
import {Baby} from '../../../_models/baby';
import {BabyService} from '../../../_services/baby.service';
import {BabyAge} from '../../../_models/baby-age';
import {MeasurementOptionsService} from '../../../measurement/measurement-option.service';
import {ValuePerPercentile} from '../../../_models/value-per-percentile';
import {MeasurementDetail} from '../../../measurement/measurement-detail';
import {CalculatorService} from '../../../calculator/calculator.service';
import {UnitTypeParameters} from '../../../measurement/unit-type-parameters';
import {UnitTypeParameter} from '../../../measurement/unit-type-parameter';
import {UnitType} from '../../../measurement/unit-type';
import {ChartData} from '../../../_models/chart-data';
import {ChartService} from '../../../chart/chart.service';
import {AlertService} from '../../../_services/alert.service';

@Component({
  selector: 'app-user-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss']
})
export class UserBabyMeasureComponent implements OnInit {


  measurementTypes = MeasurementOptionsService.getOptions();
  parameterXHidden = false;
  priorMeasurement = false;
  measureByDate = false;
  loading = false;
  lhfw = false;

  valuePerPercentile: ValuePerPercentile = {
    value: null,
    percentile: null
  };

  measurementDetails: MeasurementDetail = {
    measurementType: null,
    childSex: '',
    parameterX: {
      unitType: null,
      placeholder: null
    },
    valueOfParameterX: null,
    parameterY: null,
    valueOfParameterY: null
  };

  baby: Baby = {
    name: '',
    dateOfBirth: null,
    sex: null,
  };

  babyAge: BabyAge = {
    days: null,
    months: null,
    years: null,
    allInDays: null
  };
  /*chart data*/
  chartType = 'line';
  chartColors = [undefined];
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };

  chartIsDataLoaded = false;
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

  contentIsLoading = false;

  constructor(private calculatorService: CalculatorService,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private userService: UserService,
              private babyService: BabyService,
              private chartService: ChartService) {
  }

  onChange(newValue): void {
    const params: UnitTypeParameters = MeasurementOptionsService.getParameters(newValue);
    this.measurementDetails.parameterY = params.getParameterY();
    this.ifContainsAge();
    if (!this.parameterXHidden || (this.parameterXHidden && !(newValue === 'WEIGHT_FOR_LENGTH_HEIGHT'))) {
      this.measurementDetails.parameterX = params.getParameterX();
    }

  }

  setUnitType(value): void {
    if (value === '4') {
      this.measureByDate = true;
      this.parameterXHidden = true;
    } else {
      this.measureByDate = false;
      this.parameterXHidden = false;
    }
    this.measurementDetails.parameterX = new UnitTypeParameter(UnitType[UnitType[Number(value)]]);
  }

  submit(save): void {
    this.contentIsLoading = true;
    if (!('WEIGHT_FOR_LENGTH_HEIGHT' === this.measurementDetails.measurementType)) {
      if (this.priorMeasurement) {
        if (this.measureByDate) {
          this.measurementDetails.valueOfParameterX = this.formatDate(this.measurementDetails.valueOfParameterX);
        }
      } else {
        this.measurementDetails.valueOfParameterX = this.babyService.currentBabyAge.allInDays;
      }
    }
    this.calculatorService.calculateAndSaveMeasurement(this.measurementDetails, this.baby.name, save, this.babyAge.allInDays).then(
      value => {
        this.valuePerPercentile.percentile = value.percentile;
        this.valuePerPercentile.value = value.value;
        console.log(this.valuePerPercentile);
        console.log(this.valuePerPercentile);
        this.chartIsDataLoaded = false;
        this.chartService
          .getSampleForMeasurementWithBirthDate(this.measurementDetails, this.valuePerPercentile, this.baby.dateOfBirth).then(
          data => {
            this.prepareChartData(data);
            this.chartIsDataLoaded = true;
            this.contentIsLoading = false;
          },
          error => {
            this.contentIsLoading = false;
            this.alertService.error(error['_body']);
            console.log(error);
          });
      },
      error => {
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        console.log(error);
        //   this.alertService.error(error);
      });

  }

  ngOnInit(): void {
    this.loading = true;
    this.contentIsLoading = true;
    if (!this.babyService.currentBaby) {
      this.router.navigate(['/pages/user']);
      return;
    }
    this.priorMeasurement = false;
    console.log(this.babyService.currentBaby);
    this.baby = this.babyService.currentBaby;
    this.babyAge = this.babyService.currentBabyAge;
    this.parameterXHidden = true;
    this.measurementDetails.childSex = this.baby.sex;
    this.measurementDetails.measurementType = this.measurementTypes[0].type;
    const params: UnitTypeParameters = MeasurementOptionsService.getParameters(this.measurementDetails.measurementType);
    this.measurementDetails.parameterX = new UnitTypeParameter(UnitType.AGE_BY_DAY);
    /*this.measurementDetails.valueOfParameterY = this.babyAge.allInDays;*/
    this.measurementDetails.parameterY = params.getParameterY();
    console.log(params.getParameterY());
    this.ifContainsAge();
    this.loading = false;
    this.contentIsLoading = false;
  }

  setPriorMeasurement(value) {
    this.ifContainsAge();
    if (value) {
      if (this.parameterXHidden) {
        this.measurementDetails.parameterX = new UnitTypeParameter(UnitType.AGE_BY_DATE);
        this.measureByDate = true;
      }
      this.priorMeasurement = true;
    } else {
      if (this.parameterXHidden) {
        this.measurementDetails.parameterX = new UnitTypeParameter(UnitType.AGE_BY_DAY);
        this.measureByDate = false;
      }
      this.priorMeasurement = false;
    }
    this.ifContainsAge();

  }

  ifContainsAge() {
    if (this.measurementDetails.measurementType.indexOf('AGE') >= 0) {
      this.parameterXHidden = true;
      this.lhfw = false;
    } else {
      this.lhfw = true;
      this.parameterXHidden = false;
      this.measureByDate = false;
    }
  }

  private formatDate(dateOfBirth: { year: number, month: number, day: number }): string {
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

  private prepareChartData(data: any) {
    data.samples.map(sample => {
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
    data.samples.filter(sample => !(sample.label === '1' || sample.label === '99'));
    this.chartData = data;
  }
}

