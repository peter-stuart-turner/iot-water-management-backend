import {Component} from '@angular/core';

import { HistoricChartService } from './historicChart.service';

import 'style-loader!./historicChart.scss';

@Component({
  selector: 'historic-chart',
  templateUrl: './historicChart.html'
})
export class HistoricalChart {

  chartData:Object;

  constructor(private _lineChartService: HistoricChartService) {
    this.chartData = this._lineChartService.getData();
  }

  initChart(chart:any) {
    let zoomChart = () => {
      chart.zoomToDates(new Date(2013, 3), new Date(2014, 0));
    };

    chart.addListener('rendered', zoomChart);
    zoomChart();

    if (chart.zoomChart) {
      chart.zoomChart();
    }
  }
}
