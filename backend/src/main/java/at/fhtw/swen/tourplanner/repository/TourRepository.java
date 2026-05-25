package at.fhtw.swen.tourplanner.repository;

import at.fhtw.swen.tourplanner.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TourRepository extends JpaRepository<Tour, UUID> {
}
