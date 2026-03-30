1) We create 4 folders: Scraper, Analysis, Server, Client (mkdir)
2) Then we create files: .env, .gitignore, README.md (touch)
3) add .env in gitignore then push the repo to github


Phase 1 — Project Setup
What we did: Created the project folder structure and initialised Git.

mkdir phone-compare        # creates the main project folder
cd phone-compare           # moves into it
mkdir scraper analysis server client   # creates the 4 service folders
git init                   # initialises a git repository here
touch .gitignore           # file that tells git what to ignore
touch README.md            # documentation file
touch .env                 # stores secrets like DB passwords, never committed

Added .env to .gitignore manually — so secrets never accidentally get pushed to GitHub.

git add .                  # stages all files for commit
git commit -m "phase 1: project structure setup"   # saves a snapshot
git remote add origin https://github.com/YOUR_USERNAME/phone-compare.git  # links to github
git branch -M main         # renames branch to main
git push -u origin main    # pushes code to github for the first time

Phase 2 — Python Scraper Setup
What we did: Set up an isolated Python environment inside the scraper folder and installed the libraries we need.

cd scraper                 # move into scraper folder
python3 -m venv .venv      # creates a virtual environment (isolated python for this project)
source .venv/bin/activate  # activates it — prompt changes to (.venv)
Why virtual environment? So each part of the project has its own libraries that don't conflict with each other or your system Python.

pip install requests beautifulsoup4 pandas pymongo python-dotenv
# requests       — fetches webpages (raw HTML)
# beautifulsoup4 — parses HTML, lets you find specific elements
# pandas         — cleans and structures data
# pymongo        — connects to and writes to MongoDB
# python-dotenv  — reads your .env file in Python code

pip freeze                 # shows all installed libraries with version numbers
pip freeze > requirements.txt   # saves them into requirements.txt

Why requirements.txt? So anyone (or future you on a new machine) can run pip install -r requirements.txt and get every library at once — exact same versions, no guessing.
To reactivate the environment next time you work on scraper:

cd scraper
source .venv/bin/activate
```

---

**Also added to `.env`:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/phone_compare

MISTAKE:  the entire .venv folder got pushed to GitHub. That's 8000+ files and 45MB of library code

Open your .gitignore file in VS Code and add this line:
.venv/

run these commands in main folder
git rm -r --cached scraper/.venv

git add .gitignore
git commit -m "fix: remove .venv from tracking, add to gitignore"
git push


IMPORTANT: Always add .venv/ to .gitignore before activating 
a virtual environment. Never commit .venv to GitHub.

Now we're ready to actually write code. Before we open any Python file though, go to this URL in your browser:
https://www.gsmarena.com/samsung_galaxy_s24-12557.php
That's the GSM Arena page for the Samsung Galaxy S24. Once it loads, right click anywhere on the page and click Inspect. A panel will open showing the HTML of the page.

inspecting the DOM and it's the most important skill for scraping.
we went to gsm arena website and looked at the data 

Phase 2 — Python Scraper
What we built: A scraper that pulls phone specs from GSM Arena and saves them to MongoDB.

Files created
scraper/
├── scraper.py      # fetches and parses GSM Arena pages
├── main.py         # connects to MongoDB and saves scraped data
├── phones.json     # seed data - list of phones to scrape
└── requirements.txt  # all Python dependencies

How the scraper works
Three functions in scraper.py:
get_phone_page(url) — sends an HTTP request to GSM Arena pretending to be a real browser using a User-Agent header. Returns raw HTML.
parse_phone_specs(html, phone_name) — uses BeautifulSoup to navigate the HTML. Finds div#specs-list, loops through every tr, reads category from th, spec name from td.ttl, spec value from td.nfo. Returns a nested dictionary.
scrape_phone(name, url) — coordinator, calls both functions above and returns final data.
Data structure produced:

{
    "name": "Samsung Galaxy S24",
    "specs": {
        "Body": {
            "Dimensions": "146.6 x 70.6 x 8.3 mm",
            "Weight": "187 g"
        },
        "Display": {
            "Type": "AMOLED",
            "Size": "6.7 inches"
        }
    }
}

How main.py works

# loads .env file
load_dotenv(Path(__file__).parent.parent / ".env")

# connects to MongoDB Atlas
client = MongoClient(os.getenv("MONGODB_URI"))

# reads phones to scrape from phones.json
with open("phones.json", "r") as f:
    phones = json.load(f)

# scrapes each phone and saves to MongoDB
collection.update_one(
    {"name": phone["name"]},
    {"$set": data},
    upsert=True
)

upsert=True means — if phone exists update it, if not insert it. So you can run the scraper multiple times without duplicates.

Why phones.json and not hardcoded URLs
Data and code should be separate. phones.json is just seed data for development. Later the scraper will run on demand — when a user searches a phone that isn't in MongoDB yet, the API will trigger the scraper automatically.

Mistakes made and lessons learned
Pushed .venv to GitHub — always add .venv/ to .gitignore before activating a virtual environment. Fix it with:

git rm -r --cached .venv
git add .gitignore
git commit -m "fix: remove .venv from tracking"
git push
```

**`.env` variable had no name** — wrong: just pasting the connection string. Right:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phone_compare

No spaces around = in .env — KEY = value makes dotenv read the key as "KEY " with a trailing space, so os.getenv("KEY") returns None.
Missing database name in connection string — always end your MongoDB URI with /database_name otherwise pymongo doesn't know which database to use.
load_dotenv("../.env") is unreliable — use pathlib instead:

