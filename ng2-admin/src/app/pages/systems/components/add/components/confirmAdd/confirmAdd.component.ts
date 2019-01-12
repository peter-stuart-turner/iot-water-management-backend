import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { System } from '../system';

@Component({
  selector: 'add-system-modal',
  styleUrls: [('./confirmAdd.component.scss')],
  templateUrl: './confirmAdd.component.html'
})

export class ConfirmAddModal implements OnInit {

  modalHeader: string = 'Add System';
  modalContentBody: string = 'Are you ure you want ot add:';

  systemKey: string;
  system: System;

  constructor(private firebaseService: FirebaseService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit() { }

  addSystem() {
    this.firebaseService.addSystem(this.systemKey, this.system);
    this.activeModal.close();
  }

  closeModal() {
    this.activeModal.close();
  }
}
