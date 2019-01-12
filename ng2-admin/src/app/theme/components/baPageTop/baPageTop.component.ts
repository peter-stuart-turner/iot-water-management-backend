import { Component } from '@angular/core';

import { GlobalState } from '../../../global.state';
import { AuthService } from '../../../providers/auth.service';
import { UserService } from '../../../services/user.service';

import 'style-loader!./baPageTop.scss';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public userFirstName = '';
  public userLastName = '';
  uid: string;
  user: Profile;

  constructor(private authService: AuthService,
    private userService: UserService,
    private _state: GlobalState) {

    this.user = {
      email: '',
      firstName: '',
      lastName: '',
      role: 'client'
    };

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

    this.uid = authService.getUID();

    this.userService.getUserObject(this.uid).subscribe(user => {
      this.user = user;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  logUserOut(){
    console.log('Log user out');
    this.authService.logout();
  }
}


export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
