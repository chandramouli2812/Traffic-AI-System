from sqlalchemy import Column, Integer, Float, String, DateTime
from app.database import Base

class TrafficData(Base):
    __tablename__ = "traffic_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime)
    route_id = Column(String)
    vehicle_count = Column(Integer)
    avg_speed = Column(Float)
    congestion_level = Column(Float)