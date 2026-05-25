package at.fhtw.swen.tourplanner.strategy;

import at.fhtw.swen.tourplanner.model.TransportType;
import org.springframework.stereotype.Component;

@Component
public class BicycleRouteStrategy implements RouteCalculationStrategy {

    @Override
    public TransportType getTransportType() {
        return TransportType.BICYCLE;
    }

    @Override
    public double getAverageSpeedKmh() {
        return 15.0;
    }
}
