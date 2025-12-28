###################################################
#                                                 #
#                                                 #
#                 WebBot Vmain                    #
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

# THIS IS THE MAIN CODE, MEANING IT IS ONLY THE TESTING GROUNDS. TO USE THE REAL
# VERSIONS PLEASE GO BELOW AND USE VERSION 2 AND 3. V1 IS NOT RECOMMENED DUE TO LEGACY
# SOFTWARE AND THE LACK OF ABILITY. VERSION 2 IS LESS POWERFUL, AS VERSION 3 IS THE NEWEST 
# AND BEST. PLEASE KEEP THIS IN MIND FOR FUTURE REFERENCE.

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
]
CONCURRENT_REQUESTS = 10           
PER_DOMAIN_DELAY = 1.0           
REQUEST_TIMEOUT = 20              
MAX_PAGES = 200       
try:
    env_val = os.environ.get("MAX_PAGES_OVERRIDE")
    if env_val:
        MAX_PAGES = int(env_val)
except Exception:
    pass        
MAX_DEPTH = 3                      
SAVE_FOLDER = "websites"         
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

def save_html_file(domain_folder, filename_base, url, summary, text):
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Summary of {url}</title>
<style>
  body {{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 2rem auto;
    max-width: 900px;
    line-height: 1.6;
    background: #f5f7fa;
    color: #333;
    padding: 20px;
  }}
  h1 {{
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }}
  h2 {{
    color: #34495e;
    border-bottom: 2px solid #2980b9;
    padding-bottom: 0.3rem;
  }}
  .url {{
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-bottom: 2rem;
  }}
  pre {{
    white-space: pre-wrap;
    background: #ecf0f1;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }}
</style>
</head>
<body>
  <h1>Summary and Extracted Text</h1>
  <div class="url"><strong>URL:</strong> <a href="{url}" target="_blank" rel="noopener">{url}</a></div>
  <h2>Summary</h2>
  <pre>{summary}</pre>
  <h2>Extracted Text Preview</h2>
  <pre>{text[:5000]}{ "...\n\n(truncated)" if len(text) > 5000 else ""}</pre>
</body>
</html>"""

    html_filename = os.path.join(domain_folder, f"{filename_base}.html")
    with open(html_filename, "w", encoding="utf-8") as f:
        f.write(html_content)

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
            filename_base = os.path.splitext(filename)[0]  # remove .txt extension
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

if __name__ == "__main__":
    import sys
    seeds = SEED_URLS.copy()
    if len(sys.argv) > 1:
        seeds = sys.argv[1:]
    asyncio.run(crawl(seeds))

# END