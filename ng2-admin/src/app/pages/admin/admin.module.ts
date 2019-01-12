import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PdfmakeModule } from 'ng-pdf-make';

import { routing } from './admin.routing';

import { Admin } from './admin.component';
import { AdminTimeSheet } from './components/timesheet';
import { AdminNotepad } from './components/notepad/notepad.component';
import { AdminLogs } from './components/logFiles';

import { AdminTimeSheetService } from './components/timesheet/timesheet.service';
import { AdminNotepadService } from './components/notepad/notepad.service';
import { LogFileService } from './components/logFiles/logFile.service';

import { AdminTimeSheetModal } from './components/timesheet/components/timesheetModal/timesheet-modal.component';
import { AdminEditTimesheetModal } from './components/timesheet/components/editTimesheetModal/editTimesheetModal.component';
import { AdminTimesheetTable } from './components/timesheet/components/timesheetTable/timesheetTable.component';
import { AdminTimesheetTableService } from './components/timesheet/components/timesheetTable/timesheetTable.service';

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
    PdfmakeModule,
  ],
  declarations: [
    Admin,
    AdminTimeSheet,
    AdminTimesheetTable,
    AdminTimeSheetModal,
    AdminNotepad,
    AdminEditTimesheetModal,
    AdminLogs,
  ],
  entryComponents: [
    AdminTimeSheetModal,
    AdminEditTimesheetModal
  ],
  providers: [
    AdminTimeSheetService,
    AdminNotepadService,
    LogFileService,
    AdminTimesheetTableService
  ]
})
export class AdminModule { }