from pathlib import Path
load_dotenv(Path(__file__).parent.parent / ".env")

cd scraper
source .venv/bin/activate
python3 main.py

Phase 3 — Express APIWhat we built: A REST API in Node.js that serves phone data from MongoDB to the frontend.Files createdserver/
├── index.js          # entry point, starts the server
├── models/
│   └── Phone.js      # mongoose schema for phone documents
└── routes/
    ├── phones.js     # phone related endpoints
    └── compare.js    # comparison endpoint

How index.js works

dotenv.config({ path: "../.env" })  // loads .env from root
app.use(cors())                      // allows frontend to talk to this server
app.use(express.json())              // parses incoming JSON request bodies
app.use("/api/phones", phonesRouter) // routes starting with /api/phones go here
app.use("/api/compare", compareRouter) // routes starting with /api/compare go here
```

Server only starts after MongoDB connects successfully.

---

### Endpoints built
```
GET  /api/phones          → returns list of all phones (names only)
GET  /api/phones/:name    → returns full specs of one phone
POST /api/compare         → takes two phone names, returns both phones' full specs

How the Phone model works

const phoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  specs: { type: Map, of: new mongoose.Schema({}, { strict: false }) }
}, { timestamps: true });

unique: true — no duplicate phone names in the database.
strict: false — accepts any structure inside specs since different phones have different categories.
timestamps: true — mongoose automatically adds createdAt and updatedAt to every document.

How routing works
express.Router() creates a mini Express app per route group. Each router file handles its own endpoints and gets registered in index.js with a base path. So / inside phones.js becomes /api/phones in the actual server.

Key concepts
Promise.all() — runs multiple database queries at the same time instead of one after another. Used in the compare endpoint to fetch both phones simultaneously. Faster.
new RegExp(name, "i") — case insensitive search. So "samsung galaxy s24" and "Samsung Galaxy S24" both work.
async/await — all database operations are asynchronous. await waits for the database to respond before moving to the next line. try/catch handles any errors.

Mistakes made and lessons learned
Wrong folder when running node — always make sure you're inside the server folder before running node index.js. Running from the root gives Cannot find module error.
Typo in filename — created phone.js instead of phones.js. Node couldn't find the module because the name in require() didn't match the actual filename. Always double check filenames match exactly.
Forgot to add node_modules/ to .gitignore — always add this before running npm install. Same lesson as .venv in Phase 2 — never commit dependency folders to GitHub.

Phase 4 — Python Analysis Service
What we built: A FastAPI service that scores two phones and generates an AI powered verdict based on user preferences.

Files created
analysis/
├── main.py          # FastAPI entry point, defines the /analyse endpoint
├── scorer.py        # scoring engine, compares phone specs numerically
├── llm.py           # calls Groq LLM and returns a verdict
└── requirements.txt # all Python dependencies

How scorer.py works
Specs are stored as strings like "5000 mAh" or "6.7 inches". The extract_numeric function uses regex to pull just the number out so we can compare them mathematically.
The comparisons list defines which specs to compare and whether higher or lower is better:

comparisons = [
    {"category": "Battery", "spec": "Type", "higher_is_better": True, "label": "battery"},
    {"category": "Display", "spec": "Size", "higher_is_better": True, "label": "display"},
    {"category": "Body",    "spec": "Weight", "higher_is_better": False, "label": "weight"}
]

Returns a scores dictionary like:

{
    "Samsung Galaxy S24": {"battery": 5000.0, "display": 6.7, "weight": 167.0},
    "Apple iPhone 15 Pro": {"battery": 3274.0, "display": 6.1, "weight": 187.0},
    "winner_battery": "Samsung Galaxy S24",
    "winner_display": "Samsung Galaxy S24",
    "winner_weight": "Samsung Galaxy S24"
}

How llm.py works
Takes both phone names, the scores, and the user's preference. Builds a prompt and sends it to Groq's LLM. Returns a personalised recommendation under 150 words.

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
model = "llama-3.3-70b-versatile"  # current recommended free model

How main.py works

class CompareRequest(BaseModel):
    phone1: dict
    phone2: dict
    user_preference: str

@app.post("/analyse")
async def analyse(request: CompareRequest):
    scores = score_phones(request.phone1, request.phone2)
    verdict = get_verdict(...)
    return {"scores": scores, "verdict": verdict}

BaseModel from pydantic automatically validates the incoming request — if any field is missing FastAPI returns an error without you writing any validation code.

To start the analysis service

cd analysis
source .venv/bin/activate
uvicorn main:app --reload --port 8000

Service runs on http://localhost:8000

Mistakes made and lessons learned
Wrong virtual environment activated — always check which .venv is active before running anything. If you cd into a new folder the old venv stays active. Always deactivate first then activate the correct one.
Model decommissioned — llama3-8b-8192 was removed by Groq. Always check the provider's docs for current supported models. Current working model is llama-3.3-70b-versatile.
__pycache__ pushed to GitHub — add __pycache__/ to .gitignore from the start. Fix with:

git rm -r --cached scraper/__pycache__
git add .gitignore
git commit -m "fix: remove __pycache__ from tracking"
git push

How the two Python services differ
scraperanalysisJobpulls data from GSM Arenascores and analyses phone dataRunson demand / scheduledon every compare requestFrameworkplain PythonFastAPIPortnone8000