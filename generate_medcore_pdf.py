import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MedCore AI — System Documentation & Technical Specification</title>
<style>
    @page {
        size: A4;
        margin: 18mm 16mm 18mm 16mm;
        @bottom-right {
            content: "Page " counter(page) " of " counter(pages);
            font-size: 9pt;
            color: #64748b;
        }
    }
    
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        background: #ffffff;
        font-size: 10pt;
        line-height: 1.55;
    }
    
    .cover-page {
        page-break-after: always;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 40px 10px;
    }
    
    .cover-badge {
        display: inline-block;
        padding: 6px 14px;
        background: #e0f2fe;
        color: #0284c7;
        font-weight: 700;
        font-size: 10pt;
        border-radius: 999px;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
    }
    
    .cover-title {
        font-size: 32pt;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.15;
        margin-bottom: 12px;
    }
    
    .cover-title span {
        color: #0284c7;
    }
    
    .cover-subtitle {
        font-size: 14pt;
        color: #475569;
        font-weight: 400;
        margin-bottom: 30px;
        max-width: 650px;
    }
    
    .meta-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px 24px;
        width: 100%;
        max-width: 650px;
        margin-bottom: 40px;
    }
    
    .meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        font-size: 9.5pt;
    }
    
    .meta-item strong {
        color: #0f172a;
        display: block;
        font-size: 8.5pt;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
    }
    
    .meta-item a, .meta-item span {
        color: #0369a1;
        text-decoration: none;
        word-break: break-all;
    }
    
    .disclaimer-card {
        background: #fffbeb;
        border-left: 4px solid #f59e0b;
        padding: 14px 18px;
        border-radius: 0 8px 8px 0;
        font-size: 9pt;
        color: #92400e;
        max-width: 650px;
        line-height: 1.45;
    }
    
    .section-title {
        font-size: 16pt;
        font-weight: 700;
        color: #0f172a;
        border-bottom: 2px solid #0284c7;
        padding-bottom: 6px;
        margin-top: 28px;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .subsection-title {
        font-size: 12pt;
        font-weight: 700;
        color: #1e293b;
        margin-top: 18px;
        margin-bottom: 8px;
    }
    
    p {
        margin-bottom: 10px;
        color: #334155;
    }
    
    ul, ol {
        margin-left: 20px;
        margin-bottom: 12px;
        color: #334155;
    }
    
    li {
        margin-bottom: 4px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 14px 0;
        font-size: 9pt;
    }
    
    th, td {
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        text-align: left;
    }
    
    th {
        background: #f1f5f9;
        color: #0f172a;
        font-weight: 700;
    }
    
    tr:nth-child(even) {
        background: #f8fafc;
    }
    
    .badge {
        display: inline-block;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 8pt;
        font-weight: 600;
    }
    
    .badge-blue { background: #e0f2fe; color: #0369a1; }
    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-amber { background: #fef3c7; color: #b45309; }
    .badge-red { background: #fee2e2; color: #b91c1c; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; }
    
    .feature-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px 14px;
        margin-bottom: 10px;
        page-break-inside: avoid;
    }
    
    .feature-header {
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
    }
    
    .tech-pill {
        display: inline-block;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 8pt;
        margin: 2px;
        font-weight: 500;
    }
    
    .page-break {
        page-break-before: always;
    }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
    <div class="cover-badge">Academic Project Specification &amp; Technical Report</div>
    <div class="cover-title">MedCore <span>AI</span></div>
    <div class="cover-subtitle">Smart Hospital Operations, Emergency Fleet Dispatch &amp; Clinical Telemetry Simulation Platform</div>
    
    <div class="meta-box">
        <div class="meta-grid">
            <div class="meta-item">
                <strong>Lead Developer</strong>
                <span>Sayan Chakraborty</span>
            </div>
            <div class="meta-item">
                <strong>LinkedIn Portfolio</strong>
                <a href="https://www.linkedin.com/in/sayanchakraborty2107/">linkedin.com/in/sayanchakraborty2107</a>
            </div>
            <div class="meta-item">
                <strong>Frontend Live Deployment</strong>
                <a href="https://sayanc2107.github.io/EAI-SEM1/">sayanc2107.github.io/EAI-SEM1/</a>
            </div>
            <div class="meta-item">
                <strong>Backend Cloud API</strong>
                <a href="https://eai-sem1.onrender.com">eai-sem1.onrender.com</a>
            </div>
            <div class="meta-item">
                <strong>Database Infrastructure</strong>
                <span>MongoDB Atlas Cloud Cluster (medcore_db)</span>
            </div>
            <div class="meta-item">
                <strong>Course / Project ID</strong>
                <span>EAI-SEM1 (Semester 1 Coursework)</span>
            </div>
        </div>
    </div>
    
    <div class="disclaimer-card">
        <strong>Academic Demonstration Platform Notice:</strong><br>
        MedCore AI is an educational simulation developed for academic evaluation. All patient identities, vital sign telemetry, diagnostic suggestions, triage acuity classifications, and drug dosages are entirely synthetic mock models. It is not an FDA/CE certified medical device and must never be utilized for real-world patient triage or emergency healthcare decision-making.
    </div>
</div>

<!-- PAGE 2: EXECUTIVE SUMMARY & SYSTEM PURPOSE -->
<div class="page-break"></div>
<h2 class="section-title">1. Executive Summary &amp; System Purpose</h2>

<p>
Modern healthcare facilities face critical operational friction caused by fragmented legacy software. Clinical triage, doctor appointment bookings, ambulance emergency dispatch, bed turnover, drug inventory, and payroll often operate in disparate silos. 
</p>

<p>
<strong>MedCore AI</strong> was designed as an all-in-one, unified hospital operations and clinical intelligence management system. It models an end-to-end medical facility workflow across emergency dispatch, outpatient consultations, inpatient telemetry, pharmacy sales, and administrative financial disbursements.
</p>

<h3 class="subsection-title">Primary Operational Uses</h3>
<ul>
    <li><strong>ER Triage &amp; Telemetry</strong>: Real-time clinical vital signs monitoring (Heart Rate, Blood Pressure, Oxygen Saturation, Temperature) with interactive multi-series SVG waveform charts.</li>
    <li><strong>Emergency Ambulance Fleet Tracking</strong>: Live status dispatch tracking (Available, En Route, At Scene, Hospital Transport) and emergency call request handling.</li>
    <li><strong>Doctor Outpatient Appointments</strong>: Comprehensive appointment booking, vital logging, symptom recording, clinical notes, and prescription issuance.</li>
    <li><strong>Inpatient Ward Bed Matrix</strong>: Visual occupancy and sanitization tracking across 4 hospital wards (ICU, Emergency, Cardiology, General Ward).</li>
    <li><strong>Pharmacy Inventory &amp; Split-Payment POS</strong>: Pre-pack prescription queue, real-time stock depletion alerts, batch tracking, and multi-tender billing.</li>
    <li><strong>Hospital Finance &amp; Staff Payroll</strong>: Department-wise revenue ledger, monthly compensation calculations with deductions, and automated payslip generation.</li>
    <li><strong>Clinical Intelligence &amp; Internal Comms</strong>: AI-powered clinical assistant, evidence-based guideline library, and role-scoped internal hospital mail.</li>
</ul>

<h2 class="section-title">2. Architecture &amp; Deployment Topology</h2>
<p>
MedCore AI features a <strong>dual-mode hybrid architecture</strong> designed for continuous availability:
</p>
<ol>
    <li><strong>Client-Side Static Simulation Mode</strong>: Hosted on <strong>GitHub Pages</strong>. If the backend is cold-starting or disconnected, the frontend automatically falls back to an in-memory client-side mock store (<code>js/data.js</code>), ensuring 100% offline uptime with zero broken UI screens.</li>
    <li><strong>Full-Stack Production Mode</strong>: Connects over secure HTTPS to a <strong>Python Flask REST API on Render</strong> backed by a <strong>MongoDB Atlas Live Cloud Cluster</strong>.</li>
</ol>

<table>
    <thead>
        <tr>
            <th>Tier</th>
            <th>Technology</th>
            <th>Deployment Provider</th>
            <th>Key Responsibilities</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Frontend SPA</strong></td>
            <td>HTML5, Vanilla JS (ES6+), CSS3 Glassmorphism</td>
            <td>GitHub Pages</td>
            <td>UI rendering, role dashboards, SVG charts, instant demo login, client-side fallback</td>
        </tr>
        <tr>
            <td><strong>Backend REST API</strong></td>
            <td>Python 3.11, Flask, Gunicorn WSGI</td>
            <td>Render Web Service</td>
            <td>Session token auth, RBAC authorization, CRUD endpoints, password hashing, CORS control</td>
        </tr>
        <tr>
            <td><strong>Database Layer</strong></td>
            <td>MongoDB Atlas (PyMongo SRV Driver)</td>
            <td>MongoDB Cloud</td>
            <td>18 persistent document collections, automatic seed layer, audit logs</td>
        </tr>
    </tbody>
</table>

<!-- PAGE 3: USER ROLES & WORKSPACES -->
<div class="page-break"></div>
<h2 class="section-title">3. User Workspaces &amp; Role-Based Access (What is Available)</h2>

<p>
MedCore AI enforces role-based navigation and server-side RBAC authorization across <strong>7 distinct hospital roles</strong>:
</p>

<div class="feature-card">
    <div class="feature-header">
        <span>1. Super Administrator / COO (<span class="badge badge-red">superadmin</span>)</span>
        <span>Executive Oversight</span>
    </div>
    <p>Complete executive command center: Hospital-wide census metrics, bed occupancy analytics, financial income ledgers, database connection monitors, and seamless admin role-switching to view portals from any department's perspective.</p>
</div>

<div class="feature-card">
    <div class="feature-header">
        <span>2. Hospital Administrator (<span class="badge badge-blue">admin</span>)</span>
        <span>Operations &amp; HR</span>
    </div>
    <p>Operational duty scheduling, doctor shift assignments, 7-day staff rosters, biomedical support ticket management, hospital employee onboarding, and operational issue dispatch.</p>
</div>

<div class="feature-card">
    <div class="feature-header">
        <span>3. Attending Physician / Doctor (<span class="badge badge-blue">doctor</span>)</span>
        <span>Clinical Care</span>
    </div>
    <p>Outpatient appointment consultation desk, clinical symptoms and vital documentation, diagnostic notes, direct prescription issuance to the pharmacy, clinical practice guideline library, and AI clinical assistant chatbot.</p>
</div>

<div class="feature-card">
    <div class="feature-header">
        <span>4. Registered Nurse (<span class="badge badge-green">nurse</span>)</span>
        <span>Triage &amp; Bedside Care</span>
    </div>
    <p>Emergency room patient triage, real-time vital telemetry recording, ward patient calls, doctor paging modal, and bed availability coordination.</p>
</div>

<div class="feature-card">
    <div class="feature-header">
        <span>5. Clinical Pharmacist (<span class="badge badge-purple">pharmacy</span>)</span>
        <span>Dispensing &amp; Stock</span>
    </div>
    <p>Doctor prescription pre-pack queue, dispensing verification, drug batch inventory tracking, reorder threshold alerts, supplier stock replenishment, and multi-tender pharmacy sales point-of-sale.</p>
</div>

<div class="feature-card">
    <div class="feature-header">
        <span>6. Chief Accountant / Finance (<span class="badge badge-amber">accountant</span>)</span>
        <span>Hospital Financials</span>
    </div>
    <p>Multi-department revenue tracking (Pharmacy, Consultations, Inpatient), split-tender cashier billing, monthly staff payroll calculation, deduction records, salary disbursement, and printable PDF payslip preview.</p>
</div>

<div class="feature-card">
    <div class="feature-header">
        <span>7. Ward &amp; Sanitation Staff (<span class="badge badge-blue">ward</span>)</span>
        <span>Environmental Hygiene</span>
    </div>
    <p>Physical bed sanitation tracking (Occupied, Available, Cleaning), ward hygiene logs, and biomedical facilities issue reporting.</p>
</div>

<!-- PAGE 4: DETAILED MODULE SPECIFICATIONS -->
<div class="page-break"></div>
<h2 class="section-title">4. Core Module Specifications</h2>

<h3 class="subsection-title">A. Emergency Ambulance Fleet &amp; Dispatch Tracking</h3>
<ul>
    <li><strong>Fleet Status Engine</strong>: Monitors vehicle tracking statuses: <code>Available</code>, <code>En Route to Patient</code>, <code>At Scene</code>, <code>En Route to Hospital</code>, and <code>Maintenance</code>.</li>
    <li><strong>Emergency Pickup Requests</strong>: Logs incoming emergency calls, caller phone numbers, pickup GPS addresses, reported emergency acuity (Cardiac, Trauma, Respiratory), and automated nearest vehicle dispatch.</li>
    <li><strong>Real-Time ETA</strong>: Dynamic estimated time of arrival calculation with 1-click status advancement.</li>
</ul>

<h3 class="subsection-title">B. Doctor Appointments &amp; Outpatient Consultations</h3>
<ul>
    <li><strong>Appointment Booking Desk</strong>: Outpatient appointment booking modal capturing patient demographics, contact details, attending physician, department, appointment slot, and chief complaints.</li>
    <li><strong>Consultation Suite</strong>: Attending physicians record real-time vital telemetry (BP, Heart Rate, SpO2, Temperature, Weight), clinical findings, differential diagnoses, follow-up dates, and prescribed drug regimens.</li>
    <li><strong>Status Lifecycle</strong>: Full state cycle management (<code>Scheduled</code> &rarr; <code>Completed</code> / <code>Cancelled</code>) with instant keyword search and status pill filters.</li>
</ul>

<h3 class="subsection-title">C. Recharts-Grade Interactive Clinical Vitals Waveform Engine</h3>
<ul>
    <li><strong>SVG Rendering</strong>: High-performance cubic Bezier curve rendering without external heavy charting dependencies.</li>
    <li><strong>Multi-Series Telemetry</strong>: Simultaneously monitors Heart Rate (BPM), Systolic BP (mmHg), Diastolic BP (mmHg), and SpO2 (%).</li>
    <li><strong>Interactive Crosshairs &amp; Tooltips</strong>: Hover crosshairs, Cartesian grid lines, and interactive legend toggles to isolate clinical parameters.</li>
</ul>

<h3 class="subsection-title">D. Inpatient Ward Bed Matrix</h3>
<ul>
    <li><strong>Multi-Ward Management</strong>: Emergency Room, Intensive Care Unit (ICU), Cardiology Ward, and General Medical Ward.</li>
    <li><strong>Bed Lifecycle</strong>: Color-coded state indicators: <code>Occupied</code> (Red), <code>Available</code> (Green), and <code>Under Cleaning</code> (Amber).</li>
    <li><strong>One-Click Admission &amp; Discharge</strong>: Automatic patient bed assignment and immediate bed state updates.</li>
</ul>

<h3 class="subsection-title">E. Pharmacy Management &amp; Split-Payment Billing</h3>
<ul>
    <li><strong>Doctor Pre-Pack Queue</strong>: Orders automatically routed from doctor consultations to the pharmacy dispensing desk.</li>
    <li><strong>Inventory Tracking</strong>: Drug name, formulation, batch code, expiry date, shelf quantity, and automated low-stock warnings.</li>
    <li><strong>Split-Tender Sales</strong>: Supports multi-mode payments combining Cash, Credit Card, UPI, and Health Insurance coverage on a single invoice.</li>
</ul>

<h3 class="subsection-title">F. Staff Payroll &amp; Compensation Ledger</h3>
<ul>
    <li><strong>Automated Calculation</strong>: Base salary, clinical shift allowances, medical performance bonuses, tax withholdings, and net salary.</li>
    <li><strong>Salary Disbursal</strong>: Direct electronic salary disbursal with automated transaction recording to the hospital audit ledger.</li>
    <li><strong>Printable Payslips</strong>: Formatted payslip inspection modal with professional print preview.</li>
</ul>

<!-- PAGE 5: TECHNOLOGY STACK & SECURITY -->
<div class="page-break"></div>
<h2 class="section-title">5. Comprehensive Technology Stack</h2>

<table>
    <thead>
        <tr>
            <th>Layer</th>
            <th>Framework / Tool</th>
            <th>Purpose in MedCore AI</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Client UI</strong></td>
            <td>HTML5, CSS3 Glassmorphism</td>
            <td>Responsive layout, single-line mobile navigation bar, bottom-sheet modals, dark navy palette</td>
        </tr>
        <tr>
            <td><strong>Frontend Logic</strong></td>
            <td>Modern JavaScript (ES6+)</td>
            <td>Async/await, AbortController timeout handling, event delegation, dynamic view rendering</td>
        </tr>
        <tr>
            <td><strong>Client Telemetry</strong></td>
            <td>Custom SVG Waveform Engine</td>
            <td>Real-time cubic Bezier vital telemetry charts (<code>js/recharts_chart.js</code>)</td>
        </tr>
        <tr>
            <td><strong>Data Import / Export</strong></td>
            <td>SheetJS (xlsx)</td>
            <td>Excel workbook parsing and spreadsheet export for pharmacy stock and financial ledgers</td>
        </tr>
        <tr>
            <td><strong>Backend Application</strong></td>
            <td>Python 3.11, Flask</td>
            <td>RESTful API routing, business logic, RBAC decorators, data serialization (<code>server.py</code>)</td>
        </tr>
        <tr>
            <td><strong>Production WSGI</strong></td>
            <td>Gunicorn (>=21.2.0)</td>
            <td>Multi-worker production server for handling concurrent web traffic on cloud containers</td>
        </tr>
        <tr>
            <td><strong>Security &amp; Auth</strong></td>
            <td>Werkzeug Security</td>
            <td>Cryptographic password hashing (<code>scrypt</code> / <code>pbkdf2</code>) and 256-bit session tokens</td>
        </tr>
        <tr>
            <td><strong>Database Driver</strong></td>
            <td>PyMongo (>=4.6.0) with SRV</td>
            <td>Encrypted TLS communication with MongoDB Atlas cloud clusters</td>
        </tr>
        <tr>
            <td><strong>Primary Database</strong></td>
            <td>MongoDB Atlas</td>
            <td>NoSQL document storage across 18 distinct collections</td>
        </tr>
        <tr>
            <td><strong>Cloud Hosting</strong></td>
            <td>Render Web Service</td>
            <td>Automated CI/CD build and deploy pipeline from GitHub (<code>render.yaml</code>, <code>Procfile</code>)</td>
        </tr>
        <tr>
            <td><strong>Static Web Host</strong></td>
            <td>GitHub Pages</td>
            <td>Global CDN hosting for frontend single-page application</td>
        </tr>
    </tbody>
</table>

<h2 class="section-title">6. Security Architecture &amp; Credentials Isolation</h2>

<ul>
    <li><strong>Zero Credentials in Code</strong>: Database connection strings are strictly read from the <code>MONGO_URI</code> environment variable. All committed files and example templates use safe dummy placeholders.</li>
    <li><strong>Cryptographic Password Hashing</strong>: Plaintext credentials have been entirely replaced on the server with <code>werkzeug.security.generate_password_hash</code> and verified with <code>check_password_hash</code>.</li>
    <li><strong>Sanitized API Responses</strong>: User objects returned via <code>/api/auth/login</code>, <code>/api/staff/new</code>, and <code>/api/bootstrap</code> automatically strip all password hashes before transmission.</li>
    <li><strong>Role-Based Access Control (RBAC)</strong>: Server routes are protected by <code>@require_auth(['role1', 'role2'])</code>. Data-mutating requests require a valid cryptographic bearer token.</li>
    <li><strong>CORS Hardening</strong>: Wildcard CORS (<code>*</code>) is disabled. Origin access is strictly locked to <code>https://sayanc2107.github.io</code> and local development hosts.</li>
    <li><strong>Safe Exception Logging</strong>: MongoDB URIs and passwords are automatically masked with regex filters before reaching server log outputs.</li>
</ul>

<!-- PAGE 6: DATABASE COLLECTIONS & DEMO ACCOUNTS -->
<div class="page-break"></div>
<h2 class="section-title">7. Database Collections Specification (18 Total)</h2>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Collection Name</th>
            <th>Data Managed</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>1</td><td><code>users</code></td><td>Hospital staff accounts, credentials (hashed), roles, and employee IDs</td></tr>
        <tr><td>2</td><td><code>doctors</code></td><td>Attending physicians, specialties, cabin allocations, and duty status</td></tr>
        <tr><td>3</td><td><code>nurses</code></td><td>Registered nursing personnel and assigned ward stations</td></tr>
        <tr><td>4</td><td><code>wardStaff</code></td><td>Sanitation staff and environmental operational details</td></tr>
        <tr><td>5</td><td><code>shifts</code></td><td>7-day duty schedules, shift start/end times, and active assignments</td></tr>
        <tr><td>6</td><td><code>attendanceLogs</code></td><td>Biometric shift check-in and check-out attendance records</td></tr>
        <tr><td>7</td><td><code>patients</code></td><td>Inpatient admission registry, chief complaints, and historical vitals series</td></tr>
        <tr><td>8</td><td><code>beds</code></td><td>Bed matrix, ward allocations, and occupancy/cleaning statuses</td></tr>
        <tr><td>9</td><td><code>prescriptions</code></td><td>Doctor prescription orders routed to the pharmacy queue</td></tr>
        <tr><td>10</td><td><code>medicines</code></td><td>Pharmacy drug stock, batch numbers, reorder thresholds, and unit prices</td></tr>
        <tr><td>11</td><td><code>hospitalTransactions</code></td><td>Financial audit log for billing, drug sales, and payroll disbursements</td></tr>
        <tr><td>12</td><td><code>payroll</code></td><td>Staff monthly compensation records, allowances, and tax deductions</td></tr>
        <tr><td>13</td><td><code>internalMails</code></td><td>Scoped internal communications with role-based CC/BCC filtering</td></tr>
        <tr><td>14</td><td><code>supportIssues</code></td><td>Biomedical, facilities, and IT maintenance helpdesk tickets</td></tr>
        <tr><td>15</td><td><code>doctorLibrary</code></td><td>Evidence-based clinical guideline reference cards (BLS, ACLS, STEMI)</td></tr>
        <tr><td>16</td><td><code>ambulances</code></td><td>Emergency ambulance fleet vehicles, onboard equipment, and GPS status</td></tr>
        <tr><td>17</td><td><code>ambulanceRequests</code></td><td>Incoming emergency pickup calls and dispatch assignments</td></tr>
        <tr><td>18</td><td><code>doctorAppointments</code></td><td>Outpatient consultation bookings, symptom records, and clinical findings</td></tr>
    </tbody>
</table>

<h2 class="section-title">8. Demonstration Accounts &amp; Quick Access Credentials</h2>

<p>For academic testing and evaluation, the platform includes pre-configured demonstration accounts accessible via 1-click pills on the sign-in screen:</p>

<table>
    <thead>
        <tr>
            <th>Role</th>
            <th>Staff Name</th>
            <th>Staff Email / Identifier</th>
            <th>Demo Password</th>
            <th>Access Scope</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="badge badge-red">Superadmin</span></td>
            <td>Super Administrator</td>
            <td><code>admin@medcore.org</code></td>
            <td><code>Admin@123</code></td>
            <td>Universal Access &amp; Executive Command</td>
        </tr>
        <tr>
            <td><span class="badge badge-blue">Admin</span></td>
            <td>Sayan Chakraborty</td>
            <td><code>sayan.chakraborty@medcore.org</code></td>
            <td><code>sayan21</code></td>
            <td>Operations &amp; Staff Scheduling</td>
        </tr>
        <tr>
            <td><span class="badge badge-blue">Admin</span></td>
            <td>Chittajit Chakraborty</td>
            <td><code>chittajit.chakraborty@medcore.org</code></td>
            <td><code>tatai47</code></td>
            <td>Hospital Admin Operations</td>
        </tr>
        <tr>
            <td><span class="badge badge-blue">Doctor</span></td>
            <td>Dr. Arjun Rao</td>
            <td><code>doctor@medcore.org</code></td>
            <td><code>Doctor@123</code></td>
            <td>Consultations, Patients &amp; Prescriptions</td>
        </tr>
        <tr>
            <td><span class="badge badge-green">Nurse</span></td>
            <td>Kavya Patel</td>
            <td><code>nurse@medcore.org</code></td>
            <td><code>Nurse@123</code></td>
            <td>ER Triage, Vitals Telemetry &amp; Calls</td>
        </tr>
        <tr>
            <td><span class="badge badge-amber">Accountant</span></td>
            <td>Ananya Sen</td>
            <td><code>accountant@medcore.org</code></td>
            <td><code>Account@123</code></td>
            <td>Billing, Financials &amp; Payroll Disbursal</td>
        </tr>
        <tr>
            <td><span class="badge badge-purple">Pharmacist</span></td>
            <td>Maya Lin</td>
            <td><code>pharmacist@medcore.org</code></td>
            <td><code>Pharma@123</code></td>
            <td>Drug Dispensing, Stock &amp; Pharmacy Sales</td>
        </tr>
        <tr>
            <td><span class="badge badge-blue">Ward Staff</span></td>
            <td>Ravi Kumar</td>
            <td><code>ward@medcore.org</code></td>
            <td><code>Ward@123</code></td>
            <td>Bed Matrix &amp; Sanitation Oversight</td>
        </tr>
    </tbody>
</table>

</body>
</html>
"""

# Write HTML file
html_file = os.path.abspath("MedCore_AI_Project_Documentation.html")
pdf_file = os.path.abspath("MedCore_AI_Project_Documentation.pdf")

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated HTML source at: {html_file}")

# Compile HTML to PDF using Chrome Headless
chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_file}",
    html_file
]

print("Compiling PDF with Chrome headless...")
res = subprocess.run(cmd, capture_output=True, text=True)
if os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 0:
    print(f"SUCCESS: PDF created at: {pdf_file} (Size: {os.path.getsize(pdf_file)} bytes)")
else:
    print(f"FAILED to generate PDF. Exit code: {res.returncode}. Stderr: {res.stderr}")
