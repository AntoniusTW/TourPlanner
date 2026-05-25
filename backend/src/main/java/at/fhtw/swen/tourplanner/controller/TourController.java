package at.fhtw.swen.tourplanner.controller;

import at.fhtw.swen.tourplanner.dto.TourDto;
import at.fhtw.swen.tourplanner.service.TourService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<TourDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(tourService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TourDto> create(@Valid @RequestBody TourDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tourService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourDto> update(@PathVariable UUID id, @Valid @RequestBody TourDto dto) {
        return ResponseEntity.ok(tourService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        tourService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TourDto> uploadImage(@PathVariable UUID id,
                                               @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(tourService.uploadImage(id, file));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<Resource> getImage(@PathVariable UUID id) {
        return tourService.getImage(id);
    }
}
