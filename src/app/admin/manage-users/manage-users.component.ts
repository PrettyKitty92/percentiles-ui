import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {getAllDebugNodes} from '@angular/core/src/debug/debug_node';
import {AdminService} from '../../_services/admin.service';
import {SearchService} from '../../_services/search.service';
import {Subject} from 'rxjs/Subject';
import {Baby} from '../../_models/baby';
import {AlertService} from '../../_services';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {


  title = 'Manage users';
  loading = true;
  currentUser: User;
  users: User[] = null;
  searchTerm$ = new Subject<string>();
  searches = '';
  selectedUser: User;
  contentIsLoading = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private alertService: AlertService,
              private searchService: SearchService) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.searchService.searchUsers(this.searchTerm$)
      .subscribe(results => {
        this.searches = results;
      });
  }


  ngOnInit(): void {
    this.users = null;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loading = false;
  }


  getAllUsers() {
    this.loading = true;
    this.contentIsLoading = true;
    if (this.users !== null) {
      this.users = null;
      this.loading = false;
      this.contentIsLoading = false;
    } else {
      this.adminService.allUsers().then(
        result => {
          this.users = result;
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
    this.adminService.userByName(username).then(
      result => {
        this.selectedUser = result;
        this.users = null;
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
    console.log(this.selectedUser);
  }

  editUser(user: User) {

  }

  deleteUser(user: User) {
    this.loading = true;
    this.contentIsLoading = true;
    this.adminService.deleteUser(user.username).then(
      result => {
        console.log(result);
        this.selectedUser = null;
        this.users = null;
        this.searches = null;
        this.loading = false;
        this.contentIsLoading = false;
      },
      error => {
        console.log('Siema');
        console.log(error);
        this.contentIsLoading = false;
        this.alertService.error(error['_body']);
        this.loading = false;
      });
    console.log(this.selectedUser);
  }
}
