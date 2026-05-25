import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public tourService: TourService) {}
}
