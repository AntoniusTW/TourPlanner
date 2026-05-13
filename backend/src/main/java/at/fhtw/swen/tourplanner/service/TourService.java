package at.fhtw.swen.tourplanner.service;

import at.fhtw.swen.tourplanner.dto.TourDto;
import at.fhtw.swen.tourplanner.exception.TourNotFoundException;
import at.fhtw.swen.tourplanner.mapper.TourMapper;
import at.fhtw.swen.tourplanner.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final TourMapper tourMapper;

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
}
