from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from passlib.context import CryptContext
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# ===================== MODELS =====================

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    role: str  # 'admin' or 'field_expert'
    name: str

class WindowTypeCreate(BaseModel):
    name: str

class WindowType(BaseModel):
    id: str
    name: str

class MeasurementItem(BaseModel):
    window_type: str
    width_inches: float  # Total in inches
    height_inches: float  # Total in inches
    quantity: int
    rate: Optional[float] = None  # Rate per sq ft - only admin can see/set
    area_sqft: Optional[float] = None  # Calculated area
    amount: Optional[float] = None  # Calculated amount

class EstimateCreate(BaseModel):
    field_expert_name: str
    customer_name: str
    site_address: str
    mobile_number: str
    measurements: List[MeasurementItem]

class EstimateUpdate(BaseModel):
    measurements: List[MeasurementItem]
    discount: Optional[float] = 0
    advance_received: Optional[float] = 0
    cartage: Optional[float] = 0
    payment_status: Optional[str] = "pending"  # pending, partial, full

class Estimate(BaseModel):
    id: str
    field_expert_name: str
    customer_name: str
    site_address: str
    mobile_number: str
    measurements: List[MeasurementItem]
    subtotal: float = 0
    discount: float = 0
    advance_received: float = 0
    cartage: float = 0
    total: float = 0
    payment_status: str = "pending"
    created_at: datetime
    updated_at: datetime

class SettingsUpdate(BaseModel):
    default_rate: Optional[float] = None

class Settings(BaseModel):
    default_rate: float = 0

# ===================== AUTH ROUTES =====================

@api_router.post("/auth/login", response_model=UserResponse)
async def login(user_login: UserLogin):
    user = await db.users.find_one({"username": user_login.username})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not pwd_context.verify(user_login.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        role=user["role"],
        name=user["name"]
    )

@api_router.post("/auth/init")
async def init_users():
    """Initialize default users if they don't exist"""
    admin_exists = await db.users.find_one({"username": "admin"})
    
    if not admin_exists:
        admin_user = {
            "username": "admin",
            "password": pwd_context.hash("admin123"),
            "role": "admin",
            "name": "Admin User",
            "created_at": datetime.utcnow()
        }
        await db.users.insert_one(admin_user)
    
    expert_exists = await db.users.find_one({"username": "expert"})
    if not expert_exists:
        expert_user = {
            "username": "expert",
            "password": pwd_context.hash("expert123"),
            "role": "field_expert",
            "name": "Field Expert",
            "created_at": datetime.utcnow()
        }
        await db.users.insert_one(expert_user)
    
    # Initialize default window types
    window_types = [
        "Three track sliding window",
        "Two track sliding window",
        "Three track domal system window",
        "Two track domal system window",
        "Partition fixed",
        "Partition with doors",
        "Ventilation only net",
        "Ventilation net + glass"
    ]
    
    for wtype in window_types:
        exists = await db.window_types.find_one({"name": wtype})
        if not exists:
            await db.window_types.insert_one({"name": wtype, "created_at": datetime.utcnow()})
    
    # Initialize settings
    settings_exists = await db.settings.find_one({})
    if not settings_exists:
        await db.settings.insert_one({"default_rate": 100.0})
    
    return {"message": "Initialization complete"}

# ===================== WINDOW TYPES ROUTES =====================

@api_router.get("/window-types", response_model=List[WindowType])
async def get_window_types():
    types = await db.window_types.find().to_list(1000)
    return [WindowType(id=str(t["_id"]), name=t["name"]) for t in types]

@api_router.post("/window-types", response_model=WindowType)
async def create_window_type(window_type: WindowTypeCreate):
    # Check if already exists
    exists = await db.window_types.find_one({"name": window_type.name})
    if exists:
        raise HTTPException(status_code=400, detail="Window type already exists")
    
    doc = {
        "name": window_type.name,
        "created_at": datetime.utcnow()
    }
    result = await db.window_types.insert_one(doc)
    return WindowType(id=str(result.inserted_id), name=window_type.name)

