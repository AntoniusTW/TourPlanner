import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TourLogFormComponent } from './tour-log-form.component';
import { TourLogService } from '../../services/tour-log.service';
import { TourLog } from '../../models/tour-log.model';

const SAMPLE: TourLog = {
  id: 'log-1',
  tourId: 'tour-1',
  date: '2025-05-01',
  duration: 60,
  rating: 4,
  difficulty: 'MEDIUM',
  comment: 'Schöne Tour'
};

const VALID_FORM = {
  date: '2025-05-01',
  duration: 60,
  rating: 4,
  difficulty: 'EASY'
};

function makeService(overrides: Partial<Record<string, unknown>> = {}): TourLogService {
  return {
    logs:    signal<TourLog[]>([]),
    loading: signal(false),
    error:   signal<string | null>(null),
    loadAllForTour: jasmine.createSpy('loadAllForTour'),
    create:  jasmine.createSpy('create').and.returnValue(of(SAMPLE)),
    update:  jasmine.createSpy('update').and.returnValue(of(SAMPLE)),
    delete:  jasmine.createSpy('delete').and.returnValue(of(undefined)),
    ...overrides
  } as unknown as TourLogService;
}

// ── Create mode ───────────────────────────────────────────────────────────────

describe('TourLogFormComponent (create mode)', () => {
  let fixture: ComponentFixture<TourLogFormComponent>;
  let component: TourLogFormComponent;
  let service: TourLogService;

  beforeEach(async () => {
    service = makeService();
    await TestBed.configureTestingModule({
      imports:   [TourLogFormComponent],
      providers: [{ provide: TourLogService, useValue: service }]
    }).compileComponents();

    fixture   = TestBed.createComponent(TourLogFormComponent);
    component = fixture.componentInstance;
    component.tourId = 'tour-1';
    fixture.detectChanges();
  });

  // ── Form validation ─────────────────────────────────────────────────────────

  it('form is invalid when all fields are empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('date: required fires on empty value', () => {
    component.field('date').setValue('');
    expect(component.field('date').hasError('required')).toBeTrue();
  });

  it('duration: required fires on empty value', () => {
    component.field('duration').setValue(null);
    expect(component.field('duration').hasError('required')).toBeTrue();
  });

  it('rating: required fires on empty value', () => {
    component.field('rating').setValue(null);
    expect(component.field('rating').hasError('required')).toBeTrue();
  });

  it('rating: min error fires when value is 0', () => {
    component.field('rating').setValue(0);
    expect(component.field('rating').hasError('min')).toBeTrue();
  });

  it('rating: max error fires when value is 6', () => {
    component.field('rating').setValue(6);
    expect(component.field('rating').hasError('max')).toBeTrue();
  });

  it('difficulty: required fires on empty value', () => {
    component.field('difficulty').setValue('');
    expect(component.field('difficulty').hasError('required')).toBeTrue();
  });

  it('form is valid when all required fields are filled', () => {
    component.form.patchValue(VALID_FORM);
    expect(component.form.valid).toBeTrue();
  });

  // ── Submit behaviour ─────────────────────────────────────────────────────────

  it('submit with invalid form marks all controls touched', () => {
    component.submit();
    expect(component.field('date').touched).toBeTrue();
    expect(component.field('duration').touched).toBeTrue();
    expect(component.field('rating').touched).toBeTrue();
    expect(component.field('difficulty').touched).toBeTrue();
  });

  it('submit with invalid form does not call service.create()', () => {
    component.submit();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('submit (create) calls service.create() with form value', () => {
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(service.create).toHaveBeenCalledWith('tour-1', jasmine.objectContaining(VALID_FORM));
  });

  it('submit success: emits saved event', () => {
    let emitted: TourLog | undefined;
    component.saved.subscribe(log => (emitted = log));
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(emitted).toEqual(SAMPLE);
    expect(component.submitting()).toBeFalse();
  });

  it('submit error: sets serverError and clears submitting', () => {
    (service.create as jasmine.Spy).and.returnValue(throwError(() => new Error('fail')));
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(component.serverError()).toBeTruthy();
    expect(component.submitting()).toBeFalse();
  });

  it('cancel: emits cancelled event', () => {
    let emitted = false;
    component.cancelled.subscribe(() => (emitted = true));
    component.cancelled.emit();
    expect(emitted).toBeTrue();
  });
});

// ── Edit mode ─────────────────────────────────────────────────────────────────

describe('TourLogFormComponent (edit mode)', () => {
  let fixture: ComponentFixture<TourLogFormComponent>;
  let component: TourLogFormComponent;
  let service: TourLogService;

  beforeEach(async () => {
    service = makeService();
    await TestBed.configureTestingModule({
      imports:   [TourLogFormComponent],
      providers: [{ provide: TourLogService, useValue: service }]
    }).compileComponents();

    fixture   = TestBed.createComponent(TourLogFormComponent);
    component = fixture.componentInstance;
    component.tourId = 'tour-1';
    component.log    = SAMPLE;
    fixture.detectChanges();
  });

  it('isEditMode is true when log input is provided', () => {
    expect(component.isEditMode).toBeTrue();
  });

  it('form is pre-filled with log values', () => {
    expect(component.form.value.rating).toBe(4);
    expect(component.form.value.difficulty).toBe('MEDIUM');
  });

  it('submit calls service.update() not create()', () => {
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(service.update).toHaveBeenCalled();
    expect(service.create).not.toHaveBeenCalled();
  });
});
