import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {ChartData} from '../_models/chart-data';
import {MeasurementDetail} from '../measurement/measurement-detail';
import {ValuePerPercentile} from '../_models/value-per-percentile';
import {UnitType} from '../measurement/unit-type';

@Injectable()
export class ChartService {

  private url = '/samples/charts';

  constructor(private http: Http) {
  }

  getSamples(): Promise<ChartData> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as ChartData)
      .catch(this.handleError);
  }

  getSample(): Promise<ChartData> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as ChartData)
      .catch(this.handleError);
  }

  getSampleForMeasurement(measurementDetails: MeasurementDetail, valuePerPercentile: ValuePerPercentile) {
    const params = new URLSearchParams();
    params.set('unitTypeForParameterX', UnitType[measurementDetails.parameterX.unitType.toString()]);
    params.set('unitValue', measurementDetails.valueOfParameterX.toString().replace(',', '.'));
    params.set('valuePerPercentile', valuePerPercentile.value.toString());
    params.set('percentile', valuePerPercentile.percentile.toString());
    console.log(params);
    let url = `/samples/charts/result/${measurementDetails.measurementType}/${measurementDetails.childSex}`;
    if (measurementDetails.measurementType === 'WEIGHT_FOR_LENGTH' || measurementDetails.measurementType === 'WEIGHT_FOR_HEIGHT'){
      url = `/samples/charts/result/WEIGHT_FOR_LENGTH_HEIGHT/${measurementDetails.childSex}`;
    }

    return this.http.get(url, {params: params})
      .toPromise()
      .then(response => response.json() as ChartData)
      .catch(this.handleError);
  }

  getSampleForMeasurementWithBirthDate(measurementDetails: MeasurementDetail, valuePerPercentile: ValuePerPercentile, birthDate: string) {
    const params = new URLSearchParams();
    params.set('unitTypeForParameterX', UnitType[measurementDetails.parameterX.unitType.toString()]);
    params.set('unitValue', measurementDetails.valueOfParameterX.toString().replace(',', '.'));
    params.set('valuePerPercentile', valuePerPercentile.value.toString());
    params.set('percentile', valuePerPercentile.percentile.toString());
    params.set('birthDate', birthDate);
    console.log(params);
    const url = `/samples/charts/result/${measurementDetails.measurementType}/${measurementDetails.childSex}`;

    return this.http.get(url, {params: params})
      .toPromise()
      .then(response => response.json() as ChartData)
      .catch(this.handleError);
  }

  getGeneralChart(data): Promise<ChartData> {
    let url = `/samples/charts/${data.measurementType}/${data.childSex}`;
    if (data.measurementType === 'WEIGHT_FOR_LENGTH' || data.measurementType === 'WEIGHT_FOR_HEIGHT'){
      url = `/samples/charts/WEIGHT_FOR_LENGTH_HEIGHT/${data.childSex}`;
    }
    const params = new URLSearchParams();
    console.log(data);
    params.set('unitTypeForParameterX', UnitType[data.parameterXUnitType.unitType.toString()]);

    return this.http.get(url, {params: params})
      .toPromise()
      .then(response => response.json() as ChartData)
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
