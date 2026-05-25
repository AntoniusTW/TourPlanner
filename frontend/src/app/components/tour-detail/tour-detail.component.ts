import { Component, effect, signal } from '@angular/core';
import { CommonModule, DatePipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { TourLogService } from '../../services/tour-log.service';
import { TRANSPORT_TYPE_LABELS } from '../../models/tour.model';
import { TourLog, DIFFICULTY_LABELS } from '../../models/tour-log.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { TourDistancePipe } from '../../shared/pipes/tour-distance.pipe';
import { TourTimePipe } from '../../shared/pipes/tour-time.pipe';
import { TourLogFormComponent } from '../tour-log-form/tour-log-form.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tour-detail',
  imports: [
    CommonModule, DatePipe, LowerCasePipe, RouterLink,
    ConfirmDialogComponent, TourDistancePipe, TourTimePipe,
    TourLogFormComponent
  ],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent {

  readonly transportLabels  = TRANSPORT_TYPE_LABELS;
  readonly difficultyLabels = DIFFICULTY_LABELS;

  readonly showDeleteConfirm = signal(false);
  readonly deleting          = signal(false);
  readonly showLogForm       = signal(false);
  readonly editingLog        = signal<TourLog | null>(null);
  readonly deletingLogId     = signal<string | null>(null);
  readonly showDeleteLogConfirm = signal(false);
  readonly logToDelete       = signal<TourLog | null>(null);

  constructor(public vm: TourService, public logService: TourLogService) {
    effect(() => {
      const tour = this.vm.selectedTour();
      if (tour?.id) {
        this.logService.loadAllForTour(tour.id);
      } else {
        this.logService.logs.set([]);
      }
      this.closeLogForm();
    });
  }

  imageUrl(path: string | undefined): string | null {
    return path ? `${environment.serverUrl}${path}` : null;
  }

  starsFor(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  close(): void {
    this.vm.selectTour(null);
  }

  confirmDelete(): void {
    const tour = this.vm.selectedTour();
    if (!tour?.id) return;
    this.deleting.set(true);
    this.vm.delete(tour.id).subscribe({
      next: () => { this.showDeleteConfirm.set(false); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }

  // ── Log actions ──────────────────────────────────────

  openNewLog(): void {
    this.editingLog.set(null);
    this.showLogForm.set(true);
  }

  editLog(log: TourLog): void {
    this.showLogForm.set(true);
    this.editingLog.set(log);
  }

  closeLogForm(): void {
    this.showLogForm.set(false);
    this.editingLog.set(null);
  }

  onLogSaved(): void {
    this.closeLogForm();
  }

  confirmDeleteLog(log: TourLog): void {
    this.logToDelete.set(log);
    this.showDeleteLogConfirm.set(true);
  }

  doDeleteLog(): void {
    const log  = this.logToDelete();
    const tour = this.vm.selectedTour();
    if (!log?.id || !tour?.id) return;
    this.deletingLogId.set(log.id);
    this.logService.delete(tour.id, log.id).subscribe({
      next: () => {
        this.showDeleteLogConfirm.set(false);
        this.logToDelete.set(null);
        this.deletingLogId.set(null);
      },
      error: () => this.deletingLogId.set(null)
    });
  }
}
