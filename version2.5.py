###################################################
#                                                 #
#                                                 #
#                 WebBot V2.5                     #
#             All Rights Reserved.                #
#                                                 #
#       A bot to extract all text/info            #
#            from a desired page.                 # 
#                                                 #
#                                                 #
###################################################


# DO NOT EDIT ANYTHING LISTED BELOW
# THIS IS THE CODE AND BRAIN OF THE WEBBOT. TAMPERING 
# WITH THIS CODE MAY CORRUPT OUTPUT OR IN WORSE CASE 
# CODE WILL NOT WORK AT ALL. PLEASE READ THIS BEFORE USE.

# RUN `python3 main.py` TO START BOT
# IF YOU WANT TO ADD A URL, GO TO `seeds.txt` AND ADD YOUR URL AT THE BOTTOM
# (OR YOU CAN DELETE EVERYTHING AND START FRESH, YOUR CHOICE)

# YOU CAN VISIT `http:[my ip]:5000` TO USE THE UI VERSION FOR THOSE WHO
# DO NOT KNOW HOW TO USE PYTHON OR CODING MAGIC (OR WHAT ANNIAH CALLS "HACKING")

#-----------------------------------------------------------------------------------#

# IMPORTS (LIBS)

import asyncio
import aiohttp
import hashlib
import os
import re
import time
from urllib.parse import urljoin, urlparse, urldefrag
from bs4 import BeautifulSoup
import random
from tqdm import tqdm
import urllib.robotparser
import subprocess
import platform

try:
    import nltk
    from nltk.corpus import stopwords
    _nltk_available = True
except Exception:
    _nltk_available = False

# CONFIG

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
    'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/4.0.219.6 Safari/532.1',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; InfoPath.2)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.5.30729; .NET CLR 3.0.30729)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; Win64; x64; Trident/4.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SV1; .NET CLR 2.0.50727; InfoPath.2)',
    'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)',
    'Mozilla/4.0 (compatible; MSIE 6.1; Windows XP)',
    'Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.5.22 Version/10.51',
    'AppEngine-Google; (+http://code.google.com/appengine; appid: webetrex)',
    'Mozilla/5.0 (compatible; MSIE 9.0; AOL 9.7; AOLBuild 4343.19; Windows NT 6.1; WOW64; Trident/5.0; FunWebProducts)',
    'Mozilla/4.0 (compatible; MSIE 8.0; AOL 9.7; AOLBuild 4343.27; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)',
    'Mozilla/4.0 (compatible; MSIE 8.0; AOL 9.7; AOLBuild 4343.21; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C; .NET4.0E)',
    'Mozilla/4.0 (compatible; MSIE 8.0; AOL 9.7; AOLBuild 4343.19; Windows NT 5.1; Trident/4.0; GTB7.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)',
    'Mozilla/4.0 (compatible; MSIE 8.0; AOL 9.7; AOLBuild 4343.19; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C; .NET4.0E)',
    'Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.7; AOLBuild 4343.19; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C; .NET4.0E)',
    'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.3) Gecko/20090913 Firefox/3.5.3',
    'Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 2.0.50727)',
    'Mozilla/5.0 (Windows; U; Windows NT 5.2; de-de; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)',
    'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.1) Gecko/20090718 Firefox/3.5.1 (.NET CLR 3.0.04506.648)',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727; .NET4.0C; .NET4.0E',
    'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/4.0.219.6 Safari/532.1',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; InfoPath.2)',
    'Opera/9.60 (J2ME/MIDP; Opera Mini/4.2.14912/812; U; ru) Presto/2.4.15',
    'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-US) AppleWebKit/125.4 (KHTML, like Gecko, Safari) OmniWeb/v563.57',
]
CONCURRENT_REQUESTS = 30
PER_DOMAIN_DELAY = 1.0 
REQUEST_TIMEOUT = 50
MAX_PAGES = 5
try:
    env_val = os.environ.get("MAX_PAGES_OVERRIDE")
    if env_val:
        MAX_PAGES = int(env_val)
except Exception:
    pass   
MAX_DEPTH = 6
SAVE_FOLDER = "websites"   
SAVE_FOLDER = os.environ.get("SAVE_FOLDER_OVERRIDE", SAVE_FOLDER)
os.makedirs(SAVE_FOLDER, exist_ok=True)      
SUMMARY_SENTENCES = 3      

with open("seeds.txt", "r") as f:
    SEED_URLS = [line.strip() for line in f if line.strip()]


ALLOWED_SCHEMES = {"http", "https"}
os.makedirs(SAVE_FOLDER, exist_ok=True)

if _nltk_available:
    try:
        stopwords.words("english")
    except Exception:
        nltk.download("stopwords")

# FUNCTIONS

