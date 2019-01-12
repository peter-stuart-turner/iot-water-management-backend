import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from '../confirmModal/confirm-modal.component';
import { FirebaseService } from '../../../../../../services/firebase.service';


@Component({
  selector: 'systems-table',
  styleUrls: [('./systemsTable.component.scss')],
  templateUrl: './systemsTable.html'
})
export class SystemsTable {

  systems: Array<any>;

  constructor(private firebaseService: FirebaseService,
              private modalService: NgbModal) {}

  ngOnInit(){
    this.firebaseService.getSystems().subscribe(systems => {
      this.systems = systems;
    });
  }

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
