import {Component, OnInit} from '@angular/core';
import {CalculatorService} from './calculator.service';
import {MeasurementOptionsService} from '../measurement/measurement-option.service';
import {ValuePerPercentile} from '../_models/value-per-percentile';
import {MeasurementDetail} from '../measurement/measurement-detail';
import {UnitTypeParameters} from '../measurement/unit-type-parameters';
import {UnitTypeParameter} from '../measurement/unit-type-parameter';
import {UnitType} from '../measurement/unit-type';
import {ChartData} from '../_models/chart-data';
import {ChartService} from '../chart/chart.service';
import {AlertService} from '../_services';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {


  measurementTypes = MeasurementOptionsService.getOptions();
  measureByAge = false;
  measureByBirthDay = false;
  chartIsDataLoaded = false;
  description = '';

  valuePerPercentile: ValuePerPercentile = {
    value: null,
    percentile: null
  };

  measurementDetails: MeasurementDetail = {
    measurementType: null,
    childSex: '',
    parameterX: null,
    valueOfParameterX: null,
    parameterY: null,
    valueOfParameterY: null
  };

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
  chartColors = [undefined];
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };
  contentIsLoading = false;

  constructor(private calculatorService: CalculatorService,
              private chartService: ChartService,
              private alertService: AlertService
  ) {
  }

  onChange(newValue): void {
    const params: UnitTypeParameters = MeasurementOptionsService.getParameters(newValue);
    this.measurementDetails.parameterX = params.getParameterX();
    this.measurementDetails.parameterY = params.getParameterY();
    this.measurementDetails.valueOfParameterX = null;
    this.measurementDetails.valueOfParameterY = null;
    this.ifContainsAge();
  }

  setUnitType(value): void {
    if (value === '0'
    ) {
      this.measureByBirthDay = true;
    } else {
      this.measureByBirthDay = false;
    }
    this.measurementDetails.parameterX = new UnitTypeParameter(UnitType[UnitType[Number(value)]]);
  }

  submit(): void {
    this.contentIsLoading = true;
    this.alertService.clear();
    if (this.measureByBirthDay
    ) {
      this.measurementDetails.valueOfParameterX = this.formatDate(this.measurementDetails.valueOfParameterX);
    }
    this.calculatorService.getPercentile(this.measurementDetails).then(value => {
      this.valuePerPercentile.percentile = value.percentile;
      this.valuePerPercentile.value = value.value;
      console.log(this.valuePerPercentile);
      this.chartIsDataLoaded = false;
      this.chartService.getSampleForMeasurement(this.measurementDetails, this.valuePerPercentile).then(
        data => {
          data.samples.map(sample => {
            sample.fill = false;
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
              sample.pointBackgroundColor = 'red';
              sample.pointBorderColor = 'red';
              //   sample.borderColor = 'red';
              sample.backgroundColor = 'red';
              sample.pointRadius = 5;
            }
          });

          data.samples.filter(sample => sample.label !== '1' && sample.label !== '99');

          /*https://www.w3schools.com/cssref/css_colors.asp*/
          this.chartData = data;
          let xDesc;
          if (this.measurementDetails.measurementType !== 'WEIGHT_FOR_LENGTH'
            && this.measurementDetails.measurementType !== 'WEIGHT_FOR_HEIGHT') {
            xDesc = 'wiek w dniach';
          } else {
            xDesc = MeasurementOptionsService.getParameters(this.measurementDetails.measurementType).getParameterX().placeholder;
          }
          const yDesc = MeasurementOptionsService.getParameters(this.measurementDetails.measurementType).getParameterY().placeholder;
          this.description = xDesc + ' na ' + yDesc;
          this.chartIsDataLoaded = true;
          this.contentIsLoading = false;

        },
        error => {
          console.log(error);
          console.log();
          this.contentIsLoading = false;
          this.alertService.error(error['_body']);
        }
      );
    }, error => {
      console.log(error);
      this.contentIsLoading = false;
      console.log(error['_body']);
      this.alertService.error(error['_body']);
    });
  }

  ngOnInit(): void {
    this.measureByAge = false;
    this.measurementDetails.measurementType = this.measurementTypes[0].type;
    const params: UnitTypeParameters = MeasurementOptionsService.getParameters(this.measurementDetails.measurementType);
    this.measurementDetails.parameterX = params.getParameterX();
    this.measurementDetails.parameterY = params.getParameterY();
    this.ifContainsAge();
  }

  ifContainsAge() {
    if (this.measurementDetails.measurementType.indexOf('AGE') >= 0) {
      this.measureByAge = true;
    } else {
      this.measureByAge = false;
      this.measureByBirthDay = false;
    }
  }

  private formatDate(dateOfBirth: {
    year: number, month: number, day: number
  }): string {
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

  someFunc() {

  }
}
