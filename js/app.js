/* ===================================================================
   MedCore AI — Hospital Operations Master Controller
   Handles Role-Based Access, Recharts Line Charts, Duty Rosters,
   Multi-Department Financials, Staff Payroll, AI Clinical Chatbot,
   Internal Mail, Helpdesk Ticketing, and Split Payments.
   =================================================================== */

// ── Application State ──
let currentUser = null;
let currentRole = null;
let currentSection = null;
let activeVitalsChart = null;
let activeVitalsPatient = null;
let selectedPayslipItem = null;
let isStaffClockedIn = true;
let clockInTime = new Date();

// Deep-copy data store
let users = JSON.parse(JSON.stringify(SampleData.users));
let doctors = JSON.parse(JSON.stringify(SampleData.doctors));
let nurses = JSON.parse(JSON.stringify(SampleData.nurses));
let wardStaff = JSON.parse(JSON.stringify(SampleData.wardStaff));
let shifts = JSON.parse(JSON.stringify(SampleData.shifts));
let attendanceLogs = JSON.parse(JSON.stringify(SampleData.attendanceLogs));
let patients = JSON.parse(JSON.stringify(SampleData.patients));
let beds = JSON.parse(JSON.stringify(SampleData.beds));
let prescriptions = JSON.parse(JSON.stringify(SampleData.prescriptions));
let medicines = JSON.parse(JSON.stringify(SampleData.medicines));
let hospitalTransactions = JSON.parse(JSON.stringify(SampleData.hospitalTransactions));
let payroll = JSON.parse(JSON.stringify(SampleData.payroll));
let internalMails = JSON.parse(JSON.stringify(SampleData.internalMails));
let supportIssues = JSON.parse(JSON.stringify(SampleData.supportIssues));
let doctorLibrary = JSON.parse(JSON.stringify(SampleData.doctorLibrary));
let ambulances = JSON.parse(JSON.stringify(SampleData.ambulances || []));
let ambulanceRequests = JSON.parse(JSON.stringify(SampleData.ambulanceRequests || []));
let doctorAppointments = JSON.parse(JSON.stringify(SampleData.doctorAppointments || []));

// ── Active Filters ──
let activeAmbulanceFilter = 'All';
let activeAppointmentFilter = 'All';

// ── Role Menus Master Configuration ──
const roleMenus = {
    superadmin: {
        label: 'Super Administrator Workspace',
        items: [
            { id: 'admin-overview', icon: 'fa-th-large', label: 'Command Overview' },
            { id: 'ambulance-dispatch', icon: 'fa-ambulance', label: 'Ambulance Fleet & Dispatch' },
            { id: 'doctor-appointments', icon: 'fa-calendar-check', label: 'Patient Appointments' },
            { id: 'triage-view', icon: 'fa-heartbeat', label: 'ER Triage & Vitals', badge: '3' },
            { id: 'ward-matrix', icon: 'fa-bed', label: 'Wards & Bed Matrix' },
            { id: 'admin-shifts', icon: 'fa-calendar-alt', label: 'Doctor Shifts & Duties' },
            { id: 'hospital-financials', icon: 'fa-chart-pie', label: 'Hospital Financials' },
            { id: 'payroll-system', icon: 'fa-money-check-alt', label: 'Staff Payroll System' },
            { id: 'staff-directory', icon: 'fa-id-badge', label: 'Staff & Employee Directory' },
            { id: 'internal-mail', icon: 'fa-envelope', label: 'Internal Mail & AI' },
            { id: 'support-issues', icon: 'fa-exclamation-triangle', label: 'Helpdesk & Issues' },
            { id: 'my-payroll', icon: 'fa-file-invoice-dollar', label: 'My Payslips & PDF' }
        ]
    },
    admin: {
        label: 'Hospital Admin Workspace',
        items: [
            { id: 'admin-overview', icon: 'fa-th-large', label: 'Command Overview' },
            { id: 'ambulance-dispatch', icon: 'fa-ambulance', label: 'Ambulance Fleet & Dispatch' },
            { id: 'doctor-appointments', icon: 'fa-calendar-check', label: 'Patient Appointments' },
            { id: 'triage-view', icon: 'fa-heartbeat', label: 'ER Triage & Vitals', badge: '3' },
            { id: 'ward-matrix', icon: 'fa-bed', label: 'Wards & Bed Matrix' },
            { id: 'admin-shifts', icon: 'fa-calendar-alt', label: 'Doctor Shifts & Duties' },
            { id: 'hospital-financials', icon: 'fa-chart-pie', label: 'Hospital Financials' },
            { id: 'payroll-system', icon: 'fa-money-check-alt', label: 'Staff Payroll System' },
            { id: 'staff-directory', icon: 'fa-id-badge', label: 'Staff & Employee Directory' },
            { id: 'internal-mail', icon: 'fa-envelope', label: 'Internal Mail & AI' },
            { id: 'support-issues', icon: 'fa-exclamation-triangle', label: 'Helpdesk & Issues' },
            { id: 'my-payroll', icon: 'fa-file-invoice-dollar', label: 'My Payslips & PDF' }
        ]
    },
    doctor: {
        label: 'Attending Physician Workspace',
        items: [
            { id: 'doctor-appointments', icon: 'fa-calendar-check', label: 'Patient Appointments' },
            { id: 'doctor-shifts', icon: 'fa-calendar-week', label: '7-Day Shift Schedule' },
            { id: 'doctor-patients', icon: 'fa-user-injured', label: 'Allotted Patients & Vitals' },
            { id: 'ambulance-dispatch', icon: 'fa-ambulance', label: 'Ambulance Fleet & Dispatch' },
            { id: 'doctor-ai-assistant', icon: 'fa-robot', label: 'AI Clinical Assistant' },
            { id: 'doctor-prescriptions', icon: 'fa-prescription', label: 'Prescriptions Desk' },
            { id: 'doctor-library', icon: 'fa-book-medical', label: 'Clinical Guidelines Library' },
            { id: 'internal-mail', icon: 'fa-envelope', label: 'Internal Hospital Mail' },
            { id: 'support-issues', icon: 'fa-exclamation-triangle', label: 'Raise Operations Issue' },
            { id: 'my-payroll', icon: 'fa-file-invoice-dollar', label: 'My Compensation & Payslips' }
        ]
    },
    nurse: {
        label: 'Registered Nurse Workspace',
        items: [
            { id: 'nurse-workspace', icon: 'fa-user-nurse', label: 'Nurse Station & Calls' },
            { id: 'ambulance-dispatch', icon: 'fa-ambulance', label: 'Ambulance Fleet & Dispatch' },
            { id: 'doctor-appointments', icon: 'fa-calendar-check', label: 'Doctor Appointments' },
            { id: 'triage-view', icon: 'fa-heartbeat', label: 'Patient Vitals Telemetry' },
            { id: 'ward-matrix', icon: 'fa-bed', label: 'Ward Bed Matrix' },
            { id: 'internal-mail', icon: 'fa-envelope', label: 'Internal Mail' },
            { id: 'support-issues', icon: 'fa-exclamation-triangle', label: 'Raise Operations Issue' },
            { id: 'my-payroll', icon: 'fa-file-invoice-dollar', label: 'My Attendance & Payslips' }
        ]
    },
    ward: {
        label: 'Ward Staff Workspace',
        items: [
            { id: 'ward-workspace', icon: 'fa-procedures', label: 'Ward Operations & Doctors' },
            { id: 'ward-matrix', icon: 'fa-bed', label: 'Bed Sanitation Matrix' },
            { id: 'internal-mail', icon: 'fa-envelope', label: 'Internal Mail' },
            { id: 'support-issues', icon: 'fa-exclamation-triangle', label: 'Raise Maintenance Issue' },
            { id: 'my-payroll', icon: 'fa-file-invoice-dollar', label: 'My Attendance & Payslips' }
        ]
    },
    pharmacy: {
        label: 'Clinical Pharmacy Workspace',
        items: [
            { id: 'pharm-queue', icon: 'fa-prescription-bottle-alt', label: 'Pre-Pack Queue & Dispense' },
            { id: 'pharm-stock', icon: 'fa-boxes', label: 'Stock Check & Restock' },
            { id: 'pharm-billing', icon: 'fa-cash-register', label: 'Pharmacy Sales & Billing' },
            { id: 'internal-mail', icon: 'fa-envelope', label: 'Internal Mail' },
            { id: 'support-issues', icon: 'fa-exclamation-triangle', label: 'Raise Stock Issue' },
            { id: 'my-payroll', icon: 'fa-file-invoice-dollar', label: 'My Attendance & Payslips' }
        ]
    },
    accountant: {
        label: 'Hospital Finance & Payroll',
        items: [
            { id: 'hospital-financials', icon: 'fa-chart-pie', label: 'Multi-Column Hospital Sales' },
            { id: 'payroll-system', icon: 'fa-money-bill-wave', label: 'Staff Payroll & Special Pay' },
            { id: 'pharm-stock', icon: 'fa-boxes', label: 'Pharmacy Inventory Check' },
            { id: 'internal-mail', icon: 'fa-envelope', label: 'Internal Mail' },
            { id: 'support-issues', icon: 'fa-exclamation-triangle', label: 'Helpdesk & Issues' },
            { id: 'my-payroll', icon: 'fa-file-invoice-dollar', label: 'My Payslips & Records' }
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
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const identifier = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const errorBox = document.getElementById('login-error');

    if (errorBox) {
        errorBox.classList.add('hidden');
        errorBox.textContent = '';
    }

    if (!identifier || !password) {
        if (errorBox) {
            errorBox.textContent = 'Please enter both your staff Email/ID and Password.';
            errorBox.classList.remove('hidden');
        }
        return false;
    }

    const user = users.find(u => {
        const emailMatch = u.email && u.email.toLowerCase() === identifier;
        const usernameMatch = u.username && u.username.toLowerCase() === identifier;
        const empIdMatch = u.employeeId && u.employeeId.toLowerCase() === identifier;
        const idMatch = u.id && u.id.toLowerCase() === identifier;
        return (emailMatch || usernameMatch || empIdMatch || idMatch) && u.password === password;
    });

    if (!user) {
        if (errorBox) {
            errorBox.textContent = 'Invalid credentials. Please verify your staff email or password.';
            errorBox.classList.remove('hidden');
        }
        return false;
    }

    currentUser = user;
    currentRole = user.role;

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    document.getElementById('user-name-display').textContent = user.name;
    document.getElementById('user-role-label').textContent = user.title || formatRole(user.role);

    // Admin & Superadmin role switcher display
    const switcherBox = document.getElementById('admin-switcher-container');
    if (user.role === 'admin' || user.role === 'superadmin') {
        switcherBox.style.display = 'block';
        document.getElementById('role-view-switcher').value = user.role === 'superadmin' ? 'admin' : user.role;
    } else {
        switcherBox.style.display = 'none';
    }

    // Role-specific button visibility
    applyRoleRestrictions(user.role);

    buildNavigation(user.role);
    startLiveClock();
    updateAttendanceUI();

    showToast(`Welcome ${user.name}! Logged in as ${formatRole(user.role)}.`, 'success');
    return false;
}

function applyRoleRestrictions(role) {
    // Accountant cannot add/remove stock (only check inventory)
    const btnImportStock = document.getElementById('btn-import-stock');
    const btnOpenAddStock = document.getElementById('btn-open-add-stock');
    if (btnImportStock && btnOpenAddStock) {
        if (role === 'accountant') {
            btnImportStock.style.display = 'none';
            btnOpenAddStock.style.display = 'none';
        } else {
            btnImportStock.style.display = 'inline-flex';
            btnOpenAddStock.style.display = 'inline-flex';
        }
    }

    // Accountant can make pharmacy bill directly from financials; ADMIN CANNOT make pharmacy bills
    const btnAccPharmBill = document.getElementById('btn-acc-pharm-bill');
    if (btnAccPharmBill) {
        btnAccPharmBill.style.display = (role === 'accountant') ? 'inline-flex' : 'none';
    }
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
    applyRoleRestrictions(targetRole);
    buildNavigation(targetRole);
    showToast(`Switched view to ${formatRole(targetRole)} Portal`, 'info');
}

function formatRole(role) {
    const map = {
        superadmin: 'Super Administrator',
        admin: 'Hospital Administrator',
        doctor: 'Doctor / Physician',
        nurse: 'Registered Nurse',
        ward: 'Ward Staff',
        pharmacy: 'Pharmacist',
        accountant: 'Chief Accountant'
    };
    return map[role] || role;
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    const icon = btn ? (btn.tagName === 'I' ? btn : btn.querySelector('i')) : null;
    if (icon) {
        if (isPassword) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            icon.style.color = '#38bdf8';
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            icon.style.color = '#64748b';
        }
    }
}

// ===================================================================
//  2. ATTENDANCE CLOCK-IN / CLOCK-OUT
// ===================================================================

function toggleStaffPunch() {
    isStaffClockedIn = !isStaffClockedIn;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const staffId = (currentUser && currentUser.employeeId) || 'DOC-02';
    const staffName = (currentUser && currentUser.name) || 'Dr. Arjun Rao';

    if (isStaffClockedIn) {
        clockInTime = now;
        const punchLog = {
            id: 'ATT-' + (attendanceLogs.length + 101),
            staffId: staffId,
            staffName: staffName,
            date: dateStr,
            clockIn: timeStr,
            clockOut: 'Active',
            hours: 0.1,
            status: 'On Duty'
        };
        attendanceLogs.unshift(punchLog);
        fetch('/api/attendance/punch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(punchLog)
        }).catch(err => console.warn('MongoDB sync:', err));
        showToast(`Clocked In successfully at ${timeStr}. Attendance logged!`, 'success');
    } else {
        const activeLog = attendanceLogs.find(a => a.staffId === staffId && a.clockOut === 'Active');
        if (activeLog) {
            activeLog.clockOut = timeStr;
            activeLog.status = 'Completed';
            activeLog.hours = 8.0;
        }
        showToast(`Clocked Out at ${timeStr}. Shift hours recorded for payroll!`, 'info');
    }

    updateAttendanceUI();
    if (currentSection === 'my-payroll') renderMyPayroll();
}

function updateAttendanceUI() {
    const btn = document.getElementById('topbar-punch-btn');
    const text = document.getElementById('punch-btn-text');
    if (!btn || !text) return;

    if (isStaffClockedIn) {
        btn.className = 'punch-attendance-btn punched-in';
        text.textContent = 'Clocked In (Active)';
    } else {
        btn.className = 'punch-attendance-btn punched-out';
        text.textContent = 'Punch In';
    }
}

// ===================================================================
//  3. NAVIGATION CONTROLLER
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

    if (sectionId === 'internal-mail') {
        backToMailList();
    }

    document.querySelectorAll('#sidebar-nav .nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    const targetSection = document.getElementById('section-' + sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const config = roleMenus[currentRole || 'admin'];
    const activeItem = config ? config.items.find(i => i.id === sectionId) : null;
    document.getElementById('breadcrumb-role').textContent = formatRole(currentRole || 'admin');
    document.getElementById('breadcrumb-section').textContent = activeItem ? activeItem.label : 'Operations';

    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.remove('open');
    const bd = document.getElementById('sidebar-backdrop');
    if (bd) bd.classList.remove('active');
    refreshCurrentView();
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('sidebar-backdrop');
    if (sb) sb.classList.toggle('open');
    if (bd) bd.classList.toggle('active');
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
//  4. MASTER VIEW DISPATCHER
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
        case 'my-payroll':
            renderMyPayroll();
            break;
        case 'doctor-shifts':
            renderDoctorShifts();
            break;
        case 'doctor-ai-assistant':
            // Doctor AI Chatbot view ready
            break;
        case 'doctor-patients':
            renderDoctorPatients();
            break;
        case 'doctor-prescriptions':
            renderDoctorPrescriptions();
            break;
        case 'doctor-library':
            renderDoctorLibrary();
            break;
        case 'ambulance-dispatch':
            renderAmbulanceDispatch();
            break;
        case 'doctor-appointments':
            renderDoctorAppointments();
            break;
        case 'pharm-queue':
            renderPharmQueue();
            break;
        case 'pharm-stock':
            renderPharmStock();
            break;
        case 'pharm-billing':
            renderPharmBilling();
            break;
        case 'internal-mail':
            renderInternalMail();
            break;
        case 'support-issues':
            renderSupportIssues();
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
    }
}

// ===================================================================
//  5. ADMIN OVERVIEW & BRIEFING
// ===================================================================

