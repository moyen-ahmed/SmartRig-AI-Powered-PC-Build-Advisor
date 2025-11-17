import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB: str = os.getenv("MONGO_DB", "smartrig")
    API_TITLE: str = os.getenv("API_TITLE", "SmartRig API")
    API_VERSION: str = os.getenv("API_VERSION", "1.0.0")
    ALLOWED_ORIGINS: list[str] = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
