package at.fhtw.swen.tourplanner.strategy;

import at.fhtw.swen.tourplanner.model.TransportType;
import org.springframework.stereotype.Component;

@Component
public class WalkingRouteStrategy implements RouteCalculationStrategy {

    @Override
    public TransportType getTransportType() {
        return TransportType.WALKING;
    }

    @Override
    public double getAverageSpeedKmh() {
        return 5.0;
    }
}
