package at.fhtw.swen.tourplanner.dto;

import at.fhtw.swen.tourplanner.model.TransportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourDto {

    private UUID id;

    @NotBlank(message = "Name darf nicht leer sein")
    private String name;

    private String description;

    @NotBlank(message = "Startort darf nicht leer sein")
    private String fromLocation;

    @NotBlank(message = "Zielort darf nicht leer sein")
    private String toLocation;

    @NotNull(message = "Transportart muss angegeben werden")
    private TransportType transportType;

    private Double distance;
    private Integer estimatedTime;
    private String imagePath;
    private Instant createdAt;
    private Instant updatedAt;
}
