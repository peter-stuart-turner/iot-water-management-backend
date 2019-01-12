import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup , FormControl , ReactiveFormsModule , FormsModule } from '@angular/forms';

import { routing } from './users.routing';

import { Users } from './users.component';
import { UserManager } from './components/manager';
import { UsersTable } from './components/manager/components/usersTable';
import { UserOverview } from './components/overview';
import { ViewUser } from './components/viewUser';
import { UserDetails } from './components/viewUser/components/userDetails';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    AppTranslationModule,
    NgaModule,
    NgbRatingModule,
    NgbModalModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
  ],
  declarations: [
    Users,
    UserManager,
    UsersTable,
    ViewUser,
    UserDetails,
    UserOverview
  ],
  entryComponents: [

  ],
  providers: [

  ]
})
export class UsersModule {}
