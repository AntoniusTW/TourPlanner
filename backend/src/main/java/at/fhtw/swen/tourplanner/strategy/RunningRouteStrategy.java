package at.fhtw.swen.tourplanner.strategy;

import at.fhtw.swen.tourplanner.model.TransportType;
import org.springframework.stereotype.Component;

@Component
public class RunningRouteStrategy implements RouteCalculationStrategy {

    @Override
    public TransportType getTransportType() {
        return TransportType.RUNNING;
    }

    @Override
    public double getAverageSpeedKmh() {
        return 10.0;
    }
}
