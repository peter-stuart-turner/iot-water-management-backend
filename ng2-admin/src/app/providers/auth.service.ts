import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../interfaces/profile';

@Injectable()
export class AuthService {
  public profileData: FirebaseObjectObservable<Profile>;
  public profile: Profile;
  user: Observable<firebase.User>;
  db_user = '/users';
  isLoggedIn: boolean = false;
  uid: string;

  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFireDatabase) {
    let temp = this;
    this.afAuth.authState.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
          this.uid = null;
        }
        else {
          this.isLoggedIn = true;
          this.uid = auth.uid
          temp.profileData = temp.db.object('users/' + auth.uid);
          temp.profileData.subscribe(data =>  {
            temp.profile = data as Profile;
          });
        }

      }
    );
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  registerUserInDatabase(key: string, firstName: string, lastname: string, email: string){
    const users = this.db.object(this.db_user + '/' + key);
    return users.set({
      first_name: firstName,
      last_name: lastname,
      email: email,
      role: "client"
    });
  }

  logout() {
    this.uid = null
    this.afAuth.auth.signOut();
  }

  loggedIn() {
    return this.afAuth.authState;
  }

  getUID() {
    return this.uid;
  }

}
