import os
import time
import shutil
import subprocess
import uuid
from threading import Semaphore
from datetime import datetime
from threading import Lock
from threading import Thread
from functools import wraps
from urllib.parse import urlparse
from flask import (
    Flask, render_template, request, Response,
    send_from_directory, jsonify, abort, Response 
    as FlaskResponse
)

app = Flask(__name__, template_folder="templates")

app = Flask(__name__, template_folder="templates")

SEEDS_FILE = "seeds.txt"
WEBBOT_SCRIPT = "version3.py"
OUTPUT_FOLDER = "websites"
ZIP_FOLDER = "outputs"
os.makedirs(ZIP_FOLDER, exist_ok=True)

AUTH_USER = "webbot-USER"
AUTH_PASS = "release.2025!"

RUN_LOCK = Lock()
PROCESS_TIMEOUT_SEC = 60 * 30  
MAX_ALLOWED_PAGES = 10

def authenticate():
    return FlaskResponse(
        "Authentication required",
        401,
        {"WWW-Authenticate": 'Basic realm="Login Required"'}
    )

def check_auth(username, password):
    return username == AUTH_USER and password == AUTH_PASS

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

def clear_downloads_folder():
    while True:
        print("[INFO] Clearing downloads folder...")
        for filename in os.listdir(ZIP_FOLDER):
            file_path = os.path.join(ZIP_FOLDER, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path) 
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)  
            except Exception as e:
                print(f"[ERROR] Failed to delete {file_path}: {e}")
        print("[INFO] Downloads folder cleared.")
        time.sleep(3600)  # 1 hour btw

def start_cleanup_thread():
    thread = Thread(target=clear_downloads_folder, daemon=True)
    thread.start()

def sanitize_seeds(text):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    safe = []
    for l in lines:
        try:
            p = urlparse(l)
            if p.scheme in ("http", "https") and p.netloc:
                safe.append(l)
        except Exception:
            continue
    return safe


def make_zip_of_output():
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    zip_basename = f"webbot_output_{ts}"
    zip_path = os.path.join(ZIP_FOLDER, zip_basename)
    shutil.make_archive(zip_path, "zip", OUTPUT_FOLDER)
    return zip_basename + ".zip"

MAX_CONCURRENT_JOBS = 3   
JOB_SEMAPHORE = Semaphore(MAX_CONCURRENT_JOBS)

JOB_ROOT = os.path.join("outputs", "jobs")
os.makedirs(JOB_ROOT, exist_ok=True)

def make_job_folders(job_id):
    job_folder = os.path.join(JOB_ROOT, job_id)
    job_output_folder = os.path.join(job_folder, "websites")
    os.makedirs(job_output_folder, exist_ok=True)
    return job_folder, job_output_folder

def make_zip_for_job(job_id):
    job_folder = os.path.join(JOB_ROOT, job_id)
    zip_basename = f"webbot_job_{job_id}"
    zip_path = os.path.join(ZIP_FOLDER, zip_basename)
    shutil.make_archive(zip_path, "zip", job_folder)
    return zip_basename + ".zip"

@app.route("/")
def wolf_studios_home():
    return send_from_directory("studios", "index.html")

@app.route("/onecentury")
def one_century_page():
    return send_from_directory("studios", "onecentury.html")

@app.route("/onecentury/oc-styles.css")
def one_century_page_styles():
    return send_from_directory("studios", "oc-styles.css")

@app.route("/onecentury/script.js")
def one_century_page_script():
    return send_from_directory("studios", "script.js")

@app.route("/webbot")
def index():
    seeds = ""
    if os.path.exists(SEEDS_FILE):
        with open(SEEDS_FILE, "r", encoding="utf-8") as f:
            seeds = f.read()
    return render_template("index.html", seeds=seeds, max_pages=200)


@app.route("/save", methods=["POST"])
@requires_auth
def save():
    data = request.json or {}
    seeds = data.get("seeds", "")
    max_pages = data.get("max_pages", "")

    slist = sanitize_seeds(seeds)
    if not slist:
        return jsonify({"ok": False, "error": "No valid URLs provided"}), 400

    with open(SEEDS_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(slist) + "\n")

    try:
        if max_pages:
            n = int(max_pages)
            n = max(1, min(n, MAX_ALLOWED_PAGES))
            with open(".max_pages_override", "w") as f:
                f.write(str(n))
    except Exception:
        return jsonify({"ok": False, "error": "Invalid max_pages"}), 400

    return jsonify({"ok": True})


