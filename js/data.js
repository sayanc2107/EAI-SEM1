/* ===================================================================
   MedCore AI — Data Store
   All data is fictional / demo. Not for real patient care.
   =================================================================== */

const SampleData = {

    // ── USERS (login credentials) ──
    users: [
        { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin', employeeId: 'ADM-01' },
        { username: 'dr.sharma', password: 'doc123', role: 'doctor', name: 'Dr. Ananya Sharma', employeeId: 'D-01' },
        { username: 'dr.patel', password: 'doc123', role: 'doctor', name: 'Dr. Rahul Patel', employeeId: 'D-02' },
        { username: 'dr.nair', password: 'doc123', role: 'doctor', name: 'Dr. Priya Nair', employeeId: 'D-03' },
        { username: 'dr.singh', password: 'doc123', role: 'doctor', name: 'Dr. Vikram Singh', employeeId: 'D-04' },
        { username: 'dr.joshi', password: 'doc123', role: 'doctor', name: 'Dr. Meera Joshi', employeeId: 'D-05' },
        { username: 'nurse.priya', password: 'nurse123', role: 'nurse', name: 'Nurse Priya Das', employeeId: 'N-01' },
        { username: 'nurse.meena', password: 'nurse123', role: 'nurse', name: 'Nurse Meena Kumari', employeeId: 'N-02' },
        { username: 'ward.raj', password: 'ward123', role: 'ward', name: 'Raj Kumar', employeeId: 'W-01' },
        { username: 'ward.sita', password: 'ward123', role: 'ward', name: 'Sita Devi', employeeId: 'W-02' },
        { username: 'pharm.kumar', password: 'pharm123', role: 'pharmacy', name: 'Suresh Kumar', employeeId: 'PH-01' },
        { username: 'pharm.anita', password: 'pharm123', role: 'pharmacy', name: 'Anita Verma', employeeId: 'PH-02' },
    ],

    // ── DOCTORS ──
    doctors: [
        { id: 'D-01', name: 'Dr. Ananya Sharma', specialization: 'Emergency Medicine' },
        { id: 'D-02', name: 'Dr. Rahul Patel', specialization: 'Cardiology' },
        { id: 'D-03', name: 'Dr. Priya Nair', specialization: 'Paediatrics' },
        { id: 'D-04', name: 'Dr. Vikram Singh', specialization: 'General Surgery' },
        { id: 'D-05', name: 'Dr. Meera Joshi', specialization: 'Internal Medicine' },
        { id: 'D-06', name: 'Dr. Arjun Reddy', specialization: 'Orthopaedics' },
        { id: 'D-07', name: 'Dr. Kavitha Menon', specialization: 'Obstetrics & Gynaecology' },
    ],

    // ── DOCTOR SHIFTS ──
    shifts: [
        { doctorId: 'D-01', date: '2026-11-20', start: '06:00', end: '14:00', ward: 'Emergency', location: 'Emergency Bay 1' },
        { doctorId: 'D-02', date: '2026-11-20', start: '08:00', end: '16:00', ward: 'ICU', location: 'ICU Room 3' },
        { doctorId: 'D-03', date: '2026-11-20', start: '09:00', end: '17:00', ward: 'Pediatrics', location: 'Peds Ward A' },
        { doctorId: 'D-04', date: '2026-11-20', start: '14:00', end: '22:00', ward: 'General', location: 'OPD Room 2' },
        { doctorId: 'D-05', date: '2026-11-20', start: '07:00', end: '15:00', ward: 'General', location: 'OPD Room 5' },
        { doctorId: 'D-01', date: '2026-11-20', start: '15:00', end: '23:00', ward: 'Emergency', location: 'Emergency Bay 2' },
        { doctorId: 'D-06', date: '2026-11-21', start: '08:00', end: '16:00', ward: 'General', location: 'OT-1' },
        { doctorId: 'D-07', date: '2026-11-21', start: '06:00', end: '14:00', ward: 'Maternity', location: 'Delivery Room 1' },
        { doctorId: 'D-02', date: '2026-11-21', start: '14:00', end: '22:00', ward: 'ICU', location: 'ICU Room 1' },
        { doctorId: 'D-03', date: '2026-11-21', start: '08:00', end: '14:00', ward: 'Pediatrics', location: 'Peds Ward B' },
        { doctorId: 'D-01', date: '2026-11-21', start: '06:00', end: '14:00', ward: 'Emergency', location: 'Emergency Bay 1' },
    ],

    // ── NURSE SHIFTS ──
    nurseShifts: [
        { nurseId: 'N-01', date: '2026-11-20', start: '06:00', end: '14:00', ward: 'Emergency' },
        { nurseId: 'N-02', date: '2026-11-20', start: '14:00', end: '22:00', ward: 'ICU' },
        { nurseId: 'N-01', date: '2026-11-21', start: '06:00', end: '14:00', ward: 'Emergency' },
        { nurseId: 'N-02', date: '2026-11-21', start: '08:00', end: '16:00', ward: 'General' },
    ],

    // ── WARD STAFF SHIFTS ──
    wardStaffShifts: [
        { staffId: 'W-01', date: '2026-11-20', start: '06:00', end: '14:00', ward: 'Emergency' },
        { staffId: 'W-02', date: '2026-11-20', start: '14:00', end: '22:00', ward: 'General' },
        { staffId: 'W-01', date: '2026-11-21', start: '06:00', end: '14:00', ward: 'ICU' },
        { staffId: 'W-02', date: '2026-11-21', start: '08:00', end: '16:00', ward: 'Pediatrics' },
    ],

    // ── PATIENTS (admitted / triage) ──
    patients: [
        { id: 'P-1001', name: 'Amit Verma', age: 58, gender: 'M', concern: 'Chest pain radiating to left arm', symptoms: ['Chest pain', 'Shortness of breath', 'Dizziness'], ward: 'Emergency', bed: 'EM-01', doctorId: 'D-01', nurseId: 'N-01', status: 'admitted', priority: 'Critical', admittedAt: '2026-11-20T09:15:00', notes: 'History of hypertension. Monitor BP every 30 min.' },
        { id: 'P-1002', name: 'Sneha Gupta', age: 24, gender: 'F', concern: 'Severe allergic reaction — facial swelling', symptoms: ['Allergic reaction', 'Shortness of breath'], ward: 'Emergency', bed: 'EM-02', doctorId: 'D-01', nurseId: 'N-01', status: 'admitted', priority: 'Critical', admittedAt: '2026-11-20T09:45:00', notes: 'Shellfish allergy. Epi-pen administered.' },
        { id: 'P-1003', name: 'Ravi Shankar', age: 42, gender: 'M', concern: 'Fall from ladder — suspected forearm fracture', symptoms: ['Fracture / trauma'], ward: 'General', bed: 'GN-04', doctorId: 'D-04', nurseId: null, status: 'admitted', priority: 'Medium', admittedAt: '2026-11-20T10:30:00', notes: 'Visible deformity of right forearm. Awaiting X-ray.' },
        { id: 'P-1004', name: 'Arjun Mehra', age: 8, gender: 'M', concern: 'High fever and persistent vomiting', symptoms: ['High fever', 'Nausea / vomiting', 'Abdominal pain'], ward: 'Pediatrics', bed: 'PD-02', doctorId: 'D-03', nurseId: null, status: 'admitted', priority: 'High', admittedAt: '2026-11-20T11:00:00', notes: 'Fever of 39.5°C for 2 days. Unable to keep fluids down.' },
        { id: 'P-1005', name: 'Kamala Devi', age: 76, gender: 'F', concern: 'Sudden confusion and weakness on right side', symptoms: ['Dizziness', 'Loss of consciousness'], ward: 'ICU', bed: 'IC-01', doctorId: 'D-02', nurseId: 'N-02', status: 'admitted', priority: 'Critical', admittedAt: '2026-11-20T11:20:00', notes: 'Slurred speech. Suspected CVA. CT ordered.' },
        { id: 'P-1006', name: 'Farid Khan', age: 29, gender: 'M', concern: 'Minor laceration on hand', symptoms: ['Severe bleeding'], ward: 'General', bed: 'GN-01', doctorId: 'D-05', nurseId: null, status: 'admitted', priority: 'Low', admittedAt: '2026-11-20T12:05:00', notes: 'Superficial cut, bleeding controlled.' },
        { id: 'P-1007', name: 'Lakshmi Iyer', age: 65, gender: 'F', concern: 'Chest tightness, shortness of breath on exertion', symptoms: ['Chest pain', 'Shortness of breath'], ward: 'ICU', bed: 'IC-03', doctorId: 'D-02', nurseId: 'N-02', status: 'admitted', priority: 'High', admittedAt: '2026-11-20T08:30:00', notes: 'Known cardiac history. Scheduled for echo.' },
    ],

    // ── BEDS ──
    beds: [
        { id: 'EM-01', ward: 'Emergency', status: 'occupied', patient: 'P-1001' },
        { id: 'EM-02', ward: 'Emergency', status: 'occupied', patient: 'P-1002' },
        { id: 'EM-03', ward: 'Emergency', status: 'available', patient: null },
        { id: 'EM-04', ward: 'Emergency', status: 'available', patient: null },
        { id: 'GN-01', ward: 'General', status: 'occupied', patient: 'P-1006' },
        { id: 'GN-02', ward: 'General', status: 'available', patient: null },
        { id: 'GN-03', ward: 'General', status: 'available', patient: null },
        { id: 'GN-04', ward: 'General', status: 'occupied', patient: 'P-1003' },
        { id: 'GN-05', ward: 'General', status: 'available', patient: null },
        { id: 'IC-01', ward: 'ICU', status: 'occupied', patient: 'P-1005' },
        { id: 'IC-02', ward: 'ICU', status: 'available', patient: null },
        { id: 'IC-03', ward: 'ICU', status: 'occupied', patient: 'P-1007' },
        { id: 'IC-04', ward: 'ICU', status: 'available', patient: null },
        { id: 'PD-01', ward: 'Pediatrics', status: 'available', patient: null },
        { id: 'PD-02', ward: 'Pediatrics', status: 'occupied', patient: 'P-1004' },
        { id: 'PD-03', ward: 'Pediatrics', status: 'available', patient: null },
        { id: 'MT-01', ward: 'Maternity', status: 'available', patient: null },
        { id: 'MT-02', ward: 'Maternity', status: 'available', patient: null },
        { id: 'MT-03', ward: 'Maternity', status: 'available', patient: null },
        { id: 'MT-04', ward: 'Maternity', status: 'available', patient: null },
    ],

    // ── MEDICINES ──
    medicines: [
        { id: 'M-01', name: 'Paracetamol 500mg', category: 'Analgesic', quantity: 450, threshold: 100, unitPrice: 5 },
        { id: 'M-02', name: 'Amoxicillin 250mg', category: 'Antibiotic', quantity: 80, threshold: 100, unitPrice: 18 },
        { id: 'M-03', name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', quantity: 320, threshold: 80, unitPrice: 8 },
        { id: 'M-04', name: 'Omeprazole 20mg', category: 'Antacid', quantity: 55, threshold: 60, unitPrice: 12 },
        { id: 'M-05', name: 'Metformin 500mg', category: 'Antidiabetic', quantity: 200, threshold: 80, unitPrice: 10 },
        { id: 'M-06', name: 'Amlodipine 5mg', category: 'Antihypertensive', quantity: 30, threshold: 50, unitPrice: 15 },
        { id: 'M-07', name: 'Salbutamol Inhaler', category: 'Bronchodilator', quantity: 25, threshold: 30, unitPrice: 120 },
        { id: 'M-08', name: 'Insulin Glargine', category: 'Antidiabetic', quantity: 40, threshold: 20, unitPrice: 350 },
        { id: 'M-09', name: 'Diazepam 5mg', category: 'Anxiolytic', quantity: 15, threshold: 20, unitPrice: 22 },
        { id: 'M-10', name: 'Morphine 10mg', category: 'Opioid Analgesic', quantity: 12, threshold: 15, unitPrice: 85 },
        { id: 'M-11', name: 'Epinephrine 1mg/mL', category: 'Emergency', quantity: 50, threshold: 25, unitPrice: 45 },
        { id: 'M-12', name: 'Ciprofloxacin 500mg', category: 'Antibiotic', quantity: 110, threshold: 60, unitPrice: 25 },
        { id: 'M-13', name: 'Atorvastatin 20mg', category: 'Statin', quantity: 180, threshold: 70, unitPrice: 14 },
        { id: 'M-14', name: 'Aspirin 75mg', category: 'Antiplatelet', quantity: 400, threshold: 100, unitPrice: 3 },
        { id: 'M-15', name: 'Cetirizine 10mg', category: 'Antihistamine', quantity: 90, threshold: 50, unitPrice: 6 },
    ],

    // ── PRESCRIPTION REQUESTS (doctor → pharmacy) ──
    prescriptions: [
        { id: 'RX-001', doctorId: 'D-01', doctorName: 'Dr. Ananya Sharma', patientId: 'P-1001', patientName: 'Amit Verma', items: [{ medicineId: 'M-14', name: 'Aspirin 75mg', qty: 30 }, { medicineId: 'M-06', name: 'Amlodipine 5mg', qty: 30 }], status: 'pending', timestamp: '2026-11-20T09:30:00', notes: 'Daily dose. 30-day supply.' },
        { id: 'RX-002', doctorId: 'D-02', doctorName: 'Dr. Rahul Patel', patientId: 'P-1005', patientName: 'Kamala Devi', items: [{ medicineId: 'M-13', name: 'Atorvastatin 20mg', qty: 30 }, { medicineId: 'M-14', name: 'Aspirin 75mg', qty: 30 }], status: 'ready', timestamp: '2026-11-20T11:45:00', notes: 'Post-stroke prevention.' },
        { id: 'RX-003', doctorId: 'D-03', doctorName: 'Dr. Priya Nair', patientId: 'P-1004', patientName: 'Arjun Mehra', items: [{ medicineId: 'M-01', name: 'Paracetamol 500mg', qty: 10 }, { medicineId: 'M-04', name: 'Omeprazole 20mg', qty: 5 }], status: 'dispensed', timestamp: '2026-11-20T11:15:00', notes: 'Paediatric dosage — verify weight-based dose.' },
    ],

    // ── SALES RECORDS ──
    sales: [
        { id: 'S-001', billId: 'B-001', medicineId: 'M-01', medicineName: 'Paracetamol 500mg', qty: 20, unitPrice: 5, total: 100, date: '2026-11-18' },
        { id: 'S-002', billId: 'B-001', medicineId: 'M-03', medicineName: 'Ibuprofen 400mg', qty: 10, unitPrice: 8, total: 80, date: '2026-11-18' },
        { id: 'S-003', billId: 'B-002', medicineId: 'M-02', medicineName: 'Amoxicillin 250mg', qty: 15, unitPrice: 18, total: 270, date: '2026-11-18' },
        { id: 'S-004', billId: 'B-003', medicineId: 'M-01', medicineName: 'Paracetamol 500mg', qty: 30, unitPrice: 5, total: 150, date: '2026-11-19' },
        { id: 'S-005', billId: 'B-003', medicineId: 'M-15', medicineName: 'Cetirizine 10mg', qty: 10, unitPrice: 6, total: 60, date: '2026-11-19' },
        { id: 'S-006', billId: 'B-004', medicineId: 'M-05', medicineName: 'Metformin 500mg', qty: 60, unitPrice: 10, total: 600, date: '2026-11-19' },
        { id: 'S-007', billId: 'B-004', medicineId: 'M-13', medicineName: 'Atorvastatin 20mg', qty: 30, unitPrice: 14, total: 420, date: '2026-11-19' },
        { id: 'S-008', billId: 'B-005', medicineId: 'M-14', medicineName: 'Aspirin 75mg', qty: 60, unitPrice: 3, total: 180, date: '2026-11-20' },
        { id: 'S-009', billId: 'B-005', medicineId: 'M-06', medicineName: 'Amlodipine 5mg', qty: 30, unitPrice: 15, total: 450, date: '2026-11-20' },
        { id: 'S-010', billId: 'B-006', medicineId: 'M-01', medicineName: 'Paracetamol 500mg', qty: 50, unitPrice: 5, total: 250, date: '2026-11-20' },
        { id: 'S-011', billId: 'B-006', medicineId: 'M-12', medicineName: 'Ciprofloxacin 500mg', qty: 14, unitPrice: 25, total: 350, date: '2026-11-20' },
        { id: 'S-012', billId: 'B-007', medicineId: 'M-07', medicineName: 'Salbutamol Inhaler', qty: 2, unitPrice: 120, total: 240, date: '2026-11-20' },
    ],

    // ── BILLS ──
    bills: [
        { id: 'B-001', patientId: 'P-1003', patientName: 'Ravi Shankar', items: [{ name: 'Paracetamol 500mg', qty: 20, price: 5 }, { name: 'Ibuprofen 400mg', qty: 10, price: 8 }], total: 180, date: '2026-11-18', status: 'paid' },
        { id: 'B-002', patientId: 'P-1006', patientName: 'Farid Khan', items: [{ name: 'Amoxicillin 250mg', qty: 15, price: 18 }], total: 270, date: '2026-11-18', status: 'paid' },
        { id: 'B-003', patientId: 'P-1004', patientName: 'Arjun Mehra', items: [{ name: 'Paracetamol 500mg', qty: 30, price: 5 }, { name: 'Cetirizine 10mg', qty: 10, price: 6 }], total: 210, date: '2026-11-19', status: 'paid' },
        { id: 'B-004', patientId: 'P-1007', patientName: 'Lakshmi Iyer', items: [{ name: 'Metformin 500mg', qty: 60, price: 10 }, { name: 'Atorvastatin 20mg', qty: 30, price: 14 }], total: 1020, date: '2026-11-19', status: 'paid' },
        { id: 'B-005', patientId: 'P-1001', patientName: 'Amit Verma', items: [{ name: 'Aspirin 75mg', qty: 60, price: 3 }, { name: 'Amlodipine 5mg', qty: 30, price: 15 }], total: 630, date: '2026-11-20', status: 'unpaid' },
        { id: 'B-006', patientId: 'P-1005', patientName: 'Kamala Devi', items: [{ name: 'Paracetamol 500mg', qty: 50, price: 5 }, { name: 'Ciprofloxacin 500mg', qty: 14, price: 25 }], total: 600, date: '2026-11-20', status: 'paid' },
        { id: 'B-007', patientId: 'P-1002', patientName: 'Sneha Gupta', items: [{ name: 'Salbutamol Inhaler', qty: 2, price: 120 }], total: 240, date: '2026-11-20', status: 'unpaid' },
    ],

    // ── NURSE TASK SCHEDULE (for AI prediction) ──
    nurseTasks: [
        { nurseId: 'N-01', patientId: 'P-1001', task: 'Check BP & vitals', scheduledAt: '2026-11-20T10:00:00', status: 'done' },
        { nurseId: 'N-01', patientId: 'P-1002', task: 'Administer antihistamine IV', scheduledAt: '2026-11-20T10:30:00', status: 'done' },
        { nurseId: 'N-01', patientId: 'P-1001', task: 'Check BP & vitals', scheduledAt: '2026-11-20T10:30:00', status: 'done' },
        { nurseId: 'N-01', patientId: 'P-1001', task: 'Check BP & vitals', scheduledAt: '2026-11-20T11:00:00', status: 'pending' },
        { nurseId: 'N-01', patientId: 'P-1002', task: 'Monitor swelling & breathing', scheduledAt: '2026-11-20T11:15:00', status: 'pending' },
        { nurseId: 'N-01', patientId: 'P-1001', task: 'Administer medication (Aspirin 75mg)', scheduledAt: '2026-11-20T12:00:00', status: 'pending' },
        { nurseId: 'N-01', patientId: 'P-1002', task: 'Follow-up assessment', scheduledAt: '2026-11-20T13:00:00', status: 'pending' },
        { nurseId: 'N-02', patientId: 'P-1005', task: 'Neurological check', scheduledAt: '2026-11-20T14:30:00', status: 'pending' },
        { nurseId: 'N-02', patientId: 'P-1007', task: 'Pre-echo preparation', scheduledAt: '2026-11-20T15:00:00', status: 'pending' },
        { nurseId: 'N-02', patientId: 'P-1005', task: 'Administer medication', scheduledAt: '2026-11-20T16:00:00', status: 'pending' },
    ],
};
