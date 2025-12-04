from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime

from database import Base


class Click(Base):
    __tablename__ = "clicks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    x: Mapped[int] = mapped_column(nullable=False)
    y: Mapped[int] = mapped_column(nullable=False)
    viewport_w: Mapped[int] = mapped_column(nullable=False)
    viewport_h: Mapped[int] = mapped_column(nullable=False)

    url: Mapped[str] = mapped_column(String(512), nullable=False, index=True)

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
