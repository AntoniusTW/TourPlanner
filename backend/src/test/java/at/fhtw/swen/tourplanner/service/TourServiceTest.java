package at.fhtw.swen.tourplanner.service;

import at.fhtw.swen.tourplanner.dto.TourDto;
import at.fhtw.swen.tourplanner.exception.TourNotFoundException;
import at.fhtw.swen.tourplanner.mapper.TourMapper;
import at.fhtw.swen.tourplanner.model.Tour;
import at.fhtw.swen.tourplanner.model.TransportType;
import at.fhtw.swen.tourplanner.repository.TourRepository;
import at.fhtw.swen.tourplanner.strategy.RouteCalculationStrategy;
import at.fhtw.swen.tourplanner.strategy.RouteCalculationStrategyFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TourServiceTest {

    @Mock
    private TourRepository tourRepository;

    @Mock
    private RouteCalculationStrategyFactory strategyFactory;

    @Spy
    private TourMapper tourMapper = new TourMapper();

    @InjectMocks
    private TourService tourService;

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Tour tour(UUID id, String name) {
        return Tour.builder()
                .id(id).name(name)
                .fromLocation("Wien").toLocation("Graz")
                .transportType(TransportType.CAR)
                .build();
    }

    private TourDto dto(String name) {
        return TourDto.builder()
                .name(name)
                .fromLocation("Wien").toLocation("Graz")
                .transportType(TransportType.CAR)
                .build();
    }

    // ── findAll ───────────────────────────────────────────────────────────────

    @Test
    void findAll_emptyRepository_returnsEmptyList() {
        when(tourRepository.findAll()).thenReturn(List.of());

        assertThat(tourService.findAll()).isEmpty();
    }

    @Test
    void findAll_multipleEntries_returnsMappedDtos() {
        UUID id1 = UUID.randomUUID(), id2 = UUID.randomUUID();
        when(tourRepository.findAll()).thenReturn(List.of(tour(id1, "Tour A"), tour(id2, "Tour B")));

        List<TourDto> result = tourService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result).extracting(TourDto::getName).containsExactly("Tour A", "Tour B");
    }

    // ── findById ──────────────────────────────────────────────────────────────

    @Test
    void findById_exists_returnsMappedDto() {
        UUID id = UUID.randomUUID();
        when(tourRepository.findById(id)).thenReturn(Optional.of(tour(id, "Meine Tour")));

        TourDto result = tourService.findById(id);

        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getName()).isEqualTo("Meine Tour");
    }

    @Test
    void findById_notFound_throwsTourNotFoundException() {
        UUID id = UUID.randomUUID();
        when(tourRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourService.findById(id))
                .isInstanceOf(TourNotFoundException.class)
                .hasMessageContaining(id.toString());
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Test
    void create_happyPath_returnsSavedDto() {
        UUID id = UUID.randomUUID();
        TourDto input = dto("Neue Tour");
        when(tourRepository.save(any())).thenReturn(tour(id, "Neue Tour"));

        TourDto result = tourService.create(input);

        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getName()).isEqualTo("Neue Tour");
        verify(tourRepository).save(any(Tour.class));
    }

    @Test
    void create_invalidData_repositoryExceptionPropagates() {
        TourDto input = dto(null);
        when(tourRepository.save(any())).thenThrow(DataIntegrityViolationException.class);

        assertThatThrownBy(() -> tourService.create(input))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void create_distanceSetAndNoEstimatedTime_strategyCalculatesTime() {
        TourDto input = dto("Tour mit Distanz");
        input.setDistance(100.0);

        RouteCalculationStrategy strategy = mock(RouteCalculationStrategy.class);
        when(strategy.calculateEstimatedTime(100.0)).thenReturn(75);
        when(strategyFactory.getStrategy(TransportType.CAR)).thenReturn(strategy);
        when(tourRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        TourDto result = tourService.create(input);

        assertThat(result.getEstimatedTime()).isEqualTo(75);
        verify(strategyFactory).getStrategy(TransportType.CAR);
    }

    @Test
    void create_estimatedTimeAlreadySet_strategyNotCalled() {
        TourDto input = dto("Tour mit Zeit");
        input.setDistance(100.0);
        input.setEstimatedTime(60);
        when(tourRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        tourService.create(input);

        verifyNoInteractions(strategyFactory);
    }

    @Test
    void create_noTransportType_strategyNotCalled() {
        TourDto input = TourDto.builder()
                .name("Tour ohne Typ").fromLocation("A").toLocation("B")
                .distance(50.0)
                .build();
        when(tourRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        tourService.create(input);

        verifyNoInteractions(strategyFactory);
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Test
    void update_happyPath_returnsUpdatedDto() {
        UUID id = UUID.randomUUID();
        TourDto input = dto("Updated Tour");
        when(tourRepository.existsById(id)).thenReturn(true);
        when(tourRepository.save(any())).thenReturn(tour(id, "Updated Tour"));

        TourDto result = tourService.update(id, input);

        assertThat(result.getName()).isEqualTo("Updated Tour");
        verify(tourRepository).save(any(Tour.class));
    }

    @Test
    void update_notFound_throwsTourNotFoundException() {
        UUID id = UUID.randomUUID();
        when(tourRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> tourService.update(id, dto("X")))
                .isInstanceOf(TourNotFoundException.class);

        verify(tourRepository, never()).save(any());
    }

    @Test
    void update_distanceSetAndNoEstimatedTime_strategyCalculatesTime() {
        UUID id = UUID.randomUUID();
        TourDto input = dto("Tour Update");
        input.setDistance(50.0);

        RouteCalculationStrategy strategy = mock(RouteCalculationStrategy.class);
        when(strategy.calculateEstimatedTime(50.0)).thenReturn(38);
        when(strategyFactory.getStrategy(TransportType.CAR)).thenReturn(strategy);
        when(tourRepository.existsById(id)).thenReturn(true);
        when(tourRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        TourDto result = tourService.update(id, input);

        assertThat(result.getEstimatedTime()).isEqualTo(38);
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    void delete_happyPath_callsDeleteById() {
        UUID id = UUID.randomUUID();
        when(tourRepository.existsById(id)).thenReturn(true);

        tourService.delete(id);

        verify(tourRepository).deleteById(id);
    }

    @Test
    void delete_notFound_throwsTourNotFoundException() {
        UUID id = UUID.randomUUID();
        when(tourRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> tourService.delete(id))
                .isInstanceOf(TourNotFoundException.class);

        verify(tourRepository, never()).deleteById(any());
    }
}