function renderAdminOverview() {
    document.getElementById('stat-adm-patients').textContent = patients.length;
    const occupiedCount = beds.filter(b => b.status === 'Occupied').length;
    const pct = Math.round((occupiedCount / beds.length) * 100);
    document.getElementById('stat-adm-beds').textContent = `${pct}%`;
    const lowStockCount = medicines.filter(m => m.quantity <= m.threshold).length;
    document.getElementById('stat-adm-stock').textContent = lowStockCount;

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
//  6. ER TRIAGE & RECHARTS HISTORICAL VITALS
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
            <td><span class="severity-badge ${p.severity.toLowerCase()}">${p.severity}</span></td>
            <td><strong style="color:#38bdf8;">${p.bed}</strong><div style="font-size:11.5px; color:#94a3b8;">${p.doctorName}</div></td>
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

function openPatientVitalsModal(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    activeVitalsPatient = patient;

    document.getElementById('vitals-patient-name').textContent = `${patient.name} (${patient.id})`;
    document.getElementById('vitals-patient-meta').textContent = `Age ${patient.age} • ${patient.department} • Bed ${patient.bed} • Attending: ${patient.doctorName}`;
    document.getElementById('vitals-badge-hr').textContent = `${patient.vitals.hr} BPM`;
    document.getElementById('vitals-badge-spo2').textContent = `${patient.vitals.spo2}% SpO2`;
    document.getElementById('vitals-badge-bp').textContent = `${patient.vitals.bp} mmHg`;

    if (activeVitalsChart) {
        activeVitalsChart.destroy();
    }
    activeVitalsChart = new RechartsVitalsLineChart('recharts-vitals-chart-container', { height: 310 });
    activeVitalsChart.setData(patient.vitalsHistory || []);

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

    const newLog = { time, heartRate: hr, bpSys, bpDia, spo2, temp: 98.6 };

    if (!activeVitalsPatient.vitalsHistory) activeVitalsPatient.vitalsHistory = [];
    activeVitalsPatient.vitalsHistory.push(newLog);
    activeVitalsPatient.vitals = { hr, spo2, bp: `${bpSys}/${bpDia}`, bpSys, bpDia, temp: 98.6 };

    // Sync vitals to MongoDB
    fetch('/api/patients/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: activeVitalsPatient.id, vitals: newLog })
    }).catch(err => console.warn('MongoDB sync:', err));

    document.getElementById('vitals-badge-hr').textContent = `${hr} BPM`;
    document.getElementById('vitals-badge-spo2').textContent = `${spo2}% SpO2`;
    document.getElementById('vitals-badge-bp').textContent = `${bpSys}/${bpDia} mmHg`;

    activeVitalsChart.setData(activeVitalsPatient.vitalsHistory);
    renderTriageView();
    showToast(`Vitals logged for ${activeVitalsPatient.name}. Recharts curve updated.`, 'success');
}

// ===================================================================
//  7. WARDS & BED MATRIX
// ===================================================================

let currentWardFilter = 'All';

function renderWardMatrix() {
    let filtered = beds;
    if (currentWardFilter !== 'All') {
        filtered = beds.filter(b => b.ward === currentWardFilter);
    }

    const html = filtered.map(b => {
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
        showToast(`Bed ${bedId} marked Sanitized & Available!`, 'success');
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
//  8. ADMIN DOCTOR SHIFTS & DUTY SCHEDULING (Doctor Filter & Duty Assign)
// ===================================================================

let adminDoctorFilterVal = 'ALL';

function renderAdminShifts() {
    // Populate doctor filter options
    const filterSelect = document.getElementById('admin-doctor-filter');
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="ALL">Show All Scheduled Shifts (All Staff)</option>' +
            doctors.map(d => `<option value="${d.id}" ${adminDoctorFilterVal === d.id ? 'selected' : ''}>Only Dr. ${d.name} (${d.specialization})</option>`).join('');
    }

    let filtered = shifts;
    if (adminDoctorFilterVal !== 'ALL') {
        filtered = shifts.filter(s => s.staffId === adminDoctorFilterVal);
    }

    const rows = filtered.map(s => `
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
    document.getElementById('admin-shifts-table-body').innerHTML = rows || '<tr><td colspan="8" style="text-align:center; color:#64748b;">No shifts found for selected doctor.</td></tr>';
}

function filterAdminDoctorShifts(docId) {
    adminDoctorFilterVal = docId;
    renderAdminShifts();
}

function openAssignDutyModal() {
    document.getElementById('assign-duty-form').reset();
    document.getElementById('duty-edit-id').value = '';
    document.getElementById('duty-modal-title').innerHTML = '<i class="fas fa-calendar-plus" style="color:var(--primary)"></i> Assign Staff Duty / Shift';
    document.getElementById('duty-date').value = '2026-11-22';
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
    if (confirm('Cancel this scheduled shift duty?')) {
        shifts = shifts.filter(s => s.id !== shiftId);
        renderAdminShifts();
        showToast('Shift duty removed successfully.', 'info');
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
            status: date === '2026-11-22' ? 'Active' : 'Scheduled'
        };
        shifts.unshift(newShift);
        // Sync to MongoDB
        fetch('/api/shifts/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newShift)
        }).catch(err => console.warn('MongoDB sync:', err));

        showToast(`Duty assigned to ${staffName} (${ward} - ${location})!`, 'success');
    }

    closeModal('assign-duty-modal');
    renderAdminShifts();
}

// ===================================================================
//  9. MULTI-COLUMN HOSPITAL FINANCIALS (ICU, Pharmacy, OPD, Salary, ER)
// ===================================================================

function renderHospitalFinancials() {
    let totRev = 0, totIcu = 0, totPharm = 0, totOpd = 0, totEr = 0, totSal = 0;
    hospitalTransactions.forEach(t => {
        totIcu += (t.icuAmount || 0);
        totPharm += (t.pharmacyAmount || 0);
        totOpd += (t.opdAmount || 0);
        totEr += (t.erAmount || 0);
        totSal += (t.salaryAmount || 0);
        totRev += (t.totalAmount || 0);
    });

    document.getElementById('fin-total-rev').textContent = `₹${totRev.toLocaleString('en-IN')}`;
    document.getElementById('fin-pharmacy-rev').textContent = `₹${totPharm.toLocaleString('en-IN')}`;
    document.getElementById('fin-opd-rev').textContent = `₹${totOpd.toLocaleString('en-IN')}`;
    document.getElementById('fin-icu-rev').textContent = `₹${totIcu.toLocaleString('en-IN')}`;
    document.getElementById('fin-er-rev').textContent = `₹${totEr.toLocaleString('en-IN')}`;
    document.getElementById('fin-salary-rev').textContent = `₹${totSal.toLocaleString('en-IN')}`;

    // Multi-column transaction table
    const rows = hospitalTransactions.map(t => `
        <tr>
            <td><strong>${t.id}</strong></td>
            <td style="white-space:nowrap; font-size:12px;">${t.date}</td>
            <td>
                <strong>${t.service}</strong>
                <div style="font-size:11px; color:#94a3b8;">${t.patientId} • Handled by ${t.cashier}</div>
            </td>
            <td style="color:${t.icuAmount > 0 ? '#38bdf8' : '#64748b'}; font-weight:700;">${t.icuAmount > 0 ? '₹' + t.icuAmount.toLocaleString('en-IN') : '—'}</td>
            <td style="color:${t.pharmacyAmount > 0 ? '#a855f7' : '#64748b'}; font-weight:700;">${t.pharmacyAmount > 0 ? '₹' + t.pharmacyAmount.toLocaleString('en-IN') : '—'}</td>
            <td style="color:${t.opdAmount > 0 ? '#0ea5e9' : '#64748b'}; font-weight:700;">${t.opdAmount > 0 ? '₹' + t.opdAmount.toLocaleString('en-IN') : '—'}</td>
            <td style="color:${t.erAmount > 0 ? '#f59e0b' : '#64748b'}; font-weight:700;">${t.erAmount > 0 ? '₹' + t.erAmount.toLocaleString('en-IN') : '—'}</td>
            <td style="color:${t.salaryAmount > 0 ? '#ef4444' : '#64748b'}; font-weight:700;">${t.salaryAmount > 0 ? '₹' + t.salaryAmount.toLocaleString('en-IN') : '—'}</td>
            <td><strong style="color:#ffffff; font-size:14px;">₹${t.totalAmount.toLocaleString('en-IN')}</strong></td>
            <td><span style="font-size:11.5px; color:#cbd5e1;">${t.paymentMode}</span></td>
            <td><span class="status-badge paid"><i class="fas fa-check-circle"></i> ${t.status}</span></td>
        </tr>
    `).join('');
    document.getElementById('multi-column-transactions-body').innerHTML = rows;
}

function exportFinancialsReport() {
    try {
        const exportData = hospitalTransactions.map(t => ({
            'Transaction ID': t.id,
            'Date & Time': t.date,
            'Particulars': t.service,
            'ICU Amount (INR)': t.icuAmount || 0,
            'Pharmacy Amount (INR)': t.pharmacyAmount || 0,
            'OPD Amount (INR)': t.opdAmount || 0,
            'Emergency Amount (INR)': t.erAmount || 0,
            'Salary Expense (INR)': t.salaryAmount || 0,
            'Surgery Amount (INR)': t.surgeryAmount || 0,
            'Total Amount (INR)': t.totalAmount,
            'Payment Mode': t.paymentMode,
            'Audited By': t.cashier,
            'Status': t.status
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Multi-Dept Sales Ledger');
        XLSX.writeFile(wb, `MedCore_Hospital_Sales_Columns_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('Multi-Column Sales Ledger exported to Excel!', 'success');
    } catch (err) {
        showToast('Export failed: ' + err.message, 'error');
    }
}

// ===================================================================
//  10. FULL PAYROLL & SPECIAL PAYMENTS (Accountant & Admin)
// ===================================================================

function renderPayrollSystem() {
    const rows = payroll.map(p => {
        const hasBankSetup = p.accountNo && p.accountNo !== 'Pending' && p.accountNo !== 'Pending Setup';
        return `
        <tr>
            <td>
                <strong style="color:#ffffff;">${p.name}</strong>
                <div style="font-size:11.5px; color:#94a3b8;">${p.staffId}</div>
                <div style="font-size:11px; color:#38bdf8; font-family:monospace; margin-top:2px;">
                    <i class="fas fa-university"></i> ${p.bankName || 'HDFC Bank'} &bull; ${hasBankSetup ? (p.accountNo.length > 4 ? '•••• ' + p.accountNo.slice(-4) : p.accountNo) : '<span style="color:#f59e0b; font-weight:700;">Account Setup Needed</span>'}
                </div>
            </td>
            <td>
                <span class="role-tag ${p.role.toLowerCase().replace(' ', '')}">${p.role}</span>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">${p.department}</div>
            </td>
            <td><span style="font-size:12px; font-weight:600;">${p.month}</span></td>
            <td>₹${p.baseSalary.toLocaleString('en-IN')}</td>
            <td style="color:var(--success);">+₹${p.allowances.toLocaleString('en-IN')}</td>
            <td style="color:var(--purple); font-weight:700;">+₹${(p.specialPayment || 0).toLocaleString('en-IN')}<div style="font-size:10px; color:#94a3b8;">${p.specialPaymentReason || '—'}</div></td>
            <td style="color:var(--danger);">-₹${p.deductions.toLocaleString('en-IN')}</td>
            <td><strong style="color:#38bdf8; font-size:14px;">₹${p.netSalary.toLocaleString('en-IN')}</strong></td>
            <td>
                <span class="status-badge ${p.status.toLowerCase()}">${p.status}</span>
                ${p.paymentDate !== '—' ? `<div style="font-size:10.5px; color:#94a3b8; margin-top:2px;">${p.paymentDate}</div>` : ''}
            </td>
            <td>
                <div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${p.status === 'Pending' ? `
                        <button class="btn btn-success btn-sm" onclick="openDisburseSalaryModal('${p.id}')" title="Review, Adjust & Choose IMPS/NEFT/RTGS"><i class="fas fa-hand-holding-usd"></i> Pay</button>
                    ` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="openEditPaymentDetailsModal('${p.staffId}')" title="Configure / Edit Bank Coordinates & Salary Breakdown"><i class="fas fa-edit"></i> Bank &amp; Breakdown</button>
                    <button class="btn btn-primary btn-sm" onclick="viewPayslipPDF('${p.id}')" title="Print/Save PDF Payslip"><i class="fas fa-file-pdf"></i> PDF</button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
    document.getElementById('payroll-table-body').innerHTML = rows;
}

// ── Auto-Generate Staff Email on Input (firstname.lastname@medcore.org) ──
function autoGenerateStaffEmail(fullName) {
    if (!fullName) return;
    const clean = fullName.replace(/^(Dr\.|Dr|Nurse|Mr\.|Mr|Ms\.|Ms|Mrs\.|Mrs)\s+/i, '').trim();
    const parts = clean.toLowerCase().split(/\s+/).filter(Boolean);
    const emailField = document.getElementById('ns-email');
    if (!emailField) return;
    if (parts.length >= 2) {
        emailField.value = `${parts[0]}.${parts[parts.length - 1]}@medcore.org`;
    } else if (parts.length === 1) {
        emailField.value = `${parts[0]}@medcore.org`;
    }
}

function openAddStaffModal() {
    if (currentRole !== 'admin') {
        showToast('Access Restricted: Only Hospital Administrators can register new employees.', 'error');
        return;
    }
    document.getElementById('add-staff-form').reset();
    document.getElementById('ns-id').value = 'EMP-' + String(users.length + 1).padStart(2, '0');
    openModal('add-staff-modal');
}

function submitAddNewStaff(e) {
    e.preventDefault();
    if (currentRole !== 'admin') {
        showToast('Access Restricted: Only Hospital Administrators can register new employees.', 'error');
        return;
    }
    const name = document.getElementById('ns-name').value.trim();
    const id = document.getElementById('ns-id').value.trim();
    const role = document.getElementById('ns-role').value;
    const department = document.getElementById('ns-department').value.trim();
    const email = document.getElementById('ns-email').value.trim();
    const password = document.getElementById('ns-password').value.trim();
    const salary = parseInt(document.getElementById('ns-salary').value) || 120000;
    const phone = document.getElementById('ns-phone').value.trim();

    if (users.some(u => u.employeeId === id || u.email.toLowerCase() === email.toLowerCase())) {
        showToast(`Staff ID ${id} or email ${email} already exists.`, 'error');
        return;
    }

    // 1. Add to Users
    users.push({
        email: email,
        username: email.split('@')[0],
        password: password,
        role: role,
        name: name,
        title: `${department} ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        employeeId: id,
        department: department,
        phone: phone,
        status: 'Active',
        bankName: 'Pending Setup',
        accountNo: 'Pending',
        ifsc: 'Pending',
        pan: 'Pending'
    });

    // 2. Add to Directory if Doctor/Nurse/Ward
    if (role === 'doctor') {
        doctors.push({ id, name, specialization: department, department, room: 'OPD-' + (doctors.length + 1), onDuty: true, shiftEnd: '16:00', phone });
    } else if (role === 'nurse') {
        nurses.push({ id, name, department, ward: department + ' Ward', shift: '08:00 - 16:00', onDuty: true, phone });
    } else if (role === 'ward') {
        wardStaff.push({ id, name, department, ward: department + ' Ward', shift: '06:00 - 14:00', onDuty: true, phone });
    }

    // 3. Add to Payroll with 'Pending' setup for Accountant
    const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const hra = Math.round(salary * 0.20);
    const allow = Math.round(salary * 0.10);
    const ded = Math.round(salary * 0.12);
    const net = salary + hra + allow - ded;

    payroll.unshift({
        id: `PAY-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${id}`,
        staffId: id,
        name: name,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        department: department,
        month: month,
        baseSalary: salary,
        hra: hra,
        allowances: allow,
        specialPayment: 0,
        specialPaymentReason: '—',
        deductions: ded,
        netSalary: net,
        status: 'Pending',
        salaryConfigured: false,
        paymentDate: '—',
        bankName: 'Pending Accountant Setup',
        bankAccount: 'Pending Accountant Setup',
        accountNo: 'Pending',
        ifsc: 'Pending',
        taxPan: 'Pending',
        daysWorked: 26
    });

    // Sync with MongoDB backend
    fetch('/api/staff/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, employeeId: id, role, department, email, password, salary, phone })
    }).catch(err => console.warn('MongoDB sync:', err));

    closeModal('add-staff-modal');
    renderStaffDirectory();
    renderPayrollSystem();

    recentActivity.unshift({
        time: new Date().toTimeString().substring(0, 5),
        actor: 'Admin',
        text: `Registered new employee ${name} (${id}) with email ${email}. Added to Accountant payroll queue.`
    });
    renderActivity();

    showToast(`Employee ${name} added! Email: ${email}. Available in Accountant panel for bank setup.`, 'success');
}

// ── 10B. DISBURSE SALARY MODAL (Adjust Before Final Disbursal & Choose IMPS/NEFT/RTGS) ──

let activeDisburseItem = null;

function openDisburseSalaryModal(payrollId) {
    const p = payroll.find(item => item.id === payrollId);
    if (!p) return;
    activeDisburseItem = p;

    document.getElementById('ds-payroll-id').value = p.id;
    document.getElementById('ds-emp-name').textContent = p.name;
    document.getElementById('ds-emp-meta').textContent = `${p.role} • ${p.department} (Staff ID: ${p.staffId})`;
    document.getElementById('ds-emp-month').textContent = `Disbursing Period: ${p.month}`;
    document.getElementById('ds-bank-details-preview').textContent = `A/C: ${p.accountNo || p.bankAccount} | IFSC: ${p.ifsc || 'HDFC0001234'}`;

    document.getElementById('ds-base-salary').value = p.baseSalary;
    document.getElementById('ds-allowances').value = p.allowances;
    document.getElementById('ds-bonus').value = p.specialPayment || 0;
    document.getElementById('ds-deductions').value = p.deductions;
    document.getElementById('ds-payment-mode').value = 'NEFT';
    document.getElementById('ds-remarks').value = `Monthly payroll transfer for ${p.name} (${p.month})`;

    recalcDisburseNet();
    openModal('disburse-salary-modal');
}

function recalcDisburseNet() {
    const base = parseFloat(document.getElementById('ds-base-salary').value) || 0;
    const allow = parseFloat(document.getElementById('ds-allowances').value) || 0;
    const bonus = parseFloat(document.getElementById('ds-bonus').value) || 0;
    const ded = parseFloat(document.getElementById('ds-deductions').value) || 0;
    const net = Math.max(0, base + allow + bonus - ded);
    document.getElementById('ds-net-amount').textContent = `₹${net.toLocaleString('en-IN')}`;
}

function submitDisburseSalary(e) {
    e.preventDefault();
    if (!activeDisburseItem) return;

    const base = parseFloat(document.getElementById('ds-base-salary').value) || 0;
    const allow = parseFloat(document.getElementById('ds-allowances').value) || 0;
    const bonus = parseFloat(document.getElementById('ds-bonus').value) || 0;
    const ded = parseFloat(document.getElementById('ds-deductions').value) || 0;
    const mode = document.getElementById('ds-payment-mode').value;
    const remarks = document.getElementById('ds-remarks').value.trim();
    const finalNet = Math.max(0, base + allow + bonus - ded);

    activeDisburseItem.baseSalary = base;
    activeDisburseItem.allowances = allow;
    activeDisburseItem.specialPayment = bonus;
    activeDisburseItem.deductions = ded;
    activeDisburseItem.netSalary = finalNet;
    activeDisburseItem.status = 'Paid';
    activeDisburseItem.paymentDate = new Date().toISOString().split('T')[0];

    // Log to multi-column transactions
    hospitalTransactions.unshift({
        id: 'TXN-SAL-' + String(hospitalTransactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: 'Staff Salary',
        patientId: activeDisburseItem.staffId,
        service: `Salary Disbursement: ${activeDisburseItem.name} (${activeDisburseItem.month}) via ${mode} — ${remarks}`,
        icuAmount: 0,
        pharmacyAmount: 0,
        opdAmount: 0,
        erAmount: 0,
        salaryAmount: finalNet,
        surgeryAmount: 0,
        totalAmount: finalNet,
        paymentMode: `Electronic ${mode}`,
        cashier: currentUser ? currentUser.name : (currentRole === 'admin' ? 'Hospital Administrator' : 'Chief Accountant'),
        status: 'Completed'
    });

    // Sync with MongoDB backend
    fetch('/api/payroll/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            payrollId: activeDisburseItem.id,
            mode: mode,
            netSalary: finalNet,
            month: activeDisburseItem.month,
            cashier: currentUser ? currentUser.name : (currentRole === 'admin' ? 'Hospital Administrator' : 'Chief Accountant')
        })
    }).catch(err => console.warn('MongoDB sync:', err));

    closeModal('disburse-salary-modal');
    renderPayrollSystem();
    renderHospitalFinancials();
    renderStats();

    recentActivity.unshift({
        time: new Date().toTimeString().substring(0, 5),
        actor: currentUser ? currentUser.name : 'Finance Desk',
        text: `Disbursed ₹${finalNet.toLocaleString('en-IN')} salary to ${activeDisburseItem.name} via ${mode}.`
    });
    renderActivity();

    showToast(`Salary of ₹${finalNet.toLocaleString('en-IN')} disbursed to ${activeDisburseItem.name} via ${mode}!`, 'success');
    activeDisburseItem = null;
}

