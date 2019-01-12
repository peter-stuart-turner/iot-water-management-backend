import { Routes, RouterModule }  from '@angular/router';

import { Users } from './users.component';
import { UserOverview } from './components/overview/overview.component';
import { UserManager } from './components/manager/manager.component';
import { ViewUser } from './components/viewUser';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Users,
    children: [
      { path: 'overview', component: UserOverview },
      { path: 'manager', component: UserManager },
      { path: 'view/:id', component: ViewUser }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