def safe_filename_from_url(url: str) -> str:
    parsed = urlparse(url)
    domain = parsed.netloc.replace(":", "_")
    h = hashlib.sha1(url.encode("utf-8")).hexdigest()
    path_snippet = re.sub(r'[^0-9A-Za-z\-_.]', '_', (parsed.path or "").strip("/"))[:40]
    if path_snippet:
        name = f"{path_snippet}_{h}.txt"
    else:
        name = f"{h}.txt"
    return domain, name

def save_html_file(domain_folder: str, filename_base: str, url: str, summary: str, text: str):
    os.makedirs(domain_folder, exist_ok=True)

    html_data = f"""<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Summary of {url}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-900 text-gray-200 font-sans leading-relaxed">
    <div class="max-w-4xl mx-auto p-6">
        
        <h1 class="text-3xl font-semibold text-blue-400 mb-4">Summary and Extracted Text</h1>

        <div class="mb-6">
        <strong class="text-gray-400">URL:</strong>
        <a href="{url}" target="_blank" class="text-blue-300 hover:text-blue-200">{url}</a>
        </div>

        <h2 class="text-2xl text-blue-300 border-b border-blue-500 pb-1 mb-3">Summary</h2>
        <pre id="summary-block" class="bg-gray-800 p-4 rounded-lg shadow-lg overflow-x-auto whitespace-pre-wrap text-sm">{summary}</pre>

        <h2 class="text-2xl text-blue-300 border-b border-blue-500 pb-1 mb-3 mt-8">Extracted Text Preview</h2>
        <pre class="bg-gray-800 p-4 rounded-lg shadow-lg overflow-x-auto whitespace-pre-wrap text-sm">
        {text}
            </pre>

        </div>

        <script> (function() {{ const pre = document.getElementById('summary-block'); if(pre) {{ const firstLine = pre.textContent.trim().split('\\n')[0]; if(firstLine) document.title = firstLine; }} }})(); </script>
    </body>
    </html>"""

    file_path = os.path.join(domain_folder, f"{filename_base}.html")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_data)

