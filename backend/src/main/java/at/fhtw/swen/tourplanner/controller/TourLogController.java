package at.fhtw.swen.tourplanner.controller;

import at.fhtw.swen.tourplanner.dto.TourLogDto;
import at.fhtw.swen.tourplanner.service.TourLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/tours/{tourId}/logs")
@RequiredArgsConstructor
public class TourLogController {

    private final TourLogService tourLogService;

    @GetMapping
    public ResponseEntity<List<TourLogDto>> getAll(@PathVariable UUID tourId) {
        return ResponseEntity.ok(tourLogService.findAllByTour(tourId));
    }

    @PostMapping
    public ResponseEntity<TourLogDto> create(@PathVariable UUID tourId,
                                             @Valid @RequestBody TourLogDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tourLogService.create(tourId, dto));
    }

    @PutMapping("/{logId}")
    public ResponseEntity<TourLogDto> update(@PathVariable UUID tourId,
                                             @PathVariable UUID logId,
                                             @Valid @RequestBody TourLogDto dto) {
        return ResponseEntity.ok(tourLogService.update(tourId, logId, dto));
    }

    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> delete(@PathVariable UUID tourId,
                                       @PathVariable UUID logId) {
        tourLogService.delete(tourId, logId);
        return ResponseEntity.noContent().build();
    }
}
