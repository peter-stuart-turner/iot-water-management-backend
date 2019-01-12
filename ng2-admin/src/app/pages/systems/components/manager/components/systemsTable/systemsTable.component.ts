import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from '../confirmModal/confirm-modal.component';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { UserService } from '../../../../../../services/user.service';
import { System_IF } from '../../../../../../interfaces/all_interfaces';
import * as Rx from "RxJs";

@Component({
  selector: 'systems-table',
  styleUrls: [('./systemsTable.component.scss')],
  templateUrl: './systemsTable.html'
})
export class SystemsTable {

  systems: Array<any>;
  systemUsers: Array<any>;
  systemStates: Array<any>;
  prevStates: Array<any>;
  // Previous State Displayable TimeStamps
  prevDispTimeStamps: Array<any>;
  systemsRTD: Array<{ state: systemState_IF, GSID: string }>;

  constructor(private firebaseService: FirebaseService,
              private userService: UserService,
              private modalService: NgbModal) {}

  ngOnInit(){
    this.populateTable();
    // this.firebaseService.getSystems2()
    //   .mergeMap(_systems => this.mergeSystems_and_Observables(_systems))
    //   .subscribe(data => {console.log("YAY THERE IS DATA", data)});
  }
  private populateTable(){
    this.systemUsers = [];
    this.systemsRTD = [];
    this.systemStates = [];
    this.prevStates = [];
    this.prevDispTimeStamps = [];
    this.firebaseService.getSystems().subscribe(systems => {
      this.systems = systems;
      systems.forEach((system) => {
        this.userService.getUserObject(system.uid).subscribe(user => {
            this.systemUsers.push(user);
        });
        this.firebaseService.getSystemRealtimeData(system.GSID).subscribe( rtd => {
          let state = rtd.state;
          let prevState: string = null;
          let dispStamp: string = null;
          if(rtd.prevState && rtd.dispStamp){
            prevState = rtd.prevState;
            dispStamp = rtd.dispStamp;
          }

          if(!state){
            state = 'Error (Undefined)'
          }
          if(!prevState){
            prevState = 'Not yet Known'
          }
          if(!dispStamp){
            dispStamp = 'n/a'
          }
          this.systemStates.push(state);
          this.prevStates.push(prevState);
          this.prevDispTimeStamps.push(dispStamp);
          // this.systemsRTD.push( { state: (rtd.state as systemState_IF), GSID: system.GSID} );
          // console.log("YAY NOW WE REALLY HAVE DATA", this.systemsRTD)
        })
      });
    });
  }
  private getState_from_GSID(GSID: string){
    let gsid = parseInt(GSID);
    let state = this.systemsRTD[gsid - 1].state
    if (this.systemsRTD[gsid-1].GSID == GSID){
      if(!state){
        return "N/A";
      }
      else{
        return state;;
      }
    }
  }
  // mergeSystems_and_Observables <System_IF> (_systems){
  //   let systems: Array<System_IF> = [];
  //   console.log('_Systems', _systems);
  //     _systems.forEach( system => {
  //       this.firebaseService.getSystemRealtimeData(system.GSID)
  //       .map( rtD => {
  //         system.realTimeData = rtD;
  //         systems.push(system);
  //       }).subscribe();
  //     })
  // }
  public rowClicked(item) {
    alert('Clicked on row ' + item);
  }

  public edit(event, item) {
    alert('Edit ' + item);
  }

  public activate(event, item) {
    let heading = "Activate System";
    let body = "Are you sure you want to activate:";
    let button = "Activate";
    this.showConfirmModal(heading, body, item, button);
  }

  public deactivate(event, item) {
    let heading = "Deactivate System";
    let body = "Are you sure you want to deactivate:";
    let button = "Deactivate";
    this.showConfirmModal(heading, body, item, button);
  }

  public delete(event, item) {
    let heading = "Delete System";
    let body = "Are you sure you want to delete:";
    let button = "Delete";
    this.showConfirmModal(heading, body, item, button);
  }

  public generate(event, item) {
    alert('Generate QR Code ' + item);
  }

  showConfirmModal(heading, content, key, button){
    const activeModal = this.modalService.open(ConfirmModal, {size: 'sm'});
    activeModal.componentInstance.modalHeader = heading;
    activeModal.componentInstance.modalContentBody = content;
    activeModal.componentInstance.modalContentKey = key;
    activeModal.componentInstance.modalActionButton = button;
  }
}
interface systemState_IF {
  state: string;
}
