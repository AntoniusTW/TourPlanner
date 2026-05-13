import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { TRANSPORT_TYPE_LABELS } from '../../models/tour.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { TourDistancePipe } from '../../shared/pipes/tour-distance.pipe';
import { TourTimePipe } from '../../shared/pipes/tour-time.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tour-detail',
  imports: [CommonModule, DatePipe, RouterLink, ConfirmDialogComponent, TourDistancePipe, TourTimePipe],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent {

  readonly transportLabels = TRANSPORT_TYPE_LABELS;
  readonly showDeleteConfirm = signal(false);
  readonly deleting = signal(false);

  constructor(public vm: TourService) {}

  imageUrl(path: string | undefined): string | null {
    return path ? `${environment.serverUrl}${path}` : null;
  }

  close(): void {
    this.vm.selectTour(null);
  }

  confirmDelete(): void {
    const tour = this.vm.selectedTour();
    if (!tour?.id) return;
    this.deleting.set(true);
    this.vm.delete(tour.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.deleting.set(false);
      },
      error: () => this.deleting.set(false)
    });
  }
}