// ── 10C. EDIT EMPLOYEE BANK ACCOUNT & SALARY BREAKDOWN (Admin & Accountant) ──

function openEditPaymentDetailsModal(staffId) {
    const p = payroll.find(item => item.staffId === staffId);
    const u = users.find(user => user.employeeId === staffId);
    if (!p && !u) {
        showToast('Staff member not found in payroll database.', 'error');
        return;
    }

    const name = p ? p.name : u.name;
    const dept = p ? `${p.role} • ${p.department}` : `${u.role} • ${u.department}`;

    document.getElementById('epd-staff-id').value = staffId;
    document.getElementById('epd-staff-name').value = `${name} (${staffId})`;
    document.getElementById('epd-staff-dept').value = dept;

    document.getElementById('epd-bank-name').value = (p && p.bankName && p.bankName !== 'Pending Accountant Setup') ? p.bankName : (u.bankName || 'HDFC Bank');
    document.getElementById('epd-account-no').value = (p && p.accountNo && p.accountNo !== 'Pending') ? p.accountNo : (u.accountNo || '50100' + Math.floor(100000 + Math.random() * 900000));
    document.getElementById('epd-ifsc').value = (p && p.ifsc && p.ifsc !== 'Pending') ? p.ifsc : (u.ifsc || 'HDFC0001234');
    document.getElementById('epd-pan').value = (p && p.taxPan && p.taxPan !== 'Pending') ? p.taxPan : (u.pan || 'ABCDE1234F');

    const base = p ? p.baseSalary : 120000;
    const hra = (p && p.hra) ? p.hra : Math.round(base * 0.20);
    const allow = (p && p.allowances) ? p.allowances : Math.round(base * 0.10);
    const ded = (p && p.deductions) ? p.deductions : Math.round(base * 0.12);

    document.getElementById('epd-base-salary').value = base;
    document.getElementById('epd-hra').value = hra;
    document.getElementById('epd-special-allowance').value = allow;
    document.getElementById('epd-deductions').value = ded;

    recalcEpdNet();
    openModal('employee-payment-details-modal');
}

function recalcEpdNet() {
    const base = parseFloat(document.getElementById('epd-base-salary').value) || 0;
    const hra = parseFloat(document.getElementById('epd-hra').value) || 0;
    const allow = parseFloat(document.getElementById('epd-special-allowance').value) || 0;
    const ded = parseFloat(document.getElementById('epd-deductions').value) || 0;
    const net = Math.max(0, base + hra + allow - ded);
    document.getElementById('epd-projected-net').textContent = `₹${net.toLocaleString('en-IN')}`;
}

function submitEditPaymentDetails(e) {
    e.preventDefault();
    const staffId = document.getElementById('epd-staff-id').value;
    const bankName = document.getElementById('epd-bank-name').value.trim();
    const accountNo = document.getElementById('epd-account-no').value.trim();
    const ifsc = document.getElementById('epd-ifsc').value.trim().toUpperCase();
    const pan = document.getElementById('epd-pan').value.trim().toUpperCase();

    const base = parseFloat(document.getElementById('epd-base-salary').value) || 0;
    const hra = parseFloat(document.getElementById('epd-hra').value) || 0;
    const allow = parseFloat(document.getElementById('epd-special-allowance').value) || 0;
    const ded = parseFloat(document.getElementById('epd-deductions').value) || 0;
    const net = Math.max(0, base + hra + allow - ded);

    // Update in users
    const u = users.find(user => user.employeeId === staffId);
    if (u) {
        u.bankName = bankName;
        u.accountNo = accountNo;
        u.ifsc = ifsc;
        u.pan = pan;
    }

    // Update in all payroll entries for this staff
    payroll.forEach(p => {
        if (p.staffId === staffId) {
            p.bankName = bankName;
            p.accountNo = accountNo;
            p.bankAccount = `${bankName} (•••• ${accountNo.slice(-4)})`;
            p.ifsc = ifsc;
            p.taxPan = pan;
            p.baseSalary = base;
            p.hra = hra;
            p.allowances = hra + allow;
            p.deductions = ded;
            p.netSalary = p.baseSalary + p.allowances + (p.specialPayment || 0) - p.deductions;
            p.salaryConfigured = true;
        }
    });

    // Sync with MongoDB backend
    fetch('/api/payroll/payment-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, bankName, accountNo, ifsc, pan, baseSalary: base, hra, allowances: allow, deductions: ded })
    }).catch(err => console.warn('MongoDB sync:', err));

    closeModal('employee-payment-details-modal');
    renderPayrollSystem();
    showToast(`Bank account & salary breakdown saved for ${staffId}!`, 'success');
}

// ── 10D. SPECIAL PAYMENTS & PROCUREMENT PURCHASES (Admin & Accountant) ──

function openSpecialPaymentModal() {
    const list = document.getElementById('sp-payee-suggestions');
    if (list) {
        const vendorSuggestions = [
            'Apex Biomedical Solutions Ltd',
            'MediLife Oxygen Cylinders & Gases',
            'Cipla & SunPharma Bulk Distribution',
            'CleanCare Hospital Sanitation Services',
            'Siemens Healthineers Telemetry Spares'
        ];
        const staffNames = users.map(u => u.name);
        list.innerHTML = [...staffNames, ...vendorSuggestions].map(n => `<option value="${n}">`).join('');
    }
    document.getElementById('special-payment-form').reset();
    openModal('special-payment-modal');
}

function submitSpecialPayment(e) {
    e.preventDefault();
    const payeeName = document.getElementById('sp-payee-name').value.trim();
    const category = document.getElementById('sp-category').value;
    const accountNo = document.getElementById('sp-account-no').value.trim();
    const ifsc = document.getElementById('sp-ifsc').value.trim().toUpperCase();
    const amount = parseFloat(document.getElementById('sp-amount').value) || 0;
    const mode = document.getElementById('sp-payment-mode').value;
    const approvedBy = document.getElementById('sp-approved-by').value;
    const remarks = document.getElementById('sp-remarks').value.trim();

    if (amount <= 0) {
        showToast('Please enter a valid disbursement amount.', 'error');
        return;
    }

    // If payee matches a staff member, update their special payment bonus
    const matchedStaff = payroll.find(p => p.name.toLowerCase().includes(payeeName.toLowerCase()));
    if (matchedStaff) {
        matchedStaff.specialPayment = (matchedStaff.specialPayment || 0) + amount;
        matchedStaff.specialPaymentReason = remarks || category;
        matchedStaff.netSalary += amount;
    }

    // Record in multi-column transaction ledger
    hospitalTransactions.unshift({
        id: 'TXN-SPEC-' + String(hospitalTransactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: category,
        patientId: matchedStaff ? matchedStaff.staffId : 'VENDOR-PROC',
        service: `[${mode} Disbursal] Payee: ${payeeName} (A/C: ${accountNo}, IFSC: ${ifsc}) — ${remarks} [Auth: ${approvedBy}]`,
        icuAmount: category.includes('Equipment') ? amount : 0,
        pharmacyAmount: category.includes('Pharmacy') ? amount : 0,
        opdAmount: 0,
        erAmount: category.includes('Operational') ? amount : 0,
        salaryAmount: matchedStaff ? amount : 0,
        surgeryAmount: 0,
        totalAmount: amount,
        paymentMode: `Electronic ${mode}`,
        cashier: currentUser ? currentUser.name : (currentRole === 'admin' ? 'Hospital Administrator' : 'Chief Accountant'),
        status: 'Completed'
    });

    // Sync with MongoDB backend
    fetch('/api/payroll/special-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payeeName, category, accountNo, ifsc, amount, mode, approvedBy, remarks })
    }).catch(err => console.warn('MongoDB sync:', err));

    closeModal('special-payment-modal');
    renderPayrollSystem();
    renderHospitalFinancials();
    renderStats();

    recentActivity.unshift({
        time: new Date().toTimeString().substring(0, 5),
        actor: currentUser ? currentUser.name : 'Finance Admin',
        text: `Authorized special payment of ₹${amount.toLocaleString('en-IN')} via ${mode} to ${payeeName}. Approved by ${approvedBy}.`
    });
    renderActivity();

    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} transferred via ${mode} to ${payeeName}!`, 'success');
}

// PDF Payslip Generator & Download
function viewPayslipPDF(payrollId) {
    const p = payroll.find(item => item.id === payrollId);
    if (!p) return;
    selectedPayslipItem = p;

    document.getElementById('printable-payslip-area').innerHTML = `
        <div style="background:#ffffff; color:#000000; padding:28px 32px; border-radius:8px; font-family:'Inter',sans-serif; border:1px solid #cbd5e1; box-shadow:0 4px 14px rgba(0,0,0,0.1);">
            <!-- Hospital Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2563eb; padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h2 style="color:#1e3a8a; font-size:22px; font-weight:800; margin:0;"><i class="fas fa-heartbeat" style="color:#2563eb"></i> MedCore AI Hospital</h2>
                    <p style="font-size:12px; color:#475569; margin:2px 0 0 0;">Smart Clinical &amp; Operations Center • Accreditation NABH &amp; JCI</p>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:16px; font-weight:800; color:#1e293b;">SALARY PAYSLIP</div>
                    <div style="font-size:12px; color:#64748b; font-weight:600;">Pay Period: ${p.month}</div>
                </div>
            </div>

            <!-- Employee Details Grid -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px 24px; font-size:12.5px; background:#f8fafc; padding:14px; border-radius:6px; margin-bottom:18px; border:1px solid #e2e8f0;">
                <div><span style="color:#64748b;">Staff Full Name:</span> <strong style="color:#0f172a;">${p.name}</strong></div>
                <div><span style="color:#64748b;">Employee Staff ID:</span> <strong style="color:#0f172a;">${p.staffId}</strong></div>
                <div><span style="color:#64748b;">Designation / Role:</span> <strong style="color:#0f172a;">${p.role}</strong></div>
                <div><span style="color:#64748b;">Clinical Department:</span> <strong style="color:#0f172a;">${p.department}</strong></div>
                <div><span style="color:#64748b;">Bank Account:</span> <strong style="color:#0f172a;">${p.bankAccount}</strong></div>
                <div><span style="color:#64748b;">Tax PAN Number:</span> <strong style="color:#0f172a;">${p.taxPan}</strong></div>
            </div>

            <!-- Earnings vs Deductions Table -->
            <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:18px;">
                <thead>
                    <tr style="background:#f1f5f9; border-bottom:1px solid #cbd5e1;">
                        <th style="text-align:left; padding:8px 12px; color:#334155;">Earnings Component</th>
                        <th style="text-align:right; padding:8px 12px; color:#334155;">Amount (₹)</th>
                        <th style="text-align:left; padding:8px 12px; color:#334155;">Deductions Component</th>
                        <th style="text-align:right; padding:8px 12px; color:#334155;">Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:8px 12px;">Base Salary</td>
                        <td style="text-align:right; padding:8px 12px; font-weight:600;">₹${p.baseSalary.toLocaleString('en-IN')}</td>
                        <td style="padding:8px 12px;">Income Tax TDS</td>
                        <td style="text-align:right; padding:8px 12px; color:#dc2626;">₹${Math.round(p.deductions * 0.7).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:8px 12px;">Special Allowances &amp; HRA</td>
                        <td style="text-align:right; padding:8px 12px; font-weight:600;">₹${p.allowances.toLocaleString('en-IN')}</td>
                        <td style="padding:8px 12px;">Provident Fund &amp; Insurance</td>
                        <td style="text-align:right; padding:8px 12px; color:#dc2626;">₹${Math.round(p.deductions * 0.3).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                        <td style="padding:8px 12px;">Special Bonus / Incentive (${p.specialPaymentReason || '—'})</td>
                        <td style="text-align:right; padding:8px 12px; font-weight:700; color:#16a34a;">+₹${(p.specialPayment || 0).toLocaleString('en-IN')}</td>
                        <td style="padding:8px 12px;">Total Deductions</td>
                        <td style="text-align:right; padding:8px 12px; font-weight:700; color:#dc2626;">-₹${p.deductions.toLocaleString('en-IN')}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Net Disbursal Banner -->
            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:12px 18px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:12px; color:#1e40af; font-weight:700; text-transform:uppercase;">Net Salary Disbursed:</span>
                    <div style="font-size:11px; color:#3b82f6;">Status: Verified Paid on ${p.paymentDate}</div>
                </div>
                <div style="font-size:22px; font-weight:800; color:#1d4ed8;">₹${p.netSalary.toLocaleString('en-IN')}</div>
            </div>

            <!-- Footer & Signatures -->
            <div style="display:flex; justify-content:space-between; margin-top:28px; padding-top:14px; border-top:1px dashed #cbd5e1; font-size:11px; color:#64748b;">
                <div>Computer Generated Official Document • Ref: ${p.id}</div>
                <div>Authorized Signatory: <strong>Sanjay Mehta, CPA (CFO)</strong></div>
            </div>
        </div>
    `;

    openModal('payslip-modal');
}

function printPayslipPDF() {
    window.print();
}

function exportPayrollExcel() {
    try {
        const exportData = payroll.map(p => ({
            'Payroll ID': p.id,
            'Staff ID': p.staffId,
            'Staff Name': p.name,
            'Role': p.role,
            'Department': p.department,
            'Month': p.month,
            'Base Salary (INR)': p.baseSalary,
            'Allowances': p.allowances,
            'Special Payment': p.specialPayment || 0,
            'Reason': p.specialPaymentReason || '—',
            'Deductions': p.deductions,
            'Net Disbursed': p.netSalary,
            'Payment Status': p.status,
            'Disbursal Date': p.paymentDate,
            'Bank Account': p.bankAccount,
            'Tax PAN': p.taxPan
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
//  11. STAFF SELF-SERVICE: MY ATTENDANCE & PAYSLIPS
// ===================================================================

function renderMyPayroll() {
    const staffId = (currentUser && currentUser.employeeId) || 'DOC-02';

    // My Attendance Logs
    const myLogs = attendanceLogs.filter(a => a.staffId === staffId);
    const logHtml = myLogs.map(l => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;">
            <div>
                <strong style="color:#ffffff;">${l.date}</strong>
                <div style="font-size:11px; color:#94a3b8;">Clock-In: ${l.clockIn} • Clock-Out: ${l.clockOut}</div>
            </div>
            <div style="text-align:right;">
                <span class="status-badge ${l.status === 'On Duty' ? 'active' : 'completed'}">${l.status}</span>
                <div style="font-size:11px; color:#38bdf8; font-weight:700; margin-top:2px;">${l.hours} hrs</div>
            </div>
        </div>
    `).join('');
    document.getElementById('my-attendance-list').innerHTML = logHtml || '<p style="color:#64748b">No attendance clocked yet.</p>';

    // My Current Month Snapshot
    const currentPay = payroll.find(p => p.staffId === staffId && p.month === 'November 2026') || payroll[0];
    document.getElementById('my-compensation-snapshot').innerHTML = `
        <div style="font-size:13px; line-height:1.7;">
            <div style="display:flex; justify-content:space-between;"><span style="color:#94a3b8;">Base Salary:</span> <strong>₹${currentPay.baseSalary.toLocaleString('en-IN')}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:#94a3b8;">Allowances:</span> <strong style="color:var(--success);">+₹${currentPay.allowances.toLocaleString('en-IN')}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:#94a3b8;">Special Bonus:</span> <strong style="color:var(--purple);">+₹${(currentPay.specialPayment || 0).toLocaleString('en-IN')}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:#94a3b8;">Deductions:</span> <strong style="color:var(--danger);">-₹${currentPay.deductions.toLocaleString('en-IN')}</strong></div>
            <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border); padding-top:8px; margin-top:8px;">
                <span style="font-weight:700; color:#cbd5e1;">Net Disbursed:</span>
                <strong style="font-size:16px; color:#38bdf8;">₹${currentPay.netSalary.toLocaleString('en-IN')}</strong>
            </div>
        </div>
    `;

    // My Past Months Payslips
    const myHistory = payroll.filter(p => p.staffId === staffId);
    const rows = myHistory.map(p => `
        <tr>
            <td><strong>${p.month}</strong></td>
            <td>₹${p.baseSalary.toLocaleString('en-IN')}</td>
            <td style="color:var(--success);">+₹${(p.allowances + (p.specialPayment || 0)).toLocaleString('en-IN')}</td>
            <td style="color:var(--danger);">-₹${p.deductions.toLocaleString('en-IN')}</td>
            <td><strong style="color:#38bdf8; font-size:14px;">₹${p.netSalary.toLocaleString('en-IN')}</strong></td>
            <td>${p.paymentDate}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewPayslipPDF('${p.id}')">
                    <i class="fas fa-file-pdf"></i> Download PDF
                </button>
            </td>
        </tr>
    `).join('');
    document.getElementById('my-payslips-table-body').innerHTML = rows;
}

