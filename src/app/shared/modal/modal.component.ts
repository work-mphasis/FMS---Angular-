import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="overlay" (mousedown)="closed.emit()">
      <div class="modal" (mousedown)="$event.stopPropagation()">
        <div class="modal-head">
          <h3>{{ heading() }}</h3>
          <button class="icon-btn" (click)="closed.emit()" aria-label="Close">✕</button>
        </div>
        <ng-content />
      </div>
    </div>
  `,
})
export class ModalComponent {
  heading = input('');
  closed = output<void>();
}