import { Injectable } from '@angular/core';
import { BaThemeConfigProvider } from '../../../../theme';
import { FirebaseAdminService } from '../../../../services/firebase_admin.service';
import { AuthService } from '../../../../providers/auth.service';

@Injectable()
export class AdminNotepadService {
  private _todoList = [];

  getTodoList() {
    return this._todoList;
  }

}