// ===================================================================
//  12. DOCTOR 7-DAY SCHEDULE & AI CLINICAL CHATBOT
// ===================================================================

function renderDoctorShifts() {
    const docId = (currentUser && currentUser.employeeId) || 'DOC-02';
    const myShifts = shifts.filter(s => s.staffId === docId);

    // Render 7-day calendar view
    const days = [
        { name: 'Sun', date: 'Nov 22', iso: '2026-11-22' },
        { name: 'Mon', date: 'Nov 23', iso: '2026-11-23' },
        { name: 'Tue', date: 'Nov 24', iso: '2026-11-24' },
        { name: 'Wed', date: 'Nov 25', iso: '2026-11-25' },
        { name: 'Thu', date: 'Nov 26', iso: '2026-11-26' },
        { name: 'Fri', date: 'Nov 27', iso: '2026-11-27' },
        { name: 'Sat', date: 'Nov 28', iso: '2026-11-28' }
    ];

    const weeklyHtml = days.map(d => {
        const dayShifts = myShifts.filter(s => s.date === d.iso);
        const shiftCards = dayShifts.map(s => `
            <div class="schedule-shift-card">
                <div class="schedule-shift-time"><i class="fas fa-clock"></i> ${s.start} - ${s.end}</div>
                <div class="schedule-shift-loc">${s.ward} Ward (${s.location})</div>
            </div>
        `).join('');

        return `
            <div class="schedule-day-col">
                <div class="schedule-day-header">
                    <div class="schedule-day-name">${d.name}</div>
                    <div class="schedule-day-date">${d.date}</div>
                </div>
                <div>${shiftCards || '<span style="font-size:11px; color:#64748b;">Off Duty</span>'}</div>
            </div>
        `;
    }).join('');
    document.getElementById('doctor-weekly-schedule-container').innerHTML = weeklyHtml;

    // Table rows
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

function submitDoctorAIChat() {
    const input = document.getElementById('doc-ai-input');
    const text = input.value.trim();
    if (!text) return;

    const chatWindow = document.getElementById('doc-ai-chat-messages');

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble user';
    userMsg.textContent = text;
    chatWindow.appendChild(userMsg);
    input.value = '';

    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Simulate AI clinical reasoning
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-bubble ai';

        const q = text.toLowerCase();
        let answer = '';

        if (q.includes('pt-4091') || q.includes('rohan')) {
            answer = `
                <strong>Patient Analysis: Rohan Kulkarni (PT-4091, Bed ICU-01)</strong><br>
                • <strong>Telemetry:</strong> HR 118 bpm (sinus tachycardia), BP 162/98 mmHg, SpO2 91% on 4L nasal cannula.<br>
                • <strong>Risk:</strong> Impending cardiogenic decompensation following acute STEMI.<br>
                • <strong>Recommended Next Steps:</strong><br>
                1. Escalate supplemental O2 to non-rebreather mask (titrate SpO2 > 94%).<br>
                2. Order stat serum troponin I repeat and 12-lead ECG.<br>
                3. Initiate IV Nitroglycerin titration if SBP > 140 mmHg and patient remains chest-pain positive.<br>
                4. Pre-alert Cath Lab team (Ext. 202) for urgent percutaneous coronary intervention.
            `;
        } else if (q.includes('stroke') || q.includes('vikramjeet') || q.includes('pt-4093')) {
            answer = `
                <strong>Code Stroke Guidance (Vikramjeet Singh, ER-01):</strong><br>
                Current BP is 178/104 mmHg. SBP is within permissible thrombolysis window (<185 mmHg). Ensure blood glucose was checked. If CT Angio demonstrates anterior circulation occlusion within 4.5h window, proceed with IV Tenecteplase 0.25 mg/kg.
            `;
        } else {
            answer = `
                <strong>Clinical Decision Support:</strong> I have reviewed active inpatient records. Patient <strong>Ananya Chatterjee (ICU-02)</strong> in septic shock has a MAP of 75 mmHg on current vasopressor support. Next lactate clearance sample is due in 35 minutes.
            `;
        }

        aiMsg.innerHTML = answer;
        chatWindow.appendChild(aiMsg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 450);
}

function triggerDoctorAIAutoAnalyze() {
    const chatWindow = document.getElementById('doc-ai-chat-messages');
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-bubble ai';
    aiMsg.innerHTML = `
        <strong>Automated Patient Telemetry Audit (Completed):</strong><br>
        • <strong>Bed ICU-01 (Rohan Kulkarni):</strong> Arterial SpO2 dropped from 94% to 91%. Recommend immediate respiratory therapist check.<br>
        • <strong>Bed ER-01 (Vikramjeet Singh):</strong> BP stabilized at 178/104. Neuro check due in 15 mins.<br>
        • <strong>Bed CARD-03 (Prakash Deshpande):</strong> Post-PTCA recovery normal. Vitals stable at HR 78 bpm, SpO2 98%. Safe for discharge kit preparation.
    `;
    chatWindow.appendChild(aiMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderDoctorPatients() {
    const docId = (currentUser && currentUser.employeeId) || 'DOC-02';
    const myPatients = patients.filter(p => p.doctorId === docId);

    const rows = myPatients.map(p => `
        <tr>
            <td>
                <strong style="color:#ffffff;">${p.name}</strong> (${p.id})
                <div style="font-size:11.5px; color:#94a3b8;">${p.age}y ${p.gender} • ${p.department}</div>
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
                <button class="btn btn-primary btn-sm" onclick="openPatientVitalsModal('${p.id}')"><i class="fas fa-chart-line"></i> Vitals Telemetry</button>
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

function renderDoctorLibrary() {
    const html = doctorLibrary.map(item => `
        <div class="library-card">
            <div class="library-card-header">
                <span class="library-tag"><i class="fas fa-notes-medical"></i> ${item.category}</span>
                <span class="library-code">${item.code}</span>
            </div>
            <h4>${item.title}</h4>
            <p class="library-summary">${item.summary}</p>
            <div class="library-chips">
                ${item.tags.map(t => `<span class="library-chip"><i class="fas fa-tag"></i> ${t}</span>`).join('')}
            </div>
        </div>
    `).join('');
    document.getElementById('doctor-library-container').innerHTML = html;
}

// ===================================================================
//  13. PHARMACY WORKSPACE (Queue, Stock Check, Billing with Split Payments)
// ===================================================================

function renderPharmQueue() {
    const rows = prescriptions.map((r, idx) => `
        <tr>
            <td><strong>${r.id}</strong></td>
            <td>
                <strong style="color:#ffffff;">${r.doctorName}</strong>
                <button class="btn btn-secondary btn-sm" onclick="callSpecificDoctor('${r.doctorId}', '${r.doctorName}')" style="margin-left:8px; padding:2px 8px;"><i class="fas fa-phone-alt"></i> Call</button>
            </td>
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
    document.getElementById('pharm-rx-queue-body').innerHTML = rows;
}

function renderPharmStock() {
    const isAccountant = (currentRole === 'accountant');
    const rows = medicines.map((m, idx) => {
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
                    ${!isAccountant ? `
                        <button class="btn btn-secondary btn-sm" onclick="quickRestockMedicine(${idx})"><i class="fas fa-plus"></i> Restock +50</button>
                    ` : '<span style="color:#64748b; font-size:11px;">View Only</span>'}
                </td>
            </tr>
        `;
    }).join('');
    document.getElementById('pharm-inventory-body').innerHTML = rows;
}

function openAddStockModal() {
    const sel = document.getElementById('as-med-select');
    sel.innerHTML = medicines.map(m => `<option value="${m.id}">${m.name} (Current: ${m.quantity})</option>`).join('');
    openModal('add-stock-modal');
}

function submitAddStockForm(e) {
    e.preventDefault();
    const medId = document.getElementById('as-med-select').value;
    const qty = parseInt(document.getElementById('as-qty-input').value) || 0;
    const med = medicines.find(m => m.id === medId);
    if (med && qty > 0) {
        med.quantity += qty;
        fetch('/api/medicines/restock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: medId, quantity: qty })
        }).catch(err => console.warn('MongoDB sync:', err));

        closeModal('add-stock-modal');
        renderPharmStock();
        showToast(`Stock updated: Added ${qty} units to ${med.name}.`, 'success');
    }
}

function quickRestockMedicine(idx) {
    medicines[idx].quantity += 50;
    fetch('/api/medicines/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: medicines[idx].id, quantity: 50 })
    }).catch(err => console.warn('MongoDB sync:', err));

    renderPharmStock();
    showToast(`Restocked +50 units of ${medicines[idx].name}.`, 'success');
}

function markRxReady(idx) {
    prescriptions[idx].status = 'Ready';
    renderPharmQueue();
    showToast(`Prescription ${prescriptions[idx].id} packed & marked READY!`, 'success');
}

function quickBillRx(idx) {
    const rx = prescriptions[idx];
    rx.status = 'Dispensed';

    // Record transaction with pharmacy split
    hospitalTransactions.unshift({
        id: 'TXN-RX-' + String(hospitalTransactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: 'Pharmacy',
        patientId: rx.patientId,
        service: `Dispensed Rx #${rx.id} (${rx.items.map(i => i.name).join(', ')})`,
        icuAmount: 0,
        pharmacyAmount: rx.estimatedTotal,
        opdAmount: 0,
        erAmount: 0,
        salaryAmount: 0,
        surgeryAmount: 0,
        totalAmount: rx.estimatedTotal,
        paymentMode: 'UPI / Digital',
        cashier: currentUser ? currentUser.name : 'Pharmacist',
        status: 'Completed'
    });

    renderPharmQueue();
    showToast(`Bill collected (₹${rx.estimatedTotal}) and medications dispensed for ${rx.patientName}!`, 'success');
}

function renderPharmBilling() {
    let pharmTotal = 0;
    const pharmTxns = hospitalTransactions.filter(t => (t.pharmacyAmount || 0) > 0 || t.department === 'Pharmacy');
    pharmTxns.forEach(t => { pharmTotal += (t.pharmacyAmount || t.totalAmount); });

    document.getElementById('stat-pharm-rev').textContent = `₹${pharmTotal.toLocaleString('en-IN')}`;
    document.getElementById('stat-pharm-dispensed').textContent = pharmTxns.length;

    const rows = pharmTxns.map(t => `
        <tr>
            <td><strong>${t.id}</strong></td>
            <td>${t.date}</td>
            <td>${t.patientId}</td>
            <td>${t.service}</td>
            <td><strong style="color:#a855f7;">₹${(t.pharmacyAmount || t.totalAmount).toLocaleString('en-IN')}</strong></td>
            <td><span style="font-size:12px; color:#cbd5e1;">${t.paymentMode}</span></td>
            <td><span class="status-badge paid"><i class="fas fa-check-circle"></i> Paid</span></td>
        </tr>
    `).join('');
    document.getElementById('pharmacy-sales-ledger-body').innerHTML = rows;
}

function toggleSplitPaymentFields(mode) {
    const splitBox = document.getElementById('split-payment-inputs');
    const label1 = document.getElementById('split-label-1');
    const label2 = document.getElementById('split-label-2');

    if (mode.startsWith('Split')) {
        splitBox.style.display = 'block';
        if (mode.includes('Cash + UPI')) {
            label1.textContent = 'Cash Amount (₹)';
            label2.textContent = 'UPI Amount (₹)';
        } else if (mode.includes('Cash + Card')) {
            label1.textContent = 'Cash Amount (₹)';
            label2.textContent = 'Card Amount (₹)';
        } else {
            label1.textContent = 'UPI Amount (₹)';
            label2.textContent = 'Card Amount (₹)';
        }
        calculateSplitBalance();
    } else {
        splitBox.style.display = 'none';
    }
}

function calculateSplitBalance() {
    let grand = 0;
    document.querySelectorAll('.bill-item-row').forEach(row => {
        const select = row.querySelector('.bill-med-select');
        const qty = parseInt(row.querySelector('.bill-med-qty').value) || 0;
        const opt = select.options[select.selectedIndex];
        if (opt && opt.value) grand += (parseFloat(opt.dataset.price) || 0) * qty;
    });

    const amt1 = parseInt(document.getElementById('split-amt-1').value) || 0;
    const amt2 = parseInt(document.getElementById('split-amt-2').value) || 0;
    const sum = amt1 + amt2;

    const msg = document.getElementById('split-balance-msg');
    if (sum === grand) {
        msg.textContent = '✓ Split Total matches Grand Total perfectly (₹' + grand + ')';
        msg.style.color = 'var(--success)';
    } else {
        msg.textContent = `⚠ Split sum is ₹${sum}. Remaining balance to allocate: ₹${grand - sum}`;
        msg.style.color = 'var(--warning)';
    }
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

    let finalModeText = paymentMode;
    if (paymentMode.startsWith('Split')) {
        const amt1 = document.getElementById('split-amt-1').value;
        const amt2 = document.getElementById('split-amt-2').value;
        finalModeText = `${paymentMode} [Share: ₹${amt1} + ₹${amt2}]`;
    }

    hospitalTransactions.unshift({
        id: 'TXN-BILL-' + String(hospitalTransactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: 'Pharmacy',
        patientId: patientText,
        service: `Pharmacy Direct Bill (${items.join(', ')})`,
        icuAmount: 0,
        pharmacyAmount: total,
        opdAmount: 0,
        erAmount: 0,
        salaryAmount: 0,
        surgeryAmount: 0,
        totalAmount: total,
        paymentMode: finalModeText,
        cashier: currentUser ? currentUser.name : 'Pharmacist',
        status: 'Completed'
    });

    // Sync with MongoDB backend
    fetch('/api/pharmacy/bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            totalAmount: total,
            patientName: patientText,
            paymentMode: finalModeText,
            cashier: currentUser ? currentUser.name : 'Pharmacist',
            items: items.map(it => ({ name: it, qty: 1 }))
        })
    }).catch(err => console.warn('MongoDB sync:', err));

    closeModal('bill-modal');
    refreshCurrentView();
    showToast(`Bill generated for ₹${total.toLocaleString('en-IN')}. Stock updated automatically!`, 'success');
}

// ===================================================================
//  14. INTERNAL SECURE MAIL WITH AI DRAFTER (Mail ID Based)
// ===================================================================

let mailViewScope = 'my'; // 'my' or 'all' (for admin / superadmin)
let currentFilteredMails = [];

function backToMailList() {
    const container = document.querySelector('.mail-container');
    if (container) {
        container.classList.remove('viewing-detail');
    }
}

function setMailViewScope(scope) {
    mailViewScope = scope;
    const btnMy = document.getElementById('btn-mail-scope-my');
    const btnAll = document.getElementById('btn-mail-scope-all');
    if (btnMy) btnMy.classList.toggle('active', scope === 'my');
    if (btnAll) btnAll.classList.toggle('active', scope === 'all');
    backToMailList();
    renderInternalMail();
}

function renderInternalMail() {
    const userEmail = (currentUser && currentUser.email ? currentUser.email.toLowerCase() : '');
    const userRole = (currentUser && currentUser.role ? currentUser.role.toLowerCase() : 'doctor');
    const isAdminOrSuper = ['admin', 'superadmin'].includes(userRole);

    const adminScopeBox = document.getElementById('admin-mail-scope-container');
    if (adminScopeBox) {
        adminScopeBox.style.display = isAdminOrSuper ? 'flex' : 'none';
    }

    if (isAdminOrSuper && mailViewScope === 'all') {
        currentFilteredMails = internalMails;
        const titleSpan = document.getElementById('mail-sidebar-title');
        if (titleSpan) titleSpan.innerHTML = '<i class="fas fa-layer-group"></i> All Hospital Mails';
    } else {
        currentFilteredMails = internalMails.filter(m => {
            const toEmail = (m.toEmail || '').toLowerCase();
            const fromEmail = (m.fromEmail || '').toLowerCase();
            const toMatch = toEmail === userEmail;
            const fromMatch = fromEmail === userEmail;

            const ccList = Array.isArray(m.cc) ? m.cc : (m.cc ? String(m.cc).split(',').map(s => s.trim().toLowerCase()) : []);
            const ccMatch = ccList.some(e => e.toLowerCase() === userEmail);

            const bccList = Array.isArray(m.bcc) ? m.bcc : (m.bcc ? String(m.bcc).split(',').map(s => s.trim().toLowerCase()) : []);
            const bccMatch = bccList.some(e => e.toLowerCase() === userEmail);

            return toMatch || fromMatch || ccMatch || bccMatch;
        });
        const titleSpan = document.getElementById('mail-sidebar-title');
        if (titleSpan) titleSpan.innerHTML = '<i class="fas fa-inbox"></i> My Mails & Direct';
    }

    const unreadCount = currentFilteredMails.filter(m => !m.read).length;
    const badge = document.getElementById('mail-unread-count');
    if (badge) badge.textContent = `${unreadCount} Unread`;

    if (currentFilteredMails.length === 0) {
        document.getElementById('mail-inbox-list').innerHTML = `
            <div style="padding:28px 16px; text-align:center; color:#64748b; font-size:12.5px;">
                <i class="fas fa-envelope-open" style="font-size:28px; margin-bottom:8px; opacity:0.5;"></i>
                <p>No messages found in this view.</p>
            </div>
        `;
        document.getElementById('mail-content-display').innerHTML = `
            <div style="color:#64748b; text-align:center; margin-top:120px;">
                <i class="fas fa-envelope-open-text" style="font-size:42px; margin-bottom:12px;"></i>
                <p>Select a message from the list to view full correspondence.</p>
            </div>
        `;
        return;
    }

    const html = currentFilteredMails.map((m, idx) => `
        <div class="mail-item ${idx === 0 ? 'active' : ''}" onclick="selectMailItem(${idx}, true)">
            <div class="mail-sender">
                <span>${m.fromName}</span>
                <span style="font-size:10.5px; color:#94a3b8;">${m.timestamp ? m.timestamp.split(' ')[1] : ''}</span>
            </div>
            <div style="font-size:11px; color:#38bdf8; font-family:monospace; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${m.fromEmail || 'staff@medcore.org'} &rarr; ${m.toEmail || 'staff@medcore.org'}
            </div>
            <div class="mail-subject">${m.subject}</div>
            <div class="mail-preview">${m.body}</div>
        </div>
    `).join('');
    document.getElementById('mail-inbox-list').innerHTML = html;
    selectMailItem(0, false);
}

function selectMailItem(idx, isUserClick = false) {
    const m = currentFilteredMails[idx];
    if (!m) return;

    document.querySelectorAll('.mail-item').forEach((item, i) => item.classList.toggle('active', i === idx));

    if (isUserClick) {
        const mailContainer = document.querySelector('.mail-container');
        if (mailContainer) {
            mailContainer.classList.add('viewing-detail');
        }
    }

    const userEmail = (currentUser && currentUser.email ? currentUser.email.toLowerCase() : '');
    const userRole = (currentUser && currentUser.role ? currentUser.role.toLowerCase() : 'doctor');
    const isAdminOrSuper = ['admin', 'superadmin'].includes(userRole);

    const ccList = Array.isArray(m.cc) ? m.cc : (m.cc ? String(m.cc).split(',').map(s => s.trim()) : []);
    const ccDisplay = ccList.length > 0 
        ? `<div style="font-size:12px; color:#94a3b8; margin-top:4px;">CC: <span style="color:#cbd5e1;">${ccList.join(', ')}</span></div>` 
        : '';

    // BCC visibility: only sender, admin/superadmin, or if current user is that BCC recipient
    let bccDisplay = '';
    const bccList = Array.isArray(m.bcc) ? m.bcc : (m.bcc ? String(m.bcc).split(',').map(s => s.trim()) : []);
    const canSeeBcc = isAdminOrSuper || ((m.fromEmail || '').toLowerCase() === userEmail) || bccList.some(e => e.toLowerCase() === userEmail);
    if (canSeeBcc && bccList.length > 0) {
        bccDisplay = `<div style="font-size:12px; color:#94a3b8; margin-top:4px;">BCC: <span style="color:#e2e8f0;">${bccList.join(', ')}</span></div>`;
    }

    document.getElementById('mail-content-display').innerHTML = `
        <div class="mail-mobile-back-bar">
            <button type="button" class="btn btn-secondary btn-sm" onclick="backToMailList()">
                <i class="fas fa-arrow-left"></i> Back to Inbox
            </button>
        </div>
        <div class="mail-detail-header">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
                <span class="severity-badge ${m.priority === 'Urgent' ? 'critical' : 'moderate'}">${m.priority} Priority</span>
                <span style="font-size:11.5px; color:#94a3b8;"><i class="fas fa-clock"></i> ${m.timestamp}</span>
            </div>
            <h3 style="color:#ffffff; font-size:17px; margin-bottom:10px; line-height:1.35; word-break:break-word;">${m.subject}</h3>
            <div class="mail-meta-box">
                <div>From: <strong style="color:#fff;">${m.fromName}</strong> &lt;${m.fromEmail || 'staff@medcore.org'}&gt;</div>
                <div style="margin-top:3px;">To: <strong style="color:#fff;">${m.toName}</strong> &lt;${m.toEmail || 'staff@medcore.org'}&gt;</div>
                ${ccDisplay}
                ${bccDisplay}
            </div>
        </div>
        <div class="mail-body-text">${m.body}</div>
        <div style="margin-top:24px; padding-top:14px; border-top:1px solid var(--border); display:flex; gap:10px;">
            <button class="btn btn-secondary btn-sm" onclick="openReplyMailModal('${m.fromEmail || 'doctor@medcore.org'}', '${m.fromName}', '${m.subject}')"><i class="fas fa-reply"></i> Reply</button>
        </div>
    `;
}

function openComposeMailModal() {
    document.getElementById('compose-mail-form').reset();
    const datalist = document.getElementById('staff-email-datalist');
    if (datalist) {
        datalist.innerHTML = users.map(u => `<option value="${u.email}">${u.name} (${formatRole(u.role)})</option>`).join('');
    }
    openModal('compose-mail-modal');
}

function openReplyMailModal(fromEmail, fromName, origSubject) {
    openComposeMailModal();
    const recipientInput = document.getElementById('mail-recipient-email');
    if (recipientInput) recipientInput.value = fromEmail;
    document.getElementById('mail-subject-input').value = 'Re: ' + origSubject;
}

function aiDraftMail(type) {
    const subject = document.getElementById('mail-subject-input');
    const body = document.getElementById('mail-body-input');

    if (type === 'consult') {
        subject.value = 'Urgent Clinical Consult Request: Bed ICU-01 (Cardiac Telemetry)';
        body.value = 'Dear Colleague,\n\nPlease review patient Rohan Kulkarni in Bed ICU-01. Patient telemetry demonstrates persistent sinus tachycardia (HR 118 bpm, SpO2 91%). Please provide your clinical recommendation for emergency catheterisation.\n\nWarm regards,\n' + (currentUser ? currentUser.name : 'Attending Staff');
    } else if (type === 'handover') {
        subject.value = 'Shift Handover Clinical Summary — Ward Rounds';
        body.value = 'Dear Team,\n\nHandover update for upcoming shift: 10 admitted inpatients, 3 critical telemetry monitoring protocols active in ICU/Emergency. All infusion lines verified. Next vitals checks scheduled at noon.\n\nBest,\n' + (currentUser ? currentUser.name : 'Shift Lead');
    } else if (type === 'stock') {
        subject.value = 'Urgent Supply Notice: Epinephrine & Oxygen Reorder Required';
        body.value = 'Dear Administration & Pharmacy,\n\nStock levels for Epinephrine 1mg/mL Auto-Ampoules have reached the safety threshold (14 remaining). Please expedite purchase order approval.\n\nThank you,\n' + (currentUser ? currentUser.name : 'Staff');
    } else if (type === 'payroll') {
        subject.value = 'Payroll & Special Payment Disbursal Confirmation Query';
        body.value = 'Dear Finance & Accounts,\n\nKindly verify the special payment bonus allocation for emergency on-call shifts completed last week. Please confirm when the payslip PDF is available for download.\n\nRegards,\n' + (currentUser ? currentUser.name : 'Employee');
    }
}

function submitSendInternalMail(e) {
    e.preventDefault();
    const recipientEmail = document.getElementById('mail-recipient-email').value.trim();
    const ccRaw = document.getElementById('mail-cc-email') ? document.getElementById('mail-cc-email').value.trim() : '';
    const bccRaw = document.getElementById('mail-bcc-email') ? document.getElementById('mail-bcc-email').value.trim() : '';
    const priority = document.getElementById('mail-priority-select').value;
    const subject = document.getElementById('mail-subject-input').value.trim();
    const body = document.getElementById('mail-body-input').value.trim();

    if (!recipientEmail || !subject || !body) return;

    const cc = ccRaw ? ccRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
    const bcc = bccRaw ? bccRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    const matchedUser = users.find(u => u.email.toLowerCase() === recipientEmail.toLowerCase());
    const toName = matchedUser ? matchedUser.name : recipientEmail;
    const toRole = matchedUser ? (matchedUser.title || formatRole(matchedUser.role)) : 'Hospital Staff';

    const newMail = {
        id: 'MAIL-' + String(internalMails.length + 1).padStart(3, '0'),
        fromId: (currentUser && currentUser.employeeId) || 'DOC-02',
        fromName: (currentUser && currentUser.name) || 'Staff',
        fromEmail: (currentUser && currentUser.email) || 'staff@medcore.org',
        fromRole: (currentUser && currentUser.title) || 'Attending Physician',
        toEmail: recipientEmail,
        toName: toName,
        toRole: toRole,
        cc: cc,
        bcc: bcc,
        subject: subject,
        body: body,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false,
        priority: priority
    };

    // Sync with MongoDB backend
    fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMail)
    }).catch(err => console.warn('MongoDB sync:', err));

    internalMails.unshift(newMail);
    closeModal('compose-mail-modal');
    backToMailList();
    renderInternalMail();
    showToast(`Internal email dispatched to ${recipientEmail}!`, 'success');
}

