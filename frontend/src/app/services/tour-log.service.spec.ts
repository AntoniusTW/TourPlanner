import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TourLogService } from './tour-log.service';
import { TourLog } from '../models/tour-log.model';

const BASE = 'http://localhost:8081/api/tours';

const TOUR_ID = 'tour-1';
const LOG_ID  = 'log-1';

const SAMPLE: TourLog = {
  id: LOG_ID,
  tourId: TOUR_ID,
  date: '2025-05-01',
  duration: 60,
  rating: 4,
  difficulty: 'MEDIUM'
};

describe('TourLogService', () => {
  let service: TourLogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TourLogService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TourLogService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // ── loadAllForTour ────────────────────────────────────────────────────────

  it('loadAllForTour: makes GET and sets logs signal', () => {
    service.loadAllForTour(TOUR_ID);
    http.expectOne(`${BASE}/${TOUR_ID}/logs`).flush([SAMPLE]);
    expect(service.logs()).toEqual([SAMPLE]);
    expect(service.loading()).toBeFalse();
  });

  it('loadAllForTour: sets loading=true while request is in-flight', () => {
    service.loadAllForTour(TOUR_ID);
    expect(service.loading()).toBeTrue();
    http.expectOne(`${BASE}/${TOUR_ID}/logs`).flush([]);
  });

  it('loadAllForTour: on error sets error signal and clears loading', () => {
    service.loadAllForTour(TOUR_ID);
    http.expectOne(`${BASE}/${TOUR_ID}/logs`).error(new ProgressEvent('network-error'));
    expect(service.error()).toBe('Logs konnten nicht geladen werden');
    expect(service.loading()).toBeFalse();
  });

  // ── create ────────────────────────────────────────────────────────────────

  it('create: makes POST to correct URL', () => {
    const { id, tourId, ...input } = SAMPLE;
    service.create(TOUR_ID, input).subscribe();
    const req = http.expectOne(`${BASE}/${TOUR_ID}/logs`);
    expect(req.request.method).toBe('POST');
    req.flush(SAMPLE);
  });

  it('create: prepends created log to logs signal', () => {
    const other: TourLog = { ...SAMPLE, id: 'log-0' };
    service.logs.set([other]);
    const { id, tourId, ...input } = SAMPLE;
    service.create(TOUR_ID, input).subscribe();
    http.expectOne(`${BASE}/${TOUR_ID}/logs`).flush(SAMPLE);
    expect(service.logs()[0].id).toBe(LOG_ID);
    expect(service.logs()[1].id).toBe('log-0');
  });

  // ── update ────────────────────────────────────────────────────────────────

  it('update: makes PUT to correct URL', () => {
    service.update(TOUR_ID, LOG_ID, SAMPLE).subscribe();
    const req = http.expectOne(`${BASE}/${TOUR_ID}/logs/${LOG_ID}`);
    expect(req.request.method).toBe('PUT');
    req.flush(SAMPLE);
  });

  it('update: replaces matching entry in logs signal', () => {
    service.logs.set([SAMPLE]);
    const updated = { ...SAMPLE, rating: 5 };
    service.update(TOUR_ID, LOG_ID, updated).subscribe();
    http.expectOne(`${BASE}/${TOUR_ID}/logs/${LOG_ID}`).flush(updated);
    expect(service.logs()[0].rating).toBe(5);
  });

  // ── delete ────────────────────────────────────────────────────────────────

  it('delete: makes DELETE to correct URL', () => {
    service.delete(TOUR_ID, LOG_ID).subscribe();
    const req = http.expectOne(`${BASE}/${TOUR_ID}/logs/${LOG_ID}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('delete: removes log from logs signal', () => {
    service.logs.set([SAMPLE]);
    service.delete(TOUR_ID, LOG_ID).subscribe();
    http.expectOne(`${BASE}/${TOUR_ID}/logs/${LOG_ID}`).flush(null);
    expect(service.logs()).toEqual([]);
  });

  it('delete: keeps other logs when a different log is deleted', () => {
    const other: TourLog = { ...SAMPLE, id: 'log-2' };
    service.logs.set([SAMPLE, other]);
    service.delete(TOUR_ID, 'log-2').subscribe();
    http.expectOne(`${BASE}/${TOUR_ID}/logs/log-2`).flush(null);
    expect(service.logs()).toEqual([SAMPLE]);
  });
});
