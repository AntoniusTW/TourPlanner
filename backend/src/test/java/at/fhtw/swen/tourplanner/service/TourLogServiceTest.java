package at.fhtw.swen.tourplanner.service;

import at.fhtw.swen.tourplanner.dto.TourLogDto;
import at.fhtw.swen.tourplanner.exception.TourLogNotFoundException;
import at.fhtw.swen.tourplanner.exception.TourNotFoundException;
import at.fhtw.swen.tourplanner.mapper.TourLogMapper;
import at.fhtw.swen.tourplanner.model.DifficultyLevel;
import at.fhtw.swen.tourplanner.model.Tour;
import at.fhtw.swen.tourplanner.model.TourLog;
import at.fhtw.swen.tourplanner.model.TransportType;
import at.fhtw.swen.tourplanner.repository.TourLogRepository;
import at.fhtw.swen.tourplanner.repository.TourRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TourLogServiceTest {

    @Mock  private TourLogRepository tourLogRepository;
    @Mock  private TourRepository    tourRepository;
    @Spy   private TourLogMapper     tourLogMapper = new TourLogMapper();

    @InjectMocks
    private TourLogService tourLogService;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Tour tour(UUID id) {
        return Tour.builder()
                .id(id).name("Test Tour")
                .fromLocation("Wien").toLocation("Graz")
                .transportType(TransportType.WALKING)
                .build();
    }

    private TourLog log(UUID logId, Tour tour) {
        return TourLog.builder()
                .id(logId).tour(tour)
                .date(LocalDate.of(2025, 5, 1))
                .duration(60).rating(4)
                .difficulty(DifficultyLevel.MEDIUM)
                .build();
    }

    private TourLogDto dto() {
        return TourLogDto.builder()
                .date(LocalDate.of(2025, 5, 1))
                .duration(60).rating(4)
                .difficulty(DifficultyLevel.MEDIUM)
                .build();
    }

    // ── findAllByTour ─────────────────────────────────────────────────────────

    @Test
    void findAllByTour_emptyList_returnsEmpty() {
        UUID tourId = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(true);
        when(tourLogRepository.findByTourIdOrderByDateDesc(tourId)).thenReturn(List.of());

        assertThat(tourLogService.findAllByTour(tourId)).isEmpty();
    }

    @Test
    void findAllByTour_multipleLogs_returnsMappedDtos() {
        UUID tourId = UUID.randomUUID();
        Tour t = tour(tourId);
        UUID id1 = UUID.randomUUID(), id2 = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(true);
        when(tourLogRepository.findByTourIdOrderByDateDesc(tourId))
                .thenReturn(List.of(log(id1, t), log(id2, t)));

        List<TourLogDto> result = tourLogService.findAllByTour(tourId);

        assertThat(result).hasSize(2);
        assertThat(result).extracting(TourLogDto::getId).containsExactly(id1, id2);
    }

    @Test
    void findAllByTour_tourNotFound_throwsTourNotFoundException() {
        UUID tourId = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(false);

        assertThatThrownBy(() -> tourLogService.findAllByTour(tourId))
                .isInstanceOf(TourNotFoundException.class);

        verifyNoInteractions(tourLogRepository);
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Test
    void create_happyPath_returnsSavedDto() {
        UUID tourId = UUID.randomUUID();
        Tour t = tour(tourId);
        UUID logId = UUID.randomUUID();
        when(tourRepository.findById(tourId)).thenReturn(Optional.of(t));
        when(tourLogRepository.save(any())).thenReturn(log(logId, t));

        TourLogDto result = tourLogService.create(tourId, dto());

        assertThat(result.getId()).isEqualTo(logId);
        assertThat(result.getRating()).isEqualTo(4);
        verify(tourLogRepository).save(any(TourLog.class));
    }

    @Test
    void create_tourNotFound_throwsTourNotFoundException() {
        UUID tourId = UUID.randomUUID();
        when(tourRepository.findById(tourId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourLogService.create(tourId, dto()))
                .isInstanceOf(TourNotFoundException.class);

        verifyNoInteractions(tourLogRepository);
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Test
    void update_happyPath_returnsUpdatedDto() {
        UUID tourId = UUID.randomUUID();
        UUID logId  = UUID.randomUUID();
        Tour t = tour(tourId);
        TourLog existing = log(logId, t);
        when(tourRepository.existsById(tourId)).thenReturn(true);
        when(tourLogRepository.findById(logId)).thenReturn(Optional.of(existing));
        when(tourLogRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        TourLogDto input = dto();
        input.setRating(5);
        TourLogDto result = tourLogService.update(tourId, logId, input);

        assertThat(result.getId()).isEqualTo(logId);
        assertThat(result.getRating()).isEqualTo(5);
    }

    @Test
    void update_tourNotFound_throwsTourNotFoundException() {
        UUID tourId = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(false);

        assertThatThrownBy(() -> tourLogService.update(tourId, UUID.randomUUID(), dto()))
                .isInstanceOf(TourNotFoundException.class);

        verifyNoInteractions(tourLogRepository);
    }

    @Test
    void update_logNotFound_throwsTourLogNotFoundException() {
        UUID tourId = UUID.randomUUID();
        UUID logId  = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(true);
        when(tourLogRepository.findById(logId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourLogService.update(tourId, logId, dto()))
                .isInstanceOf(TourLogNotFoundException.class);

        verify(tourLogRepository, never()).save(any());
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    void delete_happyPath_callsDeleteById() {
        UUID tourId = UUID.randomUUID();
        UUID logId  = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(true);
        when(tourLogRepository.existsById(logId)).thenReturn(true);

        tourLogService.delete(tourId, logId);

        verify(tourLogRepository).deleteById(logId);
    }

    @Test
    void delete_tourNotFound_throwsTourNotFoundException() {
        UUID tourId = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(false);

        assertThatThrownBy(() -> tourLogService.delete(tourId, UUID.randomUUID()))
                .isInstanceOf(TourNotFoundException.class);

        verifyNoInteractions(tourLogRepository);
    }

    @Test
    void delete_logNotFound_throwsTourLogNotFoundException() {
        UUID tourId = UUID.randomUUID();
        UUID logId  = UUID.randomUUID();
        when(tourRepository.existsById(tourId)).thenReturn(true);
        when(tourLogRepository.existsById(logId)).thenReturn(false);

        assertThatThrownBy(() -> tourLogService.delete(tourId, logId))
                .isInstanceOf(TourLogNotFoundException.class);

        verify(tourLogRepository, never()).deleteById(any());
    }
}
