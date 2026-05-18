def simulate_traffic(base_traffic, impact_factor, scenario='weather'):
    scenario = scenario.lower()
    estimated_traffic = int(round(base_traffic * (1 + impact_factor)))

    scenario_map = {
        'road_closure': {
            'delay_ratio': 0.22,
            'travel_time_pct': 30,
            'description': 'Closed lanes force rerouting and increase travel delay.'
        },
        'weather': {
            'delay_ratio': 0.18,
            'travel_time_pct': 20,
            'description': 'Heavy weather causes slower movement and increased congestion.'
        },
        'event': {
            'delay_ratio': 0.25,
            'travel_time_pct': 35,
            'description': 'Special event traffic surge increases route load.'
        },
        'peak_load': {
            'delay_ratio': 0.16,
            'travel_time_pct': 18,
            'description': 'Peak-hour load increases congestion and delay.'
        }
    }

    details = scenario_map.get(scenario, scenario_map['weather'])
    estimated_delay = round(estimated_traffic * details['delay_ratio'], 2)
    travel_time_change = round(details['travel_time_pct'] * (1 + impact_factor), 2)
    congestion_impact = min(1.0, round(impact_factor * 0.8 + 0.15, 2))

    return {
        'scenario': scenario,
        'description': details['description'],
        'estimated_traffic': estimated_traffic,
        'estimated_delay': estimated_delay,
        'travel_time_change_pct': travel_time_change,
        'congestion_impact': congestion_impact
    }
