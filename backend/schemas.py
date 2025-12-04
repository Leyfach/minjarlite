from typing import List

from pydantic import BaseModel, Field


class ClickCreate(BaseModel):
    x: int = Field(..., ge=0)
    y: int = Field(..., ge=0)
    viewport_w: int = Field(..., gt=0)
    viewport_h: int = Field(..., gt=0)
    url: str


class HeatmapPoint(BaseModel):
    x: int
    y: int
    value: int
    viewport_w: int
    viewport_h: int


class HeatmapResponse(BaseModel):
    points: List[HeatmapPoint]


class PageStat(BaseModel):
    url: str
    clickCount: int
