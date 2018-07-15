import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../_models/user';
import {SearchService} from '../../_services/search.service';
import {Subject} from 'rxjs/Subject';
import {AdminService} from '../../_services/admin.service';
import {RegisterService} from '../../register/register.service';
import {AlertService} from '../../_services';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss'],
})
export class ManageAdminsComponent implements OnInit {

  title = 'Manage Admins';
  currentUser: User;
  /*option: string;*/
  searchTerm$ = new Subject<string>();
  searches = '';
  admins;
  loading = true;
  selectedAdmin: User;

  register = false;
  registeredAdmin: any = {};

  search = true;
  edit = false;
  oldAdminName = null;
  newAdminData: any = {};
  contentIsLoading = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private searchService: SearchService,
              private registerService: RegisterService,
              private alertService: AlertService) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.searchService.searchAdmins(this.searchTerm$)
      .subscribe(results => {
        this.searches = results;
      });
  }


  ngOnInit(): void {
    this.admins = null;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loading = false;
  }

  getAllAdmins() {
    this.loading = true;
    this.contentIsLoading = true;
    if (this.admins !== null) {
      this.admins = null;
      this.loading = false;
      this.contentIsLoading = false;
    } else {
      this.adminService.allAdmins().then(
        result => {
          this.admins = result;
          this.loading = false;
          this.contentIsLoading = false;
        },
        error => {
          this.contentIsLoading = false;
          this.alertService.error(error['_body']);
          this.loading = false;
        });
    }
  }

  showDetails(username) {
    this.loading = true;
    this.contentIsLoading = true;
    this.adminService.adminByName(username).then(
      result => {
        this.selectedAdmin = result;
        this.admins = null;
        this.searches = null;
        this.loading = false;
        this.contentIsLoading = false;
      },
      error => {
        console.log('Siema');
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        this.loading = false;
      });
    console.log(this.selectedAdmin);
  }

  registerAdmin() {
    this.loading = true;
    this.contentIsLoading = true;
    this.registerService.singUpAdmin(this.registeredAdmin).then(
      response => {
        if (response.status === 201) {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['pages/admin/manages/admins']);
          this.registeredAdmin = null;
          this.register = false;
        } else {
          this.alertService.error(response.message);
          this.loading = false;
          this.router.navigate(['pages/admin/manages/admins']);
          this.registeredAdmin = null;
          this.register = false;
        }
        this.contentIsLoading = false;
      }
    ).catch(
      error => {
        {
          this.contentIsLoading = false;
          this.alertService.error(error['_body']);
          this.loading = false;
        }
      }
    );
  }

  editAdmin() {
    this.loading = true;
    this.contentIsLoading = true;
    console.log(this.newAdminData);
    this.adminService.updateAdmin2(this.newAdminData).then(
      response => {
        console.log(response.status);
        if (response.status === 201) {
          this.alertService.success('Update successful', true);
          this.router.navigate(['pages/admin/manages/admins']);
          this.newAdminData = null;
          this.edit = false;
        } else {
          this.alertService.error(response.message);
          this.loading = false;
          this.router.navigate(['pages/admin/manages/admins']);
          this.newAdminData = null;
          this.edit = false;
        }
        this.contentIsLoading = false;
      }
    ).catch(
      error => {
        {
          this.contentIsLoading = false;
          this.alertService.error(error['_body']);
          console.log(error);
          this.loading = false;
        }
      }
    );
  }

  deleteAdmin(user: User) {
    this.loading = true;
    this.contentIsLoading = true;
    this.adminService.deleteAdmin(user.username).then(
      result => {
        console.log(result);
        this.selectedAdmin = null;
        this.admins = null;
        this.searches = null;
        this.loading = false;
      },
      error => {
        console.log('Siema');
        console.log(error);
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        this.loading = false;
      });
  }

  openRegistrationPanel() {
    this.clear();
    this.admins = null;
    this.searches = null;
    this.selectedAdmin = null;
    this.register = true;
    this.edit = false;
  }

  openEditPanel(user: User) {
    this.clear();
    console.log(user);
    this.oldAdminName = user.username;
    this.newAdminData = user;
    this.edit = true;
    console.log(this.newAdminData);
  }

  clear() {
    this.admins = null;
    this.searches = null;
    this.selectedAdmin = null;
    this.register = false;
    this.edit = false;
    this.search = false;
  }

  openSearchPanel() {
    this.clear();
    this.search = true;
  }
}
