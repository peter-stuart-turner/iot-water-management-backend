import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminEditTimesheetModal } from '../editTimesheetModal/editTimesheetModal.component';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { FirebaseAdminService } from '../../../../../../services/firebase_admin.service';
import { AuthService } from '../../../../../../providers/auth.service';
import { UserService } from '../../../../../../services/user.service';
import { AdminTimesheetTableService } from './timesheetTable.service';

import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import { saveAs } from 'file-saver';

declare let jsPDF;

@Component({
  selector: 'timesheet-table',
  styleUrls: [('./timesheetTable.component.scss')],
  templateUrl: './timesheetTable.html'
})
export class AdminTimesheetTable {

  timesheets: Array<any>;
  hoursWorked: Array<any>;
  pdfArray: Array<any>;
  user: any;

  constructor(private firebaseService: FirebaseService,
    private firebaseAdminService: FirebaseAdminService,
    private authService: AuthService,
    private userService: UserService,
    private timesheetService: AdminTimesheetTableService,
    private modalService: NgbModal,
    private pdfmake: PdfmakeService) { }

  ngOnInit() {
    this.timesheets = [];
    this.hoursWorked = [];
    this.pdfArray = [];

    this.userService.getUserObject(this.authService.getUID()).subscribe(user => {
      this.user = user;
    });

    this.firebaseAdminService.getUserTimeSheets(this.authService.getUID()).subscribe(timesheets => {
      this.timesheets = timesheets;
      timesheets.forEach((timecard) => {
        var date = new Date();
        let currentDate = this.formatDate(date);

        let startDay = new Date(Date.parse(currentDate + ' ' + timecard.start + ':00'))
        let endDay = new Date(Date.parse(currentDate + ' ' + timecard.end + ':00'))
        let startLunch = new Date(Date.parse(currentDate + ' ' + timecard.lunch_start + ':00'))
        let endLunch = new Date(Date.parse(currentDate + ' ' + timecard.lunch_end + ':00'))

        let first_delta = startLunch.getTime() - startDay.getTime();
        let second_delta = endDay.getTime() - endLunch.getTime();
        let total_delta = first_delta + second_delta;
        let hours = this.milliToNormal(total_delta);

        this.hoursWorked.push(hours);

        this.pdfArray.push({
          date: currentDate.toString(),
          dayStart: timecard.start.toString(),
          lunchStart: timecard.lunch_start.toString(),
          lunchEnd: timecard.lunch_end.toString(),
          dayEnd: timecard.end.toString(),
          comment: timecard.comments.toString()
        });
      });
    });

  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  milliToNormal(duration) {
    var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    var minutes = parseInt((duration / (1000 * 60)) % 60);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return hours + ":" + minutes;
  }

  public exportToPDF(exportTimecard) {
    console.log('Need to export ' + this.authService.getUID() + ' timesheet to PDF');

      this.timesheetService.getPDFFileLocation(this.authService.getUID()).subscribe(
        data => {
          let filename = data.result;
          console.log("I CANT SEE DATA HERE: ", filename);

          this.timesheetService.downloadPDFFile(filename)
            .subscribe(res => {
              saveAs(res, filename);
              let fileURL = URL.createObjectURL(res);
              window.open(fileURL);
            })

        }
    );

  }

  public exportToCSV(exportTimecard) {
    alert('Need to export ' + this.authService.getUID() + ' timesheet to CSV');
  }

  public editTimecard(editTimecard, item) {
    this.showConfirmModal(item)
  }

  showConfirmModal(timecard) {
    const activeModal = this.modalService.open(AdminEditTimesheetModal, { size: 'md' });
    activeModal.componentInstance.timecard = timecard;
  }
}
