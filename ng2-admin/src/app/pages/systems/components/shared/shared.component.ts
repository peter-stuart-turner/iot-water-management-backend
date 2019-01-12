// Imports
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';

import 'style-loader!./shared.scss';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'shared-systems',
  templateUrl: './shared.html',
})
export class SharedSystems {

  constructor() {}

}
