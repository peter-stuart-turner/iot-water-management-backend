import { Component, OnInit, OnDestroy } from '@angular/core'; import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { UserService } from '../../../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-details',
  templateUrl: './userDetails.html',
})
export class UserDetails implements OnInit, OnDestroy {

  user_id: string;
  private routerSub: any;
  private userSub: any;
  user: any;

  constructor(private firebaseService: FirebaseService,
    private userService: UserService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.routerSub = this.route.params.subscribe(params => {
      this.user_id = params['id'];
      this.userSub = this.userService.getUserObject(this.user_id).subscribe(userData => {
        this.user = userData;
      });
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.userSub.unsubscribe();
  }

}

interface User {
  key: number;
  system_model: string;
  gCapacity?: number;
  rCapacity?: number;
}
