/* ===================================================================
   MedCore AI — Hospital Operations Master Controller
   Handles Role-Based Access, Recharts Line Charts, Duty Rosters,
   Multi-Department Financials, Staff Payroll, and Pharmacy Desks.
   =================================================================== */

// ── Application State ──
let currentUser = null;
let currentRole = null;
let currentSection = null;
let activeVitalsChart = null;
let activeVitalsPatient = null;
let selectedPayrollItem = null;

// Deep-copy data store
let users = JSON.parse(JSON.stringify(SampleData.users));
let doctors = JSON.parse(JSON.stringify(SampleData.doctors));
let nurses = JSON.parse(JSON.stringify(SampleData.nurses));
let wardStaff = JSON.parse(JSON.stringify(SampleData.wardStaff));
let shifts = JSON.parse(JSON.stringify(SampleData.shifts));
let patients = JSON.parse(JSON.stringify(SampleData.patients));
let beds = JSON.parse(JSON.stringify(SampleData.beds));
let prescriptions = JSON.parse(JSON.stringify(SampleData.prescriptions));
let medicines = JSON.parse(JSON.stringify(SampleData.medicines));
let hospitalTransactions = JSON.parse(JSON.stringify(SampleData.hospitalTransactions));
let payroll = JSON.parse(JSON.stringify(SampleData.payroll));
let doctorLibrary = JSON.parse(JSON.stringify(SampleData.doctorLibrary));

// ── Role Menus Master Configuration ──
const roleMenus = {
    admin: {
        label: 'Hospital Admin Workspace',
        items: [
            { id: 'admin-overview', icon: 'fa-th-large', label: 'Command Overview' },
            { id: 'triage-view', icon: 'fa-heartbeat', label: 'ER Triage & Vitals', badge: '3' },
            { id: 'ward-matrix', icon: 'fa-bed', label: 'Wards & Bed Matrix' },
            { id: 'admin-shifts', icon: 'fa-calendar-alt', label: 'Doctor Shifts & Duties' },
            { id: 'hospital-financials', icon: 'fa-chart-pie', label: 'Hospital Financials' },
            { id: 'payroll-system', icon: 'fa-money-check-alt', label: 'Staff Payroll System' },
            { id: 'pharmacy-desk', icon: 'fa-pills', label: 'Pharmacy & Billing Desk', badge: '5' },
            { id: 'staff-directory', icon: 'fa-id-badge', label: 'Staff Directory & Roles' },
            { id: 'ai-copilot', icon: 'fa-brain', label: 'AI Operations Copilot' }
        ]
    },
    doctor: {
        label: 'Attending Physician Workspace',
        items: [
            { id: 'doctor-shifts', icon: 'fa-calendar-check', label: 'My Shift Schedule' },
            { id: 'doctor-patients', icon: 'fa-user-injured', label: 'Allotted Patients & Vitals' },
            { id: 'doctor-prescriptions', icon: 'fa-prescription', label: 'Prescriptions Desk' },
            { id: 'doctor-library', icon: 'fa-book-medical', label: 'Clinical Guidelines Library' },
            { id: 'doctor-colleagues', icon: 'fa-user-md', label: 'On-Duty Colleagues' }
        ]
    },
    nurse: {
        label: 'Registered Nurse Workspace',
        items: [
            { id: 'nurse-workspace', icon: 'fa-user-nurse', label: 'Nurse Station & Tasks' },
            { id: 'triage-view', icon: 'fa-heartbeat', label: 'Patient Vitals & Telemetry' },
            { id: 'ward-matrix', icon: 'fa-bed', label: 'Ward Bed Allocation' }
        ]
    },
    ward: {
        label: 'Ward Staff Workspace',
        items: [
            { id: 'ward-workspace', icon: 'fa-procedures', label: 'Ward Operations & Doctors' },
            { id: 'ward-matrix', icon: 'fa-bed', label: 'Bed Sanitation Matrix' }
        ]
    },
    pharmacy: {
        label: 'Clinical Pharmacy Workspace',
        items: [
            { id: 'pharmacy-desk', icon: 'fa-prescription-bottle-alt', label: 'Pre-Pack Queue & Billing' },
            { id: 'hospital-financials', icon: 'fa-file-invoice-dollar', label: 'Sales & Receipts Ledger' }
        ]
    },
    accountant: {
        label: 'Hospital Finance & Payroll',
        items: [
            { id: 'hospital-financials', icon: 'fa-chart-line', label: 'Hospital Sales & Revenues' },
            { id: 'payroll-system', icon: 'fa-money-bill-wave', label: 'Staff Payroll & Salaries' },
            { id: 'pharmacy-desk', icon: 'fa-cash-register', label: 'Pharmacy Receipts Desk' },
            { id: 'staff-directory', icon: 'fa-users-cog', label: 'Personnel Records' }
        ]
    }
};

// ===================================================================
//  1. AUTHENTICATION & LOGIN
// ===================================================================

function quickFillLogin(identifier, password) {
    document.getElementById('login-username').value = identifier;
    document.getElementById('login-password').value = password;
    handleLogin();
}

function handleLogin(e) {
    if (e) e.preventDefault();
    const identifier = document.getElementById('login-username').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error');

    errorBox.classList.add('hidden');
    errorBox.textContent = '';

    // Match by email, username, or staff ID
    const user = users.find(u =>
        (u.email.toLowerCase() === identifier ||
         u.username.toLowerCase() === identifier ||
         u.employeeId.toLowerCase() === identifier) &&
        u.password === password
    );

    if (!user) {
        errorBox.textContent = 'Invalid credentials. Please verify your staff email or password.';
        errorBox.classList.remove('hidden');
        return false;
    }

    currentUser = user;
    currentRole = user.role;

    // Show App
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    // Update User Card in Sidebar
    document.getElementById('user-name-display').textContent = user.name;
    document.getElementById('user-role-label').textContent = user.title || formatRole(user.role);

    // Show/hide Admin Role View Switcher
    const switcherBox = document.getElementById('admin-switcher-container');
    if (user.role === 'admin') {
        switcherBox.style.display = 'block';
        document.getElementById('role-view-switcher').value = 'admin';
    } else {
        switcherBox.style.display = 'none';
    }

    buildNavigation(user.role);
    startLiveClock();

    showToast(`Welcome ${user.name}! Accessing ${user.department || formatRole(user.role)}.`, 'success');
    return false;
}

function logout() {
    currentUser = null;
    currentRole = null;
    currentSection = null;
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').classList.add('hidden');
}

function switchAdminView(targetRole) {
    currentRole = targetRole;
    buildNavigation(targetRole);
    showToast(`Switched view to ${formatRole(targetRole)} Portal`, 'info');
}

function formatRole(role) {
    const map = {
        admin: 'Hospital Administrator',
        doctor: 'Doctor / Physician',
        nurse: 'Registered Nurse',
        ward: 'Ward Staff',
        pharmacy: 'Pharmacist',
        accountant: 'Chief Accountant'
    };
    return map[role] || role;
}

// ===================================================================
//  2. NAVIGATION CONTROLLER
// ===================================================================

function buildNavigation(role) {
    const config = roleMenus[role] || roleMenus['admin'];
    document.getElementById('workspace-label').textContent = config.label;

    const navContainer = document.getElementById('sidebar-nav');
    navContainer.innerHTML = '';

    config.items.forEach((item, index) => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = `nav-link ${index === 0 ? 'active' : ''}`;
        link.dataset.section = item.id;
        link.innerHTML = `
            <div class="nav-link-left">
                <i class="fas ${item.icon}"></i>
                <span>${item.label}</span>
            </div>
            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        `;
        link.onclick = (e) => {
            e.preventDefault();
            navigateTo(item.id);
        };
        navContainer.appendChild(link);
    });

    if (config.items.length > 0) {
        navigateTo(config.items[0].id);
    }
}

