def mobility_recommendation(congestion_level, route_id=None, hour=None):
    recommendation = {
        'congestion_level': congestion_level,
        'route_id': route_id,
        'hour': hour,
        'actions': []
    }

    if congestion_level >= 0.9:
        recommendation['actions'].append('Avoid the current route and use alternative corridors like Route C or Route D.')
        recommendation['actions'].append('Delay non-essential travel until after peak congestion.')
    elif congestion_level >= 0.7:
        recommendation['actions'].append('Use Route C during off-peak periods.')
        recommendation['actions'].append('Prefer travel after 10 PM or before 6 AM.')
    elif congestion_level >= 0.5:
        recommendation['actions'].append('Stagger travel by 30 minutes to reduce commute time.')
        recommendation['actions'].append('Consider lower-volume routes or public transit for this trip.')
    else:
        recommendation['actions'].append('Traffic is moderate; normal travel is recommended.')

    if hour is not None:
        if 7 <= hour <= 9 or 17 <= hour <= 19:
            recommendation['actions'].append('This is a peak-hour window; expect delays and use traffic-aware routing.')
        else:
            recommendation['actions'].append('This is a lower-impact hour with fewer delays.')

    return recommendation
