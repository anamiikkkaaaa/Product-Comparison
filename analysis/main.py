import os
import sys
from fastapi import FastAPI
from pydantic import BaseModel
from scorer import score_phones
from llm import get_verdict
from dotenv import load_dotenv
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scraper"))
import importlib.util
spec = importlib.util.spec_from_file_location(
    "scraper_main",
    Path(__file__).parent.parent / "scraper" / "main.py"
)
scraper_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scraper_module)
scrape_phone_by_name = scraper_module.scrape_phone_by_name

load_dotenv(Path(__file__).parent.parent / ".env")

app = FastAPI()

class CompareRequest(BaseModel):
    phone1: dict
    phone2: dict
    user_preference: str

class ScrapeRequest(BaseModel):
    phone_name: str

@app.post("/analyse")
async def analyse(request: CompareRequest):
    scores = score_phones(request.phone1, request.phone2)
    verdict = get_verdict(
        request.phone1["name"],
        request.phone2["name"],
        scores,
        request.user_preference
    )
    return {
        "scores": scores,
        "verdict": verdict
    }

@app.post("/scrape")
async def scrape(request: ScrapeRequest):
    data = scrape_phone_by_name(request.phone_name)
    if not data:
        return {"error": "Phone not found on GSM Arena"}
    return {"success": True, "name": data["name"]}