import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class SearchService {

  queryUrl = '?search=';
  constructor(private http: Http) {
  }

  searchAdmins(terms: Observable<string>) {
    const url = `/admin/admins/names`;
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(url, term));
  }

  searchUsers(terms: Observable<string>) {
    const url = `/admin/users/names`;
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(url, term));
  }

  searchEntries(url, term) {
    return this.http.get(url + this.queryUrl + term, this.getOptions())
      .map(res => res.json());
  }

  private getOptions(): RequestOptions {
    const re = /"/gi;
    const headers = new Headers({
      'content-type': 'application/json',
      'authorization': localStorage.getItem('authToken').replace(re, '')
    });
    return new RequestOptions({headers: headers});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
