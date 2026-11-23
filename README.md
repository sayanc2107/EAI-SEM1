# MedCore AI — Hospital Operations & Simulation Platform

> **EDUCATIONAL & ACADEMIC DEMONSTRATION PLATFORM ONLY**  
> **DISCLAIMER:** MedCore AI is an educational simulation created for academic coursework. All patient identities, vital telemetry readings, triage acuteness classifications, drug prescriptions, and vehicle GPS coordinates are entirely synthetic demonstration models. This software is **not** a certified medical device, has **not** been evaluated for regulatory compliance (FDA, CE, HIPAA, etc.), and must **never** be used for actual clinical diagnostics, treatment choices, or real-world emergency dispatch.

---

## 1. System Overview

MedCore AI demonstrates an integrated hospital management and operations portal, covering:
* **ER Triage & Telemetry Simulation**: Acuity indicators and historical vital graphs (synthetic data generated for demonstration).
* **Ward Bed Matrix**: Operational bed status management (`Occupied`, `Available`, `Cleaning`).
* **Ambulance Fleet & Dispatch Simulation**: Simulated GPS status tracking (`Available`, `En Route`, `At Scene`, `Maintenance`) and emergency call assignment.
* **Doctor Outpatient Appointments**: Scheduling, consultation notes, vital logging, and prescription recording.
* **Pharmacy Operations**: Pre-pack dispensing queue, inventory tracking, and multi-tender split-payment billing.
* **Hospital Administration & Payroll**: Staff duty rosters, multi-department accounting, and salary disbursal ledger.
* **Internal Communications**: Scoped hospital messaging (with CC/BCC scoping) and operational helpdesk ticketing.

---

## 2. Architecture & Deployment Topology

MedCore AI supports a split-cloud deployment model:

```
┌───────────────────────────────────────────────┐
│              GitHub Pages Frontend            │
│      https://sayank2107.github.io/EAI-SEM1/   │
│         (HTML5, CSS3, Vanilla JS SPA)        │
└───────────────────────┬───────────────────────┘
                        │
                        │ HTTPS REST API Calls
                        │ (CORS Restricted: FRONTEND_ORIGIN)
                        ▼
┌───────────────────────────────────────────────┐
│            Render Python Web Service          │
│            (Gunicorn WSGI + Flask API)        │
│          server.py listening on 0.0.0.0:$PORT │
└───────────────────────┬───────────────────────┘
                        │
                        │ Encrypted TLS Connection (MONGO_URI)
                        ▼
┌───────────────────────────────────────────────┐
│              MongoDB Atlas Cluster            │
│            cluster0.njngnoe.mongodb.net       │
│               Database: medcore_db            │
└───────────────────────────────────────────────┘
```

### Database Collections (18 Total)
When connected to MongoDB or running via the backend in-memory store, the application manages 18 distinct collections initialized via `seed_data.json`:
1. `users` — Hospital employee accounts and authentication credentials (passwords stored hashed).
2. `doctors` — Physician roster, specialties, room allocations, and duty status.
3. `nurses` — Registered nursing staff and assigned ward locations.
4. `wardStaff` — Support personnel and shift details.
5. `shifts` — 7-day duty schedules and timing allocations.
6. `attendanceLogs` — Staff shift check-in and check-out logs.
7. `patients` — Inpatient registry, admitting diagnoses, and historical vital series.
8. `beds` — Physical hospital bed matrix and occupancy mapping.
9. `prescriptions` — Doctor medication orders pending pharmacy pack.
10. `medicines` — Pharmacy inventory levels, batch numbers, and reorder levels.
11. `hospitalTransactions` — Financial audit ledger across pharmacy, consultations, and salaries.
12. `payroll` — Staff monthly compensation, tax deductions, and bank disbursement records.
13. `internalMails` — Role-scoped internal communications.
14. `supportIssues` — Operational maintenance and biomedical helpdesk tickets.
15. `doctorLibrary` — Emergency clinical practice guideline reference cards.
16. `ambulances` — Vehicle fleet telemetry, onboard equipment, and transport status.
17. `ambulanceRequests` — Emergency pickup calls and dispatch assignments.
18. `doctorAppointments` — Outpatient booking records, consultation logs, and clinical findings.

