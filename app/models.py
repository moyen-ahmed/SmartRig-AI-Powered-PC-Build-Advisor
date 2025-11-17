from typing import  Optional
from pydantic import BaseModel, Field

# Request/Response models

class RecommendRequest(BaseModel):
    purpose: str = Field(examples=["gaming","ai_ml","video_editing","office"])
    budget: float = Field(gt=0, examples=[1000])

class Part(BaseModel):
    id: str
    category: str
    name: str
    price: float
    socket: Optional[str] = None
    perfScore: Optional[float] = None

class BuildResponse(BaseModel):
    purpose: str
    budget: float
    totalPrice: float
    cpu: Part
    gpu: Part
    motherboard: Part
