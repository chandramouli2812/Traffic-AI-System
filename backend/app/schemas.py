from pydantic import BaseModel
from datetime import datetime

class TrafficSchema(BaseModel):
    timestamp: datetime
    route_id: str
    vehicle_count: int
    avg_speed: float
    congestion_level: float