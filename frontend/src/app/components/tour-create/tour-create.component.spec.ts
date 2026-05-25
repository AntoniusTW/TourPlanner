import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TourCreateComponent } from './tour-create.component';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour.model';

const SAMPLE: Tour = {
  id: 'tour-1',
  name: 'Wienerwald Tour',
  fromLocation: 'Wien',
  toLocation: 'Baden',
  transportType: 'WALKING'
};

const VALID_FORM = {
  name: 'Test Tour',
  fromLocation: 'Wien',
  toLocation: 'Graz',
  transportType: 'CAR'
};

function makeService(overrides: Partial<Record<string, unknown>> = {}): TourService {
  return {
    tours:        signal<Tour[]>([]),
    selectedTour: signal<Tour | null>(null),
    loading:      signal(false),
    error:        signal<string | null>(null),
    getById:      jasmine.createSpy('getById').and.returnValue(of(SAMPLE)),
    create:       jasmine.createSpy('create').and.returnValue(of(SAMPLE)),
    update:       jasmine.createSpy('update').and.returnValue(of(SAMPLE)),
    uploadImage:  jasmine.createSpy('uploadImage').and.returnValue(of(SAMPLE)),
    selectTour:   jasmine.createSpy('selectTour'),
    loadAll:      jasmine.createSpy('loadAll'),
    loadById:     jasmine.createSpy('loadById'),
    delete:       jasmine.createSpy('delete').and.returnValue(of(undefined)),
    ...overrides
  } as unknown as TourService;
}

// ── Create mode ───────────────────────────────────────────────────────────────

describe('TourCreateComponent (create mode)', () => {
  let fixture: ComponentFixture<TourCreateComponent>;
  let component: TourCreateComponent;
  let service: TourService;
  let router: Router;

  beforeEach(async () => {
    service = makeService();
    await TestBed.configureTestingModule({
      imports:   [TourCreateComponent],
      providers: [
        { provide: TourService, useValue: service },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(TourCreateComponent);
    component = fixture.componentInstance;
    router    = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ── Form validation ─────────────────────────────────────────────────────────

  it('form is invalid when all fields are empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('name: required fires on empty value', () => {
    component.field('name').setValue('');
    expect(component.field('name').hasError('required')).toBeTrue();
  });

  it('name: maxlength fires when value exceeds 100 chars', () => {
    component.field('name').setValue('x'.repeat(101));
    expect(component.field('name').hasError('maxlength')).toBeTrue();
  });

  it('fromLocation: required fires on empty value', () => {
    component.field('fromLocation').setValue('');
    expect(component.field('fromLocation').hasError('required')).toBeTrue();
  });

  it('toLocation: required fires on empty value', () => {
    component.field('toLocation').setValue('');
    expect(component.field('toLocation').hasError('required')).toBeTrue();
  });

  it('transportType: required fires on empty value', () => {
    component.field('transportType').setValue('');
    expect(component.field('transportType').hasError('required')).toBeTrue();
  });

  it('form is valid when all required fields are filled', () => {
    component.form.patchValue(VALID_FORM);
    expect(component.form.valid).toBeTrue();
  });

  // ── Submit behaviour ─────────────────────────────────────────────────────────

  it('submit with invalid form marks all controls touched', () => {
    component.submit();
    expect(component.field('name').touched).toBeTrue();
    expect(component.field('fromLocation').touched).toBeTrue();
    expect(component.field('toLocation').touched).toBeTrue();
    expect(component.field('transportType').touched).toBeTrue();
  });

  it('submit with invalid form does not call tourService.create()', () => {
    component.submit();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('submit (create mode) calls tourService.create() with form value', () => {
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(service.create).toHaveBeenCalledWith(jasmine.objectContaining(VALID_FORM));
  });

  it('submit success: sets success signal and resets form', () => {
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(component.success()).toBeTrue();
    expect(component.form.pristine).toBeTrue();
    expect(component.submitting()).toBeFalse();
  });

  it('submit error: sets serverError and clears submitting flag', () => {
    (service.create as jasmine.Spy).and.returnValue(throwError(() => new Error('fail')));
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(component.serverError()).toBeTruthy();
    expect(component.submitting()).toBeFalse();
  });

  // ── File selection ────────────────────────────────────────────────────────────

  it('onFileSelect: invalid MIME type sets serverError', () => {
    const event = { target: { files: [new File(['data'], 'doc.pdf', { type: 'application/pdf' })] } } as unknown as Event;
    component.onFileSelect(event);
    expect(component.serverError()).toBeTruthy();
    expect(component.selectedFile()).toBeNull();
  });

  it('onFileSelect: file over 10 MB sets serverError', () => {
    const big   = new File([new ArrayBuffer(11 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [big] } } as unknown as Event;
    component.onFileSelect(event);
    expect(component.serverError()).toContain('10 MB');
  });

  it('onFileSelect: valid image sets selectedFile and clears error', () => {
    const file  = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelect(event);
    expect(component.selectedFile()).toBe(file);
    expect(component.serverError()).toBeNull();
  });

  // ── tryAbort ──────────────────────────────────────────────────────────────────

  it('tryAbort: dirty form shows confirm dialog', () => {
    component.form.markAsDirty();
    component.tryAbort();
    expect(component.showAbortConfirm()).toBeTrue();
  });

  it('tryAbort: clean form navigates to /tours', () => {
    spyOn(router, 'navigate');
    component.tryAbort();
    expect(router.navigate).toHaveBeenCalledWith(['/tours']);
    expect(component.showAbortConfirm()).toBeFalse();
  });
});

// ── Edit mode ─────────────────────────────────────────────────────────────────

describe('TourCreateComponent (edit mode — no cache)', () => {
  let fixture: ComponentFixture<TourCreateComponent>;
  let component: TourCreateComponent;
  let service: TourService;

  beforeEach(async () => {
    service = makeService();
    await TestBed.configureTestingModule({
      imports:   [TourCreateComponent],
      providers: [
        { provide: TourService, useValue: service },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'tour-1' }) } } }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(TourCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('isEditMode signal is true', () => {
    expect(component.isEditMode()).toBeTrue();
  });

  it('fetches tour via getById when not in cache', () => {
    expect(service.getById).toHaveBeenCalledWith('tour-1');
    expect(component.form.value.name).toBe('Wienerwald Tour');
  });

  it('submit calls tourService.update() not create()', () => {
    component.form.patchValue(VALID_FORM);
    component.submit();
    expect(service.update).toHaveBeenCalled();
    expect(service.create).not.toHaveBeenCalled();
  });
});

describe('TourCreateComponent (edit mode — cached selectedTour)', () => {
  let fixture: ComponentFixture<TourCreateComponent>;
  let component: TourCreateComponent;
  let service: TourService;

  beforeEach(async () => {
    const selectedTour = signal<Tour | null>(SAMPLE);
    service = makeService({ selectedTour });

    await TestBed.configureTestingModule({
      imports:   [TourCreateComponent],
      providers: [
        { provide: TourService, useValue: service },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'tour-1' }) } } }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(TourCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('patches form from selectedTour signal without HTTP call', () => {
    expect(component.form.value.name).toBe('Wienerwald Tour');
    expect(service.getById).not.toHaveBeenCalled();
  });
});
