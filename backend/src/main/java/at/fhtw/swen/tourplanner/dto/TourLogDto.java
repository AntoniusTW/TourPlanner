package at.fhtw.swen.tourplanner.dto;

import at.fhtw.swen.tourplanner.model.DifficultyLevel;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourLogDto {

    private UUID id;
    private UUID tourId;

    @NotNull(message = "Datum muss angegeben werden")
    private LocalDate date;

    @NotNull(message = "Dauer muss angegeben werden")
    @Min(value = 1, message = "Dauer muss mindestens 1 Minute betragen")
    private Integer duration;

    @DecimalMin(value = "0.0", inclusive = false, message = "Distanz muss positiv sein")
    private Double distance;

    @NotNull(message = "Bewertung muss angegeben werden")
    @Min(value = 1, message = "Bewertung muss mindestens 1 sein")
    @Max(value = 5, message = "Bewertung darf maximal 5 sein")
    private Integer rating;

    private String comment;

    @NotNull(message = "Schwierigkeitsgrad muss angegeben werden")
    private DifficultyLevel difficulty;

    private Instant createdAt;
}
