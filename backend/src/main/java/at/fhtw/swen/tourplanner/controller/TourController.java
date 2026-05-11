package at.fhtw.swen.tourplanner.controller;

import at.fhtw.swen.tourplanner.dto.TourDto;
import at.fhtw.swen.tourplanner.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ResponseEntity<List<TourDto>> getAll() {
        return ResponseEntity.ok(tourService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TourDto> create(@RequestBody TourDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tourService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourDto> update(@PathVariable Long id, @RequestBody TourDto dto) {
        return ResponseEntity.ok(tourService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tourService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