def extract_main_text(html: str, url: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for s in soup(["script", "style", "header", "footer", "nav", "noscript", "svg", "iframe"]):
        s.decompose()
    article = soup.find("article")
    container = article or soup.find(attrs={"role": "main"}) or soup.body or soup
    texts = []
    for tag in container.find_all(["p", "h1", "h2", "h3", "li"]):
        txt = tag.get_text(separator=" ", strip=True)
        if txt:
            texts.append(txt)
    combined = "\n\n".join(texts).strip()
    if len(combined) < 200:
        combined = soup.get_text(separator="\n", strip=True)
    combined = re.sub(r'\n{3,}', '\n\n', combined)
    return combined

def summarize_text(text: str, n_sentences: int = 3) -> str:
    if not text or len(text.split()) < 30:
        return text.strip()[:2000]

    sentences = re.split(r'(?<=[.!?])\s+', text)
    words = re.findall(r'\w+', text.lower())
    if _nltk_available:
        stop = set(stopwords.words("english"))
    else:
        stop = set([
            "the","and","is","in","it","of","to","a","for","that","on","with","as","are","was","by","this","be","an"
        ])
    freqs = {}
    for w in words:
        if w in stop or len(w) < 3:
            continue
        freqs[w] = freqs.get(w, 0) + 1
    if not freqs:
        return " ".join(sentences[:n_sentences])

    sent_scores = []
    for s in sentences:
        s_words = re.findall(r'\w+', s.lower())
        score = sum(freqs.get(w, 0) for w in s_words)
        length = max(len(s_words), 1)
        sent_scores.append((score / length, s))
    sent_scores.sort(reverse=True, key=lambda x: x[0])
    chosen = [s for _, s in sorted(sent_scores[:n_sentences], key=lambda x: sentences.index(x[1]) if x[1] in sentences else 0)]
    if len(chosen) < n_sentences:
        chosen = sentences[:n_sentences]
    return "\n".join(chosen).strip()

# CLASSES

class DomainRateLimiter:
    def __init__(self, delay=PER_DOMAIN_DELAY):
        self.delay = delay
        self.last = {}

    async def wait(self, domain: str):
        now = time.time()
        last = self.last.get(domain, 0)
        to_wait = self.delay - (now - last)
        if to_wait > 0:
            await asyncio.sleep(to_wait)
        self.last[domain] = time.time()

    def allowed(self, url: str, user_agent: str) -> bool:
        parsed = urlparse(url)
        domain = f"{parsed.scheme}://{parsed.netloc}"
        if domain not in self.cache:
            rp = urllib.robotparser.RobotFileParser()
            try:
                rp.set_url(urljoin(domain, "/robots.txt"))
                rp.read()
            except Exception:
                rp = None
            self.cache[domain] = rp
        rp = self.cache[domain]
        if rp is None:
            return True  
        return rp.can_fetch(user_agent, url)

# MORE FUNCTIONS

async def fetch(session: aiohttp.ClientSession, url: str, timeout=REQUEST_TIMEOUT):
    try:
        async with session.get(url, timeout=timeout) as resp:
            if resp.status != 200:
                return None, resp.status
            ct = resp.headers.get("Content-Type","")
            if "text" not in ct and "html" not in ct:
                return None, "non-text"
            txt = await resp.text(errors="replace")
            return txt, 200
    except Exception as e:
        return None, str(e)

async def worker(name, queue, seen, session, limiter, progress, semaphore):
    while True:
        item = await queue.get()
        if item is None:
            queue.task_done()
            break
        url, depth = item
        if len(seen) >= MAX_PAGES:
            queue.task_done()
            continue
        url = urldefrag(url)[0]
        if url in seen:
            queue.task_done()
            continue
        parsed = urlparse(url)
        if parsed.scheme not in ALLOWED_SCHEMES or not parsed.netloc:
            queue.task_done()
            continue
        ua = random.choice(USER_AGENTS)
        await limiter.wait(parsed.netloc)

        print(f"WEBBOT_SCANNING: {url}", flush=True)

        print(f"WEBBOT_SCANNING: {url}")
        with open("scanning_log.txt", "a", encoding="utf-8") as log:
            log.write(f"WEBBOT_SCANNING: {url}\n")


        async with semaphore:
            html, status = await fetch(session, url)
        if not html:
            seen.add(url)
            progress.update(1)
            queue.task_done()
            continue
        text = extract_main_text(html, url)
        summary = summarize_text(text, SUMMARY_SENTENCES)
        domain, filename = safe_filename_from_url(url)
        domain_folder = os.path.join(SAVE_FOLDER, domain)
        os.makedirs(domain_folder, exist_ok=True)
        file_path = os.path.join(domain_folder, filename)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"URL: {url}\n")
            f.write(f"Fetched-Time: {time.asctime()}\n\n")
            f.write("==== SUMMARY ====\n")
            f.write(summary + "\n\n")
            f.write("==== EXTRACTED TEXT PREVIEW ====\n")
            f.write(text[:5000] + ("\n\n... (truncated)\n" if len(text) > 5000 else "\n"))
            filename_base = os.path.splitext(filename)[0]  
            save_html_file(domain_folder, filename_base, url, summary, text)
        seen.add(url)
        progress.update(1)

        if depth < MAX_DEPTH:
            soup = BeautifulSoup(html, "lxml")
            for a in soup.find_all("a", href=True):
                href = a["href"].strip()
                if href.startswith("mailto:") or href.startswith("tel:"):
                    continue
                new = urljoin(url, href)
                new = urldefrag(new)[0]
                parsed_new = urlparse(new)
                if parsed_new.scheme in ALLOWED_SCHEMES and parsed_new.netloc:
                    if new not in seen:
                        await queue.put((new, depth + 1))
        queue.task_done()

async def crawl(seeds):
    q = asyncio.Queue()
    seen = set()
    for s in seeds:
        await q.put((s, 0))
    limiter = DomainRateLimiter()
    semaphore = asyncio.Semaphore(CONCURRENT_REQUESTS)
    timeout = aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)
    async with aiohttp.ClientSession(headers={"User-Agent": USER_AGENTS[0]}, timeout=timeout) as session:
        with tqdm(total=MAX_PAGES, desc="pages") as pbar:
            workers = []
            for i in range(CONCURRENT_REQUESTS):
                w = asyncio.create_task(
                    worker(f"w{i}", q, seen, session, limiter, pbar, semaphore)
                )
                workers.append(w)
            while len(seen) < MAX_PAGES:
                await asyncio.sleep(0.5)
                if q.empty():
                    if q.empty():
                        break
            for _ in workers:
                await q.put(None)
            await asyncio.gather(*workers)
    print(f"Done. Saved pages: {len(seen)}")

def open_scanning_terminal(log_file="scanning_log.txt"):
    system = platform.system().lower()
    try:
        if system == "windows":
            subprocess.Popen(["start", "cmd", "/k", f"type {log_file} && powershell Get-Content {log_file} -Wait"], shell=True)
        elif system == "darwin": 
            subprocess.Popen(["osascript", "-e", f'tell app "Terminal" to do script "tail -f {log_file}"'])
        else: 
            subprocess.Popen(["x-terminal-emulator", "-e", f"tail -f {log_file}"])
    except Exception as e:
        print(f"Could not open log window: {e}")

if __name__ == "__main__":
    import sys
    seeds = SEED_URLS.copy()
    if len(sys.argv) > 1:
        seeds = sys.argv[1:]
    open("scanning_log.txt", "w").close()  # clear old log
    open_scanning_terminal("scanning_log.txt")

    asyncio.run(crawl(seeds))

# END