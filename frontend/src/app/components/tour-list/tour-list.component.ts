import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { TourDetailComponent } from '../tour-detail/tour-detail.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { Tour } from '../../models/tour.model';

/**
 * View: Master-Detail Layout.
 * Links  = klickbare Tour-Liste  (ViewModel: TourService.tours).
 * Rechts = TourDetailComponent   (ViewModel: TourService.selectedTour).
 */
@Component({
  selector: 'app-tour-list',
  imports: [CommonModule, RouterLink, TourDetailComponent, LoadingSpinnerComponent],
  templateUrl: './tour-list.component.html',
  styleUrl: './tour-list.component.scss'
})
export class TourListComponent implements OnInit {

  constructor(public vm: TourService) {}

  ngOnInit(): void {
    this.vm.loadAll();
  }

  select(tour: Tour): void {
    this.vm.selectTour(tour);
  }

  isSelected(tour: Tour): boolean {
    return this.vm.selectedTour()?.id === tour.id;
  }
}
