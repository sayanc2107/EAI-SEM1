import os
import json
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger("MedCore-Server")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'config.json')
SEED_FILE = os.path.join(BASE_DIR, 'seed_data.json')

app = Flask(__name__, static_folder=BASE_DIR)

# ── Global State ──
mongo_client = None
db = None
db_status = {
    "connected": False,
    "mode": "Hybrid In-Memory Fallback",
    "mongo_uri": "Not Connected",
    "database": "medcore_db",
    "collections": {},
    "last_checked": ""
}
memory_store = {}

# ── Helper to serialize MongoDB docs ──
def clean_mongo_doc(doc):
    if isinstance(doc, list):
        return [clean_mongo_doc(d) for d in doc]
    if isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if k == '_id':
                res['_id'] = str(v)
            elif isinstance(v, (dict, list)):
                res[k] = clean_mongo_doc(v)
            elif isinstance(v, datetime):
                res[k] = v.isoformat()
            else:
                res[k] = v
        return res
    if isinstance(doc, ObjectId):
        return str(doc)
    return doc

# ── Load Config ──
def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading config: {e}")
    return {"mongo_uri": "mongodb://localhost:27017/medcore_db", "db_name": "medcore_db", "port": 8080}

def save_config(cfg):
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(cfg, f, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error saving config: {e}")
        return False

# ── Load Seed Data ──
def load_seed_data():
    if os.path.exists(SEED_FILE):
        try:
            with open(SEED_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading seed file: {e}")
    return {}

# ── Initialize Database Connection ──
def init_db(uri=None, db_name="medcore_db"):
    global mongo_client, db, db_status, memory_store
    
    cfg = load_config()
    target_uri = os.environ.get('MONGO_URI') or uri or cfg.get('mongo_uri', 'mongodb://localhost:27017/medcore_db')
    target_db = os.environ.get('DB_NAME') or db_name or cfg.get('db_name', 'medcore_db')
    
    masked_uri = target_uri
    if '@' in target_uri:
        parts = target_uri.split('@')
        prefix = parts[0].split('//')[0] + '//***:***@'
        masked_uri = prefix + parts[1]

    logger.info(f"Connecting to MongoDB at: {masked_uri}")
    
    try:
        client = MongoClient(target_uri, serverSelectionTimeoutMS=8000)
        # Test connection
        client.admin.command('ping')
        
        mongo_client = client
        db = mongo_client[target_db]
        
        # Check and Auto-seed if collections empty
        seed = load_seed_data()
        collections_info = {}
        for coll_name, items in seed.items():
            count = db[coll_name].count_documents({})
            if count == 0 and len(items) > 0:
                logger.info(f"Seeding empty collection '{coll_name}' with {len(items)} default records...")
                db[coll_name].insert_many(items)
                count = len(items)
            collections_info[coll_name] = count
            
        db_status = {
            "connected": True,
            "mode": "MongoDB Live Cluster",
            "mongo_uri": masked_uri,
            "database": target_db,
            "collections": collections_info,
            "last_checked": datetime.now().isoformat()
        }
        logger.info(f"MongoDB connected successfully to '{target_db}'!")
        return True, "Connected to MongoDB successfully!"
        
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as err:
        logger.warning(f"Could not connect to MongoDB: {err}. Using in-memory store.")
        if not memory_store:
            memory_store = load_seed_data()
            
        counts = {k: len(v) if isinstance(v, list) else 1 for k, v in memory_store.items()}
        db_status = {
            "connected": False,
            "mode": "Hybrid In-Memory Fallback",
            "mongo_uri": masked_uri,
            "database": target_db,
            "collections": counts,
            "error": str(err),
            "message": "MongoDB not responding. Paste your MongoDB Atlas URI in config.json or via the Database Settings dialog.",
            "last_checked": datetime.now().isoformat()
        }
        return False, str(err)

# Initialize on startup
init_db()

# ── CORS Middleware ──
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

# ── STATIC FRONTEND ROUTES ──
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(BASE_DIR, path)

# =====================================================================
#  REST API ENDPOINTS
# =====================================================================

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify(db_status)

@app.route('/api/config/mongo-uri', methods=['POST'])
def update_mongo_uri():
    data = request.json or {}
    new_uri = data.get('mongo_uri', '').strip()
    db_name = data.get('db_name', 'medcore_db').strip() or 'medcore_db'
    
    if not new_uri:
        return jsonify({"success": False, "error": "Mongo URI cannot be empty"}), 400
        
    success, msg = init_db(uri=new_uri, db_name=db_name)
    if success:
        cfg = load_config()
        cfg['mongo_uri'] = new_uri
        cfg['db_name'] = db_name
        save_config(cfg)
        return jsonify({"success": True, "message": "MongoDB connected and saved!", "status": db_status})
    else:
        return jsonify({"success": False, "error": f"Failed to connect: {msg}", "status": db_status}), 400

# ── Bootstrap / Sync All Data ──
@app.route('/api/bootstrap', methods=['GET'])
def get_bootstrap_data():
    if db_status['connected'] and db is not None:
        data = {}
        for coll_name in ['users', 'doctors', 'nurses', 'wardStaff', 'shifts', 'attendanceLogs', 
                          'patients', 'beds', 'prescriptions', 'medicines', 'hospitalTransactions', 
                          'payroll', 'internalMails', 'supportIssues', 'doctorLibrary',
                          'ambulances', 'ambulanceRequests', 'doctorAppointments']:
            docs = list(db[coll_name].find())
            data[coll_name] = clean_mongo_doc(docs)
        return jsonify({"success": True, "source": "mongodb", "data": data})
    else:
        return jsonify({"success": True, "source": "memory", "data": memory_store})

# ── Authentication ──
@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.json or {}
    identifier = data.get('identifier', '').strip().lower()
    password = data.get('password', '')

    user = None
    if db_status['connected'] and db is not None:
        user = db.users.find_one({
            "$or": [
                {"email": {"$regex": f"^{identifier}$", "$options": "i"}},
                {"username": {"$regex": f"^{identifier}$", "$options": "i"}},
                {"employeeId": {"$regex": f"^{identifier}$", "$options": "i"}}
            ],
            "password": password
        })
        if user:
            user = clean_mongo_doc(user)
    else:
        for u in memory_store.get('users', []):
            if (u['email'].lower() == identifier or u.get('username','').lower() == identifier or u['employeeId'].lower() == identifier) and u['password'] == password:
                user = u
                break
                
    if user:
        return jsonify({"success": True, "user": user})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

# ── Staff Management (Admin Add Employee) ──
@app.route('/api/staff/new', methods=['POST'])
def add_new_staff():
    data = request.json or {}
    required = ['name', 'employeeId', 'role', 'department', 'email', 'password']
    if not all(k in data for k in required):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    new_user = {
        "name": data['name'],
        "employeeId": data['employeeId'],
        "role": data['role'],
        "department": data['department'],
        "email": data['email'],
        "username": data['email'].split('@')[0],
        "password": data['password'],
        "phone": data.get('phone', 'Ext. 100'),
        "title": f"{data['department']} {data['role'].capitalize()}",
        "status": "Active",
        "bankName": "Pending Setup",
        "accountNo": "Pending",
        "ifsc": "Pending",
        "pan": "Pending",
        "createdAt": datetime.now().isoformat()
    }

    # Generate initial payroll entry
    base = float(data.get('salary', 120000))
    hra = round(base * 0.20)
    allow = round(base * 0.10)
    ded = round(base * 0.12)
    net = base + hra + allow - ded

    new_payroll = {
        "id": f"PAY-{datetime.now().year}-{datetime.now().month}-{data['employeeId']}",
        "staffId": data['employeeId'],
        "name": data['name'],
        "role": data['role'].capitalize(),
        "department": data['department'],
        "month": datetime.now().strftime("%B %Y"),
        "baseSalary": base,
        "hra": hra,
        "allowances": allow,
        "specialPayment": 0,
        "specialPaymentReason": "—",
        "deductions": ded,
        "netSalary": net,
        "status": "Pending",
        "salaryConfigured": False,
        "paymentDate": "—",
        "bankName": "Pending Accountant Setup",
        "bankAccount": "Pending Accountant Setup",
        "accountNo": "Pending",
        "ifsc": "Pending",
        "taxPan": "Pending",
        "daysWorked": 26
    }

    if db_status['connected'] and db is not None:
        db.users.insert_one(new_user)
        db.payroll.insert_one(new_payroll)
        
        # Add to role specific collection
        if data['role'] == 'doctor':
            db.doctors.insert_one({"id": data['employeeId'], "name": data['name'], "specialization": data['department'], "department": data['department'], "room": "OPD-07", "onDuty": True, "shiftEnd": "16:00", "phone": data.get('phone', '')})
        elif data['role'] == 'nurse':
            db.nurses.insert_one({"id": data['employeeId'], "name": data['name'], "department": data['department'], "ward": f"{data['department']} Ward", "shift": "08:00 - 16:00", "onDuty": True, "phone": data.get('phone', '')})
        elif data['role'] == 'ward':
            db.wardStaff.insert_one({"id": data['employeeId'], "name": data['name'], "department": data['department'], "ward": f"{data['department']} Ward", "shift": "06:00 - 14:00", "onDuty": True, "phone": data.get('phone', '')})
    else:
        memory_store.setdefault('users', []).append(new_user)
        memory_store.setdefault('payroll', []).insert(0, new_payroll)

    return jsonify({"success": True, "message": "Employee registered successfully", "user": clean_mongo_doc(new_user), "payroll": clean_mongo_doc(new_payroll)})

# ── Payroll & Payment Details (Accountant & Admin) ──
@app.route('/api/payroll/payment-details', methods=['POST'])
def update_payment_details():
    data = request.json or {}
    staff_id = data.get('staffId')
    if not staff_id:
        return jsonify({"success": False, "error": "Missing staffId"}), 400

    bank_name = data.get('bankName', '')
    account_no = data.get('accountNo', '')
    ifsc = data.get('ifsc', '').upper()
    pan = data.get('pan', '').upper()
    base = float(data.get('baseSalary', 0))
    hra = float(data.get('hra', 0))
    allow = float(data.get('allowances', 0))
    ded = float(data.get('deductions', 0))
    net = base + hra + allow - ded

    update_doc = {
        "bankName": bank_name,
        "accountNo": account_no,
        "bankAccount": f"{bank_name} (•••• {account_no[-4:] if len(account_no) >= 4 else account_no})",
        "ifsc": ifsc,
        "taxPan": pan,
        "baseSalary": base,
        "hra": hra,
        "allowances": hra + allow,
        "deductions": ded,
        "netSalary": net,
        "salaryConfigured": True
    }

    if db_status['connected'] and db is not None:
        db.payroll.update_many({"staffId": staff_id}, {"$set": update_doc})
        db.users.update_one({"employeeId": staff_id}, {"$set": {"bankName": bank_name, "accountNo": account_no, "ifsc": ifsc, "pan": pan}})
    else:
        for p in memory_store.get('payroll', []):
            if p['staffId'] == staff_id:
                p.update(update_doc)

    return jsonify({"success": True, "message": "Payment details updated successfully!"})

# ── Salary Disbursal ──
@app.route('/api/payroll/disburse', methods=['POST'])
def disburse_salary():
    data = request.json or {}
    payroll_id = data.get('payrollId')
    mode = data.get('mode', 'NEFT')
    final_net = float(data.get('netSalary', 0))
    cashier = data.get('cashier', 'Accountant')

    txn = {
        "id": f"TXN-SAL-{int(datetime.now().timestamp())}",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "department": "Staff Salary",
        "service": f"Monthly Salary Disbursal ({data.get('month', '')}) via {mode}",
        "icuAmount": 0,
        "pharmacyAmount": 0,
        "opdAmount": 0,
        "erAmount": 0,
        "salaryAmount": final_net,
        "surgeryAmount": 0,
        "totalAmount": final_net,
        "paymentMode": f"Electronic {mode}",
        "cashier": cashier,
        "status": "Completed"
    }

    if db_status['connected'] and db is not None:
        db.payroll.update_one(
            {"id": payroll_id}, 
            {"$set": {"status": "Paid", "paymentDate": datetime.now().strftime("%Y-%m-%d"), "netSalary": final_net}}
        )
        db.hospitalTransactions.insert_one(txn)
    else:
        for p in memory_store.get('payroll', []):
            if p['id'] == payroll_id:
                p['status'] = 'Paid'
                p['paymentDate'] = datetime.now().strftime("%Y-%m-%d")
                p['netSalary'] = final_net
        memory_store.setdefault('hospitalTransactions', []).insert(0, txn)

    return jsonify({"success": True, "message": f"Salary disbursed via {mode}", "transaction": clean_mongo_doc(txn)})

# ── Special Payments & Procurement Disbursal ──
@app.route('/api/payroll/special-payment', methods=['POST'])
def special_payment():
    data = request.json or {}
    amount = float(data.get('amount', 0))
    payee = data.get('payeeName', '')
    account_no = data.get('accountNo', '')
    ifsc = data.get('ifsc', '')
    mode = data.get('mode', 'NEFT')
    category = data.get('category', 'Special Payment')
    approved_by = data.get('approvedBy', 'Hospital Administrator')
    remarks = data.get('remarks', '')

    txn = {
        "id": f"TXN-SPEC-{int(datetime.now().timestamp())}",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "department": category,
        "service": f"[{mode} Disbursal] Payee: {payee} (A/C: {account_no}, IFSC: {ifsc}) — {remarks} [Auth: {approved_by}]",
        "icuAmount": amount if "Equipment" in category else 0,
        "pharmacyAmount": amount if "Pharmacy" in category else 0,
        "opdAmount": 0,
        "erAmount": amount if "Operational" in category else 0,
        "salaryAmount": amount if "Award" in category or "Bonus" in category else 0,
        "surgeryAmount": 0,
        "totalAmount": amount,
        "paymentMode": f"Electronic {mode}",
        "cashier": approved_by,
        "status": "Completed"
    }

    if db_status['connected'] and db is not None:
        db.hospitalTransactions.insert_one(txn)
        # Update staff special payment if payee is staff
        db.payroll.update_one({"name": {"$regex": f"^{payee}$", "$options": "i"}}, {"$inc": {"specialPayment": amount, "netSalary": amount}})
    else:
        memory_store.setdefault('hospitalTransactions', []).insert(0, txn)
        for p in memory_store.get('payroll', []):
            if p['name'].lower() == payee.lower():
                p['specialPayment'] = (p.get('specialPayment', 0) + amount)
                p['netSalary'] = (p.get('netSalary', 0) + amount)

    return jsonify({"success": True, "message": f"Special payment of ₹{amount} disbursed via {mode}!", "transaction": clean_mongo_doc(txn)})

# ── Pharmacy Restock ──
@app.route('/api/medicines/restock', methods=['POST'])
def restock_medicine():
    data = request.json or {}
    med_id = data.get('id')
    add_qty = int(data.get('quantity', 50))

    if db_status['connected'] and db is not None:
        res = db.medicines.find_one_and_update({"id": med_id}, {"$inc": {"quantity": add_qty}}, return_document=True)
        return jsonify({"success": True, "medicine": clean_mongo_doc(res)})
    else:
        for m in memory_store.get('medicines', []):
            if m['id'] == med_id:
                m['quantity'] += add_qty
                return jsonify({"success": True, "medicine": m})
    return jsonify({"success": False, "error": "Medicine not found"}), 404

# ── Pharmacy Bulk Restock (Excel Import) ──
@app.route('/api/medicines/batch', methods=['POST'])
def batch_medicines():
    items = request.json or []
    count = 0
    if db_status['connected'] and db is not None:
        for it in items:
            name = it.get('name')
            qty = int(it.get('quantity', 0))
            if name and qty > 0:
                db.medicines.update_one(
                    {"name": {"$regex": f"^{name}$", "$options": "i"}},
                    {"$inc": {"quantity": qty}},
                    upsert=True
                )
                count += 1
    else:
        count = len(items)
    return jsonify({"success": True, "updatedCount": count})

# ── Pharmacy Billing & Dispensing ──
@app.route('/api/pharmacy/bill', methods=['POST'])
def pharmacy_bill():
    data = request.json or {}
    total = float(data.get('totalAmount', 0))
    patient_name = data.get('patientName', 'Walk-in Customer')
    items = data.get('items', [])
    mode = data.get('paymentMode', 'Cash')

    txn = {
        "id": f"TXN-RX-{int(datetime.now().timestamp())}",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "department": "Pharmacy",
        "service": f"Dispensed Rx: {', '.join([i.get('name','') for i in items])} for {patient_name}",
        "icuAmount": 0,
        "pharmacyAmount": total,
        "opdAmount": 0,
        "erAmount": 0,
        "salaryAmount": 0,
        "surgeryAmount": 0,
        "totalAmount": total,
        "paymentMode": mode,
        "cashier": data.get('cashier', 'Pharmacist'),
        "status": "Completed"
    }

    if db_status['connected'] and db is not None:
        db.hospitalTransactions.insert_one(txn)
        # Deduct quantities
        for it in items:
            med_id = it.get('id')
            qty = int(it.get('qty', 1))
            db.medicines.update_one({"id": med_id}, {"$inc": {"quantity": -qty}})
    else:
        memory_store.setdefault('hospitalTransactions', []).insert(0, txn)
        for it in items:
            med_id = it.get('id')
            qty = int(it.get('qty', 1))
            for m in memory_store.get('medicines', []):
                if m['id'] == med_id:
                    m['quantity'] = max(0, m['quantity'] - qty)

    return jsonify({"success": True, "transaction": clean_mongo_doc(txn)})

# ── Internal Mail Send ──
@app.route('/api/mail/send', methods=['POST'])
def send_mail():
    data = request.json or {}
    new_mail = {
        "id": f"MAIL-{int(datetime.now().timestamp())}",
        "fromName": data.get('fromName', 'Hospital Staff'),
        "fromEmail": data.get('fromEmail', 'staff@medcore.org'),
        "toName": data.get('toName', 'Staff'),
        "toEmail": data.get('toEmail', 'staff@medcore.org'),
        "cc": data.get('cc', []),
        "bcc": data.get('bcc', []),
        "subject": data.get('subject', 'No Subject'),
        "body": data.get('body', ''),
        "priority": data.get('priority', 'Normal'),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "read": False
    }

    if db_status['connected'] and db is not None:
        db.internalMails.insert_one(new_mail)
    else:
        memory_store.setdefault('internalMails', []).insert(0, new_mail)

    return jsonify({"success": True, "mail": clean_mongo_doc(new_mail)})

# ── Support Issues / Helpdesk ──
@app.route('/api/issues/create', methods=['POST'])
def create_issue():
    data = request.json or {}
    new_issue = {
        "id": f"ISSUE-{int(datetime.now().timestamp())}",
        "raisedByName": data.get('raisedByName', 'Staff Member'),
        "raisedByRole": data.get('raisedByRole', 'Clinical Staff'),
        "category": data.get('category', 'Biomedical Equipment'),
        "priority": data.get('priority', 'Moderate'),
        "subject": data.get('subject', ''),
        "description": data.get('description', ''),
        "status": "Open",
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "resolutionNotes": "Logged in queue. Pending Admin assignment."
    }

    if db_status['connected'] and db is not None:
        db.supportIssues.insert_one(new_issue)
    else:
        memory_store.setdefault('supportIssues', []).insert(0, new_issue)

    return jsonify({"success": True, "issue": clean_mongo_doc(new_issue)})

# ── Patients Management (Admit, Discharge & Vitals) ──
@app.route('/api/patients/admit', methods=['POST'])
def admit_patient():
    p = request.json or {}
    if db_status['connected'] and db is not None:
        db.patients.insert_one(p)
        if p.get('bed'):
            db.beds.update_one({"id": p['bed']}, {"$set": {"status": "Occupied", "patientId": p.get('id'), "patientName": p.get('name')}})
    else:
        memory_store.setdefault('patients', []).insert(0, p)
    return jsonify({"success": True, "patient": clean_mongo_doc(p)})

@app.route('/api/patients/discharge', methods=['POST'])
def discharge_patient():
    data = request.json or {}
    patient_id = data.get('id')
    if db_status['connected'] and db is not None:
        db.patients.update_one({"id": patient_id}, {"$set": {"status": "Discharged", "dischargedAt": datetime.now().isoformat()}})
    else:
        for p in memory_store.get('patients', []):
            if p.get('id') == patient_id:
                p['status'] = 'Discharged'
    return jsonify({"success": True})

@app.route('/api/patients/vitals', methods=['POST'])
def log_patient_vitals():
    data = request.json or {}
    patient_id = data.get('patientId')
    vitals_entry = data.get('vitals', {})
    if db_status['connected'] and db is not None:
        db.patients.update_one({"id": patient_id}, {"$push": {"vitalsHistory": vitals_entry}})
    else:
        for p in memory_store.get('patients', []):
            if p.get('id') == patient_id:
                p.setdefault('vitalsHistory', []).append(vitals_entry)
    return jsonify({"success": True})

# ── Duty Shift Assignment ──
@app.route('/api/shifts/assign', methods=['POST'])
def assign_shift():
    sh = request.json or {}
    if db_status['connected'] and db is not None:
        db.shifts.insert_one(sh)
    else:
        memory_store.setdefault('shifts', []).insert(0, sh)
    return jsonify({"success": True, "shift": clean_mongo_doc(sh)})

# ── Prescriptions ──
@app.route('/api/prescriptions/new', methods=['POST'])
def create_prescription():
    rx = request.json or {}
    if db_status['connected'] and db is not None:
        db.prescriptions.insert_one(rx)
    else:
        memory_store.setdefault('prescriptions', []).insert(0, rx)
    return jsonify({"success": True, "prescription": clean_mongo_doc(rx)})

# ── Attendance Punch ──
@app.route('/api/attendance/punch', methods=['POST'])
def punch_attendance():
    att = request.json or {}
    if db_status['connected'] and db is not None:
        db.attendanceLogs.insert_one(att)
    else:
        memory_store.setdefault('attendanceLogs', []).insert(0, att)
    return jsonify({"success": True, "attendance": clean_mongo_doc(att)})

# ── Ambulance Management & Dispatch ──
@app.route('/api/ambulance/request', methods=['POST'])
def create_ambulance_request():
    req_data = request.json or {}
    if db_status['connected'] and db is not None:
        db.ambulanceRequests.insert_one(req_data)
    else:
        memory_store.setdefault('ambulanceRequests', []).insert(0, req_data)
    return jsonify({"success": True, "request": clean_mongo_doc(req_data)})

@app.route('/api/ambulance/dispatch', methods=['POST'])
def dispatch_ambulance():
    data = request.json or {}
    req_id = data.get('requestId')
    amb_id = data.get('ambulanceId')
    status = data.get('status', 'En Route to Patient')
    current_location = data.get('currentLocation')
    destination = data.get('destination')
    eta = data.get('eta', '10 mins')

    if db_status['connected'] and db is not None:
        amb_update = {"$set": {"status": status, "assignedRequestId": req_id, "eta": eta}}
        if current_location:
            amb_update["$set"]["currentLocation"] = current_location
        if destination:
            amb_update["$set"]["destination"] = destination
        db.ambulances.update_one({"id": amb_id}, amb_update)
        db.ambulanceRequests.update_one({"id": req_id}, {"$set": {"status": "Dispatched", "assignedAmbulanceId": amb_id}})
    else:
        for a in memory_store.get('ambulances', []):
            if a.get('id') == amb_id:
                a['status'] = status
                a['assignedRequestId'] = req_id
                a['eta'] = eta
                if destination: a['destination'] = destination
                break
        for r in memory_store.get('ambulanceRequests', []):
            if r.get('id') == req_id:
                r['status'] = 'Dispatched'
                r['assignedAmbulanceId'] = amb_id
                break

    return jsonify({"success": True, "message": f"Ambulance {amb_id} dispatched to request {req_id}"})

@app.route('/api/ambulance/status', methods=['POST'])
def update_ambulance_status():
    data = request.json or {}
    amb_id = data.get('ambulanceId')
    status = data.get('status')
    location = data.get('currentLocation')
    destination = data.get('destination')
    eta = data.get('eta')

    if db_status['connected'] and db is not None:
        up = {"status": status}
        if location: up["currentLocation"] = location
        if destination: up["destination"] = destination
        if eta: up["eta"] = eta
        if status == 'Available':
            up["assignedRequestId"] = None
        db.ambulances.update_one({"id": amb_id}, {"$set": up})
    else:
        for a in memory_store.get('ambulances', []):
            if a.get('id') == amb_id:
                if status: a['status'] = status
                if location: a['currentLocation'] = location
                if destination: a['destination'] = destination
                if eta: a['eta'] = eta
                if status == 'Available': a['assignedRequestId'] = None
                break

    return jsonify({"success": True, "message": f"Ambulance {amb_id} status updated to {status}"})

# ── Doctor Appointments ──
@app.route('/api/appointments/create', methods=['POST'])
def create_appointment():
    apt = request.json or {}
    if db_status['connected'] and db is not None:
        db.doctorAppointments.insert_one(apt)
    else:
        memory_store.setdefault('doctorAppointments', []).insert(0, apt)
    return jsonify({"success": True, "appointment": clean_mongo_doc(apt)})

@app.route('/api/appointments/update', methods=['POST'])
def update_appointment():
    apt = request.json or {}
    apt_id = apt.get('id')
    if not apt_id:
        return jsonify({"success": False, "error": "Missing appointment id"}), 400

    if db_status['connected'] and db is not None:
        clean = {k: v for k, v in apt.items() if k != '_id'}
        db.doctorAppointments.update_one({"id": apt_id}, {"$set": clean}, upsert=True)
    else:
        store = memory_store.setdefault('doctorAppointments', [])
        idx = next((i for i, item in enumerate(store) if item.get('id') == apt_id), -1)
        if idx >= 0:
            store[idx].update(apt)
        else:
            store.insert(0, apt)

    return jsonify({"success": True, "appointment": clean_mongo_doc(apt)})

@app.route('/api/appointments/delete', methods=['POST'])
def delete_appointment():
    data = request.json or {}
    apt_id = data.get('id')
    if not apt_id:
        return jsonify({"success": False, "error": "Missing appointment id"}), 400

    if db_status['connected'] and db is not None:
        db.doctorAppointments.delete_one({"id": apt_id})
    else:
        store = memory_store.get('doctorAppointments', [])
        memory_store['doctorAppointments'] = [a for a in store if a.get('id') != apt_id]

    return jsonify({"success": True, "message": f"Appointment {apt_id} deleted successfully"})

if __name__ == '__main__':
    cfg = load_config()
    port = int(os.environ.get('PORT', cfg.get('port', 8080)))
    logger.info(f"Starting MedCore AI Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