@api_router.delete("/window-types/{type_id}")
async def delete_window_type(type_id: str):
    result = await db.window_types.delete_one({"_id": ObjectId(type_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Window type not found")
    return {"message": "Window type deleted"}

# ===================== ESTIMATES ROUTES =====================

@api_router.post("/estimates", response_model=Estimate)
async def create_estimate(estimate: EstimateCreate):
    # Calculate areas for each measurement
    measurements_with_calc = []
    for m in estimate.measurements:
        area_sqft = (m.width_inches * m.height_inches) / 144  # Convert sq inches to sq ft
        measurements_with_calc.append({
            "window_type": m.window_type,
            "width_inches": m.width_inches,
            "height_inches": m.height_inches,
            "quantity": m.quantity,
            "rate": None,  # Field expert doesn't set rate
            "area_sqft": round(area_sqft, 3),
            "amount": None
        })
    
    now = datetime.utcnow()
    doc = {
        "field_expert_name": estimate.field_expert_name,
        "customer_name": estimate.customer_name,
        "site_address": estimate.site_address,
        "mobile_number": estimate.mobile_number,
        "measurements": measurements_with_calc,
        "subtotal": 0,
        "discount": 0,
        "advance_received": 0,
        "cartage": 0,
        "total": 0,
        "payment_status": "pending",
        "created_at": now,
        "updated_at": now
    }
    
    result = await db.estimates.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    
    return Estimate(**doc)

@api_router.get("/estimates", response_model=List[Estimate])
async def get_estimates():
    estimates = await db.estimates.find().sort("created_at", -1).to_list(1000)
    result = []
    for e in estimates:
        e["id"] = str(e["_id"])
        e.pop("_id")
        result.append(Estimate(**e))
    return result

@api_router.get("/estimates/{estimate_id}", response_model=Estimate)
async def get_estimate(estimate_id: str):
    estimate = await db.estimates.find_one({"_id": ObjectId(estimate_id)})
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    
    estimate["id"] = str(estimate["_id"])
    estimate.pop("_id")
    return Estimate(**estimate)

@api_router.put("/estimates/{estimate_id}", response_model=Estimate)
async def update_estimate(estimate_id: str, update: EstimateUpdate):
    estimate = await db.estimates.find_one({"_id": ObjectId(estimate_id)})
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    
    # Calculate amounts
    measurements_with_calc = []
    subtotal = 0
    
    for m in update.measurements:
        area_sqft = (m.width_inches * m.height_inches) / 144
        amount = 0
        if m.rate:
            amount = area_sqft * m.rate * m.quantity
            subtotal += amount
        
        measurements_with_calc.append({
            "window_type": m.window_type,
            "width_inches": m.width_inches,
            "height_inches": m.height_inches,
            "quantity": m.quantity,
            "rate": m.rate,
            "area_sqft": round(area_sqft, 3),
            "amount": round(amount, 2)
        })
    
    total = subtotal - update.discount + update.cartage
    
    update_doc = {
        "measurements": measurements_with_calc,
        "subtotal": round(subtotal, 2),
        "discount": update.discount,
        "advance_received": update.advance_received,
        "cartage": update.cartage,
        "total": round(total, 2),
        "payment_status": update.payment_status or "pending",
        "updated_at": datetime.utcnow()
    }
    
    await db.estimates.update_one(
        {"_id": ObjectId(estimate_id)},
        {"$set": update_doc}
    )
    
    # Fetch updated estimate
    updated_estimate = await db.estimates.find_one({"_id": ObjectId(estimate_id)})
    updated_estimate["id"] = str(updated_estimate["_id"])
    updated_estimate.pop("_id")
    
    return Estimate(**updated_estimate)

@api_router.delete("/estimates/{estimate_id}")
async def delete_estimate(estimate_id: str):
    result = await db.estimates.delete_one({"_id": ObjectId(estimate_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Estimate not found")
    return {"message": "Estimate deleted"}

# ===================== SETTINGS ROUTES =====================

@api_router.get("/settings", response_model=Settings)
async def get_settings():
    settings = await db.settings.find_one({})
    if not settings:
        settings = {"default_rate": 100.0}
        await db.settings.insert_one(settings)
    return Settings(default_rate=settings.get("default_rate", 100.0))

@api_router.put("/settings", response_model=Settings)
async def update_settings(settings: SettingsUpdate):
    if settings.default_rate is not None:
        await db.settings.update_one(
            {},
            {"$set": {"default_rate": settings.default_rate}},
            upsert=True
        )
    
    updated = await db.settings.find_one({})
    return Settings(default_rate=updated.get("default_rate", 100.0))

# ===================== ROOT ROUTE =====================

@api_router.get("/")
async def root():
    return {"message": "Anurag Aluminium API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
