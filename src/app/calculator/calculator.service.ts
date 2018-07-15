import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {MeasurementDetail} from '../measurement/measurement-detail';

import 'rxjs/add/operator/toPromise';
import {ValuePerPercentile} from '../_models/value-per-percentile';
import {UnitType} from '../measurement/unit-type';

@Injectable()
export class CalculatorService {

  constructor(private http: Http) {
  }

  getPercentile(measurementDetail: MeasurementDetail): Promise<ValuePerPercentile> {
    let url = `percentiles/${measurementDetail.measurementType}/${measurementDetail.childSex}`;
    if (measurementDetail.measurementType === 'WEIGHT_FOR_LENGTH' || measurementDetail.measurementType === 'WEIGHT_FOR_HEIGHT') {
      url = `percentiles/WEIGHT_FOR_LENGTH_HEIGHT/${measurementDetail.childSex}`;
    }
    const params = new URLSearchParams();
    params.set('unitTypeForParameterX', UnitType[measurementDetail.parameterX.unitType.toString()]);
    params.set('unitValueForParameterX', measurementDetail.valueOfParameterX.toString().replace(',', '.'));
    params.set('unitTypeForParameterY', UnitType[measurementDetail.parameterY.unitType.toString()]);
    params.set('childMeasure', measurementDetail.valueOfParameterY.toString().replace(',', '.'));
    return this.http.get(url, {params: params})
      .toPromise()
      .then(response => response.json() as ValuePerPercentile)
      .catch(this.handleError);
  }

  calculateAndSaveMeasurement(measurementDetail: MeasurementDetail, babyName: string, save: boolean, days: number): Promise<ValuePerPercentile> {
    const url = `users/user/babies/baby/${babyName}/${measurementDetail.measurementType}`;
    return this.http.get(url, this.getOptions(measurementDetail, save, days))
      .toPromise()
      .then(response => response.json() as ValuePerPercentile)
      .catch(this.handleError);
  }

  getParams(measurementDetail: MeasurementDetail): RequestOptions {
    const params: URLSearchParams = new URLSearchParams();
    params.set('unitValue', String(measurementDetail.parameterX));
    params.set('childMeasure', String(measurementDetail.valueOfParameterX.replace(',', '.')));
    const options = new RequestOptions({params: params});
    return options;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  private getOptions(measurementDetail: MeasurementDetail, save: boolean, days: number): RequestOptions {
    const re = /"/gi;
    const headers = new Headers({
      'content-type': 'application/json',
      'authorization': localStorage.getItem('authToken').replace(re, '')
    });

    const params = new URLSearchParams();
    params.set('unitTypeForParameterX', UnitType[measurementDetail.parameterX.unitType.toString()]);
    params.set('unitValueForParameterX', measurementDetail.valueOfParameterX.toString().replace(',', '.'));
    params.set('unitTypeForParameterY', UnitType[measurementDetail.parameterY.unitType.toString()]);
    params.set('childMeasure', measurementDetail.valueOfParameterY.toString().replace(',', '.'));
    params.set('save', save.toString());
    params.set('dayOfLife', String(days));

    return new RequestOptions({headers: headers, params: params});
  }
}
