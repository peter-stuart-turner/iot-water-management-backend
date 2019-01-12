import { Injectable } from '@angular/core';
import { BaThemeConfigProvider } from '../../../../theme';
import { FirebaseAdminService } from '../../../../services/firebase_admin.service';
import { AuthService } from '../../../../providers/auth.service';

@Injectable()
export class AdminTimeSheetService {


  constructor(private _baConfig: BaThemeConfigProvider) {
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

  getInitialData(){
    var date = new Date();
    let currentDate = this.formatDate(date);

    let dashboardColors = this._baConfig.get().colors.dashboard;

    return {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      defaultDate: currentDate,
      selectable: true,
      selectHelper: true,
      editable: true,
      eventLimit: true,
      events: []
    };
  }

}
