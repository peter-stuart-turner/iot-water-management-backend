import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './guards/auth.guard'

export const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' }
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages/dashboard'  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
