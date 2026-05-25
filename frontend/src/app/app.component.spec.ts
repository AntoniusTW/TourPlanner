import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sidebarOpen starts as false', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.sidebarOpen()).toBeFalse();
  });

  it('toggleSidebar flips the signal', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.toggleSidebar();
    expect(fixture.componentInstance.sidebarOpen()).toBeTrue();
  });
});
