package at.fhtw.swen.tourplanner.service;

import at.fhtw.swen.tourplanner.dto.TourDto;
import at.fhtw.swen.tourplanner.exception.TourNotFoundException;
import at.fhtw.swen.tourplanner.mapper.TourMapper;
import at.fhtw.swen.tourplanner.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TourService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    private final TourRepository tourRepository;
    private final TourMapper tourMapper;

    @Value("${tour.images.upload-dir}")
    private String uploadDir;

    public List<TourDto> findAll() {
        log.info("Fetching all tours");
        return tourRepository.findAll().stream()
                .map(tourMapper::toDto)
                .toList();
    }

    public TourDto findById(UUID id) {
        log.info("Fetching tour with id={}", id);
        return tourRepository.findById(id)
                .map(tourMapper::toDto)
                .orElseThrow(() -> new TourNotFoundException(id));
    }

    public TourDto create(TourDto dto) {
        log.info("Creating tour: {}", dto.getName());
        var saved = tourRepository.save(tourMapper.toEntity(dto));
        return tourMapper.toDto(saved);
    }

    public TourDto update(UUID id, TourDto dto) {
        log.info("Updating tour with id={}", id);
        if (!tourRepository.existsById(id)) {
            throw new TourNotFoundException(id);
        }
        dto.setId(id);
        var saved = tourRepository.save(tourMapper.toEntity(dto));
        return tourMapper.toDto(saved);
    }

    public void delete(UUID id) {
        log.info("Deleting tour with id={}", id);
        if (!tourRepository.existsById(id)) {
            throw new TourNotFoundException(id);
        }
        tourRepository.deleteById(id);
    }

    public TourDto uploadImage(UUID id, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Datei darf nicht leer sein");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Nur Bilddateien (JPEG, PNG, GIF, WebP) sind erlaubt");
        }

        var tour = tourRepository.findById(id)
                .orElseThrow(() -> new TourNotFoundException(id));

        String extension = contentType.substring(contentType.lastIndexOf('/') + 1);
        String filename = UUID.randomUUID() + "." + extension;

        try {
            Path dir = Path.of(uploadDir);
            Files.createDirectories(dir);
            Files.copy(file.getInputStream(), dir.resolve(filename));
        } catch (IOException e) {
            throw new UncheckedIOException("Fehler beim Speichern des Bildes", e);
        }

        log.info("Uploaded image {} for tour id={}", filename, id);
        tour.setImagePath("/uploads/images/" + filename);
        return tourMapper.toDto(tourRepository.save(tour));
    }
}