// ===================================================================
//  15. HELPDESK & ISSUE TICKETING (Everybody can raise issues)
// ===================================================================

function renderSupportIssues() {
    const isAdmin = (currentRole === 'admin');
    const rows = supportIssues.map((iss, idx) => `
        <tr>
            <td><strong>${iss.id}</strong></td>
            <td><strong>${iss.raisedByName}</strong><div style="font-size:11px; color:#94a3b8;">${iss.raisedByRole} • ${iss.createdAt}</div></td>
            <td><span class="role-tag">${iss.category}</span></td>
            <td><span class="severity-badge ${iss.priority.toLowerCase()}">${iss.priority}</span></td>
            <td>
                <strong style="color:#ffffff;">${iss.subject}</strong>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">${iss.description}</div>
            </td>
            <td><span class="status-badge ${iss.status.toLowerCase().replace(' ', '')}">${iss.status}</span></td>
            <td>
                ${isAdmin && iss.status !== 'Resolved' ? `
                    <button class="btn btn-success btn-sm" onclick="resolveSupportIssue(${idx})"><i class="fas fa-check"></i> Resolve Ticket</button>
                ` : `
                    <span style="font-size:11.5px; color:#94a3b8;">${iss.resolutionNotes || 'Logged with Admin'}</span>
                `}
            </td>
        </tr>
    `).join('');
    document.getElementById('support-issues-table-body').innerHTML = rows;
}

function openRaiseIssueModal() {
    document.getElementById('raise-issue-form').reset();
    openModal('raise-issue-modal');
}

function submitRaiseIssue(e) {
    e.preventDefault();
    const category = document.getElementById('issue-category').value;
    const priority = document.getElementById('issue-priority').value;
    const subject = document.getElementById('issue-subject').value.trim();
    const desc = document.getElementById('issue-desc').value.trim();

    const newIssue = {
        id: 'ISSUE-' + (300 + supportIssues.length + 1),
        raisedById: (currentUser && currentUser.employeeId) || 'DOC-02',
        raisedByName: (currentUser && currentUser.name) || 'Staff Member',
        raisedByRole: (currentUser && currentUser.title) || 'Hospital Staff',
        category, priority, subject,
        description: desc,
        status: 'Open',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        resolutionNotes: 'Ticket dispatched to Administration helpdesk.'
    };

    // Sync with MongoDB backend
    fetch('/api/issues/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue)
    }).catch(err => console.warn('MongoDB sync:', err));

    supportIssues.unshift(newIssue);
    closeModal('raise-issue-modal');
    renderSupportIssues();
    showToast(`Issue ${newIssue.id} raised successfully! Administrator notified.`, 'success');
}

function resolveSupportIssue(idx) {
    supportIssues[idx].status = 'Resolved';
    supportIssues[idx].resolutionNotes = 'Resolved & signed off by Hospital Administrator.';
    renderSupportIssues();
    showToast(`Ticket ${supportIssues[idx].id} marked RESOLVED!`, 'success');
}

// ===================================================================
//  16. CALL DOCTOR & INTERCOM MODAL
// ===================================================================

function openCallDoctorModal() {
    const activeDocs = shifts.filter(s => s.staffType === 'Doctor' && s.date === '2026-11-22');
    const container = document.getElementById('call-doctors-list-container');

    container.innerHTML = activeDocs.map(s => {
        const doc = doctors.find(d => d.id === s.staffId) || { specialization: 'Specialist', phone: 'Ext. 200' };
        return `
            <div style="background:#111c2f; border:1px solid var(--border); border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4 style="color:#ffffff; font-size:14px; margin:0;">${s.staffName}</h4>
                    <div style="font-size:12px; color:#38bdf8; margin-top:2px;">
                        <i class="fas fa-map-marker-alt"></i> ${s.location} (${s.ward} Ward) &bull; <strong style="color:#cbd5e1;">${doc.phone || 'Ext. 200'}</strong>
                    </div>
                    <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Specialization: ${doc.specialization} &bull; Shift ends: ${s.end}</div>
                </div>
                <button class="btn btn-success btn-sm" onclick="simulateCall('${s.staffName}', '${s.location}', '${doc.phone || 'Ext. 200'}')">
                    <i class="fas fa-phone"></i> Dial
                </button>
            </div>
        `;
    }).join('') || '<p style="color:#64748b">No physicians currently clocked in.</p>';

    openModal('call-doctor-modal');
}

function callSpecificDoctor(docId, docName) {
    const doc = doctors.find(d => d.id === docId) || { room: 'Ward Bay', phone: 'Ext. 200' };
    simulateCall(docName, doc.room, doc.phone);
}

