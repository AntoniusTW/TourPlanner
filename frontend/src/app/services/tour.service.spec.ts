import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TourService } from './tour.service';
import { Tour } from '../models/tour.model';

const API = 'http://localhost:8081/api/tours';

const SAMPLE: Tour = {
  id: 'tour-1',
  name: 'Wienerwald Tour',
  fromLocation: 'Wien',
  toLocation: 'Baden',
  transportType: 'WALKING',
  distance: 25,
  estimatedTime: 300
};

describe('TourService', () => {
  let service: TourService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TourService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TourService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // ── loadAll ───────────────────────────────────────────────────────────────

  it('loadAll: makes GET and sets tours signal', () => {
    service.loadAll();
    http.expectOne(API).flush([SAMPLE]);
    expect(service.tours()).toEqual([SAMPLE]);
    expect(service.loading()).toBeFalse();
  });

  it('loadAll: sets loading=true while request is in-flight', () => {
    service.loadAll();
    expect(service.loading()).toBeTrue();
    http.expectOne(API).flush([]);
  });

  it('loadAll: on error sets error signal and clears loading', () => {
    service.loadAll();
    http.expectOne(API).error(new ProgressEvent('network-error'));
    expect(service.error()).toBe('Touren konnten nicht geladen werden');
    expect(service.loading()).toBeFalse();
  });

  // ── loadById ──────────────────────────────────────────────────────────────

  it('loadById: makes GET and sets selectedTour signal', () => {
    service.loadById('tour-1');
    const req = http.expectOne(`${API}/tour-1`);
    expect(req.request.method).toBe('GET');
    req.flush(SAMPLE);
    expect(service.selectedTour()).toEqual(SAMPLE);
  });

  it('loadById: on error sets error signal with tour id', () => {
    service.loadById('tour-1');
    http.expectOne(`${API}/tour-1`).error(new ProgressEvent('error'));
    expect(service.error()).toBe('Tour tour-1 nicht gefunden');
  });

  // ── getById ───────────────────────────────────────────────────────────────

  it('getById: returns observable that emits the tour', () => {
    let result: Tour | undefined;
    service.getById('tour-1').subscribe(t => (result = t));
    http.expectOne(`${API}/tour-1`).flush(SAMPLE);
    expect(result).toEqual(SAMPLE);
  });

  // ── create ────────────────────────────────────────────────────────────────

  it('create: makes POST to correct URL', () => {
    const { id, createdAt, updatedAt, ...input } = SAMPLE;
    service.create(input).subscribe();
    const req = http.expectOne(API);
    expect(req.request.method).toBe('POST');
    req.flush(SAMPLE);
  });

  it('create: sends correct JSON body', () => {
    const { id, createdAt, updatedAt, ...input } = SAMPLE;
    service.create(input).subscribe();
    const req = http.expectOne(API);
    expect(req.request.body).toEqual(input);
    req.flush(SAMPLE);
  });

  it('create: appends created tour to tours signal', () => {
    const { id, createdAt, updatedAt, ...input } = SAMPLE;
    service.create(input).subscribe();
    http.expectOne(API).flush(SAMPLE);
    expect(service.tours()).toContain(SAMPLE);
  });

  // ── update ────────────────────────────────────────────────────────────────

  it('update: makes PUT to /tours/{id}', () => {
    service.update('tour-1', SAMPLE).subscribe();
    const req = http.expectOne(`${API}/tour-1`);
    expect(req.request.method).toBe('PUT');
    req.flush(SAMPLE);
  });

  it('update: replaces matching entry in tours signal', () => {
    service.tours.set([SAMPLE]);
    const updated = { ...SAMPLE, name: 'Updated' };
    service.update('tour-1', updated).subscribe();
    http.expectOne(`${API}/tour-1`).flush(updated);
    expect(service.tours()[0].name).toBe('Updated');
  });

  // ── delete ────────────────────────────────────────────────────────────────

  it('delete: makes DELETE to /tours/{id}', () => {
    service.delete('tour-1').subscribe();
    const req = http.expectOne(`${API}/tour-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('delete: removes tour from tours signal', () => {
    service.tours.set([SAMPLE]);
    service.delete('tour-1').subscribe();
    http.expectOne(`${API}/tour-1`).flush(null);
    expect(service.tours()).toEqual([]);
  });

  it('delete: clears selectedTour when the deleted tour was selected', () => {
    service.selectedTour.set(SAMPLE);
    service.delete('tour-1').subscribe();
    http.expectOne(`${API}/tour-1`).flush(null);
    expect(service.selectedTour()).toBeNull();
  });

  it('delete: keeps selectedTour when a different tour is deleted', () => {
    const other = { ...SAMPLE, id: 'tour-2' };
    service.selectedTour.set(SAMPLE);
    service.tours.set([other]);
    service.delete('tour-2').subscribe();
    http.expectOne(`${API}/tour-2`).flush(null);
    expect(service.selectedTour()).toEqual(SAMPLE);
  });

  // ── selectTour ────────────────────────────────────────────────────────────

  it('selectTour: sets selectedTour signal', () => {
    service.selectTour(SAMPLE);
    expect(service.selectedTour()).toEqual(SAMPLE);
  });

  it('selectTour: can be set to null', () => {
    service.selectedTour.set(SAMPLE);
    service.selectTour(null);
    expect(service.selectedTour()).toBeNull();
  });

  // ── uploadImage ───────────────────────────────────────────────────────────

  it('uploadImage: makes POST with FormData to /tours/{id}/image', () => {
    service.tours.set([SAMPLE]);
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    service.uploadImage('tour-1', file).subscribe();
    const req = http.expectOne(`${API}/tour-1/image`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush({ ...SAMPLE, imagePath: '/uploads/photo.jpg' });
  });

  it('uploadImage: updates imagePath in tours signal', () => {
    service.tours.set([SAMPLE]);
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    const updated = { ...SAMPLE, imagePath: '/uploads/photo.jpg' };
    service.uploadImage('tour-1', file).subscribe();
    http.expectOne(`${API}/tour-1/image`).flush(updated);
    expect(service.tours()[0].imagePath).toBe('/uploads/photo.jpg');
  });
});
