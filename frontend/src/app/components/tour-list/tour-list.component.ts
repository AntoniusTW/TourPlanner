import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour, TRANSPORT_TYPE_LABELS, TRANSPORT_TYPE_ICONS } from '../../models/tour.model';
import { TourDetailComponent } from '../tour-detail/tour-detail.component';
import { TourDistancePipe } from '../../shared/pipes/tour-distance.pipe';
import { TourTimePipe } from '../../shared/pipes/tour-time.pipe';

@Component({
  selector: 'app-tour-list',
  imports: [CommonModule, RouterLink, TourDetailComponent, TourDistancePipe, TourTimePipe],
  templateUrl: './tour-list.component.html',
  styleUrl: './tour-list.component.scss'
})
export class TourListComponent implements OnInit {

  readonly transportLabels = TRANSPORT_TYPE_LABELS;
  readonly transportIcons  = TRANSPORT_TYPE_ICONS;

  constructor(public vm: TourService) {}

  ngOnInit(): void {
    this.vm.loadAll();
  }

  select(tour: Tour): void {
    this.vm.selectTour(tour);
    this.vm.loadById(tour.id!);
  }

  isSelected(tour: Tour): boolean {
    return this.vm.selectedTour()?.id === tour.id;
  }
}