function simulateCall(name, location, phone) {
    showToast(`Calling ${name} at ${location} (${phone})... Connecting audio intercom line!`, 'info');
    setTimeout(() => {
        showToast(`Connected with ${name} (${phone}) on encrypted line.`, 'success');
    }, 1200);
}

// ===================================================================
//  17. NURSE, WARD, STAFF DIRECTORY HELPERS
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

    const activeDocs = shifts.filter(s => s.staffType === 'Doctor' && s.date === '2026-11-22');
    const dList = activeDocs.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;">
            <div>
                <strong style="color:#ffffff;">${s.staffName}</strong>
                <div style="font-size:11.5px; color:#38bdf8;"><i class="fas fa-map-marker-alt"></i> ${s.location} (${s.ward})</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="callSpecificDoctor('${s.staffId}', '${s.staffName}')"><i class="fas fa-phone"></i> Call</button>
        </div>
    `).join('');
    document.getElementById('nurse-doctors-list').innerHTML = dList;
}

function renderWardWorkspace() {
    const activeDocs = shifts.filter(s => s.staffType === 'Doctor' && s.date === '2026-11-22');
    const dList = activeDocs.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;">
            <div>
                <strong style="color:#ffffff;">${s.staffName}</strong>
                <div style="font-size:11.5px; color:#38bdf8;"><i class="fas fa-map-marker-alt"></i> ${s.location} (${s.ward})</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="callSpecificDoctor('${s.staffId}', '${s.staffName}')"><i class="fas fa-phone"></i> Call Doctor</button>
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

function renderStaffDirectory() {
    const rows = users.map((u, idx) => `
        <tr>
            <td>
                <strong style="color:#ffffff;">${u.name}</strong>
                <div style="font-size:11.5px; color:#94a3b8;">${u.employeeId} • ${u.title || ''}</div>
            </td>
            <td><code style="color:#38bdf8;">${u.email}</code></td>
            <td>${u.department}</td>
            <td><span class="role-tag ${u.role.toLowerCase()}">${u.role.toUpperCase()}</span></td>
            <td><strong style="color:#cbd5e1;">${u.phone || 'Ext. 100'}</strong></td>
            <td>
                ${currentUser && currentUser.role === 'admin' ? `
                    <button class="btn btn-danger btn-sm" onclick="removeStaffMember(${idx})"><i class="fas fa-user-minus"></i> Remove</button>
                ` : '<span style="color:#64748b; font-size:11px;">Active Staff</span>'}
            </td>
        </tr>
    `).join('');
    document.getElementById('staff-directory-table-body').innerHTML = rows;
}

function removeStaffMember(idx) {
    if (confirm(`Remove employee ${users[idx].name} from hospital system?`)) {
        const removed = users.splice(idx, 1)[0];
        renderStaffDirectory();
        showToast(`Employee ${removed.name} removed from hospital roster.`, 'info');
    }
}

// ===================================================================
//  18. ADMISSION & PRESCRIPTION HELPERS
// ===================================================================

function openAdmitPatientModal() {
    document.getElementById('admit-patient-form').reset();
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
        name, age, gender,
        department: severity === 'Critical' ? 'Critical Care / ICU' : 'Emergency Medicine',
        concern, severity, bed: bedId,
        ward: bedId.startsWith('ICU') ? 'ICU' : bedId.startsWith('ER') ? 'Emergency' : bedId.startsWith('CARD') ? 'Cardiology' : 'General',
        doctorId, doctorName,
        nurseId: 'NRS-01',
        admittedAt: '2026-11-22 ' + nowStr,
        status: 'Admitted',
        vitals: { hr: 96, spo2: 98, bp: '124/80', bpSys: 124, bpDia: 80, temp: 98.6 },
        vitalsHistory: [{ time: nowStr, heartRate: 96, bpSys: 124, bpDia: 80, spo2: 98, temp: 98.6 }]
    };

    patients.unshift(newPatient);

    // Sync to MongoDB
    fetch('/api/patients/admit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
    }).catch(err => console.warn('MongoDB sync:', err));

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

    // Sync to MongoDB
    fetch('/api/prescriptions/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRx)
    }).catch(err => console.warn('MongoDB sync:', err));

    closeModal('prescription-modal');
    refreshCurrentView();
    showToast(`Prescription ${newRx.id} sent to Pharmacy for Pre-Pack preparation!`, 'success');
}

function openNewBillModal() {
    if (currentRole === 'admin') {
        showToast('Hospital Policy: Admin is not authorized to generate pharmacy bills. Only Pharmacists & Accountants may bill.', 'error');
        return;
    }
    document.getElementById('create-bill-form').reset();
    populateBillMedicineOptions();
    document.getElementById('split-payment-inputs').style.display = 'none';
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
            grand += (parseFloat(opt.dataset.price) || 0) * qty;
        }
    });
    document.getElementById('bill-grand-total').textContent = `₹${grand.toLocaleString('en-IN')}`;
    calculateSplitBalance();
}

function exportPharmacySalesExcel() {
    exportFinancialsReport();
}

function exportPharmacyStockExcel() {
    try {
        const exportData = medicines.map(m => ({
            'Medication SKU': m.id,
            'Medication Name': m.name,
            'Category': m.category,
            'Current Stock (Units)': m.quantity,
            'Safety Threshold': m.threshold,
            'Unit Price (INR)': m.unitPrice,
            'Total Stock Valuation (INR)': m.quantity * m.unitPrice,
            'Stock Acuity Status': m.quantity <= m.threshold ? 'LOW STOCK (CRITICAL)' : 'HEALTHY'
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Current Inventory');
        XLSX.writeFile(wb, `MedCore_Pharmacy_Current_Stock_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('Current Pharmacy Stock catalog exported to Excel successfully!', 'success');
    } catch (err) {
        console.error('Error exporting pharmacy stock:', err);
        showToast('Export failed. Check Excel library.', 'error');
    }
}

// ===================================================================
//  18B. EXCEL STOCK IMPORT & AI STOCK VELOCITY ADVISOR
// ===================================================================

