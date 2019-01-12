import { Component } from '@angular/core';
import { FirebaseService } from '../../../../../../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { colorHelper } from '../../../../../../theme';

import * as Chart from 'chart.js';

import 'style-loader!./realtimeChart.scss';

@Component({
  selector: 'realtime-chart',
  templateUrl: './realtimeChart.html'
})

export class RealtimeChart implements OnInit, OnDestroy {

  system_id: number;
  private sub: any;
  public realtimeData: Array<Object>;
  realtime: Realtime;
  capacity: number;

  constructor(private firebaseService: FirebaseService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.system_id = +params['id'];

      this.system = this.firebaseService.getSystemRealtimeData(this.system_id).subscribe(realtime => {
        this.realtime = realtime;

        this.capacity = this.realtime.gVolume + this.realtime.rVolume;
        let rain = this.realtime.rVolume * (this.realtime.rPercentage/100);
        let rp = (rain/this.capacity)*100;
        let grey = this.realtime.gVolume * (this.realtime.gPercentage/100);
        let gp = (grey/this.capacity)*100;
        let unused = this.capacity - rain - grey;
        let up = (unused/this.capacity)*100;

        this.realtimeData = [
          {
            value: rain,
            color: '#5b97bc',
            highlight: colorHelper.shade('#5b97bc', 15),
            label: 'Rain Water',
            percentage: rp,
            order: 1,
          }, {
            value: grey,
            color: '#96af4e',
            highlight: colorHelper.shade('#96af4e', 15),
            label: 'Grey Water',
            percentage: gp,
            order: 2,
          }
          , {
            value: unused,
            color: '#fb6466',
            highlight: colorHelper.shade('#fb6466', 15),
            label: 'Free Space',
            percentage: up,
            order: 3,
          }
        ];

        this._loadRealtimeChart();
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    // this._loadDoughnutCharts();
  }

  private _loadRealtimeChart() {
    let el = jQuery('.chart-area').get(0) as HTMLCanvasElement;
    new Chart(el.getContext('2d')).Doughnut(this.realtimeData, {
      segmentShowStroke: false,
      percentageInnerCutout: 64,
      responsive: true
    });
  }
}

interface Realtime {
  key: number;
  gPercentage?: number;
  gVolume?: number;
  rPercentage?: number;
  rVolume?: number;
}
