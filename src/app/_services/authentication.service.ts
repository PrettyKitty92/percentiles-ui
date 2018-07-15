import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';

import {Credentials} from '../_models/credential';
import {User} from '../_models/user';
import {UserService} from './user.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  constructor(private http: Http, private userService: UserService) {
  }

  login(username: string, password: string): Promise<Response> {
    const headers = new Headers({
      'content-type': 'application/json'
    });
    const options = new RequestOptions({ headers: headers });
    const url = `/login`;
    return this.http.post(url, this.setCredential(username, password), options)
      .toPromise()
      .then(response => response as Response)
      .catch(this.handleError);
  }

  loadUserDetail(): Promise<User> {
    const re = /"/gi;
    const headers = new Headers({
      'content-type': 'application/json',
      'authorization': localStorage.getItem('authToken').replace(re, '')
    });
    const options = new RequestOptions({ headers: headers });
    const url = `/users/user/details`;
    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  setCredential(username: string, password: string): Credentials {
    return {
      username: username,
      password: password
    };
  }

  checkCredentials() {
    if (localStorage.getItem('currentUser') === null) {

    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
