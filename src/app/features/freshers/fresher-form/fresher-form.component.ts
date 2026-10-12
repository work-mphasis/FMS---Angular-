import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { STATUS_OPTIONS } from '../../../core/config/constants';
import { Fresher } from '../../../core/models/fresher.model';

@Component({
  selector: 'app-fresher-form',
  imports: [ReactiveFormsModule],
  templateUrl: './fresher-form.component.html',
})
export class FresherFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  fresher = input<Fresher | null>(null);
  saving = input(false);
  formSave = output<Fresher>();
  formCancel = output<void>();

  statuses = computed(() => {
    const current = this.fresher()?.status;
    return current && !STATUS_OPTIONS.includes(current)
      ? [current, ...STATUS_OPTIONS]
      : STATUS_OPTIONS;
  });

  form = this.fb.nonNullable.group({
    employeeId: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.email],
    phone: ['', Validators.pattern(/^(\d{10})?$/)],
    technology: [''],
    joiningDate: [''],
    status: [STATUS_OPTIONS[0]],
  });

  ngOnInit(): void {
    const f = this.fresher();
    if (f) {
      this.form.patchValue({
        employeeId: f.employeeId ?? '',
        name: f.name ?? '',
        email: f.email ?? '',
        phone: f.phone ?? '',
        technology: f.technology ?? '',
        joiningDate: f.joiningDate ?? '',
        status: f.status ?? STATUS_OPTIONS[0],
      });
    }
  }

  showError(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && c.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.formSave.emit({
      employeeId: v.employeeId.trim(),
      name: v.name.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      technology: v.technology.trim(),
      joiningDate: v.joiningDate || null,
      status: v.status,
    });
  }
}