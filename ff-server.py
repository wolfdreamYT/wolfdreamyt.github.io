import os
import time
import shutil
import subprocess
import uuid
from threading import Semaphore
from datetime import datetime
from threading import Lock
from functools import wraps
from urllib.parse import urlparse
from flask import (
    Flask, render_template, request, Response,
    send_from_directory, jsonify, abort, Response as FlaskResponse
)
import logging
import re
import platform


app = Flask(__name__, template_folder="templates")

handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s", "%Y-%m-%d %H:%M:%S"))
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)

# ----------------- CONFIG -----------------
app = Flask(__name__, template_folder="templates")

SEEDS_FILE = "seeds.txt"
WEBBOT_SCRIPT = "version2.5.py"
OUTPUT_FOLDER = "websites"
ZIP_FOLDER = "outputs"
os.makedirs(ZIP_FOLDER, exist_ok=True)

# ------------- CREDENTIALS ----------------

AUTH_USER = "your-username-here"
AUTH_PASS = "your-secret-password-here"

RUN_LOCK = Lock()
PROCESS_TIMEOUT_SEC = 60 * 10  # 10 minutes maximum session
MAX_ALLOWED_PAGES = 5
# ------------------------------------------

# ----------------- AUTH SYSTEM -----------------
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
# ------------------------------------------------


# ----------------- UTILITIES -----------------
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
# ----------------------------------------------


# ----------------- ROUTES -----------------
@app.route("/")
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
            url_token_prefix = "WEBBOT_SCANNING:"
            url_regex = re.compile(r"https?://[^\s<>\"']+")

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

                if stripped.startswith(url_token_prefix):
                    scanning_url = stripped[len(url_token_prefix):].strip()
                    display = f"[{scanning_url}]"
                    app.logger.info(f"[{job_id}] SCANNING -> {display}")
                    safe = display.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                    yield f"<b>Scanning:</b> {safe}<br>\n"
                    continue

                app.logger.info(f"[{job_id}] webbot stdout: {stripped}")

                try:
                    found = url_regex.findall(stripped)
                    for u in found:
                        app.logger.info(f"[{job_id}] detected URL in webbot output: {u}")
                except Exception:
                    pass

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
# --------------------------------------------

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

# ----------------- MAIN -----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
# ----------------------------------------
