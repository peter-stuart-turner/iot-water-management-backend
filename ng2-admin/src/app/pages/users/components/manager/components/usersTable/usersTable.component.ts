import { Component } from '@angular/core';
import { Pipe } from '@angular/core';
import { UserService } from '../../../../../../services/user.service';


@Component({
  selector: 'users-table',
  styleUrls: [('./usersTable.component.scss')],
  templateUrl: './usersTable.html'
})
export class UsersTable {

  users: Array<any>;
  roles = [
     {
       value: 'client'
     }, {
       value: 'installer'
     }, {
       value: 'admin'
     }
   ];

  constructor(private userService: UserService) {}

  ngOnInit(){
    this.users = [];

    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  public changeRole(uid, role) {
    this.userService.updateUserRole(uid, role.toLowerCase());
  }

}
