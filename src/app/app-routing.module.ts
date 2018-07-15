import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdminComponent} from './admin/admin.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {CalculatorComponent} from './calculator/calculator.component';
import {ChartComponent} from './chart/chart.component';
import {AboutComponent} from './about/about.component';
import {UserComponent} from './user/user.component';
import {AddBabyComponent} from './user/add-baby/add-baby.component';
import {UserBabyComponent} from './user/baby/baby.component';
import {ManageAdminsComponent} from './admin/manage-admins/manage-admins.component';
import {ManageUsersComponent} from './admin/manage-users/manage-users.component';
import {StatisticComponent} from './admin/statistic/statistic.component';
import {WelcomeComponent} from './admin/welcome/welcome.component';
import {UserWelcomeComponent} from './user/welcome/user-welcome.component';
import {UserAdvancedComponent} from './user/advanced/advanced.component';
import {UserBabyMeasureComponent} from './user/baby/measure/measure.component';
import {UserBabyMeasureHistoryComponent} from './user/baby/measure-history/measure-history.component';

const routes: Routes = [
  {path: '', redirectTo: 'pages/home', pathMatch: 'full'},
  /*  {path: 'pages/home', component: HomeComponent,
   children: [

   ]
   },*/
  {
    path: 'pages/home', component: HomeComponent,
    children: [
      {path: 'about', component: AboutComponent},
      {path: 'calculator', component: CalculatorComponent},
      {path: 'charts/samples', component: ChartComponent}
    ]
  },
  {
    path: 'pages/user', component: UserComponent,
    children: [
      {path: 'baby/add', component: AddBabyComponent},
      {
        path: 'baby/:name', component: UserBabyComponent, children: [
        {path: 'measure', component: UserBabyMeasureComponent},
        {path: 'measure/history/:option', component: UserBabyMeasureHistoryComponent}
      ]
      },
      {path: 'welcome', component: UserWelcomeComponent},
      {path: 'advanced', component: UserAdvancedComponent}
    ]
  },
  {
    path: 'pages/admin', component: AdminComponent,
    children: [
    /*  {path: 'manages/admins/:option', component: ManageAdminsComponent},
      {path: 'manages/users/:option', component: ManageUsersComponent},*/
      {path: 'manages/admins', component: ManageAdminsComponent},
      {path: 'manages/users', component: ManageUsersComponent},
      {path: 'manages/statistics', component: StatisticComponent},
      {path: 'welcome', component: WelcomeComponent},
    ]
  },
  {path: 'pages/sign-in', component: LoginComponent},
  {path: 'pages/sign-up', component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