function importStockExcel(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            if (typeof XLSX === 'undefined') {
                showToast('Excel library not ready, please retry.', 'error');
                return;
            }
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (!jsonData || jsonData.length === 0) {
                showToast('Excel file is empty or format not recognized.', 'error');
                return;
            }

            let updatedCount = 0;
            let addedCount = 0;

            jsonData.forEach(row => {
                const name = row['Medication'] || row['Medicine'] || row['Name'] || row['SKU'] || row['Item'];
                const qty = parseInt(row['Quantity'] || row['Qty'] || row['Units'] || row['Stock'] || row['Add Stock']) || 0;
                const unitPrice = parseFloat(row['Price'] || row['UnitPrice'] || row['Rate'] || row['Unit Price']) || 150;
                const category = row['Category'] || row['Dept'] || 'General Pharmacy';
                const threshold = parseInt(row['Threshold'] || row['MinStock']) || 20;

                if (name && qty > 0) {
                    const existing = medicines.find(m => 
                        m.name.toLowerCase().includes(String(name).toLowerCase()) ||
                        String(name).toLowerCase().includes(m.name.toLowerCase()) ||
                        (m.id && m.id.toLowerCase() === String(name).toLowerCase())
                    );

                    if (existing) {
                        existing.quantity += qty;
                        updatedCount++;
                    } else {
                        medicines.push({
                            id: `MED-${String(medicines.length + 1).padStart(2, '0')}`,
                            name: String(name),
                            category: category,
                            quantity: qty,
                            threshold: threshold,
                            unitPrice: unitPrice
                        });
                        addedCount++;
                    }
                }
            });

            // Update UI
            renderPharmStock();
            renderStats();

            // Log activity
            recentActivity.unshift({
                time: new Date().toTimeString().substring(0, 5),
                actor: 'Pharmacist',
                text: `Imported stock from Excel: updated ${updatedCount} items, registered ${addedCount} new medications.`
            });
            renderActivity();

            showToast(`Excel Stock Import Complete! Updated ${updatedCount} items, added ${addedCount} new.`, 'success');
        } catch (err) {
            console.error('Error importing Excel stock:', err);
            showToast('Failed to parse Excel file. Please ensure columns include Medication and Quantity.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = ''; // Reset input for future uploads
}

function openAiStockAdvisorModal() {
    // Analyze medication sales velocity and burn rate
    const medSalesCounts = {};
    prescriptions.forEach(rx => {
        rx.items.forEach(it => {
            medSalesCounts[it.name] = (medSalesCounts[it.name] || 0) + (it.qty || 1);
        });
    });

    // Merge with inventory stats
    const analysis = medicines.map(m => {
        const soldUnits = medSalesCounts[m.name] || (m.quantity < m.threshold ? Math.floor(Math.random() * 25) + 15 : Math.floor(Math.random() * 8) + 2);
        const velocity = soldUnits > 18 ? 'High Velocity (Surge)' : (soldUnits > 8 ? 'Moderate Turnover' : 'Stable / Low');
        const isDepleted = m.quantity <= m.threshold;
        const recommendedRestock = isDepleted ? Math.max(50, m.threshold * 3 - m.quantity) : (soldUnits > 15 ? 50 : 0);
        return {
            ...m,
            soldUnits,
            velocity,
            isDepleted,
            recommendedRestock
        };
    });

    // Sort by sales velocity and critical need
    analysis.sort((a, b) => (b.soldUnits + (b.isDepleted ? 50 : 0)) - (a.soldUnits + (a.isDepleted ? 50 : 0)));

    const topSellers = analysis.filter(a => a.soldUnits > 8).slice(0, 4);
    const criticalNeeds = analysis.filter(a => a.isDepleted || a.recommendedRestock > 0);

    const container = document.getElementById('ai-stock-advisor-body');
    if (container) {
        container.innerHTML = `
            <div style="background:rgba(56, 189, 248, 0.08); border:1px solid rgba(56, 189, 248, 0.3); border-radius:8px; padding:14px; margin-bottom:18px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                    <i class="fas fa-brain" style="color:var(--accent); font-size:18px;"></i>
                    <strong style="color:#ffffff; font-size:14px;">MedCore AI Clinical Supply Velocity Engine</strong>
                </div>
                <p style="font-size:12.5px; color:#cbd5e1; line-height:1.5; margin:0;">
                    Synthesizing real-time prescription dispense rates, ER code stroke protocols, and inpatient bed occupancy to identify fast-depleting medicines and recommend optimal safety restocking.
                </p>
            </div>

            <h4 style="color:#ffffff; font-size:13px; margin:0 0 10px 0; display:flex; align-items:center; gap:8px;">
                <i class="fas fa-fire" style="color:#f59e0b;"></i> Top Selling Medications (Highest Demand)
            </h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:18px;">
                ${topSellers.map(ts => `
                    <div style="background:#090e18; border:1px solid #1e293b; border-radius:6px; padding:10px 12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:#ffffff; font-size:13px;">${ts.name}</strong>
                            <span style="font-size:10.5px; padding:2px 6px; border-radius:4px; background:rgba(245, 158, 11, 0.2); color:#f59e0b; font-weight:700;">${ts.velocity}</span>
                        </div>
                        <div style="font-size:11.5px; color:#94a3b8;">
                            Dispensed: <strong style="color:#38bdf8;">${ts.soldUnits} units</strong> • Current: <strong style="color:${ts.isDepleted ? '#ef4444' : '#10b981'};">${ts.quantity}</strong> (Min ${ts.threshold})
                        </div>
                    </div>
                `).join('')}
            </div>

            <h4 style="color:#ffffff; font-size:13px; margin:0 0 10px 0; display:flex; align-items:center; gap:8px;">
                <i class="fas fa-exclamation-triangle" style="color:#ef4444;"></i> AI Restock Recommendations (Urgent to Prevent Out-of-Stock)
            </h4>
            <div class="table-wrapper" style="margin-bottom:16px;">
                <table class="data-table" style="font-size:12.5px;">
                    <thead>
                        <tr>
                            <th>Medication</th>
                            <th>Current Stock</th>
                            <th>Safety Threshold</th>
                            <th>Sales Velocity</th>
                            <th>AI Recommended Restock</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${criticalNeeds.map(cn => `
                            <tr>
                                <td><strong style="color:#ffffff;">${cn.name}</strong> (${cn.category})</td>
                                <td><strong style="color:${cn.isDepleted ? '#ef4444' : '#f59e0b'};">${cn.quantity} units</strong></td>
                                <td>${cn.threshold} units</td>
                                <td><span style="color:#38bdf8; font-weight:600;">${cn.velocity}</span></td>
                                <td><strong style="color:#10b981;">+${cn.recommendedRestock} units</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:#090e18; border:1px solid #1e293b; padding:12px 16px; border-radius:6px;">
                <span style="font-size:12px; color:#94a3b8;">
                    Clicking below will automatically dispatch reorders and top up stock levels for all ${criticalNeeds.length} flagged items.
                </span>
                <button class="btn btn-primary" onclick="applyAiStockRecommendations()"><i class="fas fa-check-double"></i> 1-Click Auto-Restock All (${criticalNeeds.length} Items)</button>
            </div>
        `;
    }

    openModal('ai-stock-advisor-modal');
}

function applyAiStockRecommendations() {
    let count = 0;
    medicines.forEach(m => {
        if (m.quantity <= m.threshold) {
            const add = Math.max(50, m.threshold * 3 - m.quantity);
            m.quantity += add;
            count++;
        }
    });

    renderPharmStock();
    renderStats();
    closeModal('ai-stock-advisor-modal');

    recentActivity.unshift({
        time: new Date().toTimeString().substring(0, 5),
        actor: 'AI Stock Advisor',
        text: `Automated inventory replenishment: safely restocked ${count} critical medicines to peak threshold.`
    });
    renderActivity();

    showToast(`AI Stock Replenishment Applied! Restocked ${count} medicines.`, 'success');
}

// ===================================================================
//  19. MODAL UTILITIES & TOASTS
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
    bootstrapFromMongo();
});

// ===================================================================
//  20. MONGODB REAL-TIME DATABASE SYNC LAYER
// ===================================================================

async function bootstrapFromMongo() {
    try {
        if (window.location.protocol === 'file:') {
            updateMongoStatusUI(false);
            return;
        }
        const res = await fetch('api/bootstrap').catch(() => null);
        if (!res || !res.ok) {
            updateMongoStatusUI(false);
            return;
        }
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            updateMongoStatusUI(false);
            return;
        }
        const json = await res.json();
        if (json.success && json.data) {
            const d = json.data;
            if (d.users && d.users.length) users = d.users;
            if (d.doctors && d.doctors.length) doctors = d.doctors;
            if (d.nurses && d.nurses.length) nurses = d.nurses;
            if (d.wardStaff && d.wardStaff.length) wardStaff = d.wardStaff;
            if (d.shifts && d.shifts.length) shifts = d.shifts;
            if (d.attendanceLogs && d.attendanceLogs.length) attendanceLogs = d.attendanceLogs;
            if (d.patients && d.patients.length) patients = d.patients;
            if (d.beds && d.beds.length) beds = d.beds;
            if (d.prescriptions && d.prescriptions.length) prescriptions = d.prescriptions;
            if (d.medicines && d.medicines.length) medicines = d.medicines;
            if (d.hospitalTransactions && d.hospitalTransactions.length) hospitalTransactions = d.hospitalTransactions;
            if (d.payroll && d.payroll.length) payroll = d.payroll;
            if (d.internalMails && d.internalMails.length) internalMails = d.internalMails;
            if (d.supportIssues && d.supportIssues.length) supportIssues = d.supportIssues;
            if (d.doctorLibrary && d.doctorLibrary.length) doctorLibrary = d.doctorLibrary;
            if (d.ambulances && d.ambulances.length) ambulances = d.ambulances;
            if (d.ambulanceRequests && d.ambulanceRequests.length) ambulanceRequests = d.ambulanceRequests;
            if (d.doctorAppointments && d.doctorAppointments.length) doctorAppointments = d.doctorAppointments;

            updateMongoStatusUI(json.source === 'mongodb');
            console.log(`[MedCore Sync] Successfully bootstrapped collections from ${json.source}!`);
        }
    } catch (err) {
        console.warn('Backend API bootstrap failed; running on local data store:', err);
        updateMongoStatusUI(false);
    }
}

function updateMongoStatusUI(isConnected) {
    const pill = document.getElementById('mongo-status-pill');
    const text = document.getElementById('mongo-status-text');
    if (pill && text) {
        if (isConnected) {
            pill.style.background = 'rgba(16, 185, 129, 0.15)';
            pill.style.color = '#10b981';
            text.innerHTML = 'MongoDB Live';
        } else {
            pill.style.background = 'rgba(245, 158, 11, 0.15)';
            pill.style.color = '#f59e0b';
            text.innerHTML = 'Hybrid Local';
        }
    }
}

async function openMongoConfigModal() {
    try {
        const res = await fetch('/api/status');
        const st = await res.json();
        
        const badge = document.getElementById('mongo-modal-badge');
        if (badge) {
            badge.textContent = st.connected ? 'MongoDB Live Cluster' : 'In-Memory Fallback';
            badge.style.background = st.connected ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)';
            badge.style.color = st.connected ? '#10b981' : '#f59e0b';
        }
        
        const dbName = document.getElementById('mongo-db-name');
        if (dbName) dbName.textContent = st.database || 'medcore_db';
        
        const uriDisplay = document.getElementById('mongo-uri-display');
        if (uriDisplay) uriDisplay.textContent = st.mongo_uri || 'mongodb://localhost:27017';
        
        const count = st.collections ? Object.keys(st.collections).length : 15;
        const countDisplay = document.getElementById('mongo-collections-count');
        if (countDisplay) countDisplay.textContent = `${count} Collections Active`;
    } catch(err) {
        console.warn(err);
    }
    openModal('mongo-config-modal');
}

async function submitMongoUriConfig(e) {
    e.preventDefault();
    const uri = document.getElementById('cfg-mongo-uri').value.trim();
    const dbName = document.getElementById('cfg-db-name').value.trim() || 'medcore_db';

    showToast('Connecting to MongoDB cluster…', 'info');

    try {
        const res = await fetch('/api/config/mongo-uri', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mongo_uri: uri, db_name: dbName })
        });
        const data = await res.json();

        if (data.success) {
            showToast('Connected to MongoDB successfully! All collections synced.', 'success');
            closeModal('mongo-config-modal');
            bootstrapFromMongo();
        } else {
            showToast('Failed to connect: ' + (data.error || 'Check URI/Credentials'), 'error');
        }
    } catch(err) {
        showToast('Connection error: ' + err.message, 'error');
    }
}

// ===================================================================
//  21. AMBULANCE FLEET & EMERGENCY DISPATCH SYSTEM
// ===================================================================

function renderAmbulanceDispatch() {
    // 1. Update Metrics
    const totalFleet = ambulances.length;
    const enRouteCount = ambulances.filter(a => a.status === 'En Route to Patient' || a.status === 'En Route to Hospital' || a.status === 'At Scene').length;
    const pendingCalls = ambulanceRequests.filter(r => r.status === 'Pending Dispatch').length;
    const availableCount = ambulances.filter(a => a.status === 'Available').length;

    const elTotal = document.getElementById('stat-amb-total');
    const elEnroute = document.getElementById('stat-amb-enroute');
    const elPending = document.getElementById('stat-amb-pending');
    const elAvail = document.getElementById('stat-amb-available');

    if (elTotal) elTotal.textContent = totalFleet;
    if (elEnroute) elEnroute.textContent = enRouteCount;
    if (elPending) elPending.textContent = pendingCalls;
    if (elAvail) elAvail.textContent = availableCount;

    // Filter Badges count
    const cntAll = document.getElementById('amb-cnt-all');
    const cntPending = document.getElementById('amb-cnt-pending');
    const cntTransit = document.getElementById('amb-cnt-transit');
    const cntComp = document.getElementById('amb-cnt-completed');

    if (cntAll) cntAll.textContent = ambulanceRequests.length;
    if (cntPending) cntPending.textContent = ambulanceRequests.filter(r => r.status === 'Pending Dispatch').length;
    if (cntTransit) cntTransit.textContent = ambulanceRequests.filter(r => r.status === 'Dispatched' || r.status === 'At Scene' || r.status === 'En Route to Hospital' || r.status === 'En Route to Patient').length;
    if (cntComp) cntComp.textContent = ambulanceRequests.filter(r => r.status === 'Completed').length;

    renderAmbulanceRequestsTable();
    renderAmbulanceFleetCards();
}

function filterAmbulanceRequests(filter) {
    activeAmbulanceFilter = filter;
    ['all', 'pending', 'transit', 'completed'].forEach(f => {
        const btn = document.getElementById(`btn-amb-filter-${f}`);
        if (btn) btn.classList.remove('active');
    });

    const activeKey = filter === 'All' ? 'all' : (filter === 'Pending Dispatch' ? 'pending' : (filter === 'In Transit' ? 'transit' : 'completed'));
    const targetBtn = document.getElementById(`btn-amb-filter-${activeKey}`);
    if (targetBtn) targetBtn.classList.add('active');

    renderAmbulanceRequestsTable();
}

function renderAmbulanceRequestsTable() {
    const tbody = document.getElementById('ambulance-requests-table-body');
    if (!tbody) return;

    let filtered = [...ambulanceRequests];
    if (activeAmbulanceFilter === 'Pending Dispatch') {
        filtered = filtered.filter(r => r.status === 'Pending Dispatch');
    } else if (activeAmbulanceFilter === 'In Transit') {
        filtered = filtered.filter(r => r.status === 'Dispatched' || r.status === 'At Scene' || r.status === 'En Route to Hospital' || r.status === 'En Route to Patient');
    } else if (activeAmbulanceFilter === 'Completed') {
        filtered = filtered.filter(r => r.status === 'Completed' || r.status === 'Cancelled');
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:#94a3b8;"><i class="fas fa-check-circle" style="color:#10b981;"></i> No emergency requests matching filter "${activeAmbulanceFilter}".</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(r => {
        let sevBadge = '';
        if (r.severity === 'Critical') {
            sevBadge = `<span class="badge" style="background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.4);"><i class="fas fa-heartbeat"></i> Critical (Red)</span>`;
        } else if (r.severity === 'Urgent') {
            sevBadge = `<span class="badge" style="background:rgba(245,158,11,0.2); color:#f59e0b; border:1px solid rgba(245,158,11,0.4);"><i class="fas fa-exclamation-triangle"></i> Urgent (Yellow)</span>`;
        } else {
            sevBadge = `<span class="badge" style="background:rgba(16,185,129,0.2); color:#10b981; border:1px solid rgba(16,185,129,0.4);"><i class="fas fa-info-circle"></i> Standard</span>`;
        }

        let stBadge = '';
        if (r.status === 'Pending Dispatch') {
            stBadge = `<span class="amb-badge" style="background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.4);"><span class="pulse-indicator"></span> Pending Dispatch</span>`;
        } else if (r.status === 'Completed') {
            stBadge = `<span class="amb-badge available"><i class="fas fa-check"></i> Completed</span>`;
        } else if (r.status === 'Cancelled') {
            stBadge = `<span class="amb-badge maintenance"><i class="fas fa-ban"></i> Cancelled</span>`;
        } else {
            stBadge = `<span class="amb-badge en-route"><span class="pulse-indicator"></span> ${r.status}</span>`;
        }

        const assignedAmb = r.assignedAmbulanceId ? ambulances.find(a => a.id === r.assignedAmbulanceId) : null;
        const unitDisplay = assignedAmb 
            ? `<div style="display:flex; align-items:center; gap:6px;">
                <span style="font-weight:700; color:#38bdf8;">${assignedAmb.vehicleNo}</span>
                <span style="font-size:11px; color:#94a3b8;">(${assignedAmb.type.split(' ')[0]})</span>
               </div>`
            : `<em style="color:#64748b;">None Assigned</em>`;

        let actionBtns = '';
        if (r.status === 'Pending Dispatch') {
            actionBtns = `
                <button class="btn btn-primary btn-sm" onclick="openDispatchModal('${r.id}')" style="background:#ef4444; border-color:#dc2626; padding:4px 10px;">
                    <i class="fas fa-paper-plane"></i> Dispatch
                </button>
                <button class="btn btn-danger btn-sm" onclick="cancelAmbulanceRequest('${r.id}')" title="Cancel Request" style="padding:4px 8px;">
                    <i class="fas fa-times"></i>
                </button>
            `;
        } else if (r.status !== 'Completed' && r.status !== 'Cancelled') {
            actionBtns = `
                <button class="btn btn-secondary btn-sm" onclick="advanceAmbulanceFlow('${r.assignedAmbulanceId}')" title="Update Transport Progress" style="padding:4px 10px;">
                    <i class="fas fa-step-forward"></i> Progress
                </button>
                <button class="btn btn-primary btn-sm" onclick="completeAmbulanceRequest('${r.id}')" title="Mark Patient Arrived & Completed" style="background:#10b981; border-color:#059669; padding:4px 8px;">
                    <i class="fas fa-check"></i>
                </button>
            `;
        } else {
            actionBtns = `<span style="font-size:11.5px; color:#64748b;"><i class="fas fa-archive"></i> Archived</span>`;
        }

        return `
            <tr>
                <td>
                    <strong style="color:#ffffff;">${r.id}</strong>
                    <div style="font-size:11px; color:#94a3b8;">${r.timestamp}</div>
                </td>
                <td>
                    <strong style="color:#ffffff;">${r.callerName}</strong>
                    <div><a href="tel:${r.callerPhone}" style="color:#38bdf8; text-decoration:none; font-size:12px;"><i class="fas fa-phone-alt"></i> ${r.callerPhone}</a></div>
                </td>
                <td>
                    <div style="font-weight:600; color:#e2e8f0;">${r.pickupLocation}</div>
                    <div style="font-size:11.5px; color:#94a3b8;"><i class="fas fa-map-marker-alt" style="color:#ef4444; margin-right:4px;"></i>${r.landmark || 'Direct address'}</div>
                </td>
                <td>
                    <div style="max-width:260px; font-size:12px; line-height:1.4; color:#cbd5e1;">${r.patientCondition}</div>
                </td>
                <td>${sevBadge}</td>
                <td>${stBadge}</td>
                <td>${unitDisplay}</td>
                <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                        ${actionBtns}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAmbulanceFleetCards() {
    const container = document.getElementById('ambulance-fleet-container');
    if (!container) return;

    container.innerHTML = ambulances.map(amb => {
        let cardClass = 'available';
        let badgeHtml = '';

        if (amb.status.includes('En Route')) {
            cardClass = 'en-route';
            badgeHtml = `<span class="amb-badge en-route"><span class="pulse-indicator"></span> ${amb.status}</span>`;
        } else if (amb.status === 'At Scene') {
            cardClass = 'at-scene';
            badgeHtml = `<span class="amb-badge at-scene"><span class="pulse-indicator"></span> At Scene</span>`;
        } else if (amb.status === 'Maintenance') {
            cardClass = 'maintenance';
            badgeHtml = `<span class="amb-badge maintenance"><i class="fas fa-tools"></i> Maintenance</span>`;
        } else {
            cardClass = 'available';
            badgeHtml = `<span class="amb-badge available"><i class="fas fa-check-circle"></i> Available</span>`;
        }

        const fuelNum = parseInt(amb.fuel) || 50;
        const fuelColor = fuelNum > 60 ? '#10b981' : (fuelNum > 25 ? '#f59e0b' : '#ef4444');

        return `
            <div class="ambulance-card ${cardClass}">
                <div class="amb-header">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <strong style="color:#ffffff; font-size:15px;"><i class="fas fa-ambulance" style="color:#ef4444;"></i> ${amb.vehicleNo}</strong>
                            <span style="font-size:11px; background:#1e293b; color:#cbd5e1; padding:2px 6px; border-radius:4px; font-family:monospace;">${amb.id}</span>
                        </div>
                        <div style="font-size:12px; color:#38bdf8; font-weight:600; margin-top:2px;">${amb.type}</div>
                    </div>
                    <div>${badgeHtml}</div>
                </div>

                <div class="amb-route-box">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:#94a3b8;"><i class="fas fa-crosshairs"></i> Current:</span>
                        <strong style="color:#ffffff;">${amb.currentLocation}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:#94a3b8;"><i class="fas fa-flag-checkered"></i> Destination:</span>
                        <strong style="color:#38bdf8;">${amb.destination}</strong>
                    </div>
                </div>

                <div class="amb-meta-grid">
                    <div>
                        <div style="font-size:11px; color:#94a3b8;">Driver on Duty</div>
                        <strong style="color:#ffffff; font-size:12.5px;">${amb.driver}</strong>
                        <div><a href="tel:${amb.driverPhone}" style="color:#38bdf8; text-decoration:none; font-size:11.5px;"><i class="fas fa-phone-alt"></i> ${amb.driverPhone}</a></div>
                    </div>
                    <div>
                        <div style="font-size:11px; color:#94a3b8;">Paramedic / EMT</div>
                        <strong style="color:#ffffff; font-size:12.5px;">${amb.paramedic}</strong>
                        <div style="font-size:11px; color:#10b981;"><i class="fas fa-heartbeat"></i> Medical Link OK</div>
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:6px; border-top:1px solid rgba(255,255,255,0.06);">
                    <div style="font-size:11.5px; color:#cbd5e1;">
                        <i class="fas fa-gas-pump" style="color:${fuelColor}; margin-right:4px;"></i> Fuel: <strong>${amb.fuel}</strong>
                    </div>
                    <div style="font-size:11.5px; color:#cbd5e1;">
                        <i class="fas fa-stopwatch" style="color:#38bdf8; margin-right:4px;"></i> ETA: <strong>${amb.eta}</strong>
                    </div>
                </div>

                <div style="display:flex; gap:8px; margin-top:4px;">
                    <button class="btn btn-secondary btn-sm" onclick="advanceAmbulanceFlow('${amb.id}')" style="flex:1; padding:6px 8px; font-size:11.5px;">
                        <i class="fas fa-exchange-alt"></i> Change Status
                    </button>
                    ${amb.status !== 'Maintenance' ? `
                        <button class="btn btn-secondary btn-sm" onclick="quickUpdateAmbulanceStatus('${amb.id}', 'Maintenance')" title="Mark Out for Maintenance" style="padding:6px 10px;">
                            <i class="fas fa-wrench"></i>
                        </button>
                    ` : `
                        <button class="btn btn-primary btn-sm" onclick="quickUpdateAmbulanceStatus('${amb.id}', 'Available')" title="Return to Service" style="padding:6px 10px; background:#10b981; border-color:#059669;">
                            <i class="fas fa-check"></i>
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

// Ambulance Modals & Actions
function openEmergencyAmbulanceModal() {
    const form = document.getElementById('emergency-ambulance-form');
    if (form) form.reset();
    openModal('modal-emergency-ambulance');
}

async function submitEmergencyAmbulanceRequest(e) {
    e.preventDefault();
    const callerName = document.getElementById('amb-caller-name').value.trim();
    const callerPhone = document.getElementById('amb-caller-phone').value.trim();
    const pickupLocation = document.getElementById('amb-pickup-location').value.trim();
    const landmark = document.getElementById('amb-landmark').value.trim();
    const severity = document.getElementById('amb-severity').value;
    const condition = document.getElementById('amb-patient-condition').value.trim();
    const accessNotes = document.getElementById('amb-access-notes').value.trim();

    const now = new Date();
    const timeStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
    const newReqId = 'REQ-' + (800 + ambulanceRequests.length + 1);

    const newReq = {
        id: newReqId,
        callerName,
        callerPhone,
        pickupLocation,
        landmark,
        patientCondition: condition,
        severity,
        assignedAmbulanceId: null,
        status: 'Pending Dispatch',
        notes: accessNotes,
        timestamp: timeStr
    };

    ambulanceRequests.unshift(newReq);

    // Call server endpoint
    fetch('/api/ambulance/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
    }).catch(err => console.warn('Offline request log:', err));

    closeModal('modal-emergency-ambulance');
    showToast(`Emergency Ambulance Call ${newReqId} registered! Dispatch a unit now.`, 'warning');
    renderAmbulanceDispatch();
}

function openDispatchModal(requestId) {
    const req = ambulanceRequests.find(r => r.id === requestId);
    if (!req) return;

    document.getElementById('dispatch-request-id').value = req.id;
    document.getElementById('dispatch-request-summary').innerHTML = `
        <span style="color:#ef4444; font-weight:700;">[${req.severity.toUpperCase()}]</span> Call ${req.id} — ${req.callerName} (${req.callerPhone})<br>
        📍 <strong>${req.pickupLocation}</strong> (${req.landmark || 'Direct Address'})<br>
        ⚠️ <em>${req.patientCondition}</em>
    `;

    // Populate available ambulances select
    const select = document.getElementById('dispatch-ambulance-select');
    select.innerHTML = ambulances.map(a => `
        <option value="${a.id}" ${a.status === 'Available' ? 'selected' : ''}>
            ${a.vehicleNo} — ${a.type} [Status: ${a.status}] (Driver: ${a.driver})
        </option>
    `).join('');

    openModal('modal-dispatch-ambulance');
}

async function submitDispatchAmbulance(e) {
    e.preventDefault();
    const reqId = document.getElementById('dispatch-request-id').value;
    const ambId = document.getElementById('dispatch-ambulance-select').value;
    const dest = document.getElementById('dispatch-destination').value.trim();
    const eta = document.getElementById('dispatch-eta').value.trim();

    const req = ambulanceRequests.find(r => r.id === reqId);
    const amb = ambulances.find(a => a.id === ambId);

    if (req && amb) {
        req.status = 'Dispatched';
        req.assignedAmbulanceId = amb.id;

        amb.status = 'En Route to Patient';
        amb.assignedRequestId = req.id;
        amb.destination = req.pickupLocation;
        amb.eta = eta;

        // Post to backend
        fetch('/api/ambulance/dispatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requestId: req.id,
                ambulanceId: amb.id,
                status: 'En Route to Patient',
                destination: req.pickupLocation,
                eta: eta
            })
        }).catch(err => console.warn('Offline dispatch update:', err));

        closeModal('modal-dispatch-ambulance');
        showToast(`Ambulance ${amb.vehicleNo} dispatched to ${req.pickupLocation}!`, 'success');
        renderAmbulanceDispatch();
    }
}

function advanceAmbulanceFlow(ambId) {
    const amb = ambulances.find(a => a.id === ambId);
    if (!amb) return;

    let nextStatus = 'Available';
    let msg = '';

    if (amb.status === 'En Route to Patient') {
        nextStatus = 'At Scene';
        msg = `Unit ${amb.vehicleNo} arrived at scene! Paramedic attending patient.`;
    } else if (amb.status === 'At Scene') {
        nextStatus = 'En Route to Hospital';
        amb.destination = 'MedCore Central Emergency Trauma Center';
        amb.eta = '8 mins';
        msg = `Unit ${amb.vehicleNo} patient on-board, rushing to MedCore ER!`;
    } else if (amb.status === 'En Route to Hospital') {
        nextStatus = 'Available';
        amb.destination = 'Hospital Base Standby';
        amb.eta = 'Immediate';
        if (amb.assignedRequestId) {
            const req = ambulanceRequests.find(r => r.id === amb.assignedRequestId);
            if (req) req.status = 'Completed';
            amb.assignedRequestId = null;
        }
        msg = `Unit ${amb.vehicleNo} arrived at ER! Patient handed over. Unit is now Available.`;
    } else if (amb.status === 'Available') {
        nextStatus = 'En Route to Patient';
        msg = `Unit ${amb.vehicleNo} status set to En Route.`;
    } else if (amb.status === 'Maintenance') {
        nextStatus = 'Available';
        msg = `Unit ${amb.vehicleNo} maintenance complete. Back in service!`;
    }

    amb.status = nextStatus;

    if (amb.assignedRequestId) {
        const req = ambulanceRequests.find(r => r.id === amb.assignedRequestId);
        if (req && nextStatus !== 'Available') {
            req.status = nextStatus;
        }
    }

    fetch('/api/ambulance/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ambulanceId: amb.id,
            status: nextStatus,
            destination: amb.destination,
            eta: amb.eta
        })
    }).catch(err => console.warn('Offline status:', err));

    showToast(msg, 'info');
    renderAmbulanceDispatch();
}

