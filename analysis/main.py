import os
from fastapi import FastAPI
from pydantic import BaseModel
from scorer import score_phones
from llm import get_verdict
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

app = FastAPI()

class CompareRequest(BaseModel):
    phone1: dict
    phone2: dict
    user_preference: str

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