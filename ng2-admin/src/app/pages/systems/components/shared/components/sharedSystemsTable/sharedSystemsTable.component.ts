import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ConfirmModal } from '../confirmModal/confirm-modal.component';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { UserService } from '../../../../../../services/user.service';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'shared-systems-table',
  styleUrls: [('./sharedSystemsTable.component.scss')],
  templateUrl: './sharedSystemsTable.html'
})
export class SharedSystemsTable {

  private subscription: ISubscription;

  systems: Array<any>;
  systemUsers: Array<any>;

  isSelectedSystem: boolean = false;
  selectedSystem: any;
  selectedUser: any;
  sharedSystems: Array<ShareableSystems>;
  firebaseSharedSystems: Array<number>;

  constructor(private firebaseService: FirebaseService,
    private userService: UserService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.systemUsers = [];
    this.sharedSystems = [];
    this.firebaseSharedSystems = [];

    this.firebaseService.getSystems().subscribe(systems => {
      this.systems = systems;
      systems.forEach((system) => {
        this.userService.getUserObject(system.uid).subscribe(user => {
          this.systemUsers.push(user);
        });
      });
    });
  }

  public rowClicked(index, item) {
    console.log('Clicked on system ' + item + ' on row ' + index);
    this.selectedSystem = this.systems[index];
    this.selectedUser = this.systemUsers[index];
    this.firebaseSharedSystems = [];
    this.sharedSystems = [];

    if (this.selectedUser.$key == 'undefined') {
      console.log('No user for system');
      this.isSelectedSystem = false;
    }
    else {
      console.log(this.selectedUser);

      this.subscription = this.firebaseService.getSharedSystems(item).subscribe(sharedSystems => {

        this.firebaseSharedSystems = [];
        this.sharedSystems = [];

        sharedSystems.forEach((system) => {
          var selectVal = system.$value;
          var tempArray = this.selectedUser.systems.slice(0);
          console.log('New tempArray: ' + tempArray);

          var index = tempArray.indexOf(+selectVal);
          if (index > -1) {
            tempArray.splice(index, 1);
          }

          this.firebaseSharedSystems.push(selectVal);
          tempArray.unshift(selectVal);
          console.log('tempArray: ' + tempArray);

          var temp: ShareableSystems = {
            shareable_systems: tempArray
          };

          this.sharedSystems.push(temp);
          console.log('Add: ' + selectVal);
        });

        console.log('firebaseSharedSystems ' + this.firebaseSharedSystems);

        this.isSelectedSystem = true;
        // this.subscription.unsubscribe();
      });
    }
  }

  public addRow() {
    console.log('Add row');

    var tempArray = this.selectedUser.systems;
    var index = this.selectedUser.systems.indexOf(+this.selectedSystem.$key);
    if (index > -1) {
      this.selectedUser.systems.splice(index, 1);
    }

    var temp: ShareableSystems = {
      shareable_systems: tempArray
    };

    this.firebaseSharedSystems.push(+tempArray[0]);
    this.sharedSystems.push(temp);
    this.firebaseService.updateSharedSystems(this.selectedSystem.$key, this.firebaseSharedSystems);
  }

  public deleteRow(index) {
    console.log('Delete row');
    this.sharedSystems.splice(index, 1);
    this.firebaseSharedSystems.splice(index, 1);
    this.firebaseService.updateSharedSystems(this.selectedSystem.$key, this.firebaseSharedSystems);
  }

  public selectedSystems(row, selectedSystem) {
    console.log('Row: ' + row + ' system: ' + selectedSystem);
    this.firebaseSharedSystems[row] = +selectedSystem;
    this.firebaseService.updateSharedSystems(this.selectedSystem.$key, this.firebaseSharedSystems);
  }

  public saveChanges() {
    console.log('Save changes');
    console.log(this.firebaseSharedSystems);
    this.firebaseService.updateSharedSystems(this.selectedSystem.$key, this.firebaseSharedSystems);
    this.firebaseSharedSystems = [];
  }

}

export interface ShareableSystems {
  shareable_systems: Array<any>;
}
