import {Injectable} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {AlertType} from '../_models/alertTyps';
import {Alert} from '../_models/alert';

@Injectable()
export class AlertService {
  private subject = new Subject<Alert>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert messages
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Success, message, keepAfterRouteChange);
  }

  error(message: string, keepAfterRouteChange = false) {
    console.log('ERROR !!!!!!!!!|');
    if (message === 'BAD_MEASUREMENT_PARAMETERS') {
      message = 'Niepoprawne parametry zapytania';
    }
    if (message === 'MEASUREMENT_OUT_OF_BOUND') {
      message = 'Parametry dziecka nie mieszczą się w zakresie danych';
    }
    if (message === 'MEASUREMENT_ALREADY_EXIST') {
      message = 'Taki pomiar juz istnieje';
    }
    if (message === 'CANNOT_USE_VALUE_BELOW_91_DAYS') {
      message = 'Ten pomiar obejmuje tylko dzieci powyzej 3 miesiecy (od 92 dnia życia)';
    }
    this.alert(AlertType.Error, message, keepAfterRouteChange);
  }

  info(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Info, message, keepAfterRouteChange);
  }

  warn(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Warning, message, keepAfterRouteChange);
  }

  alert(type: AlertType, message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<Alert>{type: type, message: message});
  }

  clear() {
    // clear alerts
    this.subject.next();
  }

}
