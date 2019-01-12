// Imports
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';

import 'style-loader!./manager.scss';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'system-manager',
  templateUrl: './manager.html',
})
export class SystemManager {

  constructor() {}

}
