from typing import Optional

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

# =========================
# CONFIG – CHANGE THESE
# =========================

# 1) Put your real MongoDB URI here
MONGO_URI ="mongodb+srv://estyakahmefmoyen_db_user:Nkk6KGL9220kocHR@cluster0.s542nnt.mongodb.net/"

# 2) Your database name (from Compass – you showed "Smarting")
DB_NAME = "Smarting"

# 3) Frontend origins (for now allow all)
ALLOWED_ORIGINS = ["*"]

# =========================
# FASTAPI APP
# =========================

app = FastAPI(
    title="SmartRig API",
    version="1.0.0",
    description="SmartRig PC Build Advisor backend (FastAPI + MongoDB)",
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
    """Convert MongoDB doc to JSON-safe dict: _id -> id."""
    if not doc:
        return doc
    d = dict(doc)
    d["id"] = str(d.get("_id", ""))
    d.pop("_id", None)
    return d


async def list_collection(request: Request, collection_name: str) -> list[dict]:
    db = request.app.mongodb
    cursor = db[collection_name].find({})
    items = []
    async for doc in cursor:
        items.append(serialize_doc(doc))
    return items


# =========================
# MODELS FOR /recommend
# =========================

class RecommendRequest(BaseModel):
    purpose: str   # "gaming", "ai_ml", "video_editing", "office"
    budget: float  # total budget


class PartModel(BaseModel):
    id: str
    name: str
    price: float
    socket: Optional[str] = None
    perfScore: Optional[float] = None


class BuildResponse(BaseModel):
    purpose: str
    budget: float
    totalPrice: float
    cpu: PartModel
    gpu: PartModel
    motherboard: PartModel


# =========================
# AI PROFILE CONFIG
# =========================

PROFILES = {
    "gaming": {
        "split": {"cpu": 0.30, "gpu": 0.50, "mobo": 0.20},
        "weights": {"cpu": 0.3, "gpu": 0.7},
    },
    "ai_ml": {
        "split": {"cpu": 0.20, "gpu": 0.60, "mobo": 0.20},
        "weights": {"cpu": 0.2, "gpu": 0.8},
    },
    "video_editing": {
        "split": {"cpu": 0.40, "gpu": 0.40, "mobo": 0.20},
        "weights": {"cpu": 0.5, "gpu": 0.5},
    },
    "office": {
        "split": {"cpu": 0.50, "gpu": 0.10, "mobo": 0.40},
        "weights": {"cpu": 0.8, "gpu": 0.2},
    },
}


def score_build(cpu: dict, gpu: dict, budget: float, total: float, weights: dict) -> float:
    """Score a build based on perf + how close to budget it is."""
    cpu_perf = float(cpu.get("perfScore") or 0)
    gpu_perf = float(gpu.get("perfScore") or 0)
    perf = weights["cpu"] * cpu_perf + weights["gpu"] * gpu_perf
    budget_penalty = abs(budget - total) / max(budget, 1.0)
    return perf - 5.0 * budget_penalty  # 5 = penalty weight (tune later)


# =========================
# BASIC ROUTES
# =========================

@app.get("/")
async def root():
    return {"message": "SmartRig API running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


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
    return await list_collection(request, "cpu")


@app.get("/gpu", summary="List all GPUs")
async def get_gpus(request: Request):
    return await list_collection(request, "gpu")


@app.get("/motherboard", summary="List all motherboards")
async def get_motherboards(request: Request):
    return await list_collection(request, "motherboard")


@app.get("/ram", summary="List all RAM modules")
async def get_rams(request: Request):
    return await list_collection(request, "ram")


@app.get("/storage", summary="List all storage drives")
async def get_storages(request: Request):
    return await list_collection(request, "storage")


@app.get("/psu", summary="List all PSUs")
async def get_psus(request: Request):
    return await list_collection(request, "psu")


@app.get("/case", summary="List all cases")
async def get_cases(request: Request):
    return await list_collection(request, "case")


@app.get("/cooler", summary="List all coolers")
async def get_coolers(request: Request):
    return await list_collection(request, "cooler")


# =========================
# RECOMMENDATION ENDPOINT
# =========================

@app.post("/recommend", response_model=BuildResponse)
async def recommend_pc(request: Request, body: RecommendRequest):
    """
    Returns best CPU + GPU + Motherboard for given purpose & budget.
    Uses collections: cpu, gpu, motherboard.
    This version is LESS STRICT so it always tries to find something.
    """
    profile = PROFILES.get(body.purpose, PROFILES["gaming"])
    split = profile["split"]
    weights = profile["weights"]

    db = request.app.mongodb

    # 1) LOAD ALL PARTS (no price filter yet)
    cpu_cursor = db["cpu"].find({})
    gpu_cursor = db["gpu"].find({})
    mobo_cursor = db["motherboard"].find({})

    cpus = [serialize_doc(d) async for d in cpu_cursor]
    gpus = [serialize_doc(d) async for d in gpu_cursor]
    mobos = [serialize_doc(d) async for d in mobo_cursor]

    print(f"DEBUG: cpus={len(cpus)}, gpus={len(gpus)}, mobos={len(mobos)}")

    if not cpus or not gpus or not mobos:
        raise HTTPException(status_code=400, detail="Not enough parts in DB")

    # 2) INDEX MOBOS BY SOCKET (for compatibility), but we will have a fallback
    mobos_by_socket: dict[str, list[dict]] = {}
    for m in mobos:
        s = m.get("socket")
        if s:
            mobos_by_socket.setdefault(s, []).append(m)

    best = None

    # 3) TRY ALL COMBINATIONS (but skip ones over budget)
    for cpu in cpus:
        cpu_socket = cpu.get("socket")

        if cpu_socket and cpu_socket in mobos_by_socket:
            compat_mobos = mobos_by_socket[cpu_socket]
        else:
            # Fallback: if no socket info / match, allow ALL mobos
            compat_mobos = mobos

        for mobo in compat_mobos:
            for gpu in gpus:
                try:
                    cpu_price = float(cpu.get("price", 0))
                    mobo_price = float(mobo.get("price", 0))
                    gpu_price = float(gpu.get("price", 0))
                except Exception as e:
                    # if any price is not numeric, skip this combo
                    print("DEBUG price error:", e, cpu.get("price"), mobo.get("price"), gpu.get("price"))
                    continue

                total = cpu_price + mobo_price + gpu_price

                # must fit budget (allow tiny overshoot, 5%)
                if total > body.budget * 1.05:
                    continue

                sc = score_build(cpu, gpu, body.budget, total, weights)
                candidate = {
                    "cpu": cpu,
                    "gpu": gpu,
                    "motherboard": mobo,
                    "totalPrice": total,
                    "score": sc,
                }

                if (best is None) or (candidate["score"] > best["score"]):
                    best = candidate

    if not best:
        # still nothing under budget
        raise HTTPException(status_code=400, detail="No valid build found for this budget")

    return BuildResponse(
        purpose=body.purpose,
        budget=body.budget,
        totalPrice=best["totalPrice"],
        cpu=PartModel(**best["cpu"]),
        gpu=PartModel(**best["gpu"]),
        motherboard=PartModel(**best["motherboard"]),
    )
