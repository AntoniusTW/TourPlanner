package at.fhtw.swen.tourplanner.strategy;

import at.fhtw.swen.tourplanner.model.TransportType;
import org.springframework.stereotype.Component;

@Component
public class CarRouteStrategy implements RouteCalculationStrategy {

    @Override
    public TransportType getTransportType() {
        return TransportType.CAR;
    }

    @Override
    public double getAverageSpeedKmh() {
        return 80.0;
    }
}
