import os
import json
import sys
from dotenv import load_dotenv
from pymongo import MongoClient
from pathlib import Path
from scraper import scrape_phone, search_gsmarena

load_dotenv(Path(__file__).parent.parent / ".env")

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["phone_compare"]
collection = db["phones"]

def scrape_phone_by_name(phone_name):
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "phone_names_and_urls.json")

    existing = collection.find_one({"name": {"$regex": f"^{phone_name}$", "$options": "i"}})
    if existing:
        return existing

    result = search_gsmarena(phone_name, json_path)
    if not result:
        return None

    data = scrape_phone(result["name"], result["url"])

    collection.update_one(
        {"name": result["name"]},
        {"$set": data},
        upsert=True
    )

    return data

if __name__ == "__main__":
    import time
    with open("phones.json", "r") as f:
        phones = json.load(f)

    for phone in phones:
        print(f"Scraping {phone['name']}...")
        try:
            data = scrape_phone(phone["name"], phone["url"])
            collection.update_one(
                {"name": phone["name"]},
                {"$set": data},
                upsert=True
            )
            print(f"Saved {phone['name']} to MongoDB")
        except Exception as e:
            print(f"Failed {phone['name']}: {e}")
        time.sleep(2)

    print("Done!")