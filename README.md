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

## 2. Architecture & Data Model

MedCore AI operates under a dual-mode architecture:
1. **Client-Side Simulation Mode**: Can run directly in any modern browser or via static hosting (such as GitHub Pages) using an in-memory sample store (`js/data.js`).
2. **Full-Stack Mode**: Backed by a Python Flask REST API (`server.py`) and an optional MongoDB instance.

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

A dedicated security and reliability pass has been implemented in the codebase:

* **Password Hashing**: Plaintext password storage and comparisons have been replaced on the server with modern cryptographic password hashing using `werkzeug.security` (`scrypt`/`pbkdf2`).
* **Safe User Responses**: User credential hashes and passwords are automatically stripped before sending responses across `/api/auth/login`, `/api/staff/new`, and `/api/bootstrap`.
* **Token Authentication & RBAC**:
  * Logging in generates a cryptographically random 256-bit session token (`secrets.token_hex(32)`).
  * Server-side route authorization enforces role permissions on all data-mutating routes (e.g., payroll routes require `superadmin` or `admin`; clinical operations require `doctor`, `nurse`, or administrative roles). Client-side UI controls are backed by strict server-side authorization.
* **CORS Restriction**: Wildcard CORS (`*`) has been removed. Allowed origins are strictly configurable via the `ALLOWED_ORIGINS` environment variable (defaults to `http://localhost:8080,http://127.0.0.1:8080`).
* **Safe Error Handling**: Database errors, cluster endpoints, and credentials are never leaked to client responses or logs.
* **Configuration Safety**: Sensitive database connection strings are read from the `MONGO_URI` environment variable, keeping secrets out of tracked files.

---

## 4. Setup & Running Instructions

### Mode A: Standalone Demo Mode (No Backend Required)
You can explore the interface without running any backend servers:
1. Open `index.html` directly in any web browser, or access the live GitHub Pages deployment:  
   `https://sayanc2107.github.io/EAI-SEM1/`
2. Use any pre-configured demonstration role buttons on the sign-in screen to explore the respective portal.

---

### Mode B: Full-Stack Mode (Python Flask + MongoDB)

#### 1. Prerequisites
* Python 3.10 or higher
* (Optional) Access to a MongoDB instance (local or MongoDB Atlas)

#### 2. Environment Variables Configuration
Configure environment variables using system variables or an untracked `.env` file (ensure `.env` remains in `.gitignore`):

| Variable | Description | Example Placeholder |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://<db_user>:<db_pass>@<cluster>.example.mongodb.net/medcore_db?retryWrites=true&w=majority` |
| `DB_NAME` | Target database name | `medcore_db` |
| `PORT` | HTTP server port | `8080` |
| `ALLOWED_ORIGINS` | Comma-delimited CORS allowed origins | `http://localhost:8080,http://127.0.0.1:8080` |

If `MONGO_URI` is left unset or contains placeholder text, the server automatically starts in safe **in-memory demo fallback mode** using `seed_data.json` without failing.

#### 3. Installation & Startup

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

# (Optional) Set environment variables in your shell
# On Windows PowerShell:
$env:MONGO_URI="mongodb://your_actual_db_user:your_actual_password@localhost:27017/medcore_db"
$env:PORT="8080"

# On Linux / macOS:
export MONGO_URI="mongodb://your_actual_db_user:your_actual_password@localhost:27017/medcore_db"
export PORT=8080

# Start the application server
python server.py
```

Open your browser at `http://localhost:8080`.

---

## 5. Security Notice: Credential Rotation & Git History Cleanup

> **IMPORTANT:** If database credentials were previously committed to this repository's Git history, treat that credential as compromised. Follow the manual steps below to rotate the credential and purge historical commits.

### Step 1: Rotate the Compromised Database Credential in MongoDB Atlas
1. Log in to the [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Select your project and navigate to **Security** -> **Database Access**.
3. Locate the database user associated with the exposed credential.
4. Click **Edit**, select **Edit Password**, and generate a new high-entropy password. Alternatively, delete the user and create a new dedicated user with least-privilege permissions (e.g., `readWrite` strictly on `medcore_db`).
5. Under **Security** -> **Network Access**, review the IP Access List. Avoid `0.0.0.0/0` in production environments; bind strictly to your server's trusted static IP.

### Step 2: Clean Git History Using `git-filter-repo`
To purge all historical versions of `config.json` from the repository commit tree:

```bash
# 1. Install git-filter-repo (recommended by Git over legacy filter-branch)
pip install git-filter-repo

# 2. Make a fresh backup clone of your repository before rewriting history
cd ..
git clone --bare https://github.com/sayanc2107/EAI-SEM1.git EAI-SEM1-backup.git

# 3. Inside your working repository, purge config.json across all commits
cd EAI-SEM1
git filter-repo --path config.json --invert-paths

# 4. Re-add your origin remote (git-filter-repo removes remotes for safety)
git remote add origin https://github.com/sayanc2107/EAI-SEM1.git

# 5. Force push the sanitized commit history to GitHub
git push origin --force --all
git push origin --force --tags
```

All team members must discard existing local clones and clone the repository fresh after the history rewrite.

---

## 6. License & Attribution

* **Project**: MedCore AI Simulation Platform (Academic / Semester 1 Project)
* **Author**: Sayan Chakraborty ([LinkedIn Profile](https://www.linkedin.com/in/sayanchakraborty2107/))
