from datetime import datetime
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine
from models import Click
from schemas import ClickCreate, HeatmapResponse, PageStat

# Create tables on startup (SQLite file defined in database.py)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Heatmap Tracker API")

# Allow local frontend access during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """Provide a DB session for each request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}


@app.post("/api/track")
def track_click(payload: ClickCreate, db: Session = Depends(get_db)):
    click = Click(
        x=payload.x,
        y=payload.y,
        viewport_w=payload.viewport_w,
        viewport_h=payload.viewport_h,
        url=payload.url,
        timestamp=datetime.utcnow(),
    )
    db.add(click)
    db.commit()
    db.refresh(click)
    return {"status": "tracked", "id": click.id}


@app.get("/api/heatmap", response_model=HeatmapResponse)
def get_heatmap(url: str, db: Session = Depends(get_db)):
    if not url:
        raise HTTPException(status_code=400, detail="url query parameter is required")

    clicks: List[Click] = db.query(Click).filter(Click.url == url).all()
    points = [
        {
            "x": c.x,
            "y": c.y,
            "value": 1,
            "viewport_w": c.viewport_w,
            "viewport_h": c.viewport_h,
        }
        for c in clicks
    ]
    return {"points": points}


@app.get("/api/stats", response_model=List[PageStat])
def get_page_stats(db: Session = Depends(get_db)):
    results = (
        db.query(Click.url, func.count(Click.id).label("click_count"))
        .group_by(Click.url)
        .all()
    )
    return [{"url": url, "clickCount": count} for url, count in results]


@app.delete("/api/data")
def clear_data(db: Session = Depends(get_db)):
    deleted = db.query(Click).delete()
    db.commit()
    return {"deleted": deleted}
