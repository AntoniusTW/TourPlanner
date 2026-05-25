package at.fhtw.swen.tourplanner.mapper;

import at.fhtw.swen.tourplanner.dto.TourLogDto;
import at.fhtw.swen.tourplanner.model.Tour;
import at.fhtw.swen.tourplanner.model.TourLog;
import org.springframework.stereotype.Component;

@Component
public class TourLogMapper {

    public TourLogDto toDto(TourLog log) {
        return TourLogDto.builder()
                .id(log.getId())
                .tourId(log.getTour().getId())
                .date(log.getDate())
                .duration(log.getDuration())
                .distance(log.getDistance())
                .rating(log.getRating())
                .comment(log.getComment())
                .difficulty(log.getDifficulty())
                .createdAt(log.getCreatedAt())
                .build();
    }

    public TourLog toEntity(TourLogDto dto, Tour tour) {
        return TourLog.builder()
                .id(dto.getId())
                .tour(tour)
                .date(dto.getDate())
                .duration(dto.getDuration())
                .distance(dto.getDistance())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .difficulty(dto.getDifficulty())
                .build();
    }
}
