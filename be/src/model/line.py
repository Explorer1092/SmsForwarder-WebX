"""
@Time: 2024/12/01 19:30
@Author: Amagi_Yukisaki
@File: line.py
"""

from app import db
from sqlalchemy import Column, DateTime, Integer, String, Enum, func
from sqlalchemy.orm import relationship
import enum


class LineType(enum.Enum):
    SMSFORWARDER = 'SMSForwarder'
    UNKNOWN = 'UNKNOWN'


class Line(db.Model):
    __tablename__ = 'line'
    id = Column(Integer, primary_key=True, autoincrement=True)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    line_type = Column(Enum(LineType), nullable=False,
                       default=LineType.SMSFORWARDER)
    number = Column(String(255), nullable=False, unique=True)
    sim_slot = Column(Integer, nullable=False)
    device_mark = Column(String(255), nullable=False)
    # send api addr for device
    addr = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    conversations = relationship(
        "Conversation",
        back_populates="line",
        cascade="all, delete",
    )

    def __repr__(self):
        return "<Line(id='%s', number='%s')>" % (
            self.id, self.number
        )

    def to_json(self):
        return {
            'id': self.id,
            'number': self.number,
            'sim_slot': self.sim_slot,
            'device_mark': self.device_mark,
            'addr': self.addr,
            'description': self.description
        }
