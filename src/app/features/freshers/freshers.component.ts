import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { Fresher } from '../../core/models/fresher.model';
import { ModalComponent } from '../../shared/modal/modal.component';
import { FresherService } from '../../core/services/fresher.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FresherFormComponent } from './fresher-form/fresher-form.component';

@Component({
  selector: 'app-freshers',
  imports: [NavbarComponent, ModalComponent, FresherFormComponent],
  templateUrl: './freshers.component.html',
})
export class FreshersComponent implements OnInit {
  private service = inject(FresherService);

  freshers = signal<Fresher[]>([]);
  loading = signal(true);
  error = signal('');
  search = signal('');
  saving = signal(false);
  formOpen = signal(false);
  editing = signal<Fresher | null>(null);
  deleteTarget = signal<Fresher | null>(null);

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.freshers().filter((f) =>
      [f.employeeId, f.name, f.email, f.technology, f.status].some((v) =>
        v?.toLowerCase().includes(q)
      )
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.freshers.set(data);
        this.error.set('');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load freshers.');
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  openAdd(): void {
    this.editing.set(null);
    this.formOpen.set(true);
  }

  openEdit(fresher: Fresher): void {
    this.editing.set(fresher);
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  save(data: Fresher): void {
    this.saving.set(true);
    const current = this.editing();

    const request = current
      ? this.service.update(current.id!, data)
      : this.service.create(data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        alert(err.error?.message ?? 'Could not save. Please try again.');
      },
    });
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.service.delete(target.id!).subscribe({
      next: () => {
        this.deleteTarget.set(null);
        this.load();
      },
      error: () => alert('Could not delete.'),
    });
  }

  formatDate(value: string | null): string {
    if (!value) return '—';
    const [y, m, d] = value.split('-');
    return `${d}-${m}-${y}`;
  }

  badgeClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/[^a-z]+/g, '-');
  }
}