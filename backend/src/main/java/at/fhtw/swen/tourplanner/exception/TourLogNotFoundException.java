package at.fhtw.swen.tourplanner.exception;

import java.util.UUID;

public class TourLogNotFoundException extends RuntimeException {

    public TourLogNotFoundException(UUID id) {
        super("Tour log not found: " + id);
    }
}
