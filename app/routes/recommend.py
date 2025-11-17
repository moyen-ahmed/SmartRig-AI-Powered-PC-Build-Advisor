from fastapi import APIRouter, HTTPException
from ..models import RecommendRequest, BuildResponse, Part
from ..repositories import get_cpus_in_range, get_gpus_in_range, get_mobos_in_range
from ..recommendation import PROFILES, recommend_build

router = APIRouter()

@router.get("/health")
async def health():
    return {"ok": True}

@router.post("/recommend", response_model=BuildResponse)
async def recommend(req: RecommendRequest):
    profile = PROFILES.get(req.purpose)
    if not profile:
        raise HTTPException(400, detail="Unsupported purpose")

    split = profile["split"]
    cpuB = req.budget * split["cpu"]
    gpuB = req.budget * split["gpu"]
    moboB = req.budget * split["mobo"]

    # widen ranges a bit so engine can explore
    cpus = await get_cpus_in_range(cpuB*0.6, cpuB*1.4)
    gpus = await get_gpus_in_range(gpuB*0.6, gpuB*1.4)
    mobos = await get_mobos_in_range(moboB*0.5, moboB*1.5)

    if not (cpus and gpus and mobos):
        raise HTTPException(400, detail="Not enough candidates in DB for this budget/purpose")

    best = await recommend_build(
        purpose=req.purpose, budget=req.budget,
        cpus=cpus, gpus=gpus, mobos=mobos
    )
    if not best:
        raise HTTPException(400, detail="No valid build found under budget")

    return BuildResponse(
        purpose=req.purpose,
        budget=req.budget,
        totalPrice=best["totalPrice"],
        cpu=Part(**best["cpu"]),
        gpu=Part(**best["gpu"]),
        motherboard=Part(**best["motherboard"]),
    )
