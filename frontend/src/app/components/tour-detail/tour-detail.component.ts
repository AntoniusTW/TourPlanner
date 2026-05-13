import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from '../../services/tour.service';
import { TRANSPORT_TYPE_LABELS } from '../../models/tour.model';

/**
 * View: zeigt Details der im ViewModel (TourService) selektierten Tour.
 */
@Component({
  selector: 'app-tour-detail',
  imports: [CommonModule],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent {
  readonly labels = TRANSPORT_TYPE_LABELS;

  constructor(public vm: TourService) {}
}
