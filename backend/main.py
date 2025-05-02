from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import models
from database import get_db, engine

# Create database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tms-next-fast.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "X-Requested-With", "Authorization"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Task schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "TODO"
    dueDate: Optional[datetime] = None
    projectId: Optional[str] = None
    completed: Optional[bool] = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True  # Updated from orm_mode=True in Pydantic v2

# Project schemas
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    dueDate: Optional[datetime] = None
    status: Optional[str] = "PLANNING"
    icon: Optional[str] = "folder"

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True  # Updated from orm_mode=True in Pydantic v2

# Notification schemas
class NotificationBase(BaseModel):
    title: str
    message: Optional[str] = None
    type: Optional[str] = "INFO"
    taskId: Optional[str] = None
    projectId: Optional[str] = None
    read: Optional[bool] = False

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: str
    createdAt: datetime

    class Config:
        from_attributes = True

@app.get("/")
async def root():
    return {"message": "Welcome to TMS API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Tasks endpoints
@app.get("/api/tasks", response_model=List[Task])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    return tasks

@app.post("/api/tasks", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status,
        dueDate=task.dueDate or datetime.now(),
        projectId=task.projectId,
        completed=task.completed,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Create a notification for the new task
    notification = models.Notification(
        title="New task created",
        message=f"Task '{task.title}' has been created",
        type="INFO",
        taskId=db_task.id
    )
    db.add(notification)
    db.commit()
    
    return db_task

@app.get("/api/tasks/{task_id}", response_model=Task)
def get_task(task_id: str, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.put("/api/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: dict, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Save old status for notification
    old_status = db_task.status
    
    # Handle date parsing for dueDate if it's provided
    if 'dueDate' in task_update:
        try:
            if isinstance(task_update['dueDate'], str):
                task_update['dueDate'] = datetime.fromisoformat(task_update['dueDate'].replace('Z', '+00:00'))
        except ValueError as e:
            raise HTTPException(status_code=422, detail=f"Invalid date format for dueDate: {str(e)}")
    
    # Update task attributes that are provided in the request
    for key, value in task_update.items():
        if hasattr(db_task, key):
            setattr(db_task, key, value)
    
    db_task.updatedAt = datetime.now()
    db.commit()
    db.refresh(db_task)
    
    # Create notification for status change
    if 'status' in task_update and old_status != task_update['status']:
        notification_title = "Task status updated"
        notification_message = f"Task '{db_task.title}' status changed from {old_status} to {task_update['status']}"
        
        # If task was completed
        if task_update['status'] == "DONE":
            notification_title = "Task completed"
            notification_message = f"Task '{db_task.title}' has been marked as completed"
        
        notification = models.Notification(
            title=notification_title,
            message=notification_message,
            type="SUCCESS" if task_update['status'] == "DONE" else "INFO",
            taskId=db_task.id
        )
        db.add(notification)
        db.commit()
    
    return db_task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_title = db_task.title
    db.delete(db_task)
    db.commit()
    
    # Create notification for task deletion
    notification = models.Notification(
        title="Task deleted",
        message=f"Task '{task_title}' has been deleted",
        type="WARNING"
    )
    db.add(notification)
    db.commit()
    
    return {"success": True, "message": "Task deleted successfully"}

# Projects endpoints
@app.get("/api/projects", response_model=List[Project])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    return projects

@app.post("/api/projects", response_model=Project)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(
        title=project.title,
        description=project.description,
        dueDate=project.dueDate or datetime.now(),
        status=project.status,
        icon=project.icon,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Create a notification for the new project
    notification = models.Notification(
        title="New project created",
        message=f"Project '{project.title}' has been created",
        type="INFO",
        projectId=db_project.id
    )
    db.add(notification)
    db.commit()
    
    return db_project

@app.get("/api/projects/{project_id}", response_model=Project)
def get_project(project_id: str, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.put("/api/projects/{project_id}", response_model=Project)
def update_project(project_id: str, project: ProjectBase, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    old_status = db_project.status
    project_dict = project.dict(exclude_unset=True)
    
    # Update project attributes
    for key, value in project_dict.items():
        setattr(db_project, key, value)
    
    db_project.updatedAt = datetime.now()
    db.commit()
    db.refresh(db_project)
    
    # Create notification for status change
    if 'status' in project_dict and old_status != project_dict['status']:
        notification_title = "Project status updated"
        notification_message = f"Project '{db_project.title}' status changed from {old_status} to {project_dict['status']}"
        
        # If project was completed
        if project_dict['status'] == "COMPLETED":
            notification_title = "Project completed"
            notification_message = f"Project '{db_project.title}' has been marked as completed"
        
        notification = models.Notification(
            title=notification_title,
            message=notification_message,
            type="SUCCESS" if project_dict['status'] == "COMPLETED" else "INFO",
            projectId=db_project.id
        )
        db.add(notification)
        db.commit()
    
    return db_project

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project_title = db_project.title
    db.delete(db_project)
    db.commit()
    
    # Create notification for project deletion
    notification = models.Notification(
        title="Project deleted",
        message=f"Project '{project_title}' has been deleted",
        type="WARNING"
    )
    db.add(notification)
    db.commit()
    
    return {"success": True, "message": "Project deleted successfully"}

# Notification endpoints
@app.get("/api/notifications", response_model=List[Notification])
def get_notifications(limit: int = 10, include_read: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Notification)
    
    if not include_read:
        query = query.filter(models.Notification.read == False)
    
    notifications = query.order_by(models.Notification.createdAt.desc()).limit(limit).all()
    return notifications

@app.post("/api/notifications", response_model=Notification)
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    db_notification = models.Notification(
        title=notification.title,
        message=notification.message,
        type=notification.type,
        taskId=notification.taskId,
        projectId=notification.projectId,
        read=notification.read
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@app.put("/api/notifications/{notification_id}/read", response_model=Notification)
def mark_notification_as_read(notification_id: str, db: Session = Depends(get_db)):
    db_notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db_notification.read = True
    db.commit()
    db.refresh(db_notification)
    return db_notification

@app.put("/api/notifications/read-all")
def mark_all_notifications_as_read(db: Session = Depends(get_db)):
    db.query(models.Notification).filter(models.Notification.read == False).update({"read": True})
    db.commit()
    return {"success": True, "message": "All notifications marked as read"}