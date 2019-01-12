import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { FirebaseAdminService } from '../../../../../../services/firebase_admin.service';

@Component({
  selector: 'edit-timesheet-modal',
  styleUrls: [('./editTimesheetModal.component.scss')],
  templateUrl: './editTimesheetModal.component.html'
})

export class AdminEditTimesheetModal implements OnInit {

  timecard: Timesheet;

  error: boolean = false;
  errorMessage: string = '';

  constructor(private firebaseService: FirebaseService,
    private firebaseAdminService: FirebaseAdminService,
    private activeModal: NgbActiveModal) {
  }

  ngOnInit() { }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  performAction() {
    var date = new Date();
    let currentDate = this.formatDate(date);

    let startDay = new Date(Date.parse(currentDate + ' ' + this.timecard.start + ':00'))
    let endDay = new Date(Date.parse(currentDate + ' ' + this.timecard.end + ':00'))
    let startLunch = new Date(Date.parse(currentDate + ' ' + this.timecard.lunch_start + ':00'))
    let endLunch = new Date(Date.parse(currentDate + ' ' + this.timecard.lunch_end + ':00'))

    if((endDay.getTime() - startDay.getTime()) <= 0){
      this.error = true;
      this.errorMessage = 'The day start time can\'t be after the day end time';
      return;
    }
    else if((endLunch.getTime() - startLunch.getTime()) <= 0){
      this.error = true;
      this.errorMessage = 'The lunch start time can\'t be after the lunch end time';
      return;
    }
    else if((startLunch.getTime() - startDay.getTime()) <= 0){
      this.error = true;
      this.errorMessage = 'The day start must be before the start of lunch';
      return;
    }
    else if((endDay.getTime() - endLunch.getTime()) <= 0){
      this.error = true;
      this.errorMessage = 'The day end must be after the end of lunch';
      return;
    }
    else{
      console.log('Updating timecard');
      this.firebaseAdminService.updateTimeSheet(this.timecard.uid, this.timecard);
      this.activeModal.close();
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}

interface Timesheet {
  date?: string;
  start: string;
  end: string;
  lunch_start: string;
  lunch_end: string;
  comments?: string,
  uid: string;
}
