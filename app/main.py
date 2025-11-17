from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

# =========================
# CONFIG
# =========================

# TODO: put your real MongoDB URI here
MONGO_URI = "mongodb+srv://estyakahmefmoyen_db_user:Nkk6KGL9220kocHR@cluster0.s542nnt.mongodb.net/"

# Your DB name from Compass (you showed "Smarting")
DB_NAME = "Smarting"

# Frontend origin(s) – for now allow all
ALLOWED_ORIGINS = ["*"]

# =========================
# APP INIT
# =========================

app = FastAPI(
    title="SmartRig API",
    version="1.0.0",
    description="Backend for SmartRig PC Build Advisor (FastAPI + MongoDB)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# MONGODB CONNECTION
# =========================

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(MONGO_URI)
    app.mongodb = app.mongodb_client[DB_NAME]
    print("✅ MongoDB connected to DB:", DB_NAME)


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
    print("🔴 MongoDB connection closed")


# =========================
# HELPERS
# =========================

def serialize_doc(doc: dict) -> dict:
    """
    Convert MongoDB document to JSON-safe dict:
    - _id -> id (string)
    """
    if not doc:
        return doc
    doc = dict(doc)
    doc["id"] = str(doc.get("_id", ""))
    doc.pop("_id", None)
    return doc


async def list_collection(request: Request, collection_name: str) -> list[dict]:
    db = request.app.mongodb
    cursor = db[collection_name].find({})
    items = []
    async for doc in cursor:
        items.append(serialize_doc(doc))
    return items


# =========================
# BASIC ROUTES
# =========================

@app.get("/")
async def root():
    return {"message": "SmartRig API running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


# Test single CPU (first doc)
@app.get("/test-cpu")
async def test_cpu(request: Request):
    db = request.app.mongodb
    doc = await db["cpu"].find_one({})
    if not doc:
        return {"message": "No document in 'cpu' collection"}
    return serialize_doc(doc)


# =========================
# COLLECTION LIST ROUTES
# =========================

@app.get("/cpu", summary="List all CPUs")
async def get_cpus(request: Request):
    """Return all CPU documents from 'cpu' collection."""
    return await list_collection(request, "cpu")


@app.get("/gpu", summary="List all GPUs")
async def get_gpus(request: Request):
    """Return all GPU documents from 'gpu' collection."""
    return await list_collection(request, "gpu")


@app.get("/motherboard", summary="List all motherboards")
async def get_motherboards(request: Request):
    """Return all motherboard documents from 'motherboard' collection."""
    return await list_collection(request, "motherboard")


@app.get("/ram", summary="List all RAM modules")
async def get_rams(request: Request):
    """Return all RAM documents from 'ram' collection."""
    return await list_collection(request, "ram")


@app.get("/storage", summary="List all storage drives")
async def get_storages(request: Request):
    """Return all storage documents from 'storage' collection."""
    return await list_collection(request, "storage")


@app.get("/psu", summary="List all PSUs")
async def get_psus(request: Request):
    """Return all PSU documents from 'psu' collection."""
    return await list_collection(request, "psu")


@app.get("/case", summary="List all cases")
async def get_cases(request: Request):
    """Return all case documents from 'case' collection."""
    return await list_collection(request, "case")


@app.get("/cooler", summary="List all coolers")
async def get_coolers(request: Request):
    """Return all cooler documents from 'cooler' collection."""
    return await list_collection(request, "cooler")