---

## 3. Security Architecture

* **Zero Hardcoded Secrets**: MongoDB connection strings are strictly read from the `MONGO_URI` environment variable. Defaults and example files only contain safe placeholders.
* **Password Hashing**: Plaintext password storage and comparisons have been replaced on the server with modern cryptographic password hashing using `werkzeug.security` (`scrypt`/`pbkdf2`).
* **Safe User Responses**: User credential hashes and passwords are automatically stripped before sending responses across `/api/auth/login`, `/api/staff/new`, and `/api/bootstrap`.
* **Token Authentication & RBAC**:
  * Logging in generates a cryptographically random 256-bit session token (`secrets.token_hex(32)`).
  * Server-side route authorization enforces role permissions on all data-mutating routes (e.g., payroll routes require `superadmin` or `admin`; clinical operations require `doctor`, `nurse`, or administrative roles). Client-side UI controls are backed by strict server-side authorization.
* **Strict CORS Policy**: CORS is narrowly restricted to `FRONTEND_ORIGIN` (`https://sayank2107.github.io`) and local development ports. Wildcard CORS (`*`) is disabled in production.
* **Safe Error Handling**: Database errors, cluster endpoints, and credentials are never leaked to client responses or logs. All connection strings in logs are automatically masked (`mongodb+srv://***:***@...`).
* **Resilient Fallback**: If `MONGO_URI` is missing, contains placeholder text, or the database is temporarily unreachable, the backend gracefully activates an in-memory demo simulation mode without crashing.

---

## 4. Production Deployment Guide

### A. What Was Implemented in Code
1. **Flask Render Compatibility**: Added `Procfile` (`web: gunicorn server:app`) and `render.yaml` for zero-configuration Render deployment. Configured server to bind to `0.0.0.0` and read `$PORT`.
2. **Centralized Frontend API Configuration**: Added `js/config.js` defining `MedCoreConfig.API_BASE_URL` and `getApiUrl()`. Wrapped all 26 frontend API requests (`/api/auth/login`, `/api/status`, `/api/bootstrap`, patients, ambulance, appointments, etc.) to dynamically route through `API_BASE_URL`.
3. **CORS Normalization**: Updated `server.py` to support `FRONTEND_ORIGIN` and `ALLOWED_ORIGINS` with trailing slash normalization.
4. **Offline / Standalone Fallback**: If the Render backend is sleeping or unreachable, the frontend automatically falls back to client-side demo mode.

---

### B. Manual Steps: Deploying the Backend on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `https://github.com/sayank2107/EAI-SEM1` (Branch: `main`).
4. Configure the Web Service settings:
   * **Name**: `medcore-ai-backend` (or your preferred name)
   * **Region**: Choose the region closest to your MongoDB Atlas cluster (e.g., Oregon, Frankfurt, Singapore)
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `gunicorn server:app`
   * **Instance Type**: `Free`
5. Navigate to **Environment Variables** and add the following keys:

| Key | Value / Instructions |
| :--- | :--- |
| `MONGO_URI` | `mongodb+srv://sayan2008c_db_user:<YOUR_ROTATED_PASSWORD>@cluster0.njngnoe.mongodb.net/medcore_db?retryWrites=true&w=majority`<br>*(Enter your privately rotated password here. Never paste this into chat or commit it to code).* |
| `FRONTEND_ORIGIN` | `https://sayank2107.github.io` |
| `DB_NAME` | `medcore_db` |
| `PYTHON_VERSION` | `3.11.9` |

6. Click **Create Web Service**.
7. Once deployed, Render will provide your public service URL (e.g. `https://eai-sem1.onrender.com`). Copy this URL.

---

