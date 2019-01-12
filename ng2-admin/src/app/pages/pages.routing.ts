import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'users', loadChildren: 'app/pages/users/users.module#UsersModule', canActivate: [AdminGuard] },
      { path: 'systems', loadChildren: 'app/pages/systems/systems.module#SystemsModule', canActivate: [AdminGuard] },
      { path: 'admin', loadChildren: 'app/pages/admin/admin.module#AdminModule', canActivate: [AdminGuard] },
    ],
    canActivate: [AuthGuard]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
