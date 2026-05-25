package at.fhtw.swen.tourplanner.strategy;

import at.fhtw.swen.tourplanner.model.TransportType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Factory Pattern: sammelt alle Strategy-Beans per Constructor Injection
 * und liefert die passende Instanz anhand des TransportType.
 */
@Component
public class RouteCalculationStrategyFactory {

    private final Map<TransportType, RouteCalculationStrategy> strategies;

    public RouteCalculationStrategyFactory(List<RouteCalculationStrategy> strategies) {
        this.strategies = strategies.stream()
                .collect(Collectors.toMap(RouteCalculationStrategy::getTransportType, Function.identity()));
    }

    public RouteCalculationStrategy getStrategy(TransportType type) {
        RouteCalculationStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("Keine Strategie für TransportType: " + type);
        }
        return strategy;
    }
}
