import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class LogFileService {

  constructor(private http: Http) { }

  private localhost = 'http://localhost:8081';
  private live = 'http://admin.greenchain-engineering.com';
  private logFileUrl = '/api/v1/demo/logfiles';
  private downloadUrl = '/api/v1/demo/downloadlogfiles/';

  getLogFiles() {
    let headers = new Headers();
    // headers.append('Content-Type','application/json');
    return this.http.get(this.logFileUrl)
      .map(res => res.json());
  }

  downloadLogFile(file) {
    return this.http.get(this.downloadUrl + file,
      { responseType: ResponseContentType.Blob })
      .map((res) => {
        return new Blob([res.blob()], { type: 'application/txt' })
      })
  }

}
