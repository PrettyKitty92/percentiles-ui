import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';

@Injectable()
export class MeasurementService {

  constructor(private http: Http) {
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private getOptions(): RequestOptions {
    const re = /"/gi;
    const headers = new Headers({
      'content-type': 'application/json',
      'authorization': localStorage.getItem('authToken').replace(re, '')
    });
    return new RequestOptions({headers: headers});
  }

  saveLMS(measurementDetails: any, lms: any) {
    console.log(measurementDetails);
    const url = `/admin/measurement/edit/lms`;
    const search = new URLSearchParams();
    search.set('type', measurementDetails.type);
    search.set('sex', measurementDetails.sex);
    search.set('parameterX', measurementDetails.parameterX);
    const re = /"/gi;
    const headers = new Headers({
      'content-type': 'application/json',
      'authorization': localStorage.getItem('authToken').replace(re, '')
    });
    return this.http.put(url, lms,{headers: headers, params: search})
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  savePercentiles(measurementDetails: any, valuePerPercentiles: any) {
    console.log(measurementDetails);
    const url = `/admin/measurement/edit/percentiles`;
    const search = new URLSearchParams();
    search.set('type', measurementDetails.type);
    search.set('sex', measurementDetails.sex);
    search.set('parameterX', measurementDetails.parameterX);
    const re = /"/gi;
    const headers = new Headers({
      'content-type': 'application/json',
      'authorization': localStorage.getItem('authToken').replace(re, '')
    });
    return this.http.put(url, valuePerPercentiles,{headers: headers, params: search})
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  getMeasurementData(measurementDetails: any) {
    console.log(measurementDetails);
    const url = `/admin/measurement/details`;
    const search = new URLSearchParams();
    search.set('type', measurementDetails.type);
    search.set('sex', measurementDetails.sex);
    search.set('parameterX', measurementDetails.parameterX);
    const re = /"/gi;
    const headers = new Headers({
      'content-type': 'application/json',
      'authorization': localStorage.getItem('authToken').replace(re, '')
    });
    return this.http.get(url, {headers: headers, params: search})
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
}
