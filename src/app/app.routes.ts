import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { FreshersComponent } from './features/freshers/freshers.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'freshers', component: FreshersComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'freshers', pathMatch: 'full' },
  { path: '**', redirectTo: 'freshers' },
];