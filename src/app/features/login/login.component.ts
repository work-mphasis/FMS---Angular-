import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APP_NAME } from '../../core/config/constants';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  appName = APP_NAME;
  error = signal('');
  loading = signal(false);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/freshers']);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.loading.set(true);
    const { username, password } = this.form.getRawValue();

    this.auth.login(username.trim(), password).subscribe({
      next: () => this.router.navigate(['/freshers']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 0
            ? 'Cannot reach server. Is the backend running?'
            : 'Invalid username or password'
        );
      },
    });
  }
}