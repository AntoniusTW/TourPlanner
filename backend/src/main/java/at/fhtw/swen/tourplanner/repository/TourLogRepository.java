package at.fhtw.swen.tourplanner.repository;

import at.fhtw.swen.tourplanner.model.TourLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TourLogRepository extends JpaRepository<TourLog, UUID> {

    List<TourLog> findByTourIdOrderByDateDesc(UUID tourId);
}