@app.route("/run", methods=["POST"])
@requires_auth
def run_scan():
    data = request.json or {}
    seeds_text = data.get("seeds", "").strip()
    max_pages = data.get("max_pages", None)

    seeds_args = []
    used_seed_source = "none"
    if seeds_text:
        slist = sanitize_seeds(seeds_text)
        if not slist:
            return jsonify({"ok": False, "error": "No valid seed URLs supplied"}), 400
        seeds_args = slist
        used_seed_source = "request"
    else:
        used_seed_source = "file-or-default"

    try:
        requester = request.remote_addr or "unknown"
        ua = request.user_agent.string or "unknown-UA"
        app.logger.info(f"Incoming /run request from {requester} | UA: {ua} | seeds_source={used_seed_source}")
    except Exception:
        app.logger.info("Incoming /run request (failed to read some request metadata)")

    acquired = JOB_SEMAPHORE.acquire(blocking=False)
    if not acquired:
        app.logger.info("Rejected run: too many concurrent scans")
        return jsonify({"ok": False, "error": "Server is busy: too many concurrent scans. Try again later."}), 429

    job_id = uuid.uuid4().hex[:12]
    job_folder, job_output_folder = make_job_folders(job_id)

    if seeds_args:
        app.logger.info(f"[{job_id}] Seeds provided ({len(seeds_args)}):")
        for s in seeds_args:
            app.logger.info(f"[{job_id}]   - {s}")
    else:
        app.logger.info(f"[{job_id}] No seeds provided in request; webbot will use default behavior (e.g. reading seeds.txt or internal logic).")

    env = os.environ.copy()
    env["SAVE_FOLDER_OVERRIDE"] = job_output_folder
    if max_pages:
        try:
            env["MAX_PAGES_OVERRIDE"] = str(int(max_pages))
        except:
            pass
    elif os.path.exists(".max_pages_override"):
        with open(".max_pages_override","r") as f:
            env["MAX_PAGES_OVERRIDE"] = f.read().strip()

    cmd = ["python", WEBBOT_SCRIPT] + seeds_args

    def generate():
        try:
            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                env=env,
                text=True,
                bufsize=1,
                universal_newlines=True
            )

            start = time.time()

            for line in iter(proc.stdout.readline, ""):
                elapsed = time.time() - start
                if elapsed > PROCESS_TIMEOUT_SEC:
                    try:
                        proc.kill()
                    except:
                        pass
                    app.logger.warning(f"[{job_id}] Process killed after timeout ({PROCESS_TIMEOUT_SEC}s).")
                    yield f"<br>Process killed after timeout ({PROCESS_TIMEOUT_SEC}s).<br>"
                    break

                stripped = line.rstrip("\n")

                safe = stripped.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                yield safe + "<br>\n"

            try:
                proc.stdout.close()
            except:
                pass
            try:
                proc.wait(timeout=5)
            except:
                pass

            try:
                zipname = make_zip_for_job(job_id)
                app.logger.info(f"[{job_id}] Job finished; created zip: {zipname}")
                yield f"<br><br><!--DONE-->{zipname}<br>"
            except Exception as e:
                app.logger.exception(f"[{job_id}] Error creating job zip: {e}")
                yield f"<br><br><!--DONE-->ERROR_ZIP_CREATION: {e}<br>"

        except Exception as e:
            app.logger.exception(f"[{job_id}] ERROR RUNNING JOB: {e}")
            yield f"<br>ERROR RUNNING JOB: {e}<br>"
        finally:
            JOB_SEMAPHORE.release()

    return Response(generate(), mimetype="text/html; charset=utf-8")


@app.route("/download/<path:zipname>")
@requires_auth
def download(zipname):
    if ".." in zipname or zipname.startswith("/") or "\\" in zipname:
        return abort(400)
    path = os.path.join(ZIP_FOLDER, zipname)
    if not os.path.exists(path):
        return abort(404)
    return send_from_directory(ZIP_FOLDER, zipname, as_attachment=True)

if __name__ == "__main__":
    start_cleanup_thread()
    app.run(host="0.0.0.0", port=5000, debug=False)

