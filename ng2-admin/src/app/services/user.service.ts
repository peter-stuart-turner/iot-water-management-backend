import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class UserService {

  db_user = '/users';

  user: FirebaseObjectObservable<any>;
  users: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) { }

  getUsers(){
    this.users = this.db.list(this.db_user);
    return this.users;
  }

  getUserObject(uid) {
    console.log("Getting User object for UID", uid)
    this.user = this.db.object(this.db_user + '/' + uid);
    return this.user;
  }

  updateUserRole(uid, newRole){
    const user = this.db.object(this.db_user + '/' + uid);
    user.update({ role: newRole });
  }

}
