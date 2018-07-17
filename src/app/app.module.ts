import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SidebarModule} from 'ng-sidebar';
import {UserBabyComponent} from './user/baby/baby.component';
import {ChartsModule} from 'ng2-charts/charts/charts';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AdminComponent} from './admin/admin.component';
import {AppRoutingModule} from './app-routing.module';
import {AlertService} from './_services/alert.service';
import {AuthenticationService} from './_services/authentication.service';
import {RegisterService} from './register/register.service';
import {UserService} from './_services/user.service';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AlertComponent} from './_directives/alert.component';


import {CalculatorComponent} from './calculator/calculator.component';
import {ChartComponent} from './chart/chart.component';
import {AboutComponent} from './about/about.component';
import {CalculatorService} from './calculator/calculator.service';
import {ChartService} from './chart/chart.service';
import {UserComponent} from './user/user.component';
import {AddBabyComponent} from './user/add-baby/add-baby.component';
import {ManageAdminsComponent} from './admin/manage-admins/manage-admins.component';
import {ManageUsersComponent} from './admin/manage-users/manage-users.component';
import {WelcomeComponent} from './admin/welcome/welcome.component';
import {StatisticComponent} from './admin/statistic/statistic.component';
import {UserWelcomeComponent} from './user/welcome/user-welcome.component';
import {UserAdvancedComponent} from './user/advanced/advanced.component';
import {UserBabyMeasureComponent} from './user/baby/measure/measure.component';
import {UserBabyMeasureHistoryComponent} from './user/baby/measure-history/measure-history.component';
import {BabyService} from './_services/baby.service';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {SearchService} from './_services/search.service';
import {AdminService} from './_services/admin.service';
import {MeasurementService} from './_services/measurement.service';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {CollapsibleModule} from 'angular2-collapsible';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomeComponent,
    AdminComponent,
    AboutComponent,
    AlertComponent,
    AdminComponent,
    LoginComponent,
    ChartComponent,
    WelcomeComponent,
    AddBabyComponent,
    UserBabyComponent,
    RegisterComponent,
    CalculatorComponent,
    ManageUsersComponent,
    ManageAdminsComponent,
    StatisticComponent,
    UserWelcomeComponent,
    UserAdvancedComponent,
    UserBabyMeasureComponent,
    UserBabyMeasureHistoryComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapsibleModule,
    Ng2SmartTableModule,
    MultiselectDropdownModule,
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot(),
    SidebarModule.forRoot(),
    MatProgressSpinnerModule
  ],
  providers: [
    BabyService,
    UserService,
    AdminService,
    AlertService,
    ChartService,
    SearchService,
    RegisterService,
    CalculatorService,
    MeasurementService,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
