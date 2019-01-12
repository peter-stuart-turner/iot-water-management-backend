import { Routes, RouterModule }  from '@angular/router';

import { Admin } from './admin.component';
import { AdminNotepad } from './components/notepad/notepad.component';
import { AdminTimeSheet } from './components/timesheet/timesheet.component';
import { AdminLogs } from './components/logFiles/logs.component';

const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'timesheets', component: AdminTimeSheet },
      { path: 'todo', component: AdminNotepad },
      { path: 'logs', component: AdminLogs },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
