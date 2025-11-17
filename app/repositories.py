from typing import List, Dict, Any
from bson import ObjectId
from .db import db

def _to_part(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc.get("_id", "")),
        "category": doc.get("category",""),
        "name": doc.get("name",""),
        "price": float(doc.get("price",0)),
        "socket": doc.get("socket"),
        "perfScore": float(doc.get("perfScore",0)) if doc.get("perfScore") is not None else None,
    }

async def get_cpus_in_range(low: float, high: float) -> List[Dict[str,Any]]:
    cur = db["cpus"].find({"price":{"$gte": low, "$lte": high}})
    return [_to_part(x) async for x in cur]

async def get_gpus_in_range(low: float, high: float) -> List[Dict[str,Any]]:
    cur = db["gpus"].find({"price":{"$gte": low, "$lte": high}})
    return [_to_part(x) async for x in cur]

async def get_mobos_in_range(low: float, high: float) -> List[Dict[str,Any]]:
    cur = db["motherboards"].find({"price":{"$gte": low, "$lte": high}})
    return [_to_part(x) async for x in cur]
