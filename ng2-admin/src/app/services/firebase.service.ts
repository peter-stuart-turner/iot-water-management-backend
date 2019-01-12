import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { System_IF } from '../interfaces/all_interfaces';
import * as Rx from "RxJs";


@Injectable()
export class FirebaseService {

  db_system = '/systems';
  db_system_realtime = '/systems_observables';
  db_system_historical = '/systems_historical';
  db_system_shared = '/shared_systems';

  systems: FirebaseListObservable<any[]>;
  system: FirebaseObjectObservable<any>;
  realtime: FirebaseObjectObservable<any>;

  systems2: FirebaseListObservable< Array<System_IF> >;

  sharedSystems: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) { }

  getSystems() {
    this.systems = this.db.list(this.db_system);
    return this.systems;
  }
  getSystems2<System_IF>() {
    this.systems2 = this.db.list(this.db_system);
    return this.systems2;
  }
  getSystem(system_key) {
    this.system = this.db.object(this.db_system + '/' + system_key);
    return this.system;
  }

  activateSystem(system_key) {
    const system = this.db.object(this.db_system + '/' + system_key);
    system.update({ active: true });
  }

  deactivateSystem(system_key) {
    const system = this.db.object(this.db_system + '/' + system_key);
    system.update({ active: false });
  }

  removeSystem(system_key) {
    const system = this.db.object(this.db_system + '/' + system_key);
    system.remove();
  }

  addSystem(key, system_object) {
    const system = this.db.object(this.db_system + '/' + key);
    system.set(system_object);
  }

  getSystemRealtimeData(system_key) {
    this.realtime = this.db.object(this.db_system_realtime + '/' + system_key);
    return this.realtime;
  }
  get_All_Realtime_Data(){
    this.realtime = this.db.object(this.db_system_realtime + '/');
    return this.realtime;
  }

  getSystemHistoricalData(system_key) {

  }

  getSharedSystems(uid) {
    this.sharedSystems = this.db.list(this.db_system_shared + '/' + uid);
    return this.sharedSystems;
  }

  updateSharedSystems(uid, sharedSystems) {
    const systemShared = this.db.object(this.db_system_shared + '/' + uid);
    systemShared.set(sharedSystems);
  }

}

interface System {
  $key?: string;
  GSID?: string;
  active?: boolean;
  system_model?: string;
  uid?: string;
}
