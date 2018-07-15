import {Component, OnInit} from '@angular/core';
import {ChartService} from '../../chart/chart.service';
import {ChartData} from '../../_models/chart-data';
import {MeasurementOptionsService} from '../../measurement/measurement-option.service';
import {MeasurementService} from '../../_services/measurement.service';
import {UnitTypeParameters} from '../../measurement/unit-type-parameters';
import {AlertService} from '../../_services';


@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

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

  charType = 'line';

  params = {
    measurementType: '',
    childSex: '',
    parameterXUnitType: ''
  };

  measurementTypes = MeasurementOptionsService.getOptions();
  isDataLoaded = false;
  description = '';
  editRecord = false;
  measurementDetails: any = {};
  browser = false;
  measurementEditDetails: any = {};

  sampleDataLoaded = false;
  contentIsLoading = true;

  constructor(private chartService: ChartService,
              private measurementService: MeasurementService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.params.measurementType = this.measurementTypes[0].type;
    this.params.childSex = 'BOY';
    this.params.parameterXUnitType = (MeasurementOptionsService.getParameters(this.params.measurementType)).getParameterX();
    this.isDataLoaded = false;
  }

  openEditRecordPanel() {
    console.log('openEditRecordPanel');
    this.measurementDetails = {}
    this.measurementEditDetails = {};
    this.sampleDataLoaded = false;
    this.editRecord = true;
    this.browser = false;
  }

  openBrowserPanel() {
    this.measurementDetails = {};
    this.measurementEditDetails = {};
    this.sampleDataLoaded = false;
    this.editRecord = false;
    this.browser = true;
    this.contentIsLoading = true;
    this.chartService.getGeneralChart(this.params).then(
      data => {
        this.setUpChart(data);
        this.isDataLoaded = true;
        this.contentIsLoading = false;
      },
      error => {
        console.log(error);
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        this.isDataLoaded = false;
      }
    );

  }

  onChange(newValue): void {
    this.measurementEditDetails = {};
    this.measurementDetails.parameterX = null;
  }

  measurementTypeHeightLength = () => this.measurementDetails &&
    (this.measurementDetails.type === 'WEIGHT_FOR_LENGTH' ||
      this.measurementDetails.type === 'WEIGHT_FOR_HEIGHT');

  saveMeasurementData() {
    this.sampleDataLoaded = false;
    this.contentIsLoading = true;
    this.measurementService.savePercentiles(this.measurementDetails, this.measurementEditDetails.valuePerPercentiles).then(
      data => {
        console.log(data);
        this.measurementService.saveLMS(this.measurementDetails, this.measurementEditDetails.lambdaMuSigmaProperties
        ).then(
          result => {
            console.log(result);
          },
          error => {
            this.contentIsLoading = false;
            this.alertService.error(error['_body']);
          }
        );
        this.loadMeasurementData();
        this.sampleDataLoaded = true;
        this.contentIsLoading = false;
      },
      error => {
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        console.log(error);
      }
    );
  }

  loadMeasurementData() {
    console.log('loadMeasurementData');
    this.sampleDataLoaded = false;
    this.contentIsLoading = true;
    this.measurementService.getMeasurementData(this.measurementDetails).then(
      data => {
        this.measurementEditDetails.valuePerPercentiles = data.valuePerPercentiles;
        this.measurementEditDetails.lambdaMuSigmaProperties = data.lambdaMuSigmaProperties;
        console.log(data);
        console.log(this.measurementEditDetails);
        this.sampleDataLoaded = true;
        this.contentIsLoading = false;
      },
      error => {
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        console.log(error);
      }
    );
  }


  private setUpChart(data: ChartData) {
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
    });

    data.samples.filter(sample => sample.label !== '1' && sample.label !== '99');
    this.chartData = data;
    let xDesc;
    if (this.params.measurementType !== 'WEIGHT_FOR_LENGTH' && this.params.measurementType !== 'WEIGHT_FOR_HEIGHT') {
      xDesc = 'wiek';
    } else {
      xDesc = MeasurementOptionsService.getParameters(this.params.measurementType).getParameterX().placeholder;
    }
    const yDesc = MeasurementOptionsService.getParameters(this.params.measurementType).getParameterY().placeholder;
    this.description = xDesc + ' na ' + yDesc;
    this.isDataLoaded = true;
  }


  reloadChart() {
    this.isDataLoaded = false;
    this.contentIsLoading = true;
    this.params.parameterXUnitType = (MeasurementOptionsService.getParameters(this.params.measurementType)).getParameterX();
    this.chartService.getGeneralChart(this.params).then(
      data => {
        this.setUpChart(data);
        this.isDataLoaded = true;
        this.contentIsLoading = false;
      },
      error => {
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        console.log(error);
      }
    );
  }
}
