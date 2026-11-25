/* ===================================================================
   MedCore AI — Comprehensive Data Store
   Fictional / Demo Clinical, Financial, Operational & HR Data.
   =================================================================== */

const SampleData = {

    // ── USERS & ROLES ──
    users: [
        {
            email: 'admin@medcore.org',
            username: 'admin',
            password: 'Admin@123',
            role: 'superadmin',
            name: 'Super Administrator',
            title: 'Chief Operations Officer (Superadmin)',
            employeeId: 'ADM-01',
            department: 'Hospital Administration',
            phone: 'Ext. 100',
            status: 'Active'
        },
        {
            email: 'chittajit.chakraborty@medcore.org',
            username: 'chittajit',
            password: 'tatai47',
            role: 'admin',
            name: 'Chittajit Chakraborty',
            title: 'Hospital Administrator',
            employeeId: 'ADM-02',
            department: 'Hospital Administration',
            phone: 'Ext. 102',
            status: 'Active'
        },
        {
            email: 'sayan.chakraborty@medcore.org',
            username: 'sayan',
            password: 'sayan21',
            role: 'admin',
            name: 'Sayan Chakraborty',
            title: 'Hospital Administrator',
            employeeId: 'ADM-03',
            department: 'Hospital Administration',
            phone: 'Ext. 103',
            status: 'Active'
        },
        {
            email: 'doctor@medcore.org',
            username: 'dr.sharma',
            password: 'Doctor@123',
            role: 'doctor',
            name: 'Dr. Arjun Rao',
            title: 'Senior Cardiologist',
            employeeId: 'DOC-02',
            department: 'Cardiology',
            phone: 'Ext. 202',
            status: 'Active'
        },
        {
            email: 'meera.nair@medcore.org',
            username: 'dr.nair',
            password: 'Doctor@123',
            role: 'doctor',
            name: 'Dr. Meera Nair',
            title: 'Emergency Physician',
            employeeId: 'DOC-01',
            department: 'Emergency Medicine',
            phone: 'Ext. 201',
            status: 'Active'
        },
        {
            email: 'elena.varga@medcore.org',
            username: 'dr.varga',
            password: 'Doctor@123',
            role: 'doctor',
            name: 'Dr. Elena Varga',
            title: 'Critical Care Specialist',
            employeeId: 'DOC-03',
            department: 'Critical Care / ICU',
            phone: 'Ext. 203',
            status: 'Active'
        },
        {
            email: 'kenji.tanaka@medcore.org',
            username: 'dr.tanaka',
            password: 'Doctor@123',
            role: 'doctor',
            name: 'Dr. Kenji Tanaka',
            title: 'Consultant Neurologist',
            employeeId: 'DOC-04',
            department: 'Neurology',
            phone: 'Ext. 204',
            status: 'Active'
        },
        {
            email: 'pharmacist@medcore.org',
            username: 'pharm.maya',
            password: 'Pharma@123',
            role: 'pharmacy',
            name: 'Maya Lin',
            title: 'Chief Clinical Pharmacist',
            employeeId: 'PH-01',
            department: 'Central Pharmacy',
            phone: 'Ext. 301',
            status: 'Active'
        },
        {
            email: 'ward@medcore.org',
            username: 'ward.ravi',
            password: 'Ward@123',
            role: 'ward',
            name: 'Ravi Kumar',
            title: 'Ward Operations Supervisor',
            employeeId: 'WRD-01',
            department: 'Ward & Bed Operations',
            phone: 'Ext. 401',
            status: 'Active'
        },
        {
            email: 'nurse@medcore.org',
            username: 'nurse.kavya',
            password: 'Nurse@123',
            role: 'nurse',
            name: 'Kavya Menon, RN',
            title: 'ICU Senior Staff Nurse',
            employeeId: 'NRS-01',
            department: 'ICU / Cardiac Care',
            phone: 'Ext. 501',
            status: 'Active'
        },
        {
            email: 'accountant@medcore.org',
            username: 'accountant',
            password: 'Account@123',
            role: 'accountant',
            name: 'Sanjay Mehta, CPA',
            title: 'Chief Financial Officer & Accountant',
            employeeId: 'ACC-01',
            department: 'Finance & Accounts',
            phone: 'Ext. 601',
            status: 'Active'
        }
    ],

    // ── DOCTOR DIRECTORY ──
    doctors: [
        { id: 'DOC-01', name: 'Dr. Meera Nair', specialization: 'Emergency Medicine', department: 'Emergency', room: 'ER Bay 1', onDuty: true, shiftEnd: '14:00', phone: 'Ext. 201' },
        { id: 'DOC-02', name: 'Dr. Arjun Rao', specialization: 'Cardiology', department: 'Cardiology', room: 'CARD-03', onDuty: true, shiftEnd: '16:00', phone: 'Ext. 202' },
        { id: 'DOC-03', name: 'Dr. Elena Varga', specialization: 'Critical Care / ICU', department: 'ICU', room: 'ICU-02', onDuty: true, shiftEnd: '18:00', phone: 'Ext. 203' },
        { id: 'DOC-04', name: 'Dr. Kenji Tanaka', specialization: 'Neurology', department: 'Neurology', room: 'ER-01', onDuty: true, shiftEnd: '15:00', phone: 'Ext. 204' },
        { id: 'DOC-05', name: 'Dr. Priya Deshmukh', specialization: 'Pulmonology', department: 'General', room: 'OPD-04', onDuty: false, shiftEnd: '—', phone: 'Ext. 205' },
        { id: 'DOC-06', name: 'Dr. Samuel Okafor', specialization: 'General Surgery', department: 'Surgery', room: 'OT-02', onDuty: false, shiftEnd: '—', phone: 'Ext. 206' }
    ],

    // ── NURSES DIRECTORY ──
    nurses: [
        { id: 'NRS-01', name: 'Kavya Menon, RN', department: 'ICU / Cardiac Care', ward: 'ICU Ward', shift: '08:00 - 16:00', onDuty: true, phone: 'Ext. 501' },
        { id: 'NRS-02', name: 'Anjali Sharma, RN', department: 'Emergency Care', ward: 'Emergency Ward', shift: '06:00 - 14:00', onDuty: true, phone: 'Ext. 502' },
        { id: 'NRS-03', name: 'Sunil Rao, RN', department: 'General Care', ward: 'General Ward', shift: '14:00 - 22:00', onDuty: false, phone: 'Ext. 503' }
    ],

    // ── WARD STAFF DIRECTORY ──
    wardStaff: [
        { id: 'WRD-01', name: 'Ravi Kumar', department: 'Ward Operations', ward: 'Emergency & ICU', shift: '06:00 - 14:00', onDuty: true, phone: 'Ext. 401' },
        { id: 'WRD-02', name: 'Geeta Patel', department: 'Bed Sanitation', ward: 'Cardiology & General', shift: '14:00 - 22:00', onDuty: false, phone: 'Ext. 402' }
    ],

    // ── NEXT 1 WEEK DOCTOR & STAFF SHIFTS SCHEDULE (Nov 22 - Nov 28) ──
    shifts: [
        // Today Nov 26 (Today)
        { id: 'SH-01', staffType: 'Doctor', staffId: 'DOC-01', staffName: 'Dr. Meera Nair', date: '2026-11-26', start: '06:00', end: '14:00', ward: 'Emergency', location: 'ER Bay 1', status: 'Active' },
        { id: 'SH-02', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-26', start: '08:00', end: '16:00', ward: 'Cardiology', location: 'CARD-03', status: 'Active' },
        { id: 'SH-03', staffType: 'Doctor', staffId: 'DOC-03', staffName: 'Dr. Elena Varga', date: '2026-11-26', start: '10:00', end: '18:00', ward: 'ICU', location: 'ICU-02', status: 'Active' },
        { id: 'SH-04', staffType: 'Doctor', staffId: 'DOC-04', staffName: 'Dr. Kenji Tanaka', date: '2026-11-26', start: '07:00', end: '15:00', ward: 'Neurology', location: 'ER-01', status: 'Active' },
        { id: 'SH-05', staffType: 'Nurse', staffId: 'NRS-01', staffName: 'Kavya Menon, RN', date: '2026-11-26', start: '08:00', end: '16:00', ward: 'ICU', location: 'ICU Station A', status: 'Active' },
        { id: 'SH-06', staffType: 'Ward Staff', staffId: 'WRD-01', staffName: 'Ravi Kumar', date: '2026-11-26', start: '06:00', end: '14:00', ward: 'Emergency', location: 'ER Floor', status: 'Active' },
        
        // Day 2: Nov 27
        { id: 'SH-07', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-27', start: '08:00', end: '16:00', ward: 'Cardiology', location: 'Cath Lab 1', status: 'Scheduled' },
        { id: 'SH-08', staffType: 'Doctor', staffId: 'DOC-01', staffName: 'Dr. Meera Nair', date: '2026-11-27', start: '14:00', end: '22:00', ward: 'Emergency', location: 'Trauma Bay', status: 'Scheduled' },
        { id: 'SH-09', staffType: 'Doctor', staffId: 'DOC-05', staffName: 'Dr. Priya Deshmukh', date: '2026-11-27', start: '09:00', end: '17:00', ward: 'General', location: 'OPD Room 3', status: 'Scheduled' },
        
        // Day 3: Nov 28
        { id: 'SH-10', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-28', start: '09:00', end: '17:00', ward: 'Cardiology', location: 'CARD-01', status: 'Scheduled' },
        { id: 'SH-11', staffType: 'Doctor', staffId: 'DOC-03', staffName: 'Dr. Elena Varga', date: '2026-11-28', start: '08:00', end: '16:00', ward: 'ICU', location: 'ICU Bay 1', status: 'Scheduled' },
        { id: 'SH-12', staffType: 'Doctor', staffId: 'DOC-06', staffName: 'Dr. Samuel Okafor', date: '2026-11-28', start: '08:00', end: '16:00', ward: 'Surgery', location: 'OT-1', status: 'Scheduled' },
        
        // Day 4: Nov 29
        { id: 'SH-13', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-29', start: '08:00', end: '14:00', ward: 'Cardiology', location: 'OPD-02', status: 'Scheduled' },
        { id: 'SH-14', staffType: 'Doctor', staffId: 'DOC-04', staffName: 'Dr. Kenji Tanaka', date: '2026-11-29', start: '12:00', end: '20:00', ward: 'Neurology', location: 'Neuro Clinic', status: 'Scheduled' },
        
        // Day 5: Nov 30
        { id: 'SH-15', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-30', start: '10:00', end: '18:00', ward: 'Cardiology', location: 'CARD-03', status: 'Scheduled' },
        { id: 'SH-16', staffType: 'Doctor', staffId: 'DOC-01', staffName: 'Dr. Meera Nair', date: '2026-11-30', start: '06:00', end: '14:00', ward: 'Emergency', location: 'ER Bay 2', status: 'Scheduled' },
        
        // Day 6: Dec 01
        { id: 'SH-17', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-12-01', start: '08:00', end: '16:00', ward: 'Cardiology', location: 'Inpatient Round', status: 'Scheduled' },
        { id: 'SH-18', staffType: 'Doctor', staffId: 'DOC-03', staffName: 'Dr. Elena Varga', date: '2026-12-01', start: '14:00', end: '22:00', ward: 'ICU', location: 'ICU-03', status: 'Scheduled' },
        
        // Day 7: Dec 02
        { id: 'SH-19', staffType: 'Doctor', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-12-02', start: '08:00', end: '12:00', ward: 'Cardiology', location: 'Executive Health Check', status: 'Scheduled' },
        { id: 'SH-20', staffType: 'Doctor', staffId: 'DOC-06', staffName: 'Dr. Samuel Okafor', date: '2026-12-02', start: '09:00', end: '17:00', ward: 'Surgery', location: 'OT-2', status: 'Scheduled' }
    ],

    // ── ATTENDANCE & PUNCH-IN RECORDS ──
    attendanceLogs: [
        { id: 'ATT-101', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-26', clockIn: '07:55 AM', clockOut: 'Active', hours: 4.5, status: 'On Duty' },
        { id: 'ATT-102', staffId: 'DOC-01', staffName: 'Dr. Meera Nair', date: '2026-11-26', clockIn: '05:50 AM', clockOut: 'Active', hours: 6.5, status: 'On Duty' },
        { id: 'ATT-103', staffId: 'NRS-01', staffName: 'Kavya Menon, RN', date: '2026-11-26', clockIn: '07:50 AM', clockOut: 'Active', hours: 4.6, status: 'On Duty' },
        { id: 'ATT-104', staffId: 'WRD-01', staffName: 'Ravi Kumar', date: '2026-11-26', clockIn: '05:58 AM', clockOut: 'Active', hours: 6.4, status: 'On Duty' },
        { id: 'ATT-105', staffId: 'PH-01', staffName: 'Maya Lin', date: '2026-11-26', clockIn: '08:00 AM', clockOut: 'Active', hours: 4.3, status: 'On Duty' },
        { id: 'ATT-106', staffId: 'ACC-01', staffName: 'Sanjay Mehta', date: '2026-11-26', clockIn: '08:30 AM', clockOut: 'Active', hours: 3.8, status: 'On Duty' },
        { id: 'ATT-107', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-25', clockIn: '08:00 AM', clockOut: '04:10 PM', hours: 8.2, status: 'Completed' },
        { id: 'ATT-108', staffId: 'DOC-02', staffName: 'Dr. Arjun Rao', date: '2026-11-24', clockIn: '07:52 AM', clockOut: '04:05 PM', hours: 8.2, status: 'Completed' }
    ],

    // ── PATIENTS WITH CLINICAL VITALS ──
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
            admittedAt: '2026-11-25 07:15',
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
            admittedAt: '2026-11-25 07:45',
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
            admittedAt: '2026-11-25 08:48',
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
            admittedAt: '2026-11-25 09:12',
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
            admittedAt: '2026-11-25 09:18',
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
            admittedAt: '2026-11-25 09:30',
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
            concern: 'Right lower quadrant abdominal pain — appendicitis',
            severity: 'Moderate',
            bed: 'GEN-01',
            ward: 'General',
            doctorId: 'DOC-01',
            doctorName: 'Dr. Meera Nair',
            nurseId: 'NRS-02',
            admittedAt: '2026-11-25 09:44',
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
            admittedAt: '2026-11-25 09:55',
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
            admittedAt: '2026-11-25 10:10',
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
            admittedAt: '2026-11-25 10:22',
            status: 'Admitted',
            vitals: { hr: 94, spo2: 99, bp: '116/74', bpSys: 116, bpDia: 74, temp: 98.6 },
            vitalsHistory: [
                { time: '10:25', heartRate: 96, bpSys: 120, bpDia: 78, spo2: 98, temp: 98.8 },
                { time: '10:55', heartRate: 94, bpSys: 116, bpDia: 74, spo2: 99, temp: 98.6 }
            ]
        }
    ],

    // ── BEDS ──
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

    // ── DOCTOR PRESCRIPTIONS ──
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
            timestamp: '2026-11-25 10:22'
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
            timestamp: '2026-11-25 10:15'
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
            timestamp: '2026-11-25 09:05'
        }
    ],

    // ── PHARMACY MEDICINES ──
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

    // ── HOSPITAL SALES TRANSACTIONS (Multi-Column By Location: ICU, Pharmacy, OPD, Staff Salary, ER, Surgery) ──
    hospitalTransactions: [
        { id: 'TXN-8801', date: '2026-11-26 10:30', department: 'Pharmacy', patientId: 'PT-4099', service: 'Cardiac Pre-pack Discharge Meds', icuAmount: 0, pharmacyAmount: 634, opdAmount: 0, erAmount: 0, salaryAmount: 0, surgeryAmount: 0, totalAmount: 634, paymentMode: 'Split: UPI (₹400) + Cash (₹234)', cashier: 'Maya Lin', status: 'Completed' },
        { id: 'TXN-8802', date: '2026-11-26 10:15', department: 'ICU', patientId: 'PT-4091', service: 'Cardiac Critical Care Bed & Telemetry (Day 2)', icuAmount: 38500, pharmacyAmount: 0, opdAmount: 0, erAmount: 0, salaryAmount: 0, surgeryAmount: 0, totalAmount: 38500, paymentMode: 'TPA Insurance', cashier: 'Sanjay Mehta', status: 'Completed' },
        { id: 'TXN-8803', date: '2026-11-26 09:50', department: 'OPD', patientId: 'PT-4096', service: 'Cardiology Specialist Consultation & ECG', icuAmount: 0, pharmacyAmount: 0, opdAmount: 2200, erAmount: 0, salaryAmount: 0, surgeryAmount: 0, totalAmount: 2200, paymentMode: 'Split: Cash (₹1000) + Card (₹1200)', cashier: 'Front Desk', status: 'Completed' },
        { id: 'TXN-8804', date: '2026-11-26 09:35', department: 'Emergency', patientId: 'PT-4094', service: 'Emergency Resuscitation & High Flow O2', icuAmount: 0, pharmacyAmount: 0, opdAmount: 0, erAmount: 4800, salaryAmount: 0, surgeryAmount: 0, totalAmount: 4800, paymentMode: 'Cash', cashier: 'ER Desk', status: 'Completed' },
        { id: 'TXN-8805', date: '2026-11-26 09:10', department: 'Surgery', patientId: 'PT-4095', service: 'Emergency Chest Tube Insertion & Splinting', icuAmount: 0, pharmacyAmount: 0, opdAmount: 0, erAmount: 0, salaryAmount: 0, surgeryAmount: 28500, totalAmount: 28500, paymentMode: 'TPA Insurance', cashier: 'OT Desk', status: 'Completed' },
        { id: 'TXN-8806', date: '2026-11-25 16:00', department: 'Staff Salary', patientId: 'DOC-02', service: 'Special Incentive Bonus Disbursal', icuAmount: 0, pharmacyAmount: 0, opdAmount: 0, erAmount: 0, salaryAmount: 25000, surgeryAmount: 0, totalAmount: 25000, paymentMode: 'NEFT Bank Transfer', cashier: 'Sanjay Mehta (CFO)', status: 'Completed' },
        { id: 'TXN-8807', date: '2026-11-25 14:20', department: 'Pharmacy', patientId: 'PT-4089', service: 'Antibiotic IV Course & Syringes', icuAmount: 0, pharmacyAmount: 2450, opdAmount: 0, erAmount: 0, salaryAmount: 0, surgeryAmount: 0, totalAmount: 2450, paymentMode: 'UPI / Digital', cashier: 'Maya Lin', status: 'Completed' },
        { id: 'TXN-8808', date: '2026-11-25 11:40', department: 'ICU', patientId: 'PT-4092', service: 'ICU Sepsis Resuscitation & Vasopressors', icuAmount: 42000, pharmacyAmount: 0, opdAmount: 0, erAmount: 0, salaryAmount: 0, surgeryAmount: 0, totalAmount: 42000, paymentMode: 'TPA Insurance', cashier: 'Sanjay Mehta', status: 'Completed' }
    ],

    // ── FULL PAYROLL SYSTEM WITH MULTI-MONTH HISTORY (Payslips download in PDF) ──
    payroll: [
        {
            id: 'PAY-2026-11-DOC02',
            staffId: 'DOC-02',
            name: 'Dr. Arjun Rao',
            role: 'Doctor',
            department: 'Cardiology',
            month: 'November 2026',
            baseSalary: 285000,
            allowances: 45000,
            specialPayment: 25000,
            specialPaymentReason: 'Cardiology On-Call Emergency Bonus',
            deductions: 32000,
            netSalary: 323000,
            status: 'Paid',
            paymentDate: '2026-11-25',
            bankAccount: 'HDFC Bank (•••• 4921)',
            taxPan: 'AAAAA1234F',
            daysWorked: 26
        },
        {
            id: 'PAY-2026-10-DOC02',
            staffId: 'DOC-02',
            name: 'Dr. Arjun Rao',
            role: 'Doctor',
            department: 'Cardiology',
            month: 'October 2026',
            baseSalary: 285000,
            allowances: 45000,
            specialPayment: 0,
            specialPaymentReason: '—',
            deductions: 32000,
            netSalary: 298000,
            status: 'Paid',
            paymentDate: '2026-10-31',
            bankAccount: 'HDFC Bank (•••• 4921)',
            taxPan: 'AAAAA1234F',
            daysWorked: 26
        },
        {
            id: 'PAY-2026-09-DOC02',
            staffId: 'DOC-02',
            name: 'Dr. Arjun Rao',
            role: 'Doctor',
            department: 'Cardiology',
            month: 'September 2026',
            baseSalary: 285000,
            allowances: 45000,
            specialPayment: 15000,
            specialPaymentReason: 'Cath Lab Overtime Incentive',
            deductions: 32000,
            netSalary: 313000,
            status: 'Paid',
            paymentDate: '2026-09-30',
            bankAccount: 'HDFC Bank (•••• 4921)',
            taxPan: 'AAAAA1234F',
            daysWorked: 25
        },
        {
            id: 'PAY-2026-11-DOC01',
            staffId: 'DOC-01',
            name: 'Dr. Meera Nair',
            role: 'Doctor',
            department: 'Emergency Medicine',
            month: 'November 2026',
            baseSalary: 250000,
            allowances: 40000,
            specialPayment: 18000,
            specialPaymentReason: 'Trauma Bay Night Shift Allowance',
            deductions: 28000,
            netSalary: 280000,
            status: 'Pending',
            paymentDate: '—',
            bankAccount: 'ICICI Bank (•••• 8102)',
            taxPan: 'BBBBB5678G',
            daysWorked: 26
        },
        {
            id: 'PAY-2026-11-DOC03',
            staffId: 'DOC-03',
            name: 'Dr. Elena Varga',
            role: 'Doctor',
            department: 'Critical Care / ICU',
            month: 'November 2026',
            baseSalary: 275000,
            allowances: 42000,
            specialPayment: 20000,
            specialPaymentReason: 'ECMO Telemetry Specialist Allowance',
            deductions: 30000,
            netSalary: 307000,
            status: 'Paid',
            paymentDate: '2026-11-26',
            bankAccount: 'Axis Bank (•••• 7721)',
            taxPan: 'CCCCC9012H',
            daysWorked: 25
        },
        {
            id: 'PAY-2026-11-DOC04',
            staffId: 'DOC-04',
            name: 'Dr. Kenji Tanaka',
            role: 'Doctor',
            department: 'Neurology',
            month: 'November 2026',
            baseSalary: 290000,
            allowances: 48000,
            specialPayment: 0,
            specialPaymentReason: '—',
            deductions: 34000,
            netSalary: 304000,
            status: 'Pending',
            paymentDate: '—',
            bankAccount: 'SBI (•••• 3319)',
            taxPan: 'DDDDD3456J',
            daysWorked: 24
        },
        {
            id: 'PAY-2026-11-NRS01',
            staffId: 'NRS-01',
            name: 'Kavya Menon, RN',
            role: 'Nurse',
            department: 'ICU / Cardiac Care',
            month: 'November 2026',
            baseSalary: 82000,
            allowances: 15000,
            specialPayment: 8000,
            specialPaymentReason: 'High Acuity Shift Differential',
            deductions: 7500,
            netSalary: 97500,
            status: 'Paid',
            paymentDate: '2026-11-15',
            bankAccount: 'HDFC Bank (•••• 1102)',
            taxPan: 'EEEEE7890K',
            daysWorked: 26
        },
        {
            id: 'PAY-2026-11-WRD01',
            staffId: 'WRD-01',
            name: 'Ravi Kumar',
            role: 'Ward Staff',
            department: 'Ward & Bed Operations',
            month: 'November 2026',
            baseSalary: 45000,
            allowances: 8000,
            specialPayment: 5000,
            specialPaymentReason: 'Emergency Sanitation Incentive',
            deductions: 3500,
            netSalary: 54500,
            status: 'Paid',
            paymentDate: '2026-11-15',
            bankAccount: 'SBI (•••• 5520)',
            taxPan: 'GGGGG5678M',
            daysWorked: 26
        },
        {
            id: 'PAY-2026-11-PH01',
            staffId: 'PH-01',
            name: 'Maya Lin',
            role: 'Pharmacist',
            department: 'Central Pharmacy',
            month: 'November 2026',
            baseSalary: 98000,
            allowances: 16000,
            specialPayment: 10000,
            specialPaymentReason: 'Inventory Audit Accuracy Bonus',
            deductions: 9000,
            netSalary: 115000,
            status: 'Paid',
            paymentDate: '2026-11-15',
            bankAccount: 'ICICI Bank (•••• 1890)',
            taxPan: 'HHHHH9012N',
            daysWorked: 26
        },
        {
            id: 'PAY-2026-11-ACC01',
            staffId: 'ACC-01',
            name: 'Sanjay Mehta, CPA',
            role: 'Accountant',
            department: 'Finance & Accounts',
            month: 'November 2026',
            baseSalary: 115000,
            allowances: 20000,
            specialPayment: 12000,
            specialPaymentReason: 'Quarterly TPA Reconciliation Bonus',
            deductions: 12000,
            netSalary: 135000,
            status: 'Paid',
            paymentDate: '2026-11-15',
            bankAccount: 'HDFC Bank (•••• 9021)',
            taxPan: 'JJJJJ3456P',
            daysWorked: 26
        },
        {
            id: 'PAY-2026-11-ADM01',
            staffId: 'ADM-01',
            name: 'Hospital Administrator',
            role: 'Admin',
            department: 'Hospital Administration',
            month: 'November 2026',
            baseSalary: 195000,
            allowances: 35000,
            specialPayment: 25000,
            specialPaymentReason: 'NABH Accreditation Leadership Award',
            deductions: 25000,
            netSalary: 230000,
            status: 'Paid',
            paymentDate: '2026-11-15',
            bankAccount: 'CitiBank (•••• 4412)',
            taxPan: 'KKKKK7890Q',
            daysWorked: 26
        }
    ],

    // ── INTERNAL SECURE HOSPITAL MAIL SYSTEM WITH AI WRITER ──
    internalMails: [
        {
            id: 'MAIL-001',
            fromId: 'DOC-01',
            fromName: 'Dr. Meera Nair',
            fromEmail: 'meera.nair@medcore.org',
            fromRole: 'Emergency Physician',
            toId: 'DOC-02',
            toName: 'Dr. Arjun Rao',
            toEmail: 'doctor@medcore.org',
            toRole: 'Senior Cardiologist',
            subject: 'Urgent Cardiology Consult: Rohan Kulkarni (Bed ICU-01)',
            body: 'Dear Dr. Rao,\n\nPatient Rohan Kulkarni (PT-4091) presented with acute STEMI and ongoing cardiogenic hypotension (BP 162/98 on admission, SpO2 91%). Please review the latest cardiac telemetry curve in ER Triage and advise if emergency cardiac catheterisation should be scheduled before noon.\n\nBest regards,\nDr. Meera Nair',
            timestamp: '2026-11-26 09:15',
            read: false,
            priority: 'Urgent'
        },
        {
            id: 'MAIL-002',
            fromId: 'PH-01',
            fromName: 'Maya Lin',
            fromEmail: 'pharmacist@medcore.org',
            fromRole: 'Chief Pharmacist',
            toId: 'ACC-01',
            toName: 'Sanjay Mehta, CPA',
            toEmail: 'accountant@medcore.org',
            toRole: 'CFO & Accountant',
            subject: 'Emergency Purchase Order Approval: Epinephrine & Medical O2',
            body: 'Hello Sanjay,\n\nStock levels for Epinephrine 1mg/mL Auto-Ampoules have dropped to 14 units (Safety threshold: 30) and Medical Oxygen cylinders to 9. We need an immediate financial approval for purchase order #PO-9921 for ₹84,500 to replenish both supplies before tonight\'s intake.\n\nThanks,\nMaya Lin',
            timestamp: '2026-11-26 08:45',
            read: true,
            priority: 'High'
        },
        {
            id: 'MAIL-003',
            fromId: 'ADM-01',
            fromName: 'Hospital Administrator',
            fromEmail: 'admin@medcore.org',
            fromRole: 'COO',
            toId: 'ALL',
            toName: 'All Hospital Personnel',
            toEmail: 'all.staff@medcore.org',
            toRole: 'Clinical & Ops Staff',
            subject: 'Hospital Accreditation Audit Schedule: Nov 25-27',
            body: 'Dear MedCore Team,\n\nThe Joint Commission hospital inspection begins this Wednesday. Please ensure all ER Triage telemetry curves, prescription records, and shift punch-in attendance logs are current.\n\nWarm regards,\nHospital Administration',
            timestamp: '2026-11-25 16:30',
            read: true,
            priority: 'Normal'
        }
    ],

    // ── ISSUE TICKETING & HELPDESK SYSTEM (Everybody can raise issues for Admin) ──
    supportIssues: [
        {
            id: 'ISSUE-301',
            raisedById: 'NRS-01',
            raisedByName: 'Kavya Menon, RN',
            raisedByRole: 'Nurse',
            category: 'Biomedical Equipment',
            priority: 'Critical',
            subject: 'Telemetry Monitor lead disconnection in Bed ICU-02',
            description: 'Channel 2 ECG leads on monitor M-02 are intermittently dropping cardiac rhythm tracing for patient Ananya Chatterjee. Requires urgent calibration.',
            status: 'Open',
            createdAt: '2026-11-26 08:30',
            resolutionNotes: 'Assigned to Biomedical Engineering team. Tech dispatched.'
        },
        {
            id: 'ISSUE-302',
            raisedById: 'WRD-01',
            raisedByName: 'Ravi Kumar',
            raisedByRole: 'Ward Staff',
            category: 'Facilities & Sanitation',
            priority: 'Moderate',
            subject: 'Hydraulic lift lever stuck on Bed CARD-02',
            description: 'The height adjustment pedal on Bed CARD-02 is jammed during sanitation. Needs maintenance check before new patient transfer.',
            status: 'In Progress',
            createdAt: '2026-11-26 09:10',
            resolutionNotes: 'Maintenance staff on site.'
        },
        {
            id: 'ISSUE-303',
            raisedById: 'PH-01',
            raisedByName: 'Maya Lin',
            raisedByRole: 'Pharmacist',
            category: 'Supply Chain',
            priority: 'High',
            subject: 'Vendor delay on Sterile Normal Saline 500mL batch',
            description: 'Supplier MedPharma flagged a 24-hour dispatch delay for our saline consignment. Need admin to coordinate secondary supplier backup.',
            status: 'Open',
            createdAt: '2026-11-25 18:00',
            resolutionNotes: 'Admin reaching out to alternate vendor.'
        }
    ],

    // ── DOCTOR MEDICAL CLINICAL GUIDELINES ──
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
    ],

    // ── AMBULANCE FLEET & TRACKING ──
    ambulances: [
        {
            id: 'AMB-101',
            vehicleNo: 'DL-01-AB-1011',
            type: 'Advanced Cardiac Life Support (ACLS)',
            driver: 'Ramesh Kumar',
            driverPhone: '+91 98765 43210',
            paramedic: 'Sunil Sharma, EMT-P',
            equipment: ['Defibrillator', 'Ventilator', 'ECG Monitor', 'O2 Cylinder', 'Syringe Infusion Pump'],
            baseLocation: 'Emergency Bay 1',
            currentLocation: 'Sector 62 Expressway Junction',
            destination: 'Central Emergency Trauma Center',
            status: 'En Route to Hospital',
            fuel: '84%',
            eta: '7 mins',
            assignedRequestId: 'REQ-802',
            patientOnBoard: 'Vikram Joshi (Cardiac Event)'
        },
        {
            id: 'AMB-102',
            vehicleNo: 'DL-01-AB-1022',
            type: 'Basic Life Support (BLS)',
            driver: 'Manoj Verma',
            driverPhone: '+91 98112 34567',
            paramedic: 'Pooja Tiwari, EMT-B',
            equipment: ['Stretcher', 'Basic O2 Kit', 'First Aid Trauma Kit', 'Splints'],
            baseLocation: 'Emergency Bay 2',
            currentLocation: 'Hospital Main Trauma Bay',
            destination: 'Standby at Base',
            status: 'Available',
            fuel: '95%',
            eta: 'Immediate',
            assignedRequestId: null,
            patientOnBoard: null
        },
        {
            id: 'AMB-103',
            vehicleNo: 'DL-01-AB-1033',
            type: 'Neonatal / Pediatric ICU (NICU)',
            driver: 'Harish Chandra',
            driverPhone: '+91 99223 44556',
            paramedic: 'Dr. Neha Kapoor (Pediatric Reg)',
            equipment: ['Neonatal Incubator', 'Pediatric Ventilator', 'Infant Phototherapy', 'Blood Gas Analyzer'],
            baseLocation: 'Maternity Wing Bay',
            currentLocation: 'City Maternity Clinic, Block C',
            destination: 'MedCore NICU Wing',
            status: 'At Scene',
            fuel: '78%',
            eta: '12 mins',
            assignedRequestId: 'REQ-803',
            patientOnBoard: 'Infant of Radhika Sen'
        },
        {
            id: 'AMB-104',
            vehicleNo: 'DL-01-AB-1044',
            type: 'Advanced Trauma Support (ALS)',
            driver: 'Suresh Yadav',
            driverPhone: '+91 97118 99887',
            paramedic: 'Amit Chauhan, EMT-P',
            equipment: ['Lucas CPR Device', 'Spinal Immobilizer', 'Portable Suction', 'Telemetry Link'],
            baseLocation: 'Emergency Bay 3',
            currentLocation: 'NH-24 Flyover Mile 18',
            destination: 'Accident Scene Mile 18',
            status: 'En Route to Patient',
            fuel: '68%',
            eta: '5 mins',
            assignedRequestId: 'REQ-804',
            patientOnBoard: null
        },
        {
            id: 'AMB-105',
            vehicleNo: 'DL-01-AB-1055',
            type: 'Patient Transport Unit (PTU)',
            driver: 'Deepak Rawat',
            driverPhone: '+91 98991 12233',
            paramedic: 'Kishore Pal, Attendant',
            equipment: ['Wheelchair Access Ramp', 'Standard O2', 'First Aid'],
            baseLocation: 'South Gate Dispatch',
            currentLocation: 'Hospital Fleet Workshop',
            destination: 'Scheduled Brake Inspection',
            status: 'Maintenance',
            fuel: '40%',
            eta: 'Out of Service',
            assignedRequestId: null,
            patientOnBoard: null
        }
    ],

    // ── EMERGENCY AMBULANCE DISPATCH REQUESTS ──
    ambulanceRequests: [
        {
            id: 'REQ-801',
            callerName: 'Sunita Sharma',
            callerPhone: '+91 98111 22334',
            pickupLocation: 'Greenwood Apartments, Flat 402, Sector 45',
            landmark: 'Near City Mall Gate 2',
            patientCondition: 'Elderly male collapsed, suspected acute respiratory failure, gasping for breath',
            severity: 'Critical',
            assignedAmbulanceId: null,
            status: 'Pending Dispatch',
            notes: 'Security advised to keep gate open and lift grounded.',
            timestamp: '2026-11-26 21:28'
        },
        {
            id: 'REQ-802',
            callerName: 'Ravi Joshi',
            callerPhone: '+91 99220 33445',
            pickupLocation: 'TechZone 4, Building 8 Entrance',
            landmark: 'Opposite Metro Pillar 142',
            patientCondition: 'Severe crushing chest pain, profuse sweating, BP dropping',
            severity: 'Critical',
            assignedAmbulanceId: 'AMB-101',
            status: 'En Route to Hospital',
            notes: 'ACLS AMB-101 dispatched with IV resuscitation started on board.',
            timestamp: '2026-11-26 20:55'
        },
        {
            id: 'REQ-803',
            callerName: 'Dr. Alok Verma',
            callerPhone: '+91 98450 11223',
            pickupLocation: 'Mother & Child Care Center, Block C',
            landmark: 'Behind St. Xavier School',
            patientCondition: 'Premature neonate (31 weeks) with severe respiratory distress syndrome',
            severity: 'Critical',
            assignedAmbulanceId: 'AMB-103',
            status: 'At Scene',
            notes: 'NICU transport team stabilizing infant in transport incubator.',
            timestamp: '2026-11-26 21:10'
        },
        {
            id: 'REQ-804',
            callerName: 'Traffic Police Patrol #12',
            callerPhone: '+91 98711 00991',
            pickupLocation: 'NH-24 Flyover Mile 18, Westbound',
            landmark: 'Near Toll Plaza Ramp',
            patientCondition: 'Two-wheeler road accident victim with open femur fracture and head trauma',
            severity: 'Critical',
            assignedAmbulanceId: 'AMB-104',
            status: 'En Route to Patient',
            notes: 'Trauma team en route with cervical collar and spinal board.',
            timestamp: '2026-11-26 21:35'
        },
        {
            id: 'REQ-805',
            callerName: 'Meera Chawla',
            callerPhone: '+91 99119 88776',
            pickupLocation: 'B-12, Sector 15 Residence',
            landmark: 'Near Community Park',
            patientCondition: 'Post-op rehabilitation patient needs non-emergency transfer for dialysis',
            severity: 'Standard',
            assignedAmbulanceId: null,
            status: 'Pending Dispatch',
            notes: 'Scheduled transfer, patient requires wheelchair assistance.',
            timestamp: '2026-11-26 21:40'
        }
    ],

    // ── DOCTOR APPOINTMENTS & CONSULTATION LOGS ──
    doctorAppointments: [
        {
            id: 'APT-1001',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            department: 'Cardiology',
            patientName: 'Pooja Verma',
            patientAge: 42,
            patientGender: 'Female',
            patientPhone: '+91 99887 66554',
            patientEmail: 'pooja.verma@example.com',
            appointmentDate: '2026-11-26',
            timeSlot: '10:00 AM - 10:30 AM',
            type: 'In-Person Consultation',
            symptoms: 'Recurring exertional chest tightness, shortness of breath on climbing stairs, mild dizziness.',
            vitals: {
                bp: '135/88 mmHg',
                hr: '82 bpm',
                spo2: '98%',
                temp: '98.4 °F',
                weight: '64 kg'
            },
            diagnosis: 'Stage-1 Hypertension, Suspected Exertional Angina',
            clinicalNotes: 'Resting ECG shows mild T-wave inversion in V4-V6. Advised 2D Echocardiogram, Treadmill Stress Test (TMT), and Lipid Profile.',
            prescription: 'Tab. Telmisartan 40mg (1 OD Morning)\nTab. Metoprolol Succinate 25mg (1 OD Post-Breakfast)\nTab. Sorbitrate 5mg (SOS Sublingual for acute chest pain)\nTab. Atorvastatin 20mg (1 HS Bedtime)',
            followUpDate: '2026-12-08',
            status: 'Completed',
            createdAt: '2026-11-26'
        },
        {
            id: 'APT-1002',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            department: 'Cardiology',
            patientName: 'Kishore Singhania',
            patientAge: 58,
            patientGender: 'Male',
            patientPhone: '+91 98112 44332',
            patientEmail: 'k.singhania@example.com',
            appointmentDate: '2026-11-26',
            timeSlot: '11:15 AM - 11:45 AM',
            type: 'Follow-up Consultation',
            symptoms: 'Post-angioplasty 6-month routine review, occasional fatigue, palpitations after brisk walking.',
            vitals: {
                bp: '128/82 mmHg',
                hr: '74 bpm',
                spo2: '99%',
                temp: '98.2 °F',
                weight: '76 kg'
            },
            diagnosis: 'Post-PCI Stent (LAD) Stable Review, Good Ventricular Function',
            clinicalNotes: 'Previous stent patent on Echo (LVEF 55%). Renal function and electrolytes within normal limits. Reinforce strict cardiac rehab exercise regimen.',
            prescription: 'Tab. Aspirin 75mg (1 OD Lunch)\nTab. Ticagrelor 90mg (1 BD)\nTab. Rosuvastatin 20mg + Ezetimibe 10mg (1 HS)\nTab. Bisoprolol 5mg (1 OD Morning)',
            followUpDate: '2026-12-24',
            status: 'Scheduled',
            createdAt: '2026-11-25'
        },
        {
            id: 'APT-1003',
            doctorId: 'DOC-01',
            doctorName: 'Dr. Priya Sharma',
            department: 'General Medicine',
            patientName: 'Rohan Mehra',
            patientAge: 29,
            patientGender: 'Male',
            patientPhone: '+91 98223 99887',
            patientEmail: 'rohan.mehra@example.com',
            appointmentDate: '2026-11-26',
            timeSlot: '02:00 PM - 02:30 PM',
            type: 'New Consultation',
            symptoms: 'Persistent high fever (102°F) for 4 days, severe body ache, retro-orbital headache, chills.',
            vitals: {
                bp: '115/75 mmHg',
                hr: '96 bpm',
                spo2: '97%',
                temp: '101.8 °F',
                weight: '70 kg'
            },
            diagnosis: 'Suspected Viral Pyrexia / Rule out Dengue or Malaria',
            clinicalNotes: 'Mild dehydration noted. Advised Dengue NS1 Antigen, CBC with platelet monitoring, and Peripheral Smear for Malarial Parasite.',
            prescription: 'Tab. Paracetamol 650mg (1 SOS Q6H for fever > 100°F)\nSyp. ORS Electral (2-3 Litres daily oral hydration)\nTab. Pantoprazole 40mg (1 OD 30 min before breakfast)\nAvoid NSAIDs (Ibuprofen / Diclofenac)',
            followUpDate: '2026-11-27',
            status: 'Scheduled',
            createdAt: '2026-11-25'
        },
        {
            id: 'APT-1004',
            doctorId: 'DOC-03',
            doctorName: 'Dr. Sarah Jenkins',
            department: 'Orthopedics',
            patientName: 'Ananya Roy',
            patientAge: 34,
            patientGender: 'Female',
            patientPhone: '+91 99110 55443',
            patientEmail: 'ananya.roy@example.com',
            appointmentDate: '2026-11-26',
            timeSlot: '03:30 PM - 04:00 PM',
            type: 'In-Person Consultation',
            symptoms: 'Sharp right knee joint pain following badminton match, swelling and inability to bear full weight.',
            vitals: {
                bp: '120/80 mmHg',
                hr: '78 bpm',
                spo2: '99%',
                temp: '98.6 °F',
                weight: '58 kg'
            },
            diagnosis: 'Suspected Right Knee Anterior Cruciate Ligament (ACL) or Meniscal Tear',
            clinicalNotes: 'Lachman test positive, joint effusion present. Advised urgent Right Knee MRI and dynamic knee brace.',
            prescription: 'Tab. Etoricoxib 90mg (1 OD Post-Dinner x 5 days)\nCap. Rabeprazole 20mg (1 OD Morning)\nIce compression 15 min TID\nStrict non-weight bearing with crutches',
            followUpDate: '2026-11-29',
            status: 'Scheduled',
            createdAt: '2026-11-25'
        },
        {
            id: 'APT-1005',
            doctorId: 'DOC-02',
            doctorName: 'Dr. Arjun Rao',
            department: 'Cardiology',
            patientName: 'Sunil Nair',
            patientAge: 62,
            patientGender: 'Male',
            patientPhone: '+91 98334 11223',
            patientEmail: 'sunil.nair@example.com',
            appointmentDate: '2026-11-25',
            timeSlot: '09:00 AM - 09:30 AM',
            type: 'In-Person Consultation',
            symptoms: 'Chronic ankle swelling, orthopnea when lying flat, early morning coughing.',
            vitals: {
                bp: '142/92 mmHg',
                hr: '88 bpm',
                spo2: '95%',
                temp: '98.6 °F',
                weight: '82 kg'
            },
            diagnosis: 'Congestive Cardiac Failure (NYHA Class II-III), Fluid Overload',
            clinicalNotes: 'Bilateral basal crepitations on auscultation, 2+ pedal edema. NT-proBNP elevated at 1450 pg/mL. Fluid restriction to 1.5L/day and low salt diet.',
            prescription: 'Tab. Torsemide 20mg (1 OD Morning)\nTab. Sacubitril/Valsartan 50mg (1 BD)\nTab. Spironolactone 25mg (1 OD)\nTab. Empagliflozin 10mg (1 OD Morning)',
            followUpDate: '2026-11-30',
            status: 'Completed',
            createdAt: '2026-11-25'
        }
    ]
};
