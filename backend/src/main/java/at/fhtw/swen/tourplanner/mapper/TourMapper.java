package at.fhtw.swen.tourplanner.mapper;

import at.fhtw.swen.tourplanner.dto.TourDto;
import at.fhtw.swen.tourplanner.model.Tour;
import org.springframework.stereotype.Component;

@Component
public class TourMapper {

    public TourDto toDto(Tour tour) {
        return TourDto.builder()
                .id(tour.getId())
                .name(tour.getName())
                .description(tour.getDescription())
                .fromLocation(tour.getFromLocation())
                .toLocation(tour.getToLocation())
                .transportType(tour.getTransportType())
                .distance(tour.getDistance())
                .estimatedTime(tour.getEstimatedTime())
                .imagePath(tour.getImagePath())
                .createdAt(tour.getCreatedAt())
                .updatedAt(tour.getUpdatedAt())
                .build();
    }

    public Tour toEntity(TourDto dto) {
        return Tour.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .fromLocation(dto.getFromLocation())
                .toLocation(dto.getToLocation())
                .transportType(dto.getTransportType())
                .distance(dto.getDistance())
                .estimatedTime(dto.getEstimatedTime())
                .imagePath(dto.getImagePath())
                .build();
    }
}