### C. Manual Steps: Configuring MongoDB Atlas
1. Log in to [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. In **Database Access**:
   * Verify database user `sayan2008c_db_user` exists.
   * Verify privileges include `readWrite` on `medcore_db`.
3. In **Network Access**:
   * Add `0.0.0.0/0` (Allow Access from Anywhere) so Render's dynamic cloud instances can connect to the database. (Protected by your strong database password).

---

### D. Manual Steps: Connecting Frontend to Backend
Once you have your Render URL (e.g. `https://eai-sem1.onrender.com`):

1. Open `js/config.js` in your repository.
2. Set `API_BASE_URL` to your Render URL:
   ```javascript
   const MedCoreConfig = {
       API_BASE_URL: 'https://eai-sem1.onrender.com'
   };
   ```
3. Commit and push the change to `main`:
   ```bash
   git add js/config.js
   git commit -m "chore: set live Render backend API URL"
   git push origin main
   ```
4. GitHub Pages will automatically redeploy at `https://sayank2107.github.io/EAI-SEM1/`.

*(Optional Quick Test without Redeploying)*:  
You can test the frontend against your Render backend immediately in your browser:
Open `https://sayank2107.github.io/EAI-SEM1/`, open DevTools Console (`F12`), and run:
```javascript
localStorage.setItem('medcore_api_url', 'https://eai-sem1.onrender.com');
location.reload();
```

---

## 5. Local Development Setup

If you wish to run the entire stack locally:

```bash
# Clone the repository
git clone https://github.com/sayanc2107/EAI-SEM1.git
cd EAI-SEM1

# Create and activate a virtual environment
python -m venv .venv

# On Linux / macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your MONGO_URI in your shell or .env
# Windows PowerShell:
$env:MONGO_URI="mongodb+srv://sayan2008c_db_user:<YOUR_PASSWORD>@cluster0.njngnoe.mongodb.net/medcore_db?retryWrites=true&w=majority"
$env:PORT="8080"

# Linux / macOS:
export MONGO_URI="mongodb+srv://sayan2008c_db_user:<YOUR_PASSWORD>@cluster0.njngnoe.mongodb.net/medcore_db?retryWrites=true&w=majority"
export PORT=8080

# Start server
python server.py
```
Open your browser at `http://localhost:8080`.

---

## 6. Git History Audit & Historical Credential Cleanup

> **AUDIT FINDING:**  
> An inspection of the Git commit history identified that earlier historical commits (specifically `b30b07e` and `5d13d86`) contained diffs with database connection strings.
> 
> Although current tracked files (`server.py`, `config.example.json`, etc.) are completely sanitized and read exclusively from environment variables, Git history retains past versions.

### Recommended Steps to Clean Git History:
Because rewriting Git history alters commit SHAs and requires force-pushing (`git push --force`), do this only after coordinating with your team:

1. **Install `git-filter-repo`**:
   ```bash
   pip install git-filter-repo
   ```

2. **Create a local backup clone first**:
   ```bash
   cd ..
   git clone --mirror https://github.com/sayanc2107/EAI-SEM1.git EAI-SEM1-backup.git
   cd EAI-SEM1
   ```

3. **Create a replacement expressions file `replace.txt`** to replace any old connection strings or passwords with `<YOUR_PASSWORD_HERE>`:
   ```
   regex:cluster0\.[a-z0-9]+\.mongodb\.net==>cluster0.njngnoe.mongodb.net
   ```
   Or use `git-filter-repo` to replace text strings across all commits:
   ```bash
   git filter-repo --replace-text replace.txt
   ```

4. **Re-add your origin remote**:
   ```bash
   git remote add origin https://github.com/sayanc2107/EAI-SEM1.git
   ```

5. **Force-push only after explicit review**:
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```

---

## 7. License & Attribution

* **Project**: MedCore AI Simulation Platform (Academic / Semester 1 Project)
* **Author**: Sayan Chakraborty ([LinkedIn Profile](https://www.linkedin.com/in/sayanchakraborty2107/))
