from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

from config import CORS_ORIGINS
from database import engine, Base, SessionLocal
from seed_data import seed_database

# Import routers
from routers.auth import router as auth_router
from routers.employees import router as employees_router
from routers.attendance import router as attendance_router
from routers.leave import router as leave_router
from routers.payroll import router as payroll_router
from routers.dashboard import router as dashboard_router
from routers.alerts import router as alerts_router
from routers.reports import router as reports_router
from routers.notifications import router as notifications_router
from routers.payroll_pdf import router as payroll_pdf_router

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(title="DayFlow HRMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(employees_router)
app.include_router(attendance_router)
app.include_router(leave_router)
app.include_router(payroll_router)
app.include_router(dashboard_router)
app.include_router(alerts_router)
app.include_router(reports_router)
app.include_router(notifications_router)
app.include_router(payroll_pdf_router)

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Simple echo or process real-time events
            await manager.broadcast({"event": "message", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
def read_root():
    return {"message": "Welcome to DayFlow HRMS API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
