import { Routes, RouterModule }  from '@angular/router';

import { Systems } from './systems.component';
import { SystemAdder } from './components/add/add.component';
import { SystemManager } from './components/manager/manager.component';
import { SharedSystems } from './components/shared/shared.component';
import { ViewSystem } from './components/view/view-system.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Systems,
    children: [
      { path: 'add', component: SystemAdder },
      { path: 'manager', component: SystemManager },
      { path: 'shared-systems', component: SharedSystems },
      { path: 'view/:id', component: ViewSystem }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
