package at.fhtw.swen.tourplanner.repository;

import at.fhtw.swen.tourplanner.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
}
