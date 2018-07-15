import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Baby} from '../_models/baby';
import {BabyAge} from '../_models/baby-age';

@Injectable()
export class BabyService {

  private _currentBaby: Baby;
  private _currentBabyAge: BabyAge;

  constructor(private http: Http) {
  }

  get currentBaby(): Baby {
    return this._currentBaby;
  }

  set currentBaby(value: Baby) {
    this._currentBaby = value;
  }

  get currentBabyAge(): BabyAge {
    return this._currentBabyAge;
  }

  set currentBabyAge(value: BabyAge) {
    this._currentBabyAge = value;
  }

  clean() {
    this._currentBaby = null;
    this._currentBabyAge = null;
  }
}
