import os
import json
from dotenv import load_dotenv
from pymongo import MongoClient
from scraper import scrape_phone

load_dotenv("../.env")

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["phone_compare"]
collection = db["phones"]

with open("phones.json", "r") as f:
    phones = json.load(f)

for phone in phones:
    print(f"Scraping {phone['name']}...")
    data = scrape_phone(phone["name"], phone["url"])
    collection.update_one(
        {"name": phone["name"]},
        {"$set": data},
        upsert=True
    )
    print(f"Saved {phone['name']} to MongoDB")

print("Done!")