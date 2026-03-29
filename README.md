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