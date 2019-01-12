import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminNotepadService } from './notepad.service';
import { DatePipe } from '@angular/common';
import { FirebaseAdminService } from '../../../../services/firebase_admin.service';
import { AuthService } from '../../../../providers/auth.service';
import { BaThemeConfigProvider } from '../../../../theme';

import 'style-loader!./notepad.scss';

@Component({
  selector: 'notepad',
  templateUrl: './notepad.html'
})
export class AdminNotepad {

  public dashboardColors = this._baConfig.get().colors.dashboard;
  public todoList: Array<any>;
  public newTodoText: string = '';
  public profile: any;

  constructor(
    private _baConfig: BaThemeConfigProvider,
    private modalService: NgbModal,
    private notepadService: AdminNotepadService,
    private firebaseAdminService: FirebaseAdminService,
    private authService: AuthService) {

    this.todoList = this.notepadService.getTodoList();

    this.getTasks();

    this.todoList.forEach((item) => {
      item.color = this._getRandomColor();
    });
  }

  getTasks(){
    var temp = this;
    var test = this.firebaseAdminService.getUserTasks(this.authService.getUID()).subscribe( tasks => {
      temp.todoList = [];
      for(var task in tasks){
        temp.todoList.unshift({
          text: String(tasks[task].$value),
          color: this._getRandomColor(),
        });
      }
    })
  }
  deleteItem(item){
    let uid = this.authService.getUID();
    let temp = this;
    let key, path: string;
    this.firebaseAdminService.startDeleteUserTask(uid, String(item.text))
    .subscribe( taskToDelete => {
      key = String(taskToDelete[0].$key);
      path = temp.firebaseAdminService.getNotepadUpdatePath(uid, key);
      temp.firebaseAdminService.finishDeleteUserTask(path);

    });
  }
  getNotDeleted() {
    return this.todoList.filter((item: any) => {
      return !item.deleted
    })
  }

  addToDoItem($event) {

    if (($event.which === 1 || $event.which === 13) && this.newTodoText.trim() != '') {

      this.todoList.unshift({
        text: this.newTodoText,
        color: this._getRandomColor(),
      });
      this.firebaseAdminService.addUserTask(this.authService.getUID(), this.newTodoText);
      this.newTodoText = '';
    }
  }

  private _getRandomColor() {
    let colors = Object.keys(this.dashboardColors).map(key => this.dashboardColors[key]);

    var i = Math.floor(Math.random() * (colors.length - 1));
    return colors[i];
  }
}
