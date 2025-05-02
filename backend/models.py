from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="TODO")
    dueDate = Column(DateTime, nullable=True)
    completed = Column(Boolean, default=False)
    projectId = Column(String, ForeignKey("projects.id"), nullable=True)
    createdAt = Column(DateTime, default=datetime.now)
    updatedAt = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    project = relationship("Project", back_populates="tasks")
    notifications = relationship("Notification", back_populates="task")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    dueDate = Column(DateTime, nullable=True)
    status = Column(String, default="PLANNING")
    icon = Column(String, default="folder")
    createdAt = Column(DateTime, default=datetime.now)
    updatedAt = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    tasks = relationship("Task", back_populates="project")
    notifications = relationship("Notification", back_populates="project")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    type = Column(String, default="INFO")  # INFO, WARNING, SUCCESS, ERROR
    read = Column(Boolean, default=False)
    taskId = Column(String, ForeignKey("tasks.id"), nullable=True)
    projectId = Column(String, ForeignKey("projects.id"), nullable=True)
    createdAt = Column(DateTime, default=datetime.now)

    task = relationship("Task", back_populates="notifications")
    project = relationship("Project", back_populates="notifications")