function navigateTo(sectionId) {
    currentSection = sectionId;

    // Toggle active link
    document.querySelectorAll('#sidebar-nav .nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById('section-' + sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update Breadcrumb
    const config = roleMenus[currentRole || 'admin'];
    const activeItem = config ? config.items.find(i => i.id === sectionId) : null;
    document.getElementById('breadcrumb-role').textContent = formatRole(currentRole || 'admin');
    document.getElementById('breadcrumb-section').textContent = activeItem ? activeItem.label : 'Operations';

    document.getElementById('sidebar').classList.remove('open');
    refreshCurrentView();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function startLiveClock() {
    const update = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        document.getElementById('time-display').textContent = `${timeStr}  •  ${dateStr}`;
    };
    update();
    if (!window._clockInterval) {
        window._clockInterval = setInterval(update, 1000);
    }
}

// ===================================================================
//  3. MASTER VIEW DISPATCHER
// ===================================================================

function refreshCurrentView() {
    switch (currentSection) {
        case 'admin-overview':
            renderAdminOverview();
            break;
        case 'triage-view':
            renderTriageView();
            break;
        case 'ward-matrix':
            renderWardMatrix();
            break;
        case 'admin-shifts':
            renderAdminShifts();
            break;
        case 'hospital-financials':
            renderHospitalFinancials();
            break;
        case 'payroll-system':
            renderPayrollSystem();
            break;
        case 'doctor-shifts':
            renderDoctorShifts();
            break;
        case 'doctor-library':
            renderDoctorLibrary();
            break;
        case 'doctor-patients':
            renderDoctorPatients();
            break;
        case 'doctor-prescriptions':
            renderDoctorPrescriptions();
            break;
        case 'doctor-colleagues':
            renderDoctorColleagues();
            break;
        case 'pharmacy-desk':
            renderPharmacyDesk();
            break;
        case 'nurse-workspace':
            renderNurseWorkspace();
            break;
        case 'ward-workspace':
            renderWardWorkspace();
            break;
        case 'staff-directory':
            renderStaffDirectory();
            break;
        case 'ai-copilot':
            // Static elements ready
            break;
    }
}

// ===================================================================
//  4. ADMIN COMMAND OVERVIEW
// ===================================================================

function renderAdminOverview() {
    document.getElementById('stat-adm-patients').textContent = patients.length;
    const occupiedCount = beds.filter(b => b.status === 'Occupied').length;
    const pct = Math.round((occupiedCount / beds.length) * 100);
    document.getElementById('stat-adm-beds').textContent = `${pct}%`;
    const lowStockCount = medicines.filter(m => m.quantity <= m.threshold).length;
    document.getElementById('stat-adm-stock').textContent = lowStockCount;

    // Ward breakdown bars
    const wards = ['Emergency', 'ICU', 'Cardiology', 'General'];
    const wardHtml = wards.map(w => {
        const total = beds.filter(b => b.ward === w).length;
        const occ = beds.filter(b => b.ward === w && b.status === 'Occupied').length;
        const free = total - occ;
        const wPct = Math.round((occ / total) * 100);
        return `
            <div style="margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:4px;">
                    <span style="color:#ffffff;">${w} Ward</span>
                    <span style="color:${free === 0 ? 'var(--danger)' : '#38bdf8'}">${occ}/${total} Occupied (${free} Open)</span>
                </div>
                <div style="height:6px; background:#1e293b; border-radius:999px; overflow:hidden;">
                    <div style="width:${wPct}%; height:100%; background:${wPct > 70 ? 'var(--danger)' : '#2563eb'};"></div>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('adm-ward-breakdown').innerHTML = wardHtml;

    // Critical Watchlist
    const criticalPatients = patients.filter(p => p.severity === 'Critical');
    const watchHtml = criticalPatients.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;">
            <div>
                <strong style="color:#ffffff;">${p.name}</strong> <span style="font-size:11.5px; color:#94a3b8;">(${p.id})</span>
                <div style="font-size:11.5px; color:#cbd5e1;">${p.concern}</div>
            </div>
            <div style="text-align:right;">
                <span class="severity-badge critical">${p.bed} • ${p.vitals.hr} bpm</span>
                <div style="font-size:11px; color:#94a3b8; margin-top:2px;">${p.doctorName}</div>
            </div>
        </div>
    `).join('');
    document.getElementById('adm-critical-watchlist').innerHTML = watchHtml || '<p style="color:#64748b">No critical patients right now.</p>';
}

function generateAIBriefing() {
    const briefing = document.getElementById('ai-briefing-text');
    briefing.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Synthesizing clinical state across hospital database...`;
    setTimeout(() => {
        briefing.innerHTML = `
            <strong>Live AI Hospital Audit:</strong> 10 patients actively monitored across 4 wards. Critical acuity index is elevated in <strong>ICU (Bed ICU-01 &amp; ICU-02)</strong> due to concurrent acute STEMI and septic shock protocols. <strong>Epinephrine 1mg/mL</strong> and <strong>Medical Oxygen Cylinders</strong> have breached emergency safety thresholds (14 ampoules &amp; 9 cylinders remaining). Shift handover for Emergency Bay 1 recommended at 13:45 to prevent triage transfer delays.
        `;
        showToast('AI Executive Briefing refreshed from live clinical records.', 'success');
    }, 450);
}

// ===================================================================
//  5. ER TRIAGE & RECHARTS HISTORICAL VITALS
// ===================================================================

let currentTriageFilter = 'All';

function renderTriageView() {
    let filtered = patients;
    if (currentTriageFilter !== 'All') {
        filtered = patients.filter(p => p.severity === currentTriageFilter);
    }

    const rows = filtered.map(p => `
        <tr>
            <td>
                <strong style="color:#ffffff; font-size:13.5px;">${p.name}</strong>
                <div style="font-size:11.5px; color:#94a3b8;">${p.id} • ${p.age}y ${p.gender} • ${p.department}</div>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">${p.concern}</div>
            </td>
            <td>
                <span class="severity-badge ${p.severity.toLowerCase()}">${p.severity}</span>
            </td>
            <td>
                <strong style="color:#38bdf8;">${p.bed}</strong>
                <div style="font-size:11.5px; color:#94a3b8;">${p.doctorName}</div>
            </td>
            <td>
                <div style="display:flex; flex-direction:column; gap:2px; font-size:12px;">
                    <span style="color:#ef4444; font-weight:700;"><i class="fas fa-heart"></i> ${p.vitals.hr} BPM</span>
                    <span style="color:#0ea5e9; font-weight:700;"><i class="fas fa-lungs"></i> ${p.vitals.spo2}% SpO2</span>
                    <span style="color:#a855f7; font-weight:700;"><i class="fas fa-tachometer-alt"></i> ${p.vitals.bp} mmHg</span>
                </div>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openPatientVitalsModal('${p.id}')">
                    <i class="fas fa-chart-line"></i> Vitals Telemetry (${p.vitalsHistory ? p.vitalsHistory.length : 0})
                </button>
            </td>
        </tr>
    `).join('');
    document.getElementById('triage-table-body').innerHTML = rows || '<tr><td colspan="5" style="text-align:center; color:#64748b;">No patients found.</td></tr>';
}

function filterTriageList(filter) {
    currentTriageFilter = filter;
    document.querySelectorAll('.triage-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.startsWith(filter));
    });
    renderTriageView();
}

function searchTriageList(query) {
    const q = query.toLowerCase();
    const rows = patients.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.bed.toLowerCase().includes(q) ||
        p.concern.toLowerCase().includes(q)
    ).map(p => `
        <tr>
            <td>
                <strong style="color:#ffffff;">${p.name}</strong> (${p.id})
                <div style="font-size:11.5px; color:#94a3b8;">${p.department} • ${p.concern}</div>
            </td>
            <td><span class="severity-badge ${p.severity.toLowerCase()}">${p.severity}</span></td>
            <td><strong style="color:#38bdf8;">${p.bed}</strong> (${p.doctorName})</td>
            <td>${p.vitals.hr} bpm • ${p.vitals.spo2}% • ${p.vitals.bp}</td>
            <td><button class="btn btn-primary btn-sm" onclick="openPatientVitalsModal('${p.id}')"><i class="fas fa-chart-line"></i> Telemetry</button></td>
        </tr>
    `).join('');
    document.getElementById('triage-table-body').innerHTML = rows;
}

// Open Vitals Modal & Render Recharts Line Chart
function openPatientVitalsModal(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    activeVitalsPatient = patient;

    document.getElementById('vitals-patient-name').textContent = `${patient.name} (${patient.id})`;
    document.getElementById('vitals-patient-meta').textContent = `Age ${patient.age} • ${patient.department} • Bed ${patient.bed} • Attending: ${patient.doctorName}`;
    document.getElementById('vitals-badge-hr').textContent = `${patient.vitals.hr} BPM`;
    document.getElementById('vitals-badge-spo2').textContent = `${patient.vitals.spo2}% SpO2`;
    document.getElementById('vitals-badge-bp').textContent = `${patient.vitals.bp} mmHg`;

    // Instantiate / Refresh Recharts Chart Engine
    if (activeVitalsChart) {
        activeVitalsChart.destroy();
    }
    activeVitalsChart = new RechartsVitalsLineChart('recharts-vitals-chart-container', { height: 310 });
    activeVitalsChart.setData(patient.vitalsHistory || []);

    // Set default log time to current time
    const now = new Date();
    document.getElementById('nv-time').value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    document.getElementById('nv-hr').value = patient.vitals.hr;
    document.getElementById('nv-bpsys').value = patient.vitals.bpSys || 120;
    document.getElementById('nv-bpdia').value = patient.vitals.bpDia || 80;
    document.getElementById('nv-spo2').value = patient.vitals.spo2;

    openModal('vitals-modal');
}

function submitNewVitals(e) {
    e.preventDefault();
    if (!activeVitalsPatient) return;

    const time = document.getElementById('nv-time').value.trim();
    const hr = parseInt(document.getElementById('nv-hr').value);
    const bpSys = parseInt(document.getElementById('nv-bpsys').value);
    const bpDia = parseInt(document.getElementById('nv-bpdia').value);
    const spo2 = parseInt(document.getElementById('nv-spo2').value);

    const newLog = {
        time: time,
        heartRate: hr,
        bpSys: bpSys,
        bpDia: bpDia,
        spo2: spo2,
        temp: 98.6
    };

    if (!activeVitalsPatient.vitalsHistory) activeVitalsPatient.vitalsHistory = [];
    activeVitalsPatient.vitalsHistory.push(newLog);

    // Update current snapshot
    activeVitalsPatient.vitals = {
        hr: hr,
        spo2: spo2,
        bp: `${bpSys}/${bpDia}`,
        bpSys: bpSys,
        bpDia: bpDia,
        temp: 98.6
    };

    // Update modal badges
    document.getElementById('vitals-badge-hr').textContent = `${hr} BPM`;
    document.getElementById('vitals-badge-spo2').textContent = `${spo2}% SpO2`;
    document.getElementById('vitals-badge-bp').textContent = `${bpSys}/${bpDia} mmHg`;

    // Re-render Recharts line chart smoothly
    activeVitalsChart.setData(activeVitalsPatient.vitalsHistory);

    // Refresh underlying tables
    renderTriageView();
    showToast(`Vitals logged for ${activeVitalsPatient.name}. Recharts curve updated.`, 'success');
}

// ===================================================================
//  6. WARDS & BED MATRIX
// ===================================================================

let currentWardFilter = 'All';

function renderWardMatrix() {
    let filtered = beds;
    if (currentWardFilter !== 'All') {
        filtered = beds.filter(b => b.ward === currentWardFilter);
    }

    const html = filtered.map((b, idx) => {
        const isOccupied = b.status === 'Occupied';
        const isCleaning = b.status === 'Cleaning';
        return `
            <div class="bed-matrix-card">
                <div class="bed-card-top">
                    <span class="bed-card-id">${b.id}</span>
                    <span class="bed-status-tag ${b.status.toLowerCase()}">${b.status}</span>
                </div>
                <div class="bed-patient-name">${b.patient}</div>
                <div style="font-size:11.5px; color:#94a3b8;">${b.ward} Ward</div>
                <div class="bed-details-row">
                    <span>SpO2: <strong style="color:#ffffff;">${b.spo2}</strong></span>
                    ${isCleaning ? `
                        <button class="btn btn-success btn-sm" onclick="markBedReady('${b.id}')"><i class="fas fa-check"></i> Mark Ready</button>
                    ` : isOccupied ? `
                        <button class="btn btn-secondary btn-sm" onclick="queueBedCleaning('${b.id}')">Discharge / Clean</button>
                    ` : `
                        <span style="color:var(--success); font-weight:700;"><i class="fas fa-door-open"></i> Available</span>
                    `}
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('bed-matrix-container').innerHTML = html;
}

function filterBedsWard(ward) {
    currentWardFilter = ward;
    document.querySelectorAll('.ward-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.startsWith(ward));
    });
    renderWardMatrix();
}

function markBedReady(bedId) {
    const bed = beds.find(b => b.id === bedId);
    if (bed) {
        bed.status = 'Available';
        bed.patient = 'Ready for intake';
        bed.spo2 = '—';
        renderWardMatrix();
        showToast(`Bed ${bedId} marked Sanitized & Available for ER triage intake!`, 'success');
    }
}

function queueBedCleaning(bedId) {
    const bed = beds.find(b => b.id === bedId);
    if (bed) {
        bed.status = 'Cleaning';
        bed.patient = 'Sanitization in progress';
        bed.spo2 = '—';
        renderWardMatrix();
        showToast(`Bed ${bedId} queued for sanitization protocol.`, 'info');
    }
}

// ===================================================================
//  7. ADMIN DOCTOR SHIFTS & DUTY SCHEDULING (Change / Add Duties)
// ===================================================================

function renderAdminShifts() {
    const rows = shifts.map(s => `
        <tr>
            <td><strong style="color:#ffffff;">${s.staffName}</strong></td>
            <td><span class="role-tag ${s.staffType.toLowerCase().replace(' ', '')}">${s.staffType}</span></td>
            <td>${s.date}</td>
            <td><strong>${s.start} — ${s.end}</strong></td>
            <td>${s.ward} Ward</td>
            <td><span class="doctor-location-pill"><i class="fas fa-map-marker-alt"></i> ${s.location}</span></td>
            <td><span class="status-badge ${s.status === 'Active' ? 'active' : 'ready'}">${s.status}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editShiftDuty('${s.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteShiftDuty('${s.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    document.getElementById('admin-shifts-table-body').innerHTML = rows;
}

function openAssignDutyModal() {
    document.getElementById('assign-duty-form').reset();
    document.getElementById('duty-edit-id').value = '';
    document.getElementById('duty-modal-title').innerHTML = '<i class="fas fa-calendar-plus" style="color:var(--primary)"></i> Assign Staff Duty / Shift';
    document.getElementById('duty-date').value = '2026-11-21';
    document.getElementById('duty-start').value = '08:00';
    document.getElementById('duty-end').value = '16:00';
    populateDutyStaffDropdown('Doctor');
    openModal('assign-duty-modal');
}

function populateDutyStaffDropdown(staffType) {
    const select = document.getElementById('duty-staff-member');
    if (staffType === 'Doctor') {
        select.innerHTML = doctors.map(d => `<option value="${d.id}" data-name="${d.name}">${d.name} (${d.specialization})</option>`).join('');
    } else if (staffType === 'Nurse') {
        select.innerHTML = nurses.map(n => `<option value="${n.id}" data-name="${n.name}">${n.name} (${n.department})</option>`).join('');
    } else {
        select.innerHTML = wardStaff.map(w => `<option value="${w.id}" data-name="${w.name}">${w.name} (${w.department})</option>`).join('');
    }
}

function editShiftDuty(shiftId) {
    const s = shifts.find(item => item.id === shiftId);
    if (!s) return;

    openAssignDutyModal();
    document.getElementById('duty-edit-id').value = s.id;
    document.getElementById('duty-modal-title').innerHTML = `<i class="fas fa-edit" style="color:var(--accent)"></i> Modify Shift: ${s.staffName}`;
    document.getElementById('duty-staff-type').value = s.staffType;
    populateDutyStaffDropdown(s.staffType);
    document.getElementById('duty-staff-member').value = s.staffId;
    document.getElementById('duty-date').value = s.date;
    document.getElementById('duty-ward').value = s.ward;
    document.getElementById('duty-start').value = s.start;
    document.getElementById('duty-end').value = s.end;
    document.getElementById('duty-location').value = s.location;
}

function deleteShiftDuty(shiftId) {
    if (confirm('Are you sure you want to cancel this scheduled shift duty?')) {
        shifts = shifts.filter(s => s.id !== shiftId);
        renderAdminShifts();
        showToast('Shift cancelled successfully.', 'info');
    }
}

function submitAssignDuty(e) {
    e.preventDefault();
    const editId = document.getElementById('duty-edit-id').value;
    const staffType = document.getElementById('duty-staff-type').value;
    const staffSelect = document.getElementById('duty-staff-member');
    const staffId = staffSelect.value;
    const staffName = staffSelect.options[staffSelect.selectedIndex].dataset.name;
    const date = document.getElementById('duty-date').value;
    const ward = document.getElementById('duty-ward').value;
    const start = document.getElementById('duty-start').value;
    const end = document.getElementById('duty-end').value;
    const location = document.getElementById('duty-location').value.trim();

    if (editId) {
        const existing = shifts.find(s => s.id === editId);
        if (existing) {
            existing.staffType = staffType;
            existing.staffId = staffId;
            existing.staffName = staffName;
            existing.date = date;
            existing.ward = ward;
            existing.start = start;
            existing.end = end;
            existing.location = location;
            showToast(`Shift updated for ${staffName}!`, 'success');
        }
    } else {
        const newShift = {
            id: 'SH-' + String(shifts.length + 1).padStart(2, '0'),
            staffType: staffType,
            staffId: staffId,
            staffName: staffName,
            date: date,
            start: start,
            end: end,
            ward: ward,
            location: location,
            status: date === '2026-11-21' ? 'Active' : 'Scheduled'
        };
        shifts.unshift(newShift);
        showToast(`Duty assigned to ${staffName} (${ward} Ward - ${location})!`, 'success');
    }

    closeModal('assign-duty-modal');
    renderAdminShifts();
}

// ===================================================================
//  8. HOSPITAL FINANCIALS & MULTI-DEPARTMENT SALES
// ===================================================================

function renderHospitalFinancials() {
    const summary = SampleData.departmentSalesSummary;
    document.getElementById('fin-total-rev').textContent = `₹${summary.totalHospitalRevenue.toLocaleString('en-IN')}`;
    document.getElementById('fin-pharmacy-rev').textContent = `₹${summary.pharmacy.toLocaleString('en-IN')}`;
    document.getElementById('fin-opd-rev').textContent = `₹${summary.opd.toLocaleString('en-IN')}`;
    document.getElementById('fin-icu-rev').textContent = `₹${summary.icu.toLocaleString('en-IN')}`;
    document.getElementById('fin-er-rev').textContent = `₹${summary.emergency.toLocaleString('en-IN')}`;
    document.getElementById('fin-ot-rev').textContent = `₹${summary.surgery.toLocaleString('en-IN')}`;

    const rows = hospitalTransactions.map(t => `
        <tr>
            <td><strong>${t.id}</strong></td>
            <td>${t.date}</td>
            <td><span class="role-tag ${t.department.toLowerCase().replace(/[^a-z]/g, '')}">${t.department}</span></td>
            <td>${t.patientId || 'Walk-in'}</td>
            <td>${t.service}</td>
            <td>${t.paymentMode}</td>
            <td><strong style="color:#ffffff;">₹${t.amount.toLocaleString('en-IN')}</strong></td>
            <td><span class="status-badge paid"><i class="fas fa-check-circle"></i> ${t.status}</span></td>
        </tr>
    `).join('');
    document.getElementById('hospital-transactions-table-body').innerHTML = rows;
}

function exportFinancialsReport() {
    try {
        const exportData = hospitalTransactions.map(t => ({
            'Transaction ID': t.id,
            'Date & Time': t.date,
            'Department': t.department,
            'Patient ID': t.patientId,
            'Clinical Service / Product': t.service,
            'Amount (INR)': t.amount,
            'Payment Mode': t.paymentMode,
            'Cashier / Staff': t.cashier,
            'Audit Status': t.status
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hospital Sales Ledger');
        XLSX.writeFile(wb, `MedCore_Hospital_Financials_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('Hospital Sales Ledger exported to Excel!', 'success');
    } catch (err) {
        showToast('Export failed: ' + err.message, 'error');
    }
}

// ===================================================================
//  9. FULL PAYROLL MANAGEMENT SYSTEM (Accountant & Admin)
// ===================================================================

function renderPayrollSystem() {
    const rows = payroll.map(p => `
        <tr>
            <td>
                <strong style="color:#ffffff;">${p.name}</strong>
                <div style="font-size:11.5px; color:#94a3b8;">${p.staffId}</div>
            </td>
            <td>
                <span class="role-tag ${p.role.toLowerCase().replace(' ', '')}">${p.role}</span>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">${p.department}</div>
            </td>
            <td>₹${p.baseSalary.toLocaleString('en-IN')}</td>
            <td style="color:var(--success);">+₹${p.allowances.toLocaleString('en-IN')}</td>
            <td style="color:var(--danger);">-₹${p.deductions.toLocaleString('en-IN')}</td>
            <td><strong style="color:#38bdf8; font-size:14px;">₹${p.netSalary.toLocaleString('en-IN')}</strong></td>
            <td>
                <div style="font-size:12px;">${p.bankAccount}</div>
                <div style="font-size:10.5px; color:#64748b;">PAN: ${p.taxPan}</div>
            </td>
            <td>
                <span class="status-badge ${p.status.toLowerCase()}">${p.status}</span>
                ${p.paymentDate !== '—' ? `<div style="font-size:10.5px; color:#94a3b8; margin-top:2px;">${p.paymentDate}</div>` : ''}
            </td>
            <td>
                ${p.status === 'Pending' ? `
                    <button class="btn btn-success btn-sm" onclick="openPaySalaryModal('${p.id}')"><i class="fas fa-hand-holding-usd"></i> Pay Salary</button>
                ` : `
                    <button class="btn btn-secondary btn-sm" onclick="openPaySalaryModal('${p.id}')"><i class="fas fa-file-invoice"></i> Payslip</button>
                `}
            </td>
        </tr>
    `).join('');
    document.getElementById('payroll-table-body').innerHTML = rows;
}

function openPaySalaryModal(payrollId) {
    const item = payroll.find(p => p.id === payrollId);
    if (!item) return;
    selectedPayrollItem = item;

    const isPaid = item.status === 'Paid';
    document.getElementById('payroll-slip-content').innerHTML = `
        <div style="background:#090e18; border:1px solid var(--border); border-radius:10px; padding:20px; font-size:13px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:14px;">
                <div>
                    <h3 style="color:#ffffff; font-size:16px;">${item.name}</h3>
                    <p style="color:#94a3b8; font-size:12px;">${item.role} • ${item.department} • Staff ID: ${item.staffId}</p>
                </div>
                <div style="text-align:right;">
                    <span class="status-badge ${isPaid ? 'paid' : 'pending'}">${item.status}</span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                <div><span style="color:#94a3b8;">Base Salary:</span> <strong>₹${item.baseSalary.toLocaleString('en-IN')}</strong></div>
                <div><span style="color:#94a3b8;">Special Allowances:</span> <strong style="color:var(--success);">+₹${item.allowances.toLocaleString('en-IN')}</strong></div>
                <div><span style="color:#94a3b8;">Statutory Tax / Deductions:</span> <strong style="color:var(--danger);">-₹${item.deductions.toLocaleString('en-IN')}</strong></div>
                <div><span style="color:#94a3b8;">Beneficiary Account:</span> <strong>${item.bankAccount}</strong></div>
            </div>

            <div style="background:#111d33; padding:12px 16px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:#cbd5e1;">Net Payable Disbursal:</span>
                <strong style="font-size:18px; color:#38bdf8;">₹${item.netSalary.toLocaleString('en-IN')}</strong>
            </div>
        </div>
    `;

    document.getElementById('btn-confirm-pay').style.display = isPaid ? 'none' : 'inline-flex';
    openModal('payroll-modal');
}

function confirmPaySalary() {
    if (!selectedPayrollItem) return;
    selectedPayrollItem.status = 'Paid';
    selectedPayrollItem.paymentDate = new Date().toISOString().split('T')[0];

    // Log as a hospital payroll transaction
    hospitalTransactions.unshift({
        id: 'TXN-SAL-' + String(hospitalTransactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: 'Payroll Disbursal',
        patientId: selectedPayrollItem.staffId,
        service: `Monthly Salary Payment to ${selectedPayrollItem.name}`,
        amount: selectedPayrollItem.netSalary,
        paymentMode: 'Direct Bank NEFT',
        cashier: currentUser ? currentUser.name : 'Accountant',
        status: 'Completed'
    });

    closeModal('payroll-modal');
    renderPayrollSystem();
    showToast(`Salary of ₹${selectedPayrollItem.netSalary.toLocaleString('en-IN')} disbursed to ${selectedPayrollItem.name}!`, 'success');
}

function disburseAllPendingSalaries() {
    let count = 0;
    payroll.forEach(p => {
        if (p.status === 'Pending') {
            p.status = 'Paid';
            p.paymentDate = new Date().toISOString().split('T')[0];
            count++;
        }
    });
    renderPayrollSystem();
    showToast(`Batch Disbursal: Paid ${count} pending staff salaries electronically!`, 'success');
}

function exportPayrollExcel() {
    try {
        const exportData = payroll.map(p => ({
            'Payroll ID': p.id,
            'Staff ID': p.staffId,
            'Staff Full Name': p.name,
            'Designation / Role': p.role,
            'Department': p.department,
            'Base Salary (INR)': p.baseSalary,
            'Allowances': p.allowances,
            'Tax & Deductions': p.deductions,
            'Net Disbursed': p.netSalary,
            'Payment Status': p.status,
            'Disbursement Date': p.paymentDate,
            'Bank Account': p.bankAccount,
            'Income Tax PAN': p.taxPan
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Staff Payroll');
        XLSX.writeFile(wb, `MedCore_Staff_Payroll_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('Payroll sheet exported to Excel!', 'success');
    } catch (err) {
        showToast('Export failed: ' + err.message, 'error');
    }
}

// ===================================================================
//  10. DOCTOR VIEWS (Shifts, Library, Patients, Prescriptions, Colleagues)
// ===================================================================

function renderDoctorShifts() {
    const docId = (currentUser && currentUser.employeeId) || 'DOC-02';
    const myShifts = shifts.filter(s => s.staffId === docId);

    const rows = myShifts.map(s => `
        <tr>
            <td><strong>${s.date}</strong></td>
            <td>${s.start}</td>
            <td>${s.end}</td>
            <td>${s.ward} Ward</td>
            <td><span class="doctor-location-pill"><i class="fas fa-map-marker-alt"></i> ${s.location}</span></td>
            <td><span class="status-badge ${s.status === 'Active' ? 'active' : 'ready'}">${s.status}</span></td>
        </tr>
    `).join('');
    document.getElementById('doc-shifts-table-body').innerHTML = rows || '<tr><td colspan="6" style="text-align:center; color:#64748b;">No scheduled shifts.</td></tr>';
}

function renderDoctorLibrary() {
    const html = doctorLibrary.map(item => `
        <div class="library-card">
            <span class="library-tag">${item.category} • ${item.code}</span>
            <h4>${item.title}</h4>
            <p class="library-summary">${item.summary}</p>
            <div class="library-chips">
                ${item.tags.map(t => `<span class="library-chip">${t}</span>`).join('')}
            </div>
        </div>
    `).join('');
    document.getElementById('doctor-library-container').innerHTML = html;
}

function renderDoctorPatients() {
    const docId = (currentUser && currentUser.employeeId) || 'DOC-02';
    const myPatients = patients.filter(p => p.doctorId === docId);

    const rows = myPatients.map(p => `
        <tr>
            <td>
                <strong style="color:#ffffff;">${p.name}</strong> (${p.id})
                <div style="font-size:11.5px; color:#94a3b8;">${p.age}y ${p.gender}</div>
            </td>
            <td><span class="severity-badge ${p.severity.toLowerCase()}">${p.severity}</span></td>
            <td><strong style="color:#38bdf8;">${p.bed}</strong> (${p.ward})</td>
            <td>${p.concern}</td>
            <td>
                <span style="color:#ef4444; font-weight:700;">${p.vitals.hr} bpm</span> • 
                <span style="color:#0ea5e9; font-weight:700;">${p.vitals.spo2}%</span> • 
                <span style="color:#a855f7; font-weight:700;">${p.vitals.bp}</span>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openPatientVitalsModal('${p.id}')"><i class="fas fa-chart-line"></i> Vitals</button>
            </td>
        </tr>
    `).join('');
    document.getElementById('doc-patients-table-body').innerHTML = rows || '<tr><td colspan="6" style="text-align:center; color:#64748b;">No patients currently assigned.</td></tr>';
}

function renderDoctorPrescriptions() {
    const rows = prescriptions.map(r => `
        <tr>
            <td><strong>${r.id}</strong></td>
            <td>${r.patientName} (${r.patientId})</td>
            <td>${r.ward}</td>
            <td>${r.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
            <td><span class="severity-badge ${r.urgency.toLowerCase()}">${r.urgency}</span></td>
            <td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
        </tr>
    `).join('');
    document.getElementById('doc-rx-table-body').innerHTML = rows;
}

function renderDoctorColleagues() {
    const activeDocShifts = shifts.filter(s => s.staffType === 'Doctor' && s.date === '2026-11-21');
    const rows = activeDocShifts.map(s => {
        const doc = doctors.find(d => d.id === s.staffId);
        return `
            <tr>
                <td><strong style="color:#ffffff;">${s.staffName}</strong></td>
                <td>${doc ? doc.specialization : 'Specialist'}</td>
                <td>${s.ward} Ward</td>
                <td><span class="doctor-location-pill"><i class="fas fa-map-marker-alt"></i> ${s.location}</span></td>
                <td><strong>${s.end}</strong></td>
                <td><span class="status-badge active"><i class="fas fa-circle" style="font-size:7px;"></i> On Duty Live</span></td>
            </tr>
        `;
    }).join('');
    document.getElementById('doc-colleagues-table-body').innerHTML = rows;
}

// ===================================================================
//  11. PHARMACY DESK (Pre-Pack, Stock, Billing, AI)
// ===================================================================

function renderPharmacyDesk() {
    // 1. Rx Queue
    const queueRows = prescriptions.map((r, idx) => `
        <tr>
            <td><strong>${r.id}</strong></td>
            <td>${r.doctorName}</td>
            <td><strong>${r.patientName}</strong> (${r.patientId})<div style="font-size:11.5px; color:#94a3b8;">${r.ward}</div></td>
            <td>${r.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
            <td><strong style="color:#38bdf8;">₹${r.estimatedTotal}</strong></td>
            <td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
            <td>
                ${r.status === 'Pending' ? `
                    <button class="btn btn-primary btn-sm" onclick="markRxReady(${idx})"><i class="fas fa-box"></i> Start Packing</button>
                ` : r.status === 'Ready' ? `
                    <button class="btn btn-success btn-sm" onclick="quickBillRx(${idx})"><i class="fas fa-receipt"></i> Quick Bill &amp; Dispense</button>
                ` : `
                    <span style="color:var(--success); font-size:12px; font-weight:700;"><i class="fas fa-check-circle"></i> Dispensed</span>
                `}
            </td>
        </tr>
    `).join('');
    document.getElementById('pharm-rx-queue-body').innerHTML = queueRows;

    // 2. Inventory
    const stockRows = medicines.map((m, idx) => {
        const isLow = m.quantity <= m.threshold;
        return `
            <tr>
                <td><strong style="color:#ffffff;">${m.name}</strong> (${m.id})</td>
                <td>${m.category}</td>
                <td><strong style="color:${isLow ? 'var(--danger)' : '#ffffff'}; font-size:14px;">${m.quantity}</strong></td>
                <td>${m.threshold}</td>
                <td>₹${m.unitPrice}</td>
                <td><span class="severity-badge ${isLow ? 'critical' : 'routine'}">${isLow ? 'LOW STOCK' : 'IN STOCK'}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="quickRestockMedicine(${idx})"><i class="fas fa-plus"></i> Restock +50</button>
                </td>
            </tr>
        `;
    }).join('');
    document.getElementById('pharm-inventory-body').innerHTML = stockRows;

    // 3. AI Advisor
    const lowStockItems = medicines.filter(m => m.quantity <= m.threshold);
    document.getElementById('pharm-ai-advisor-content').innerHTML = `
        <div style="font-size:14px; font-weight:700; color:#ffffff; margin-bottom:10px;">
            <i class="fas fa-brain" style="color:var(--accent)"></i> AI Inventory Velocity &amp; Demand Forecast
        </div>
        <p style="color:#cbd5e1; font-size:13.5px; line-height:1.6; margin-bottom:14px;">
            AI detected high consumption velocity on <strong>Atorvastatin 20mg</strong> (120 units consumed in past 48h) and <strong>Epinephrine Auto-Ampoules</strong> (14 left; threshold 30).
        </p>
        <div style="background:#090e18; border:1px solid var(--border); border-radius:8px; padding:14px;">
            <strong style="color:#f59e0b; font-size:13px;"><i class="fas fa-truck-loading"></i> Recommended Purchase Requisition:</strong>
            <ul style="margin:8px 0 0 20px; font-size:12.5px; color:#94a3b8;">
                <li>Epinephrine 1mg/mL Auto-Ampoules: Order <strong>+50 units</strong> immediately.</li>
                <li>Medical Oxygen Cylinders: Dispatch refill requisition for <strong>+15 B-type cylinders</strong>.</li>
                <li>Amoxicillin + Clavulanate 625mg: Safety reorder trigger reached (45 / 60).</li>
            </ul>
        </div>
    `;
}

function switchPharmTab(tab) {
    document.querySelectorAll('.pharm-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pharm-tab-content').forEach(c => c.classList.add('hidden'));

    if (tab === 'queue') {
        document.querySelector('.pharm-tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('pharm-tab-queue').classList.remove('hidden');
    } else if (tab === 'stock') {
        document.querySelector('.pharm-tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('pharm-tab-stock').classList.remove('hidden');
    } else {
        document.querySelector('.pharm-tab-btn:nth-child(3)').classList.add('active');
        document.getElementById('pharm-tab-ai').classList.remove('hidden');
    }
}

function markRxReady(idx) {
    prescriptions[idx].status = 'Ready';
    renderPharmacyDesk();
    showToast(`Prescription ${prescriptions[idx].id} packed & marked READY for patient pickup!`, 'success');
}

function quickBillRx(idx) {
    const rx = prescriptions[idx];
    rx.status = 'Dispensed';

    // Log transaction
    hospitalTransactions.unshift({
        id: 'TXN-RX-' + String(hospitalTransactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: 'Pharmacy',
        patientId: rx.patientId,
        service: `Dispensed Rx #${rx.id} (${rx.items.map(i => i.name).join(', ')})`,
        amount: rx.estimatedTotal,
        paymentMode: 'UPI / Digital',
        cashier: currentUser ? currentUser.name : 'Pharmacist',
        status: 'Completed'
    });

    renderPharmacyDesk();
    showToast(`Bill collected (₹${rx.estimatedTotal}) and medications dispensed for ${rx.patientName}!`, 'success');
}

function quickRestockMedicine(idx) {
    medicines[idx].quantity += 50;
    renderPharmacyDesk();
    showToast(`Restocked +50 units of ${medicines[idx].name}. New Total: ${medicines[idx].quantity}`, 'success');
}

function importStockExcel(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);

            let count = 0;
            json.forEach(row => {
                const name = row['Medicine'] || row['Name'] || row['name'];
                const qty = parseInt(row['Quantity'] || row['Qty'] || row['qty']);
                if (name && !isNaN(qty)) {
                    const match = medicines.find(m => m.name.toLowerCase().includes(name.toString().toLowerCase()));
                    if (match) {
                        match.quantity += qty;
                        count++;
                    }
                }
            });
            renderPharmacyDesk();
            showToast(`Excel Batch Import: Updated ${count} medicine stocks!`, 'success');
        } catch (err) {
            showToast('Failed to parse Excel file.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}

function exportPharmacySalesExcel() {
    exportFinancialsReport();
}

// ===================================================================
//  12. NURSE & WARD WORKSPACES
// ===================================================================

function renderNurseWorkspace() {
    const pList = patients.slice(0, 5).map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;">
            <div>
                <strong style="color:#ffffff;">${p.name}</strong> <span style="font-size:11.5px; color:#94a3b8;">(${p.bed})</span>
                <div style="font-size:11.5px; color:#cbd5e1;">${p.concern}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="openPatientVitalsModal('${p.id}')">Vitals Telemetry</button>
        </div>
    `).join('');
    document.getElementById('nurse-patients-list').innerHTML = pList;

    const activeDocs = shifts.filter(s => s.staffType === 'Doctor' && s.date === '2026-11-21');
    const dList = activeDocs.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;">
            <div>
                <strong style="color:#ffffff;">${s.staffName}</strong>
                <div style="font-size:11.5px; color:#38bdf8;"><i class="fas fa-map-marker-alt"></i> ${s.location} (${s.ward})</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="showToast('Calling ${s.staffName} at ${s.location}...', 'info')"><i class="fas fa-phone"></i> Call</button>
        </div>
    `).join('');
    document.getElementById('nurse-doctors-list').innerHTML = dList;

    document.getElementById('nurse-ai-task-brief').innerHTML = `
        <strong>AI Priority Schedule:</strong> 1) Re-check arterial saturation &amp; blood pressure for <strong>Rohan Kulkarni (ICU-01)</strong> at 11:30. 2) Administer scheduled IV hydration for <strong>Sunita Verma (GEN-03)</strong>. 3) Prepare step-down handover note for Cardiology Ward.
    `;
}

function renderWardWorkspace() {
    const activeDocs = shifts.filter(s => s.staffType === 'Doctor' && s.date === '2026-11-21');
    const dList = activeDocs.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;">
            <div>
                <strong style="color:#ffffff;">${s.staffName}</strong>
                <div style="font-size:11.5px; color:#38bdf8;"><i class="fas fa-map-marker-alt"></i> ${s.location} (${s.ward})</div>
            </div>
            <span style="font-size:12px; color:#94a3b8;">Ends: <strong>${s.end}</strong></span>
        </div>
    `).join('');
    document.getElementById('ward-doctors-list').innerHTML = dList;

    document.getElementById('ward-ai-alert-box').innerHTML = `
        <div style="font-size:13px; color:#cbd5e1; line-height:1.6;">
            <p><strong style="color:#f59e0b;"><i class="fas fa-bell"></i> Early Summon Alert:</strong> Emergency Ward is at 75% capacity. AI suggests alerting <strong>Dr. Kenji Tanaka (ER-01)</strong> 15 minutes before 14:00 shift change so neuro-triage handoff occurs without delay.</p>
            <p style="margin-top:10px;"><strong style="color:var(--success);"><i class="fas fa-bed"></i> Sanitation Queue:</strong> Bed <strong>CARD-02</strong> and <strong>ICU-03</strong> require terminal cleaning before incoming noon admissions.</p>
        </div>
    `;
}

// ===================================================================
//  13. STAFF DIRECTORY & ROLES
// ===================================================================

function renderStaffDirectory() {
    const rows = users.map(u => `
        <tr>
            <td>
                <strong style="color:#ffffff;">${u.name}</strong>
                <div style="font-size:11.5px; color:#94a3b8;">${u.employeeId} • ${u.title || ''}</div>
            </td>
            <td><code style="color:#38bdf8;">${u.email}</code></td>
            <td>${u.department}</td>
            <td><span class="role-tag ${u.role.toLowerCase()}">${u.role.toUpperCase()}</span></td>
            <td><span class="status-badge active"><i class="fas fa-circle" style="font-size:7px;"></i> Registered &amp; Synced</span></td>
        </tr>
    `).join('');
    document.getElementById('staff-directory-table-body').innerHTML = rows;
}

// ===================================================================
//  14. AI HOSPITAL OPERATIONS COPILOT
// ===================================================================

function askCopilotPrompt(text) {
    document.getElementById('copilot-input').value = text;
    submitCopilotQuery();
}

function submitCopilotQuery() {
    const query = document.getElementById('copilot-input').value.trim();
    if (!query) return;

    const responseBox = document.getElementById('copilot-response-box');
    const responseText = document.getElementById('copilot-response-text');
    responseBox.style.display = 'block';
    responseText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing live hospital operational records...';

    setTimeout(() => {
        let answer = '';
        const q = query.toLowerCase();

        if (q.includes('capacity') || q.includes('ward')) {
            answer = `
                Based on live bed sensor feeds: <strong>Emergency Ward (3/4 occupied, 75%)</strong> and <strong>ICU Ward (2/4 occupied, 50% + 1 cleaning)</strong> are closest to capacity. Bed ER-04, CARD-04, and GEN-04 are currently sterilized and available for intake.
            `;
        } else if (q.includes('critical') || q.includes('handover') || q.includes('patient')) {
            answer = `
                <strong>3 Critical Inpatients for Handover:</strong><br>
                1. <strong>Rohan Kulkarni (ICU-01)</strong> — STEMI post-thrombolytic, HR 118, BP 162/98, SpO2 91%. Attending: Dr. Arjun Rao.<br>
                2. <strong>Ananya Chatterjee (ICU-02)</strong> — Pyelonephritis Sepsis, on IV vasopressors, HR 124, BP 128/82. Attending: Dr. Elena Varga.<br>
                3. <strong>Vikramjeet Singh (ER-01)</strong> — Code Stroke, BP 178/104. Attending: Dr. Kenji Tanaka.
            `;
        } else if (q.includes('medication') || q.includes('safety') || q.includes('threshold') || q.includes('stock')) {
            answer = `
                <strong>Critical Supply Breaches:</strong> <strong>Medical Oxygen Cylinders</strong> (9 remaining; threshold 20) and <strong>Epinephrine 1mg/mL Ampoules</strong> (14 remaining; threshold 30). Restock orders recommended immediately via Central Pharmacy.
            `;
        } else {
            answer = `
                <strong>Operational Audit:</strong> 10 patients admitted across 4 active wards. 4 attending physicians on duty. Hospital revenue month-to-date stands at <strong>₹24,86,750</strong> with 10 staff payroll profiles verified. All emergency clinical workflows are currently functioning normally.
            `;
        }
        responseText.innerHTML = answer;
    }, 400);
}

// ===================================================================
//  15. ADMISSION, PRESCRIPTION & BILLING MODALS
// ===================================================================

function openAdmitPatientModal() {
    document.getElementById('admit-patient-form').reset();
    // Populate available beds
    const availBeds = beds.filter(b => b.status === 'Available');
    document.getElementById('adm-bed').innerHTML = availBeds.map(b => `<option value="${b.id}">${b.id} — ${b.ward} Ward</option>`).join('') || '<option value="GEN-04">GEN-04 — General Ward</option>';
    document.getElementById('adm-doctor').innerHTML = doctors.map(d => `<option value="${d.id}" data-name="${d.name}">${d.name} (${d.specialization})</option>`).join('');
    openModal('admit-patient-modal');
}

function submitAdmitPatient(e) {
    e.preventDefault();
    const name = document.getElementById('adm-name').value.trim();
    const age = parseInt(document.getElementById('adm-age').value);
    const gender = document.getElementById('adm-gender').value;
    const severity = document.getElementById('adm-severity').value;
    const bedId = document.getElementById('adm-bed').value;
    const docSelect = document.getElementById('adm-doctor');
    const doctorId = docSelect.value;
    const doctorName = docSelect.options[docSelect.selectedIndex].dataset.name;
    const concern = document.getElementById('adm-concern').value.trim();

    const newId = 'PT-' + (4100 + patients.length + 1);
    const nowStr = new Date().toTimeString().substring(0, 5);

    const newPatient = {
        id: newId,
        name: name,
        age: age,
        gender: gender,
        department: severity === 'Critical' ? 'Critical Care / ICU' : 'Emergency Medicine',
        concern: concern,
        severity: severity,
        bed: bedId,
        ward: bedId.startsWith('ICU') ? 'ICU' : bedId.startsWith('ER') ? 'Emergency' : bedId.startsWith('CARD') ? 'Cardiology' : 'General',
        doctorId: doctorId,
        doctorName: doctorName,
        nurseId: 'NRS-01',
        admittedAt: '2026-11-21 ' + nowStr,
        status: 'Admitted',
        vitals: { hr: 96, spo2: 98, bp: '124/80', bpSys: 124, bpDia: 80, temp: 98.6 },
        vitalsHistory: [
            { time: nowStr, heartRate: 96, bpSys: 124, bpDia: 80, spo2: 98, temp: 98.6 }
        ]
    };

    patients.unshift(newPatient);

    // Update bed status
    const bed = beds.find(b => b.id === bedId);
    if (bed) {
        bed.status = 'Occupied';
        bed.patient = name;
        bed.severity = severity;
        bed.spo2 = '98%';
    }

    closeModal('admit-patient-modal');
    refreshCurrentView();
    showToast(`Patient ${name} admitted to Bed ${bedId}!`, 'success');
}

// Prescription Modal
function openPrescriptionModal() {
    document.getElementById('doc-rx-form').reset();
    document.getElementById('rx-patient-select').innerHTML = patients.map(p => `<option value="${p.id}" data-name="${p.name}" data-ward="${p.ward} ${p.bed}">${p.name} (${p.id}) — ${p.bed}</option>`).join('');
    populateRxMedicineOptions();
    openModal('prescription-modal');
}

function populateRxMedicineOptions() {
    const opts = '<option value="">Select medicine SKU…</option>' + medicines.map(m => `<option value="${m.id}" data-price="${m.unitPrice}" data-name="${m.name}">${m.name} — ₹${m.unitPrice}</option>`).join('');
    document.querySelectorAll('.rx-med-sku').forEach(s => s.innerHTML = opts);
}

function addRxMedRow() {
    const container = document.getElementById('rx-items-list-container');
    const row = document.createElement('div');
    row.className = 'form-row rx-med-row';
    row.style.marginBottom = '8px';
    row.innerHTML = `
        <select class="rx-med-sku" style="flex:2;" required></select>
        <input type="number" class="rx-med-qty" placeholder="Qty" value="1" min="1" style="width:80px;" required>
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()" style="padding:6px 10px;"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(row);
    populateRxMedicineOptions();
}

function submitDoctorPrescription(e) {
    e.preventDefault();
    const pSelect = document.getElementById('rx-patient-select');
    const pId = pSelect.value;
    const pName = pSelect.options[pSelect.selectedIndex].dataset.name;
    const pWard = pSelect.options[pSelect.selectedIndex].dataset.ward;
    const urgency = document.getElementById('rx-urgency').value;
    const instructions = document.getElementById('rx-instructions').value.trim();

    const items = [];
    let estTotal = 0;

    document.querySelectorAll('.rx-med-row').forEach(row => {
        const skuSelect = row.querySelector('.rx-med-sku');
        const qty = parseInt(row.querySelector('.rx-med-qty').value) || 1;
        const opt = skuSelect.options[skuSelect.selectedIndex];
        if (opt && opt.value) {
            const price = parseFloat(opt.dataset.price) || 0;
            items.push({ name: opt.dataset.name, qty: qty, price: price * qty });
            estTotal += price * qty;
        }
    });

    if (items.length === 0) {
        showToast('Please select at least one medication.', 'error');
        return;
    }

    const newRx = {
        id: 'RX-' + (505 + prescriptions.length + 1),
        doctorId: (currentUser && currentUser.employeeId) || 'DOC-02',
        doctorName: (currentUser && currentUser.name) || 'Dr. Arjun Rao',
        patientId: pId,
        patientName: pName,
        ward: pWard,
        urgency: urgency,
        status: 'Pending',
        estimatedTotal: estTotal,
        notes: instructions,
        items: items,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    prescriptions.unshift(newRx);
    closeModal('prescription-modal');
    refreshCurrentView();
    showToast(`Prescription ${newRx.id} sent to Pharmacy for Pre-Pack preparation!`, 'success');
}

// Direct Bill Modal
function openNewBillModal() {
    document.getElementById('create-bill-form').reset();
    populateBillMedicineOptions();
    updateBillTotalCalculation();
    openModal('bill-modal');
}

function populateBillMedicineOptions() {
    const opts = '<option value="">Select medicine…</option>' + medicines.map(m => `<option value="${m.id}" data-price="${m.unitPrice}" data-name="${m.name}">${m.name} — ₹${m.unitPrice}</option>`).join('');
    document.querySelectorAll('.bill-med-select').forEach(s => s.innerHTML = opts);
}

function addBillItemRow() {
    const container = document.getElementById('bill-items-container');
    const row = document.createElement('div');
    row.className = 'form-row bill-item-row';
    row.style.marginBottom = '8px';
    row.innerHTML = `
        <select class="bill-med-select" style="flex:2;" required onchange="updateBillTotalCalculation()"></select>
        <input type="number" class="bill-med-qty" placeholder="Qty" value="1" min="1" style="width:80px;" required oninput="updateBillTotalCalculation()">
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove(); updateBillTotalCalculation();" style="padding:6px 10px;"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(row);
    populateBillMedicineOptions();
}

function updateBillTotalCalculation() {
    let grand = 0;
    document.querySelectorAll('.bill-item-row').forEach(row => {
        const select = row.querySelector('.bill-med-select');
        const qty = parseInt(row.querySelector('.bill-med-qty').value) || 0;
        const opt = select.options[select.selectedIndex];
        if (opt && opt.value) {
            const price = parseFloat(opt.dataset.price) || 0;
            grand += price * qty;
        }
    });
    document.getElementById('bill-grand-total').textContent = `₹${grand.toLocaleString('en-IN')}`;
}

function submitGenerateBill(e) {
    e.preventDefault();
    const patientText = document.getElementById('bill-patient').value.trim();
    const paymentMode = document.getElementById('bill-payment-mode').value;

    let total = 0;
    const items = [];

    document.querySelectorAll('.bill-item-row').forEach(row => {
        const select = row.querySelector('.bill-med-select');
        const qty = parseInt(row.querySelector('.bill-med-qty').value) || 0;
        const opt = select.options[select.selectedIndex];
        if (opt && opt.value && qty > 0) {
            const med = medicines.find(m => m.id === opt.value);
            if (med) {
                med.quantity = Math.max(0, med.quantity - qty);
                total += med.unitPrice * qty;
                items.push(`${med.name} (x${qty})`);
            }
        }
    });

    if (items.length === 0) {
        showToast('Please select at least one item.', 'error');
        return;
    }

    hospitalTransactions.unshift({
        id: 'TXN-BILL-' + String(hospitalTransactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: 'Pharmacy',
        patientId: patientText,
        service: `Pharmacy Direct Bill (${items.join(', ')})`,
        amount: total,
        paymentMode: paymentMode,
        cashier: currentUser ? currentUser.name : 'Pharmacist',
        status: 'Completed'
    });

    closeModal('bill-modal');
    refreshCurrentView();
    showToast(`Bill generated for ₹${total.toLocaleString('en-IN')}. Stock updated automatically!`, 'success');
}

// ===================================================================
//  16. MODAL UTILITIES & TOASTS
// ===================================================================

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('show');
    }
});

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
    }, 4000);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Ready for user login
});
