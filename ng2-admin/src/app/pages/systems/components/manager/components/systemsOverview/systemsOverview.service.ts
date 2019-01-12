import { Injectable } from '@angular/core';
import { BaThemeConfigProvider, colorHelper } from '../../../../../../theme';

@Injectable()
export class SystemsOverviewService {

  constructor(private _baConfig:BaThemeConfigProvider) {
  }

  getData() {
    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
    return [
      {
        color: pieColor,
        description: 'Active Systems',
        stats: '7',
        icon: 'person',
      }, {
        color: pieColor,
        description: 'Pending Systems',
        stats: '1',
        icon: 'money',
      }, {
        color: pieColor,
        description: 'Rain Water Saved',
        stats: '178,391 Litres',
        icon: 'face',
      }, {
        color: pieColor,
        description: 'Grey Water Saved',
        stats: '32,592 Litres',
        icon: 'refresh',
      }
    ];
  }
}
