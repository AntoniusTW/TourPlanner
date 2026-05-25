package at.fhtw.swen.tourplanner.strategy;

import at.fhtw.swen.tourplanner.model.TransportType;

/**
 * Strategy Pattern: jede Implementierung kapselt die Berechnungslogik
 * für einen bestimmten Transporttyp.
 */
public interface RouteCalculationStrategy {

    TransportType getTransportType();

    /** Gibt die Durchschnittsgeschwindigkeit in km/h zurück. */
    double getAverageSpeedKmh();

    /** Berechnet die geschätzte Fahrzeit in Minuten. */
    default int calculateEstimatedTime(double distanceKm) {
        return (int) Math.ceil((distanceKm / getAverageSpeedKmh()) * 60);
    }
}
