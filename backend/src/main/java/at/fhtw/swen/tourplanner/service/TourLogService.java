package at.fhtw.swen.tourplanner.service;

import at.fhtw.swen.tourplanner.dto.TourLogDto;
import at.fhtw.swen.tourplanner.exception.TourLogNotFoundException;
import at.fhtw.swen.tourplanner.exception.TourNotFoundException;
import at.fhtw.swen.tourplanner.mapper.TourLogMapper;
import at.fhtw.swen.tourplanner.repository.TourLogRepository;
import at.fhtw.swen.tourplanner.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TourLogService {

    private final TourLogRepository tourLogRepository;
    private final TourRepository tourRepository;
    private final TourLogMapper tourLogMapper;

    public List<TourLogDto> findAllByTour(UUID tourId) {
        log.info("Fetching logs for tour id={}", tourId);
        if (!tourRepository.existsById(tourId)) {
            throw new TourNotFoundException(tourId);
        }
        return tourLogRepository.findByTourIdOrderByDateDesc(tourId).stream()
                .map(tourLogMapper::toDto)
                .toList();
    }

    public TourLogDto create(UUID tourId, TourLogDto dto) {
        log.info("Creating tour log for tour id={}", tourId);
        var tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException(tourId));
        var saved = tourLogRepository.save(tourLogMapper.toEntity(dto, tour));
        return tourLogMapper.toDto(saved);
    }

    public TourLogDto update(UUID tourId, UUID logId, TourLogDto dto) {
        log.info("Updating tour log id={} for tour id={}", logId, tourId);
        if (!tourRepository.existsById(tourId)) {
            throw new TourNotFoundException(tourId);
        }
        var existing = tourLogRepository.findById(logId)
                .orElseThrow(() -> new TourLogNotFoundException(logId));
        var tour = existing.getTour();
        dto.setId(logId);
        var saved = tourLogRepository.save(tourLogMapper.toEntity(dto, tour));
        return tourLogMapper.toDto(saved);
    }

    public void delete(UUID tourId, UUID logId) {
        log.info("Deleting tour log id={} for tour id={}", logId, tourId);
        if (!tourRepository.existsById(tourId)) {
            throw new TourNotFoundException(tourId);
        }
        if (!tourLogRepository.existsById(logId)) {
            throw new TourLogNotFoundException(logId);
        }
        tourLogRepository.deleteById(logId);
    }
}
