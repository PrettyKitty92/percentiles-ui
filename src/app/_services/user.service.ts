import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';

import {User} from '../_models/index';
import {Baby} from '../_models/baby';
import {BabyAge} from '../_models/baby-age';

@Injectable()
export class UserService {

  constructor(private http: Http) {
  }

  addBaby(body: Baby): Promise<User> {
    const url = `/users/user/babies/add`;
    return this.http.post(url, body, this.getOptions())
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  getBabyAge(babyName: string): Promise<BabyAge> {
    const url = `/users/user/babies/baby/` + babyName + `/age`;
    return this.http.get(url, this.getOptions())
      .toPromise()
      .then(response => response.json() as BabyAge)
      .catch(this.handleError);
  }

  getAllBabyMeasurements(babyName: string, measurementType: any): Promise<any> {
    const url = `/users/user/babies/baby/${babyName}/measurements/${measurementType}`;
    return this.http.get(url, this.getOptions())
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  getBabyMeasurementsFromDayToDay(babyName: string, measurementType: any, from: number, to: number): Promise<any> {
    const url = `/users/user/babies/baby/${babyName}/measurements/${measurementType}/periodInDays`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('from', String(from));
    params.set('to', String(to));
    const options = new RequestOptions({params: params});
    options.headers = this.getOptions().headers;
    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  getBabyMeasurementsFromDateToDate(babyName: string, measurementType: string, from: string, to: string): Promise<any> {
    const url = `/users/user/babies/baby/${babyName}/measurements/${measurementType}/periodInDates`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('from', from);
    params.set('to', to);
    const options = new RequestOptions({params: params});
    options.headers = this.getOptions().headers;
    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  getAllBabyMeasurementsChart(babyName: string, measurementType: any): Promise<any> {
    const url = `/users/user/babies/baby/${babyName}/measurements/${measurementType}/chart`;
    return this.http.get(url, this.getOptions())
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  getBabyMeasurementsFromDayToDayChart(babyName: string, measurementType: any, from: number, to: number): Promise<any> {
    const url = `/users/user/babies/baby/${babyName}/measurements/${measurementType}/periodInDays/chart`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('from', String(from));
    params.set('to', String(to));
    const options = new RequestOptions({params: params});
    options.headers = this.getOptions().headers;
    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  getBabyMeasurementsFromDateToDateChart(babyName: string, measurementType: string, from: string, to: string): Promise<any> {
    const url = `/users/user/babies/baby/${babyName}/measurements/${measurementType}/periodInDates/chart`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('from', from);
    params.set('to', to);
    const options = new RequestOptions({params: params});
    options.headers = this.getOptions().headers;
    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  compareBabies(babies, measurementType: string) {
    const url = `/users/user/babies/compare`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('babies', String(babies));
    params.set('measurementType', measurementType);
    const options = new RequestOptions({params: params, headers: this.getOptions().headers});
    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
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



}
