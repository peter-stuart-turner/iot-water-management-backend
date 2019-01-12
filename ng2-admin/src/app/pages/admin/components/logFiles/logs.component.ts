import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LogFileService } from './logFile.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'admin-logs',
  templateUrl: './logs.html'
})
export class AdminLogs {

  logFiles: [string];

  constructor(private logFileService: LogFileService) {
  }

  ngOnInit() {
    this.logFileService.getLogFiles().subscribe(files => {
      console.log(files);
      var newFiles: [string] = [];

      for (let file of files) {
        let split = file.split('/');
        newFiles.push(split[1]);
      }

      this.logFiles = newFiles;
    },
      err => {
        console.log(err);
        return false;
      });
  }

  download(event, filename) {
    console.log('Download: ' + filename);
    this.logFileService.downloadLogFile(filename)
      .subscribe(res => {
        saveAs(res, filename);
        let fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      })
  }

  delete(event, filename) {
    console.log('Delete: ' + filename);
  }


}
