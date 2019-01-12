import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { ConfirmAddModal } from '../confirmAdd/confirmAdd.component';
import { System } from '../system';

@Component({
  selector: 'add-form',
  templateUrl: './addForm.html',
})
export class AddForm implements OnInit {

  public system: System;

  public system_models = ['Greywater', 'Rainwater', 'Irrigation', 'GR Combo', 'GI Combo', 'RI Combo', 'GRI Combo'];

  public grey_water_cap = [
    { value: 200, display: '200 liters' },
    { value: 500, display: '500 liters' },
    { value: 750, display: '750 liters' }
  ];

  public rain_water_cap = [
    { value: 5000, display: '5000 liters' },
    { value: 10000, display: '10000 liters' },
    { value: 15000, display: '15000 liters' }
  ];

  constructor(private firebaseService: FirebaseService,
    private modalService: NgbModal) {

    this.system = {
      key: 0,
      system_model: this.system_models[0],
      gCapacity: this.grey_water_cap[0].value,
      rCapacity: this.rain_water_cap[0].value,
    }

  }

  ngOnInit() {
    this.system = {
      key: 0,
      system_model: this.system_models[0],
      gCapacity: this.grey_water_cap[0].value,
      rCapacity: this.rain_water_cap[0].value,
    }

    this.firebaseService.getSystems().subscribe(systems => {
      if (systems.length == 0) {
        this.system.key = 0;
      }
      else {
        this.system.key = +systems[systems.length - 1].$key + 1;
      }

    });

  }

  ngOnDestroy() {
  }

  public addSystem(isValid: boolean, system: System) {
    this.showConfirmAddModal(this.system.key, system)
  }

  showConfirmAddModal(system_key, system) {
    const addModal = this.modalService.open(ConfirmAddModal, { size: 'sm' });
    addModal.componentInstance.systemKey = system_key;
    addModal.componentInstance.system = system;
  }
}
