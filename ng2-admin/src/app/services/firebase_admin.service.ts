import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class FirebaseAdminService {

  db_timesheets = '/admin_panel/timesheets';
  db_tasks = '/admin_panel/notepads';


  timesheets: FirebaseListObservable<any[]>;
  userTasks: FirebaseListObservable<any[]>;
  system: FirebaseObjectObservable<any>;
  realtime: FirebaseObjectObservable<any>;

  constructor(private db: AngularFireDatabase) { }

  getTimesheets() {
    this.timesheets = this.db.list(this.db_timesheets);
    return this.timesheets;
  }

  addTimeSheet(uid, timesheet) {
    const sheets = this.db.list(this.db_timesheets + '/' + uid);
    sheets.push(timesheet);
  }

  updateTimeSheet(uid, timesheet) {
    const sheets = this.db.object(this.db_timesheets + '/' + uid + '/' + timesheet.$key);
    sheets.update(timesheet);
  }

  getUserTimeSheets(uid) {
    this.timesheets = this.db.list(this.db_timesheets + '/' + uid);
    return this.timesheets;
  }


  getUserTasks(uid) {
    this.userTasks = this.db.list(this.db_tasks + '/' + uid);
    return this.userTasks;
  }

  addUserTask(uid, task_text) {
    const tasks = this.db.list(this.db_tasks + '/' + uid);
    tasks.push(task_text);
  }

  startDeleteUserTask(uid, task_text) {
    const taskToDelete = this.db.list(this.db_tasks + '/' + uid, {
      query: {
        orderByValue: true,
        equalTo: task_text
      }
    })

    return taskToDelete;
  }

  finishDeleteUserTask(path: string) {
    console.log(path);
    let ref = this.db.list(path);
    ref.remove();
  }

  getNotepadUpdatePath(uid, key) {
    let path = this.db_tasks + '/' + uid + '/' + key;
    return path;
  }

}

interface Timesheet {
  $key?: string;
  start?: string;
  end?: boolean;
  lunch_start?: string;
  lunch_end?: string;
  uid?: string;
}
