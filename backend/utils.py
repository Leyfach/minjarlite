from sqlalchemy.orm import Session
from . import models

def get_heatmap_data(db: Session, url: str):
    events = db.query(models.ClickEvent).filter(models.ClickEvent.url == url).all()

    return [{
        "x": e.x,
        "y": e.y,
        "viewport_w": e.viewport_w,
        "viewport_h": e.viewport_h,
        "timestamp": e.created_at.isoformat()
    } for e in events]
