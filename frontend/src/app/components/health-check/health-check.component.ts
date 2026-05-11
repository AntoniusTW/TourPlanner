import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

/**
 * View: binds to HealthService (ViewModel) signals, triggers ping() on init.
 */
@Component({
  selector: 'app-health-check',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './health-check.component.html',
  styleUrl: './health-check.component.scss'
})
export class HealthCheckComponent implements OnInit {

  constructor(public vm: HealthService) {}

  ngOnInit(): void {
    this.vm.ping();
  }
}
