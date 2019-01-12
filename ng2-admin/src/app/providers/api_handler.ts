// Imports
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Component } from '@angular/core';
import { Settings } from '../pages/systems/components/add/settings';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class API_Handler {
    constructor(public http: Http) {}
    private api_Url = 'https://greenchain-software.appspot.com/api/v1/system/add';

    public addSystem(s: Settings) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var body = 'data='+JSON.stringify(s);
        return  this.http.post(this.api_Url, body , {headers})      //added return
        .map(res => res);
    }
}
