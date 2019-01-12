import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AdminTimesheetTableService {

  constructor(private http: Http) { }

  private localhost = 'http://localhost:8081';
  private live = 'http://admin.greenchain-engineering.com';
  private pdfUrl = '/api/v1/demo/generate/';
  private downloadUrl = '/api/v1/demo/downloadtimesheet/';

  getPDFFileLocation(uid) {
    let url = this.pdfUrl + uid;
    console.log(url);
    return this.http.get(url)
      .map(data => {
        data.json();
        // the console.log(...) line prevents your code from working
        // either remove it or add the line below (return ...)
        // console.log("I CAN SEE DATA HERE: ", data.json());
        return data.json();
      });
  }

  downloadPDFFile(filename) {
    let url = this.downloadUrl + filename
    console.log(url);
    return this.http.get(url,
      { responseType: ResponseContentType.Blob })
      .map((res) => {
        return new Blob([res.blob()], { type: 'application/pdf' })
      })
  }

}
