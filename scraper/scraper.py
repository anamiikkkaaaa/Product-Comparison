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

