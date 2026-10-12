import { Component, inject } from '@angular/core';

import { APP_NAME } from '../../core/config/constants';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <header class="navbar">
      <div class="navbar-brand">
        <span class="logo">F</span>
        <span class="brand-text">{{ appName }}</span>
      </div>
      <div class="navbar-right">
        <span class="user-chip">{{ auth.user()?.username }} · {{ auth.user()?.role }}</span>
        <button class="btn btn-outline" (click)="auth.logout()">Logout</button>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  appName = APP_NAME;
}