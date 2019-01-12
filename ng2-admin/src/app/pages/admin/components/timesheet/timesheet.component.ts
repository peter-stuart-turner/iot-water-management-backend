import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminTimeSheetService } from './timesheet.service';
import { DatePipe } from '@angular/common';
import { AdminTimeSheetModal } from './components/timesheetModal/timesheet-modal.component';
import { FirebaseAdminService } from '../../../../services/firebase_admin.service';
import { AuthService } from '../../../../providers/auth.service';


import 'style-loader!./timesheet.scss';

@Component({
  selector: 'timesheet',
  templateUrl: './timesheet.html'
})
export class AdminTimeSheet {

  public calendarConfiguration: any;
  private _calendar: Object;
  userTimesheet: Array<any>;

  constructor(private modalService: NgbModal,
    private timesheetService: AdminTimeSheetService,
    private firebaseAdminService: FirebaseAdminService,
    private authService: AuthService) {

    this.userTimesheet = [];
    this.calendarConfiguration = this.timesheetService.getInitialData();
    this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);

    this.firebaseAdminService.getUserTimeSheets(this.authService.getUID()).subscribe(userTimesheet => {

      userTimesheet.forEach((sheet) => {
        let temp = {
          title: sheet.start + ' - ' + sheet.end,
          start: sheet.date,
          color: '#ff0000'
        }

        if (!this.userTimesheet.includes(sheet.$key)) {
          this.userTimesheet.push(sheet.$key);
          jQuery(this._calendar).fullCalendar('renderEvent', temp, true);
        }

      });

    });

  }

  public onCalendarReady(calendar): void {
    this._calendar = calendar;
  }

  private _onSelect(start, end): void {

    if (this._calendar != null) {
      var datePipe = new DatePipe();
      let date = datePipe.transform(start._d, 'yyyy-MM-dd')

      this.showConfirmModal(date);
      jQuery(this._calendar).fullCalendar('unselect');
    }
  }

  showConfirmModal(date) {
    const activeModal = this.modalService.open(AdminTimeSheetModal, { size: 'md' });
    activeModal.componentInstance.date = date;
  }

}
