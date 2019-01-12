import { Component, OnInit, OnDestroy } from '@angular/core'; import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { ConfirmAddModal } from '../confirmAdd/confirmAdd.component';
import { System } from '../system';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'system-details',
  templateUrl: './systemDetails.html',
})
export class SystemDetails implements OnInit, OnDestroy {

  system_id: number;
  private routerSub: any;
  private systemSub: any;
  system: System;

  constructor(private firebaseService: FirebaseService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.routerSub = this.route.params.subscribe(params => {
      this.system_id = +params['id'];

      this.systemSub = this.firebaseService.getSystem(this.system_id).subscribe(system => {
        this.system = system;
      });
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.systemSub.unsubscribe();
  }

}

interface System {
  key: number;
  system_model: string;
  gCapacity?: number;
  rCapacity?: number;
}
