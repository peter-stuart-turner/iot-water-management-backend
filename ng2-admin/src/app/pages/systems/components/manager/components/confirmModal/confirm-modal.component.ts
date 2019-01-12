import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../../../../../services/firebase.service';

@Component({
  selector: 'add-service-modal',
  styleUrls: [('./confirm-modal.component.scss')],
  templateUrl: './confirm-modal.component.html'
})

export class ConfirmModal implements OnInit {

  modalHeader: string;
  modalContentBody: string = 'Lorem ipsum dolor sit amet:';
  modalContentKey: string = 'null';
  modalActionButton: string = 'Save';

  constructor(private firebaseService: FirebaseService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit() { }

  performAction() {
    switch (this.modalActionButton) {
      case 'Activate': {
        console.log('Activate the system');
        this.firebaseService.activateSystem(this.modalContentKey);
        this.closeModal();
        break;
      }
      case 'Deactivate': {
        console.log('Deactivate the system');
        this.firebaseService.deactivateSystem(this.modalContentKey);
        this.closeModal();
        break;
      }
      case 'Delete': {
        console.log('Delete the system');
        this.firebaseService.removeSystem(this.modalContentKey);
        this.closeModal();
        break;
      }
      default: {
        console.log('Invalid call');
        this.closeModal();
        break;
      }
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
