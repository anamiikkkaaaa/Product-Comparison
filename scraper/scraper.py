import requests
from bs4 import BeautifulSoup

def get_phone_page(phone_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    response = requests.get(phone_url, headers=headers)
    return response.text

def parse_phone_specs(html, phone_name):
    soup = BeautifulSoup(html, "html.parser")
    specs = {}
    current_category = None
    
    specs_div = soup.find("div", id="specs-list")
    rows = specs_div.find_all("tr")
    
    for row in rows:
        th = row.find("th")
        if th:
            current_category = th.text.strip()
            specs[current_category] = {}
        
        ttl = row.find("td", class_="ttl")
        nfo = row.find("td", class_="nfo")
        
        if ttl and nfo and current_category:
            spec_name = ttl.text.strip()
            spec_value = nfo.text.strip()
            specs[current_category][spec_name] = spec_value
    
    return {
        "name": phone_name,
        "specs": specs
    }

def scrape_phone(phone_name, phone_url):
    html = get_phone_page(phone_url)
    phone_data = parse_phone_specs(html, phone_name)
    return phone_data

def search_gsmarena(phone_name, json_path=None):
    import json
    import os

    if json_path is None:
        json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "phone_names_and_urls.json")

    if not os.path.exists(json_path):
        json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "phone_names_and_urls.json")

    with open(json_path, "r") as f:
        all_phones = json.load(f)

    phone_name_lower = phone_name.lower().strip()
    
    for brand, models in all_phones.items():
        for model, url in models.items():
            full_name = f"{brand} {model}".lower().strip()
            if phone_name_lower == full_name:
                return {"name": f"{brand} {model}", "url": url}

    for brand, models in all_phones.items():
        for model, url in models.items():
            model_lower = model.lower().strip()
            if phone_name_lower == model_lower:
                return {"name": f"{brand} {model}", "url": url}

    for brand, models in all_phones.items():
        for model, url in models.items():
            full_name = f"{brand} {model}".lower().strip()
            if full_name.startswith(phone_name_lower) and (
                len(full_name) == len(phone_name_lower) or
                full_name[len(phone_name_lower)] == ' '
            ):
                return {"name": f"{brand} {model}", "url": url}

    for brand, models in all_phones.items():
        for model, url in models.items():
            full_name = f"{brand} {model}".lower()
            if phone_name_lower in full_name:
                return {"name": f"{brand} {model}", "url": url}

    return None