function quickUpdateAmbulanceStatus(ambId, newStatus) {
    const amb = ambulances.find(a => a.id === ambId);
    if (!amb) return;

    amb.status = newStatus;
    if (newStatus === 'Available') {
        amb.assignedRequestId = null;
        amb.destination = 'Standby at Base';
        amb.eta = 'Immediate';
    }

    fetch('/api/ambulance/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ambulanceId: amb.id, status: newStatus })
    }).catch(err => console.warn('Offline status:', err));

    showToast(`Ambulance ${amb.vehicleNo} set to ${newStatus}.`, 'info');
    renderAmbulanceDispatch();
}

function completeAmbulanceRequest(reqId) {
    const req = ambulanceRequests.find(r => r.id === reqId);
    if (!req) return;

    req.status = 'Completed';
    if (req.assignedAmbulanceId) {
        const amb = ambulances.find(a => a.id === req.assignedAmbulanceId);
        if (amb) {
            amb.status = 'Available';
            amb.assignedRequestId = null;
            amb.destination = 'Standby at Base';
            amb.eta = 'Immediate';
        }
    }

    showToast(`Emergency Call ${req.id} marked Completed. Ambulance freed.`, 'success');
    renderAmbulanceDispatch();
}

function cancelAmbulanceRequest(reqId) {
    if (!confirm(`Are you sure you want to cancel ambulance request ${reqId}?`)) return;

    const req = ambulanceRequests.find(r => r.id === reqId);
    if (!req) return;

    req.status = 'Cancelled';
    if (req.assignedAmbulanceId) {
        const amb = ambulances.find(a => a.id === req.assignedAmbulanceId);
        if (amb) {
            amb.status = 'Available';
            amb.assignedRequestId = null;
        }
    }

    showToast(`Ambulance Call ${reqId} has been cancelled.`, 'warning');
    renderAmbulanceDispatch();
}


// ===================================================================
//  22. DOCTOR APPOINTMENTS & CONSULTATION LOGS SYSTEM
// ===================================================================

function renderDoctorAppointments() {
    const total = doctorAppointments.length;
    const scheduled = doctorAppointments.filter(a => a.status === 'Scheduled').length;
    const completed = doctorAppointments.filter(a => a.status === 'Completed').length;
    const cancelled = doctorAppointments.filter(a => a.status === 'Cancelled').length;

    const elTotal = document.getElementById('stat-apt-total');
    const elToday = document.getElementById('stat-apt-today');
    const elComp = document.getElementById('stat-apt-completed');
    const elCanc = document.getElementById('stat-apt-cancelled');

    if (elTotal) elTotal.textContent = total;
    if (elToday) elToday.textContent = scheduled;
    if (elComp) elComp.textContent = completed;
    if (elCanc) elCanc.textContent = cancelled;

    renderDoctorAppointmentsTable();
}

function filterDoctorAppointments(status) {
    activeAppointmentFilter = status;
    ['all', 'scheduled', 'completed', 'cancelled'].forEach(s => {
        const btn = document.getElementById(`btn-apt-filter-${s}`);
        if (btn) btn.classList.remove('active');
    });

    const target = document.getElementById(`btn-apt-filter-${status.toLowerCase()}`);
    if (target) target.classList.add('active');

    renderDoctorAppointmentsTable();
}

function renderDoctorAppointmentsTable() {
    const tbody = document.getElementById('doctor-appointments-table-body');
    if (!tbody) return;

    const searchInput = document.getElementById('apt-search-input');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    let list = [...doctorAppointments];

    // Filter by status tab
    if (activeAppointmentFilter !== 'All') {
        list = list.filter(a => a.status === activeAppointmentFilter);
    }

    // Filter by search query
    if (query) {
        list = list.filter(a => 
            (a.patientName && a.patientName.toLowerCase().includes(query)) ||
            (a.id && a.id.toLowerCase().includes(query)) ||
            (a.patientPhone && a.patientPhone.toLowerCase().includes(query)) ||
            (a.symptoms && a.symptoms.toLowerCase().includes(query)) ||
            (a.doctorName && a.doctorName.toLowerCase().includes(query)) ||
            (a.department && a.department.toLowerCase().includes(query))
        );
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#94a3b8;"><i class="fas fa-calendar-times" style="color:#64748b;"></i> No appointments found matching current filter or search.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(apt => {
        let stBadge = '';
        if (apt.status === 'Completed') {
            stBadge = `<span class="badge" style="background:rgba(16,185,129,0.2); color:#10b981; border:1px solid rgba(16,185,129,0.4);"><i class="fas fa-check-circle"></i> Completed</span>`;
        } else if (apt.status === 'Cancelled') {
            stBadge = `<span class="badge" style="background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.4);"><i class="fas fa-times-circle"></i> Cancelled</span>`;
        } else {
            stBadge = `<span class="badge" style="background:rgba(56,189,248,0.2); color:#38bdf8; border:1px solid rgba(56,189,248,0.4);"><i class="fas fa-clock"></i> Scheduled</span>`;
        }

        return `
            <tr>
                <td>
                    <strong style="color:#ffffff;">${apt.id}</strong>
                    <div style="font-size:11px; color:#94a3b8;">${apt.type || 'Consultation'}</div>
                </td>
                <td>
                    <strong style="color:#ffffff;">${apt.patientName}</strong>
                    <span style="font-size:12px; color:#94a3b8;">(${apt.patientAge}y, ${apt.patientGender})</span>
                    <div><a href="tel:${apt.patientPhone}" style="color:#38bdf8; text-decoration:none; font-size:12px;"><i class="fas fa-phone-alt"></i> ${apt.patientPhone}</a></div>
                </td>
                <td>
                    <div style="font-weight:600; color:#e2e8f0;"><i class="far fa-calendar-alt" style="color:var(--primary); margin-right:4px;"></i>${apt.appointmentDate}</div>
                    <div style="font-size:11.5px; color:#94a3b8;"><i class="far fa-clock" style="margin-right:4px;"></i>${apt.timeSlot}</div>
                </td>
                <td>
                    <strong style="color:#ffffff;">${apt.doctorName}</strong>
                    <div style="font-size:11.5px; color:#38bdf8;">${apt.department}</div>
                </td>
                <td>
                    <div style="max-width:240px; font-size:12px; color:#cbd5e1; line-height:1.4;">
                        ${apt.symptoms || 'General Health Consultation'}
                    </div>
                </td>
                <td>${stBadge}</td>
                <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <button class="btn btn-primary btn-sm" onclick="openConsultationModal('${apt.id}')" title="Log Clinical Consultation, Vitals & Prescriptions" style="padding:4px 10px;">
                            <i class="fas fa-stethoscope"></i> Consult
                        </button>
                        ${apt.prescription ? `
                            <button class="btn btn-secondary btn-sm" onclick="viewAppointmentSummary('${apt.id}')" title="View Prescription & Summary" style="padding:4px 8px;">
                                <i class="fas fa-file-prescription"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-danger btn-sm" onclick="removeAppointment('${apt.id}')" title="Cancel & Remove Appointment" style="padding:4px 8px;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Book Appointment Modal
function openBookAppointmentModal() {
    const docSelect = document.getElementById('book-doctor-select');
    if (docSelect) {
        docSelect.innerHTML = doctors.map(d => `
            <option value="${d.id}" data-dept="${d.department || d.specialty || 'General Medicine'}">
                ${d.name} (${d.department || d.specialty || 'General'})
            </option>
        `).join('');
    }

    onBookDoctorChanged();

    // Default appointment date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('book-appointment-date');
    if (dateInput) dateInput.value = tomorrow.toISOString().slice(0, 10);

    const form = document.getElementById('book-appointment-form');
    if (form) form.reset();

    if (dateInput) dateInput.value = tomorrow.toISOString().slice(0, 10);
    onBookDoctorChanged();

    openModal('modal-book-appointment');
}

function onBookDoctorChanged() {
    const docSelect = document.getElementById('book-doctor-select');
    const deptInput = document.getElementById('book-department');
    if (docSelect && deptInput) {
        const selectedOpt = docSelect.options[docSelect.selectedIndex];
        deptInput.value = selectedOpt ? (selectedOpt.getAttribute('data-dept') || 'General Medicine') : 'General Medicine';
    }
}

async function submitBookAppointment(e) {
    e.preventDefault();
    const patientName = document.getElementById('book-patient-name').value.trim();
    const patientPhone = document.getElementById('book-patient-phone').value.trim();
    const patientAge = parseInt(document.getElementById('book-patient-age').value) || 30;
    const patientGender = document.getElementById('book-patient-gender').value;
    const patientEmail = document.getElementById('book-patient-email').value.trim();

    const docSelect = document.getElementById('book-doctor-select');
    const doctorId = docSelect ? docSelect.value : 'DOC-01';
    const selectedOpt = docSelect ? docSelect.options[docSelect.selectedIndex] : null;
    const doctorName = selectedOpt ? selectedOpt.text.split('(')[0].trim() : 'Dr. Attending Physician';
    const department = document.getElementById('book-department').value || 'General Medicine';

    const appointmentDate = document.getElementById('book-appointment-date').value;
    const timeSlot = document.getElementById('book-time-slot').value;
    const consultType = document.getElementById('book-consult-type').value;
    const symptoms = document.getElementById('book-initial-symptoms').value.trim();

    const newAptId = 'APT-' + (1000 + doctorAppointments.length + 1);

    const newApt = {
        id: newAptId,
        doctorId,
        doctorName,
        department,
        patientName,
        patientAge,
        patientGender,
        patientPhone,
        patientEmail,
        appointmentDate,
        timeSlot,
        type: consultType,
        symptoms,
        vitals: {
            bp: '120/80 mmHg',
            hr: '76 bpm',
            spo2: '98%',
            temp: '98.6 °F',
            weight: '65 kg'
        },
        diagnosis: '',
        clinicalNotes: '',
        prescription: '',
        followUpDate: '',
        status: 'Scheduled',
        createdAt: new Date().toISOString().slice(0, 10)
    };

    doctorAppointments.unshift(newApt);

    fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApt)
    }).catch(err => console.warn('Offline appointment creation:', err));

    closeModal('modal-book-appointment');
    showToast(`Appointment ${newAptId} booked successfully for ${patientName}!`, 'success');
    renderDoctorAppointments();
}

// Consultation Modal
function openConsultationModal(aptId) {
    const apt = doctorAppointments.find(a => a.id === aptId);
    if (!apt) return;

    document.getElementById('consult-apt-id').value = apt.id;
    document.getElementById('consult-patient-header').innerHTML = `
        <strong>${apt.patientName}</strong> (${apt.patientAge}y, ${apt.patientGender}) • Phone: ${apt.patientPhone} • Attending: <strong>${apt.doctorName}</strong> (${apt.department}) • Slot: ${apt.appointmentDate} (${apt.timeSlot})
    `;

    document.getElementById('consult-symptoms').value = apt.symptoms || '';

    // Fill vitals
    const vitals = apt.vitals || {};
    document.getElementById('consult-vital-bp').value = vitals.bp || '120/80';
    document.getElementById('consult-vital-hr').value = vitals.hr || '76';
    document.getElementById('consult-vital-spo2').value = vitals.spo2 || '98%';
    document.getElementById('consult-vital-temp').value = vitals.temp || '98.6 °F';
    document.getElementById('consult-vital-wt').value = vitals.weight || '65 kg';

    document.getElementById('consult-diagnosis').value = apt.diagnosis || '';
    document.getElementById('consult-notes').value = apt.clinicalNotes || '';
    document.getElementById('consult-prescription').value = apt.prescription || '';
    document.getElementById('consult-followup-date').value = apt.followUpDate || '';
    document.getElementById('consult-status').value = apt.status || 'Completed';

    openModal('modal-consultation-details');
}

async function submitConsultationDetails(e) {
    e.preventDefault();
    const aptId = document.getElementById('consult-apt-id').value;
    const apt = doctorAppointments.find(a => a.id === aptId);
    if (!apt) return;

    apt.symptoms = document.getElementById('consult-symptoms').value.trim();
    apt.vitals = {
        bp: document.getElementById('consult-vital-bp').value.trim(),
        hr: document.getElementById('consult-vital-hr').value.trim(),
        spo2: document.getElementById('consult-vital-spo2').value.trim(),
        temp: document.getElementById('consult-vital-temp').value.trim(),
        weight: document.getElementById('consult-vital-wt').value.trim()
    };
    apt.diagnosis = document.getElementById('consult-diagnosis').value.trim();
    apt.clinicalNotes = document.getElementById('consult-notes').value.trim();
    apt.prescription = document.getElementById('consult-prescription').value.trim();
    apt.followUpDate = document.getElementById('consult-followup-date').value;
    apt.status = document.getElementById('consult-status').value;

    fetch('/api/appointments/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt)
    }).catch(err => console.warn('Offline consultation update:', err));

    closeModal('modal-consultation-details');
    showToast(`Consultation details & prescription updated for ${apt.patientName}!`, 'success');
    renderDoctorAppointments();
}

function viewAppointmentSummary(aptId) {
    const apt = doctorAppointments.find(a => a.id === aptId);
    if (!apt) return;

    alert(
        `MEDCORE CLINICAL CONSULTATION SUMMARY\n` +
        `-----------------------------------------\n` +
        `Appointment ID: ${apt.id}\n` +
        `Patient: ${apt.patientName} (${apt.patientAge}y, ${apt.patientGender})\n` +
        `Doctor: ${apt.doctorName} - ${apt.department}\n` +
        `Date: ${apt.appointmentDate} | Slot: ${apt.timeSlot}\n` +
        `Status: ${apt.status}\n\n` +
        `REPORTED SYMPTOMS:\n${apt.symptoms}\n\n` +
        `VITALS:\nBP: ${apt.vitals ? apt.vitals.bp : 'N/A'}, HR: ${apt.vitals ? apt.vitals.hr : 'N/A'}, SpO2: ${apt.vitals ? apt.vitals.spo2 : 'N/A'}\n\n` +
        `DIAGNOSIS:\n${apt.diagnosis || 'None entered'}\n\n` +
        `PRESCRIPTION REGIMEN:\n${apt.prescription || 'No medicines prescribed'}\n\n` +
        `CLINICAL ADVICE:\n${apt.clinicalNotes || 'None'}\n\n` +
        `FOLLOW-UP REVIEW DATE: ${apt.followUpDate || 'SOS / As needed'}`
    );
}

function removeAppointment(aptId) {
    if (!confirm(`Are you sure you want to cancel and remove appointment ${aptId}?`)) return;

    const idx = doctorAppointments.findIndex(a => a.id === aptId);
    if (idx !== -1) {
        doctorAppointments[idx].status = 'Cancelled';

        fetch('/api/appointments/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: aptId })
        }).catch(err => console.warn('Offline appointment delete:', err));

        showToast(`Appointment ${aptId} cancelled.`, 'warning');
        renderDoctorAppointments();
    }
}
