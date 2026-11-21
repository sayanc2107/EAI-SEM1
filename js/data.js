/* ===================================================================
   MedCore AI — Comprehensive Data Store
   Fictional / Demo Clinical, Financial, and Operational Data.
   =================================================================== */

const SampleData = {

    // ── USERS & ROLES ──
    users: [
        {
            email: 'admin@medcore.org',
            username: 'admin',
            password: 'Admin@123',
            role: 'admin',
            name: 'Hospital Administrator',
            title: 'Chief Operations Officer',
            employeeId: 'ADM-01',
            department: 'Hospital Administration'
        },
        {
            email: 'doctor@medcore.org',
            username: 'dr.sharma',
            password: 'Doctor@123',
            role: 'doctor',
            name: 'Dr. Arjun Rao',
            title: 'Senior Cardiologist',
            employeeId: 'DOC-02',
            department: 'Cardiology'
        },
        {
            email: 'meera.nair@medcore.org',
            username: 'dr.nair',
            password: 'Doctor@123',
            role: 'doctor',
            name: 'Dr. Meera Nair',
            title: 'Emergency Physician',
            employeeId: 'DOC-01',
            department: 'Emergency Medicine'
        },
        {
            email: 'elena.varga@medcore.org',
            username: 'dr.varga',
            password: 'Doctor@123',
            role: 'doctor',
            name: 'Dr. Elena Varga',
            title: 'Critical Care Specialist',
            employeeId: 'DOC-03',
            department: 'Critical Care / ICU'
        },
        {
            email: 'pharmacist@medcore.org',
            username: 'pharm.maya',
            password: 'Pharma@123',
            role: 'pharmacy',
            name: 'Maya Lin',
            title: 'Chief Clinical Pharmacist',
            employeeId: 'PH-01',
            department: 'Central Pharmacy'
        },
        {
            email: 'ward@medcore.org',
            username: 'ward.ravi',
            password: 'Ward@123',
            role: 'ward',
            name: 'Ravi Kumar',
            title: 'Ward Operations Supervisor',
            employeeId: 'WRD-01',
            department: 'Ward & Bed Operations'
        },
        {
            email: 'nurse@medcore.org',
            username: 'nurse.kavya',
            password: 'Nurse@123',
            role: 'nurse',
            name: 'Kavya Menon, RN',
            title: 'ICU Senior Staff Nurse',
            employeeId: 'NRS-01',
            department: 'ICU / Cardiac Care'
        },
        {
            email: 'accountant@medcore.org',
            username: 'accountant',
            password: 'Account@123',
            role: 'accountant',
            name: 'Sanjay Mehta, CPA',
            title: 'Chief Financial Officer & Accountant',
            employeeId: 'ACC-01',
            department: 'Finance & Accounts'
        }
    ],

    // ── DOCTOR DIRECTORY ──
    doctors: [
        { id: 'DOC-01', name: 'Dr. Meera Nair', specialization: 'Emergency Medicine', department: 'Emergency', room: 'ER Bay 1', onDuty: true, shiftEnd: '14:00' },
        { id: 'DOC-02', name: 'Dr. Arjun Rao', specialization: 'Cardiology', department: 'Cardiology', room: 'CARD-03', onDuty: true, shiftEnd: '16:00' },
        { id: 'DOC-03', name: 'Dr. Elena Varga', specialization: 'Critical Care / ICU', department: 'ICU', room: 'ICU-02', onDuty: true, shiftEnd: '18:00' },
        { id: 'DOC-04', name: 'Dr. Kenji Tanaka', specialization: 'Neurology', department: 'Neurology', room: 'ER-01', onDuty: true, shiftEnd: '15:00' },
        { id: 'DOC-05', name: 'Dr. Priya Deshmukh', specialization: 'Pulmonology', department: 'General', room: 'OPD-04', onDuty: false, shiftEnd: '—' },
        { id: 'DOC-06', name: 'Dr. Samuel Okafor', specialization: 'General Surgery', department: 'Surgery', room: 'OT-02', onDuty: false, shiftEnd: '—' }
    ],

    // ── NURSES DIRECTORY ──
    nurses: [
        { id: 'NRS-01', name: 'Kavya Menon, RN', department: 'ICU / Cardiac Care', ward: 'ICU Ward', shift: '08:00 - 16:00', onDuty: true },
        { id: 'NRS-02', name: 'Anjali Sharma, RN', department: 'Emergency Care', ward: 'Emergency Ward', shift: '06:00 - 14:00', onDuty: true },
        { id: 'NRS-03', name: 'Sunil Rao, RN', department: 'General Care', ward: 'General Ward', shift: '14:00 - 22:00', onDuty: false }
    ],

    // ── WARD STAFF DIRECTORY ──
    wardStaff: [
        { id: 'WRD-01', name: 'Ravi Kumar', department: 'Ward Operations', ward: 'Emergency & ICU', shift: '06:00 - 14:00', onDuty: true },
        { id: 'WRD-02', name: 'Geeta Patel', department: 'Bed Sanitation', ward: 'Cardiology & General', shift: '14:00 - 22:00', onDuty: false }
    ],

    // ── SHIFTS / DUTIES MASTER SCHEDULE ──
    shifts: [
        { id: 'SH-01', staffType: 'Doctor', staffId: 'DOC-01', staffName: 'Dr. Meera Nair', date: '2026-11-21', start: '06:00', end: '14:00', ward: 'Emergency', location: 'ER Bay 1', status: 'Active' },
        { id: 'SH-02', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-21', start: '08:00', end: '16:00', ward: 'Cardiology', location: 'CARD-03', status: 'Active' },
        { id: 'SH-03', staffType: 'Doctor', staffId: 'DOC-03', staffName: 'Dr. Elena Varga', date: '2026-11-21', start: '10:00', end: '18:00', ward: 'ICU', location: 'ICU-02', status: 'Active' },
        { id: 'SH-04', staffType: 'Doctor', staffId: 'DOC-04', staffName: 'Dr. Kenji Tanaka', date: '2026-11-21', start: '07:00', end: '15:00', ward: 'Neurology', location: 'ER-01', status: 'Active' },
        { id: 'SH-05', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-22', start: '08:00', end: '16:00', ward: 'Cardiology', location: 'CARD-01', status: 'Scheduled' },
        { id: 'SH-06', staffType: 'Nurse', staffId: 'NRS-01', staffName: 'Kavya Menon, RN', date: '2026-11-21', start: '08:00', end: '16:00', ward: 'ICU', location: 'ICU Station A', status: 'Active' },
        { id: 'SH-07', staffType: 'Nurse', staffId: 'NRS-02', staffName: 'Anjali Sharma, RN', date: '2026-11-21', start: '06:00', end: '14:00', ward: 'Emergency', location: 'Triage Desk', status: 'Active' },
        { id: 'SH-08', staffType: 'Nurse', staffId: 'NRS-01', staffName: 'Kavya Menon, RN', date: '2026-11-22', start: '08:00', end: '16:00', ward: 'ICU', location: 'ICU Station B', status: 'Scheduled' },
        { id: 'SH-09', staffType: 'Ward Staff', staffId: 'WRD-01', staffName: 'Ravi Kumar', date: '2026-11-21', start: '06:00', end: '14:00', ward: 'Emergency', location: 'ER Floor', status: 'Active' },
        { id: 'SH-10', staffType: 'Ward Staff', staffId: 'WRD-02', staffName: 'Geeta Patel', date: '2026-11-21', start: '14:00', end: '22:00', ward: 'Cardiology', location: 'Sanitation Bay', status: 'Scheduled' }
    ],

    // ── PATIENTS WITH REAL-TIME & HISTORICAL VITALS ──
    patients: [
        {
            id: 'PT-4091',
            name: 'Rohan Kulkarni',
            age: 64,
            gender: 'Male',
            department: 'Cardiology',
            concern: 'Acute STEMI with cardiogenic instability',
            severity: 'Critical',
            bed: 'ICU-01',
            ward: 'ICU',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            nurseId: 'NRS-01',
            admittedAt: '2026-11-21 07:15',
            status: 'Admitted',
            vitals: { hr: 118, spo2: 91, bp: '162/98', bpSys: 162, bpDia: 98, temp: 99.1 },
            vitalsHistory: [
                { time: '07:30', heartRate: 126, bpSys: 170, bpDia: 104, spo2: 88, temp: 99.4 },
                { time: '08:00', heartRate: 122, bpSys: 166, bpDia: 100, spo2: 89, temp: 99.2 },
                { time: '08:30', heartRate: 118, bpSys: 162, bpDia: 98, spo2: 91, temp: 99.1 },
                { time: '09:00', heartRate: 114, bpSys: 158, bpDia: 95, spo2: 92, temp: 98.9 },
                { time: '09:30', heartRate: 110, bpSys: 152, bpDia: 92, spo2: 94, temp: 98.8 }
            ]
        },
        {
            id: 'PT-4092',
            name: 'Ananya Chatterjee',
            age: 31,
            gender: 'Female',
            department: 'Critical Care / ICU',
            concern: 'Severe sepsis secondary to pyelonephritis',
            severity: 'Critical',
            bed: 'ICU-02',
            ward: 'ICU',
            doctorId: 'DOC-03',
            doctorName: 'Dr. Elena Varga',
            nurseId: 'NRS-01',
            admittedAt: '2026-11-21 07:45',
            status: 'Admitted',
            vitals: { hr: 124, spo2: 89, bp: '128/82', bpSys: 128, bpDia: 82, temp: 102.6 },
            vitalsHistory: [
                { time: '08:00', heartRate: 135, bpSys: 110, bpDia: 70, spo2: 86, temp: 103.4 },
                { time: '08:30', heartRate: 130, bpSys: 118, bpDia: 76, spo2: 88, temp: 103.0 },
                { time: '09:00', heartRate: 124, bpSys: 128, bpDia: 82, spo2: 89, temp: 102.6 },
                { time: '09:30', heartRate: 118, bpSys: 126, bpDia: 80, spo2: 92, temp: 101.8 }
            ]
        },
        {
            id: 'PT-4093',
            name: 'Vikramjeet Singh',
            age: 57,
            gender: 'Male',
            department: 'Neurology',
            concern: 'Acute ischemic stroke (Code Stroke protocol)',
            severity: 'Critical',
            bed: 'ER-01',
            ward: 'Emergency',
            doctorId: 'DOC-04',
            doctorName: 'Dr. Kenji Tanaka',
            nurseId: 'NRS-02',
            admittedAt: '2026-11-21 08:48',
            status: 'Admitted',
            vitals: { hr: 92, spo2: 96, bp: '178/104', bpSys: 178, bpDia: 104, temp: 98.4 },
            vitalsHistory: [
                { time: '08:50', heartRate: 98, bpSys: 188, bpDia: 110, spo2: 95, temp: 98.6 },
                { time: '09:15', heartRate: 95, bpSys: 182, bpDia: 106, spo2: 96, temp: 98.5 },
                { time: '09:40', heartRate: 92, bpSys: 178, bpDia: 104, spo2: 96, temp: 98.4 }
            ]
        },
        {
            id: 'PT-4094',
            name: 'Farah Siddiqui',
            age: 45,
            gender: 'Female',
            department: 'Pulmonology',
            concern: 'Acute exacerbation of severe asthma with hypoxemia',
            severity: 'Urgent',
            bed: 'ER-02',
            ward: 'Emergency',
            doctorId: 'DOC-01',
            doctorName: 'Dr. Meera Nair',
            nurseId: 'NRS-02',
            admittedAt: '2026-11-21 09:12',
            status: 'Admitted',
            vitals: { hr: 104, spo2: 93, bp: '114/72', bpSys: 114, bpDia: 72, temp: 99.0 },
            vitalsHistory: [
                { time: '09:15', heartRate: 116, bpSys: 120, bpDia: 78, spo2: 89, temp: 99.2 },
                { time: '09:45', heartRate: 108, bpSys: 116, bpDia: 74, spo2: 91, temp: 99.1 },
                { time: '10:15', heartRate: 104, bpSys: 114, bpDia: 72, spo2: 93, temp: 99.0 }
            ]
        },
        {
            id: 'PT-4095',
            name: 'David Morales',
            age: 29,
            gender: 'Male',
            department: 'Emergency Medicine',
            concern: 'Motor vehicle collision with blunt chest trauma',
            severity: 'Urgent',
            bed: 'ER-03',
            ward: 'Emergency',
            doctorId: 'DOC-01',
            doctorName: 'Dr. Meera Nair',
            nurseId: 'NRS-02',
            admittedAt: '2026-11-21 09:18',
            status: 'Admitted',
            vitals: { hr: 98, spo2: 98, bp: '122/78', bpSys: 122, bpDia: 78, temp: 100.8 },
            vitalsHistory: [
                { time: '09:20', heartRate: 110, bpSys: 130, bpDia: 85, spo2: 96, temp: 101.2 },
                { time: '09:50', heartRate: 102, bpSys: 126, bpDia: 80, spo2: 97, temp: 101.0 },
                { time: '10:20', heartRate: 98, bpSys: 122, bpDia: 78, spo2: 98, temp: 100.8 }
            ]
        },
        {
            id: 'PT-4096',
            name: 'Meenakshi Iyer',
            age: 71,
            gender: 'Female',
            department: 'Cardiology',
            concern: 'Atrial fibrillation with rapid ventricular response',
            severity: 'Moderate',
            bed: 'CARD-01',
            ward: 'Cardiology',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            nurseId: 'NRS-01',
            admittedAt: '2026-11-21 09:30',
            status: 'Admitted',
            vitals: { hr: 112, spo2: 97, bp: '136/84', bpSys: 136, bpDia: 84, temp: 98.2 },
            vitalsHistory: [
                { time: '09:30', heartRate: 132, bpSys: 142, bpDia: 88, spo2: 96, temp: 98.2 },
                { time: '10:00', heartRate: 120, bpSys: 138, bpDia: 86, spo2: 97, temp: 98.2 },
                { time: '10:30', heartRate: 112, bpSys: 136, bpDia: 84, spo2: 97, temp: 98.2 }
            ]
        },
        {
            id: 'PT-4097',
            name: 'Kabir Sen',
            age: 22,
            gender: 'Male',
            department: 'Emergency Medicine',
            concern: 'Right lower quadrant abdominal pain — suspect appendicitis',
            severity: 'Moderate',
            bed: 'GEN-01',
            ward: 'General',
            doctorId: 'DOC-01',
            doctorName: 'Dr. Meera Nair',
            nurseId: 'NRS-02',
            admittedAt: '2026-11-21 09:44',
            status: 'Admitted',
            vitals: { hr: 84, spo2: 99, bp: '118/76', bpSys: 118, bpDia: 76, temp: 98.4 },
            vitalsHistory: [
                { time: '09:45', heartRate: 90, bpSys: 122, bpDia: 80, spo2: 98, temp: 98.5 },
                { time: '10:15', heartRate: 84, bpSys: 118, bpDia: 76, spo2: 99, temp: 98.4 }
            ]
        },
        {
            id: 'PT-4098',
            name: 'Lakshmi Narayanan',
            age: 52,
            gender: 'Female',
            department: 'Internal Medicine',
            concern: 'Diabetic ketoacidosis resolution phase',
            severity: 'Routine',
            bed: 'GEN-02',
            ward: 'General',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            nurseId: 'NRS-01',
            admittedAt: '2026-11-21 09:55',
            status: 'Admitted',
            vitals: { hr: 86, spo2: 99, bp: '124/80', bpSys: 124, bpDia: 80, temp: 98.7 },
            vitalsHistory: [
                { time: '10:00', heartRate: 88, bpSys: 126, bpDia: 82, spo2: 98, temp: 98.7 },
                { time: '10:30', heartRate: 86, bpSys: 124, bpDia: 80, spo2: 99, temp: 98.7 }
            ]
        },
        {
            id: 'PT-4099',
            name: 'Prakash Deshpande',
            age: 61,
            gender: 'Male',
            department: 'Cardiology',
            concern: 'Post-PTCA observation and ambulation',
            severity: 'Moderate',
            bed: 'CARD-03',
            ward: 'Cardiology',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            nurseId: 'NRS-01',
            admittedAt: '2026-11-21 10:10',
            status: 'Admitted',
            vitals: { hr: 78, spo2: 98, bp: '128/82', bpSys: 128, bpDia: 82, temp: 98.5 },
            vitalsHistory: [
                { time: '10:10', heartRate: 82, bpSys: 132, bpDia: 86, spo2: 97, temp: 98.6 },
                { time: '10:40', heartRate: 78, bpSys: 128, bpDia: 82, spo2: 98, temp: 98.5 }
            ]
        },
        {
            id: 'PT-4100',
            name: 'Sunita Verma',
            age: 39,
            gender: 'Female',
            department: 'Critical Care / ICU',
            concern: 'Post-op observation following cholecystectomy',
            severity: 'Routine',
            bed: 'GEN-03',
            ward: 'General',
            doctorId: 'DOC-03',
            doctorName: 'Dr. Elena Varga',
            nurseId: 'NRS-01',
            admittedAt: '2026-11-21 10:22',
            status: 'Admitted',
            vitals: { hr: 94, spo2: 99, bp: '116/74', bpSys: 116, bpDia: 74, temp: 98.6 },
            vitalsHistory: [
                { time: '10:25', heartRate: 96, bpSys: 120, bpDia: 78, spo2: 98, temp: 98.8 },
                { time: '10:55', heartRate: 94, bpSys: 116, bpDia: 74, spo2: 99, temp: 98.6 }
            ]
        }
    ],

    // ── BEDS MATRIX (16 beds across 4 wards) ──
    beds: [
        { id: 'ICU-01', ward: 'ICU', status: 'Occupied', patient: 'Rohan Kulkarni', severity: 'Critical', spo2: '91%' },
        { id: 'ICU-02', ward: 'ICU', status: 'Occupied', patient: 'Ananya Chatterjee', severity: 'Critical', spo2: '89%' },
        { id: 'ICU-03', ward: 'ICU', status: 'Cleaning', patient: 'Sanitizing in progress', severity: 'Normal', spo2: '—' },
        { id: 'ICU-04', ward: 'ICU', status: 'Available', patient: 'Ready for intake', severity: 'Normal', spo2: '—' },
        { id: 'ER-01', ward: 'Emergency', status: 'Occupied', patient: 'Vikramjeet Singh', severity: 'Critical', spo2: '96%' },
        { id: 'ER-02', ward: 'Emergency', status: 'Occupied', patient: 'Farah Siddiqui', severity: 'Urgent', spo2: '93%' },
        { id: 'ER-03', ward: 'Emergency', status: 'Occupied', patient: 'David Morales', severity: 'Urgent', spo2: '98%' },
        { id: 'ER-04', ward: 'Emergency', status: 'Available', patient: 'Ready for intake', severity: 'Normal', spo2: '—' },
        { id: 'CARD-01', ward: 'Cardiology', status: 'Occupied', patient: 'Meenakshi Iyer', severity: 'Moderate', spo2: '97%' },
        { id: 'CARD-02', ward: 'Cardiology', status: 'Cleaning', patient: 'Sanitizing in progress', severity: 'Normal', spo2: '—' },
        { id: 'CARD-03', ward: 'Cardiology', status: 'Occupied', patient: 'Prakash Deshpande', severity: 'Moderate', spo2: '98%' },
        { id: 'CARD-04', ward: 'Cardiology', status: 'Available', patient: 'Ready for intake', severity: 'Normal', spo2: '—' },
        { id: 'GEN-01', ward: 'General', status: 'Occupied', patient: 'Kabir Sen', severity: 'Moderate', spo2: '99%' },
        { id: 'GEN-02', ward: 'General', status: 'Occupied', patient: 'Lakshmi Narayanan', severity: 'Routine', spo2: '99%' },
        { id: 'GEN-03', ward: 'General', status: 'Occupied', patient: 'Sunita Verma', severity: 'Routine', spo2: '99%' },
        { id: 'GEN-04', ward: 'General', status: 'Available', patient: 'Ready for intake', severity: 'Normal', spo2: '—' }
    ],

    // ── DOCTOR PRESCRIPTION QUEUE (Doctor -> Pharmacy Pre-Pack) ──
    prescriptions: [
        {
            id: 'RX-505',
            doctorId: 'DOC-03',
            doctorName: 'Dr. Elena Varga',
            patientId: 'PT-4100',
            patientName: 'Sunita Verma',
            ward: 'General Ward GEN-03',
            urgency: 'Urgent',
            status: 'Pending',
            estimatedTotal: 320,
            notes: 'Send up to General Ward GEN-03 once billed.',
            items: [
                { name: 'Ondansetron 4mg IV Antiemetic Injection', detail: '4mg slow IV push STAT', qty: 2, price: 150 },
                { name: 'Normal Saline 0.9% (500mL IV Bags)', detail: 'IV hydration over 2 hours', qty: 2, price: 170 }
            ],
            timestamp: '2026-11-21 10:22'
        },
        {
            id: 'RX-504',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            patientId: 'PT-4099',
            patientName: 'Prakash Deshpande',
            ward: 'Cardiology CARD-03',
            urgency: 'Standard',
            status: 'Ready',
            estimatedTotal: 634,
            notes: 'Pre-pack discharge cardiac kit for Cardiology Ward.',
            items: [
                { name: 'Atorvastatin 20mg Cardiac Tablets', detail: '20mg once daily after dinner', qty: 3, price: 444 },
                { name: 'Pantoprazole 40mg Gastro-Resistant Tabs', detail: '1 tab before breakfast', qty: 2, price: 190 }
            ],
            timestamp: '2026-11-21 10:15'
        },
        {
            id: 'RX-503',
            doctorId: 'DOC-04',
            doctorName: 'Dr. Kenji Tanaka',
            patientId: 'PT-4093',
            patientName: 'Vikramjeet Singh',
            ward: 'Emergency ER-01',
            urgency: 'STAT',
            status: 'Dispensed',
            estimatedTotal: 1840,
            notes: 'Code stroke thrombolytic adjuvant kit.',
            items: [
                { name: 'Mannitol 20% 100mL Infusion', detail: 'Cerebral edema control', qty: 2, price: 540 },
                { name: 'Aspirin 300mg Soluble', detail: 'Antiplatelet stat load', qty: 1, price: 1300 }
            ],
            timestamp: '2026-11-21 09:05'
        }
    ],

    // ── PHARMACY INVENTORY & MEDICINES ──
    medicines: [
        { id: 'M-01', name: 'Atorvastatin 20mg Cardiac Tablets', category: 'Cardiology', quantity: 180, threshold: 70, unitPrice: 148 },
        { id: 'M-02', name: 'Pantoprazole 40mg Gastro-Resistant Tabs', category: 'Gastroenterology', quantity: 240, threshold: 80, unitPrice: 95 },
        { id: 'M-03', name: 'Ondansetron 4mg IV Injection', category: 'Emergency', quantity: 38, threshold: 50, unitPrice: 75 },
        { id: 'M-04', name: 'Normal Saline 0.9% (500mL IV Bags)', category: 'Infusions', quantity: 95, threshold: 100, unitPrice: 85 },
        { id: 'M-05', name: 'Epinephrine 1mg/mL Auto-Ampoules', category: 'Resuscitation', quantity: 14, threshold: 30, unitPrice: 420 },
        { id: 'M-06', name: 'Medical Oxygen Cylinders (B-Type)', category: 'Respiratory', quantity: 9, threshold: 20, unitPrice: 1200 },
        { id: 'M-07', name: 'Amoxicillin + Clavulanate 625mg', category: 'Antibiotics', quantity: 45, threshold: 60, unitPrice: 210 },
        { id: 'M-08', name: 'Heparin Sodium 5,000 IU/mL Vials', category: 'Anticoagulant', quantity: 18, threshold: 35, unitPrice: 380 },
        { id: 'M-09', name: 'Paracetamol 1000mg IV Infusion', category: 'Analgesics', quantity: 120, threshold: 50, unitPrice: 110 },
        { id: 'M-10', name: 'Amlodipine 5mg Tablets', category: 'Hypertension', quantity: 320, threshold: 100, unitPrice: 45 }
    ],

    // ── MULTI-DEPARTMENT HOSPITAL FINANCIALS ──
    // Tracks total sales from Pharmacy, OPD, ICU, Emergency, Surgery, and Diagnostics
    departmentSalesSummary: {
        totalHospitalRevenue: 2486750,
        pharmacy: 342600,
        opd: 485000,
        icu: 792400,
        emergency: 318250,
        surgery: 428500,
        diagnostics: 120000
    },

    hospitalTransactions: [
        { id: 'TXN-8801', date: '2026-11-21 10:30', department: 'Pharmacy', patientId: 'PT-4099', service: 'Cardiac Pre-pack Discharge Meds (Atorvastatin/Panto)', amount: 634, paymentMode: 'UPI / Digital', cashier: 'Maya Lin', status: 'Completed' },
        { id: 'TXN-8802', date: '2026-11-21 10:15', department: 'ICU', patientId: 'PT-4091', service: 'Cardiac Critical Care Bed & Invasive Monitoring (Day 1)', amount: 38500, paymentMode: 'TPA Insurance', cashier: 'Sanjay Mehta', status: 'Completed' },
        { id: 'TXN-8803', date: '2026-11-21 09:50', department: 'OPD', patientId: 'PT-4096', service: 'Cardiology Specialist Consultation & ECG (Dr. Arjun Rao)', amount: 2200, paymentMode: 'Credit Card', cashier: 'Front Desk', status: 'Completed' },
        { id: 'TXN-8804', date: '2026-11-21 09:35', department: 'Emergency', patientId: 'PT-4094', service: 'Emergency Bronchodilator Resuscitation & High Flow O2', amount: 4800, paymentMode: 'Cash', cashier: 'ER Desk', status: 'Completed' },
        { id: 'TXN-8805', date: '2026-11-21 09:10', department: 'Surgery', patientId: 'PT-4095', service: 'Emergency Chest Tube Insertion & Wound Debridement', amount: 28500, paymentMode: 'TPA Insurance', cashier: 'OT Desk', status: 'Completed' },
        { id: 'TXN-8806', date: '2026-11-21 08:45', department: 'Diagnostics', patientId: 'PT-4093', service: 'Stat Brain CT Scan & Angiography Protocol', amount: 8900, paymentMode: 'UPI / Digital', cashier: 'Radiology Desk', status: 'Completed' },
        { id: 'TXN-8807', date: '2026-11-20 18:20', department: 'Pharmacy', patientId: 'PT-4089', service: 'Antibiotic IV Course & Infusions (Bill #8812)', amount: 2450, paymentMode: 'Credit Card', cashier: 'Maya Lin', status: 'Completed' },
        { id: 'TXN-8808', date: '2026-11-20 16:40', department: 'ICU', patientId: 'PT-4092', service: 'ICU Sepsis Resuscitation Bundle & Vasopressor Protocol', amount: 42000, paymentMode: 'TPA Insurance', cashier: 'Sanjay Mehta', status: 'Completed' }
    ],

    // ── FULL HOSPITAL PAYROLL SYSTEM (Doctors, Nurses, Ward Staff, Pharmacy, Accountant, Admin) ──
    payroll: [
        {
            id: 'PAY-101',
            staffId: 'DOC-02',
            name: 'Dr. Arjun Rao',
            role: 'Doctor',
            department: 'Cardiology',
            baseSalary: 285000,
            allowances: 45000,
            deductions: 32000,
            netSalary: 298000,
            status: 'Paid',
            paymentDate: '2026-11-01',
            bankAccount: 'HDFC Bank (•••• 4921)',
            taxPan: 'AAAAA1234F'
        },
        {
            id: 'PAY-102',
            staffId: 'DOC-01',
            name: 'Dr. Meera Nair',
            role: 'Doctor',
            department: 'Emergency Medicine',
            baseSalary: 250000,
            allowances: 40000,
            deductions: 28000,
            netSalary: 262000,
            status: 'Pending',
            paymentDate: '—',
            bankAccount: 'ICICI Bank (•••• 8102)',
            taxPan: 'BBBBB5678G'
        },
        {
            id: 'PAY-103',
            staffId: 'DOC-03',
            name: 'Dr. Elena Varga',
            role: 'Doctor',
            department: 'Critical Care / ICU',
            baseSalary: 275000,
            allowances: 42000,
            deductions: 30000,
            netSalary: 287000,
            status: 'Paid',
            paymentDate: '2026-11-01',
            bankAccount: 'Axis Bank (•••• 7721)',
            taxPan: 'CCCCC9012H'
        },
        {
            id: 'PAY-104',
            staffId: 'DOC-04',
            name: 'Dr. Kenji Tanaka',
            role: 'Doctor',
            department: 'Neurology',
            baseSalary: 290000,
            allowances: 48000,
            deductions: 34000,
            netSalary: 304000,
            status: 'Pending',
            paymentDate: '—',
            bankAccount: 'SBI (•••• 3319)',
            taxPan: 'DDDDD3456J'
        },
        {
            id: 'PAY-105',
            staffId: 'NRS-01',
            name: 'Kavya Menon, RN',
            role: 'Nurse',
            department: 'ICU / Cardiac Care',
            baseSalary: 82000,
            allowances: 15000,
            deductions: 7500,
            netSalary: 89500,
            status: 'Paid',
            paymentDate: '2026-11-01',
            bankAccount: 'HDFC Bank (•••• 1102)',
            taxPan: 'EEEEE7890K'
        },
        {
            id: 'PAY-106',
            staffId: 'NRS-02',
            name: 'Anjali Sharma, RN',
            role: 'Nurse',
            department: 'Emergency Care',
            baseSalary: 78000,
            allowances: 14000,
            deductions: 7000,
            netSalary: 85000,
            status: 'Pending',
            paymentDate: '—',
            bankAccount: 'PNB (•••• 9943)',
            taxPan: 'FFFFF1234L'
        },
        {
            id: 'PAY-107',
            staffId: 'WRD-01',
            name: 'Ravi Kumar',
            role: 'Ward Staff',
            department: 'Ward & Bed Operations',
            baseSalary: 45000,
            allowances: 8000,
            deductions: 3500,
            netSalary: 49500,
            status: 'Paid',
            paymentDate: '2026-11-01',
            bankAccount: 'SBI (•••• 5520)',
            taxPan: 'GGGGG5678M'
        },
        {
            id: 'PAY-108',
            staffId: 'PH-01',
            name: 'Maya Lin',
            role: 'Pharmacist',
            department: 'Central Pharmacy',
            baseSalary: 98000,
            allowances: 16000,
            deductions: 9000,
            netSalary: 105000,
            status: 'Paid',
            paymentDate: '2026-11-01',
            bankAccount: 'ICICI Bank (•••• 1890)',
            taxPan: 'HHHHH9012N'
        },
        {
            id: 'PAY-109',
            staffId: 'ACC-01',
            name: 'Sanjay Mehta, CPA',
            role: 'Accountant',
            department: 'Finance & Accounts',
            baseSalary: 115000,
            allowances: 20000,
            deductions: 12000,
            netSalary: 123000,
            status: 'Paid',
            paymentDate: '2026-11-01',
            bankAccount: 'HDFC Bank (•••• 9021)',
            taxPan: 'JJJJJ3456P'
        },
        {
            id: 'PAY-110',
            staffId: 'ADM-01',
            name: 'Hospital Administrator',
            role: 'Admin',
            department: 'Hospital Administration',
            baseSalary: 195000,
            allowances: 35000,
            deductions: 25000,
            netSalary: 205000,
            status: 'Paid',
            paymentDate: '2026-11-01',
            bankAccount: 'CitiBank (•••• 4412)',
            taxPan: 'KKKKK7890Q'
        }
    ],

    // ── DOCTOR MEDICAL CLINICAL LIBRARY & PROTOCOLS ──
    doctorLibrary: [
        {
            category: 'Emergency & Resuscitation',
            title: 'Advanced Cardiac Life Support (ACLS) — Refractory Ventricular Fibrillation Protocol',
            code: 'ACLS-CARD-01',
            summary: 'Defibrillation sequence (200J biphasic) followed by immediate CPR for 2 min. Epinephrine 1mg IV/IO Q3-5 min. Amiodarone 300mg first dose, 150mg second dose.',
            tags: ['ACLS', 'Cardiac Arrest', 'Amiodarone', 'Defibrillation']
        },
        {
            category: 'Critical Care / Stroke',
            title: 'Acute Ischemic Stroke — IV Thrombolysis (Tenecteplase / Alteplase) Protocol',
            code: 'STROKE-CODE-04',
            summary: 'Confirm CT Head without hemorrhage. Blood pressure target < 185/110 mmHg. IV Tenecteplase 0.25 mg/kg within 4.5 hours of last known normal.',
            tags: ['Stroke', 'Tenecteplase', 'Neurology', 'BP Target']
        },
        {
            category: 'Sepsis & Infectious Disease',
            title: 'Surviving Sepsis Campaign — 1-Hour Management Bundle',
            code: 'SEPSIS-BUNDLE-02',
            summary: 'Measure lactate level. Obtain blood cultures prior to antibiotics. Administer broad-spectrum antibiotics. Rapid administration of 30mL/kg crystalloid for hypotension.',
            tags: ['Sepsis', 'Lactate', 'Fluid Resuscitation', 'Cultures']
        },
        {
            category: 'Cardiology Guidelines',
            title: 'Acute Coronary Syndrome (NSTEMI / STEMI) Dual Antiplatelet Therapy (DAPT)',
            code: 'DAPT-ACS-03',
            summary: 'Aspirin 300mg chewable stat load + Ticagrelor 180mg load (or Clopidogrel 600mg if contraindicated). Anticoagulation with Enoxaparin 1mg/kg SC Q12H.',
            tags: ['ACS', 'STEMI', 'Ticagrelor', 'Aspirin']
        },
        {
            category: 'Pulmonology & Airway',
            title: 'Severe Acute Asthma Exacerbation — Stepwise Inhaled & Systemic Regimen',
            code: 'PULM-ASTHMA-05',
            summary: 'Continuous nebulized Salbutamol 5mg + Ipratropium 0.5mg. IV Hydrocortisone 200mg or Methylprednisolone 60mg. Magnesium sulfate 2g IV over 20 minutes.',
            tags: ['Asthma', 'Bronchodilator', 'Corticosteroid', 'Magnesium']
        }
    ]
};
