"""
Test script to verify database connection and models
Run this with: python test_db.py
"""
import os
from database import engine, SessionLocal
import models
from datetime import datetime, timedelta
import sys

# Create tables
models.Base.metadata.create_all(bind=engine)

# Create a session
db = SessionLocal()

try:
    # Clear existing data for testing
    db.query(models.Task).delete()
    db.query(models.Project).delete()
    db.commit()
    
    # Create a test project
    project = models.Project(
        title="Test Project",
        description="This is a test project",
        dueDate=datetime.now() + timedelta(days=30),
        status="PLANNING",
        icon="folder"
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Create a test task linked to the project
    task = models.Task(
        title="Test Task",
        description="This is a test task",
        status="TODO",
        dueDate=datetime.now() + timedelta(days=7),
        projectId=project.id
    )
    db.add(task)
    db.commit()
    
    # Query and print data to verify
    projects = db.query(models.Project).all()
    tasks = db.query(models.Task).all()
    
    print(f"Database connection successful!")
    print(f"Created {len(projects)} projects and {len(tasks)} tasks")
    print(f"Sample project: {projects[0].title}")
    print(f"Sample task: {tasks[0].title} (linked to project: {tasks[0].project.title})")
    sys.exit(0)  # Success
    
except Exception as e:
    print(f"Database error: {e}")
    sys.exit(1)  # Error
    
finally:
    db.close() 