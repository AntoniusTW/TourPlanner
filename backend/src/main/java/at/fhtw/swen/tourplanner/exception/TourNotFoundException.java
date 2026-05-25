package at.fhtw.swen.tourplanner.exception;

import java.util.UUID;

public class TourNotFoundException extends RuntimeException {

    public TourNotFoundException(UUID id) {
        super("Tour not found: " + id);
    }
}
