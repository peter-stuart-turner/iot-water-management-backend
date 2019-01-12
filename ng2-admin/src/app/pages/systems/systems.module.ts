import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup , FormControl , ReactiveFormsModule , FormsModule } from '@angular/forms';

import { routing } from './systems.routing';

import { Systems } from './systems.component';

import { SystemAdder } from './components/add';
import { AddForm } from './components/add/components/addForm';
import { SystemManager } from './components/manager';
import { SystemsTable } from './components/manager/components/systemsTable';
import { SystemsOverview } from './components/manager/components/systemsOverview';
import { SharedSystems } from './components/shared';
import { SharedSystemsTable } from './components/shared/components/sharedSystemsTable';
import { ViewSystem } from './components/view';
import { SystemDetails } from './components/view/components/systemDetails';
import { RealtimeChart } from './components/view/components/realtimeChart';
import { HistoricalChart } from './components/view/components/historicChart';

import { SystemsOverviewService } from './components/manager/components/systemsOverview/systemsOverview.service';
import { HistoricChartService } from './components/view/components/historicChart/historicChart.service';

import { ConfirmModal } from './components/manager/components/confirmModal/confirm-modal.component';
import { ConfirmAddModal } from './components/add/components/confirmAdd/confirmAdd.component';


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
    ReactiveFormsModule
  ],
  declarations: [
    SystemAdder,
    AddForm,
    SystemManager,
    Systems,
    SharedSystems,
    SystemsTable,
    SharedSystemsTable,
    SystemsOverview,
    ViewSystem,
    SystemDetails,
    RealtimeChart,
    HistoricalChart,
    ConfirmModal,
    ConfirmAddModal
  ],
  entryComponents: [
    ConfirmModal,
    ConfirmAddModal
  ],
  providers: [
    HistoricChartService,
    SystemsOverviewService,
  ]
})
export class SystemsModule {}
