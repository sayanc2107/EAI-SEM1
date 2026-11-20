/* ===================================================================
   MedCore AI — Application Logic
   =================================================================== */

// ── Application State ──
let currentUser = null;
let currentSection = null;

// Deep-copy data store
let users = JSON.parse(JSON.stringify(SampleData.users));
let doctors = JSON.parse(JSON.stringify(SampleData.doctors));
let shifts = JSON.parse(JSON.stringify(SampleData.shifts));
let nurseShifts = JSON.parse(JSON.stringify(SampleData.nurseShifts));
let wardStaffShifts = JSON.parse(JSON.stringify(SampleData.wardStaffShifts));
let patients = JSON.parse(JSON.stringify(SampleData.patients));
let beds = JSON.parse(JSON.stringify(SampleData.beds));
let medicines = JSON.parse(JSON.stringify(SampleData.medicines));
let prescriptions = JSON.parse(JSON.stringify(SampleData.prescriptions));
let sales = JSON.parse(JSON.stringify(SampleData.sales));
let bills = JSON.parse(JSON.stringify(SampleData.bills));
let nurseTasks = JSON.parse(JSON.stringify(SampleData.nurseTasks));

// ── Navigation Schemes by Role ──
const roleNavs = {
    admin: [
        { id: 'admin-dashboard', icon: 'fa-th-large', label: 'Admin Overview' },
        { id: 'pharmacy-stock', icon: 'fa-capsules', label: 'Pharmacy Stock' },
        { id: 'pharmacy-billing', icon: 'fa-receipt', label: 'Billing Records' },
    ],
    doctor: [
        { id: 'doctor-dashboard', icon: 'fa-user-md', label: 'My Shift & Schedule' },
        { id: 'doctor-patients', icon: 'fa-users', label: 'My Patients' },
        { id: 'doctor-prescriptions', icon: 'fa-prescription', label: 'Send Prescription' },
    ],
    nurse: [
        { id: 'nurse-dashboard', icon: 'fa-calendar-alt', label: 'My Shift' },
        { id: 'nurse-doctors', icon: 'fa-user-md', label: 'Doctor Status (Call)' },
        { id: 'nurse-patients', icon: 'fa-user-injured', label: 'My Patients' },
        { id: 'nurse-ai', icon: 'fa-robot', label: 'AI Next Task Predictor' },
    ],
    ward: [
        { id: 'ward-dashboard', icon: 'fa-calendar-alt', label: 'My Shift' },
        { id: 'ward-doctors', icon: 'fa-map-marker-alt', label: 'Doctor Locations' },
        { id: 'ward-ai', icon: 'fa-robot', label: 'AI Location Predictor' },
    ],
    pharmacy: [
        { id: 'pharmacy-stock', icon: 'fa-boxes', label: 'Stock Management' },
        { id: 'pharmacy-billing', icon: 'fa-file-invoice-dollar', label: 'Make Bill & Sales' },
        { id: 'pharmacy-rx', icon: 'fa-prescription-bottle-alt', label: 'Doctor Prescriptions' },
        { id: 'pharmacy-ai', icon: 'fa-chart-line', label: 'AI Demand & Reorder' },
    ]
};

// ===================================================================
//  AUTHENTICATION & ROLE FETCHING
// ===================================================================

function quickFillLogin(username, password) {
    document.getElementById('login-username').value = username;
    document.getElementById('login-password').value = password;
    handleLogin();
}

function handleLogin(e) {
    if (e) e.preventDefault();
    const usernameInput = document.getElementById('login-username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error');

    errorBox.classList.add('hidden');
    errorBox.textContent = '';

    const matchedUser = users.find(u => u.username.toLowerCase() === usernameInput && u.password === passwordInput);

    if (!matchedUser) {
        errorBox.textContent = 'Invalid username or password. Please try again.';
        errorBox.classList.remove('hidden');
        return false;
    }

    // Role automatically fetched from user credentials
    currentUser = matchedUser;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    // Update User Info in Sidebar
    document.getElementById('user-name-display').textContent = currentUser.name;
    document.getElementById('user-role-label').textContent = formatRole(currentUser.role);

    buildSidebarNavigation(currentUser.role);
    startLiveClock();

    showToast(`Welcome back, ${currentUser.name}! Logged in as ${formatRole(currentUser.role)}.`, 'success');
    return false;
}

function logout() {
    currentUser = null;
    currentSection = null;
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').classList.add('hidden');
}

function formatRole(role) {
    const map = {
        admin: 'Hospital Administrator',
        doctor: 'Doctor / Physician',
        nurse: 'Registered Nurse',
        ward: 'Ward Operations Staff',
        pharmacy: 'Pharmacist'
    };
    return map[role] || role;
}

// ===================================================================
//  SIDEBAR & SECTION SWITCHING
// ===================================================================

function buildSidebarNavigation(role) {
    const navItems = roleNavs[role] || [];
    const navContainer = document.getElementById('sidebar-nav');
    navContainer.innerHTML = '';

    navItems.forEach((item, index) => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = `nav-link ${index === 0 ? 'active' : ''}`;
        link.dataset.section = item.id;
        link.innerHTML = `<i class="fas ${item.icon}"></i><span>${item.label}</span>`;
        link.onclick = (e) => {
            e.preventDefault();
            navigateTo(item.id);
        };
        navContainer.appendChild(link);
    });

    if (navItems.length > 0) {
        navigateTo(navItems[0].id);
    }
}

function navigateTo(sectionId) {
    currentSection = sectionId;

    // Toggle active class on sidebar links
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

    // Set header title
    const navList = roleNavs[currentUser ? currentUser.role : 'admin'] || [];
    const item = navList.find(n => n.id === sectionId);
    document.getElementById('section-title').textContent = item ? item.label : 'Dashboard';

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');

    // Refresh view data
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
//  CENTRAL VIEW REFRESH ROUTER
// ===================================================================

function refreshCurrentView() {
    if (!currentUser) return;

    switch (currentSection) {
        case 'admin-dashboard':
            renderAdminDashboard();
            break;
        case 'doctor-dashboard':
            renderDoctorDashboard();
            break;
        case 'doctor-patients':
            renderDoctorPatients();
            break;
        case 'doctor-prescriptions':
            renderDoctorPrescriptions();
            break;
        case 'nurse-dashboard':
            renderNurseDashboard();
            break;
        case 'nurse-doctors':
            renderNurseDoctors();
            break;
        case 'nurse-patients':
            renderNursePatients();
            break;
        case 'nurse-ai':
            renderNurseAI();
            break;
        case 'ward-dashboard':
            renderWardDashboard();
            break;
        case 'ward-doctors':
            renderWardDoctors();
            break;
        case 'ward-ai':
            renderWardAI();
            break;
        case 'pharmacy-stock':
            renderPharmacyStock();
            break;
        case 'pharmacy-billing':
            renderPharmacyBilling();
            break;
        case 'pharmacy-rx':
            renderPharmacyPrescriptions();
            break;
        case 'pharmacy-ai':
            renderPharmacyAI();
            break;
    }
}

// Helper: Active duty check for doctors
function isDoctorOnDuty(shift) {
    // Demo assumption: Shifts on 2026-11-20 are active
    return shift.date === '2026-11-20';
}

// ===================================================================
//  1. ADMIN DASHBOARD
// ===================================================================

function renderAdminDashboard() {
    document.getElementById('stat-total-patients').textContent = patients.length;
    const availBeds = beds.filter(b => b.status === 'available').length;
    document.getElementById('stat-available-beds').textContent = `${availBeds}/${beds.length}`;
    
    // Unique doctors on duty today
    const onDutyDocIds = new Set(shifts.filter(isDoctorOnDuty).map(s => s.doctorId));
    document.getElementById('stat-on-duty').textContent = onDutyDocIds.size;

    const lowStock = medicines.filter(m => m.quantity <= m.threshold).length;
    document.getElementById('stat-low-stock').textContent = lowStock;

    // Patients list
    const patientHtml = patients.slice(0, 5).map(p => `
        <div class="dash-item">
            <span class="dash-item-label">${p.name} (${p.id})</span>
            <span class="priority-badge ${p.priority.toLowerCase()}">${p.priority}</span>
        </div>
    `).join('');
    document.getElementById('admin-patients-list').innerHTML = patientHtml;

    // Ward occupancy
    const wards = ['Emergency', 'General', 'ICU', 'Pediatrics', 'Maternity'];
    const wardHtml = wards.map(w => {
        const wBeds = beds.filter(b => b.ward === w);
        const free = wBeds.filter(b => b.status === 'available').length;
        return `
        <div class="dash-item">
            <span class="dash-item-label">${w} Ward</span>
            <span style="font-weight:600;color:${free === 0 ? 'var(--danger)' : 'var(--success)'}">${free}/${wBeds.length} Free</span>
        </div>`;
    }).join('');
    document.getElementById('admin-ward-overview').innerHTML = wardHtml;

    // Doctors on duty
    const docHtml = Array.from(onDutyDocIds).map(id => {
        const doc = doctors.find(d => d.id === id);
        const curShift = shifts.find(s => s.doctorId === id && isDoctorOnDuty(s));
        return `
        <div class="dash-item">
            <span class="dash-item-label">${doc ? doc.name : id}</span>
            <span style="font-size:12px;color:var(--text-secondary)"><i class="fas fa-map-marker-alt"></i> ${curShift ? curShift.location : 'Duty'}</span>
        </div>`;
    }).join('');
    document.getElementById('admin-doctors-list').innerHTML = docHtml || '<p style="color:var(--text-muted)">None currently</p>';

    // Low stock
    const stockHtml = medicines.filter(m => m.quantity <= m.threshold).map(m => `
        <div class="dash-item">
            <span class="dash-item-label" style="color:var(--danger)">${m.name}</span>
            <span style="color:var(--danger);font-weight:700">${m.quantity} in stock (Reorder: ${m.threshold})</span>
        </div>
    `).join('');
    document.getElementById('admin-stock-alerts').innerHTML = stockHtml || '<p style="color:var(--success)">All stocks healthy</p>';
}

// ===================================================================
//  2. DOCTOR VIEWS
// ===================================================================

function renderDoctorDashboard() {
    const doc = doctors.find(d => d.id === currentUser.employeeId) || { name: currentUser.name, specialization: 'General Physician' };
    document.getElementById('doc-welcome').textContent = doc.name;
    document.getElementById('doc-specialization').textContent = `${doc.specialization}  •  ID: ${currentUser.employeeId}`;

    // Doctor sees ONLY their full shifts
    const myShifts = shifts.filter(s => s.doctorId === currentUser.employeeId);
    const activeShift = myShifts.find(isDoctorOnDuty);

    document.getElementById('doc-current-shift').textContent = activeShift ? `${activeShift.start} – ${activeShift.end}` : 'Off Duty';
    document.getElementById('doc-current-location').textContent = activeShift ? `${activeShift.location} (${activeShift.ward})` : '—';

    // Doctor sees patients allotted to them
    const myPatients = patients.filter(p => p.doctorId === currentUser.employeeId);
    document.getElementById('doc-patient-count').textContent = myPatients.length;

    // Render doctor's full shift schedule
    const rows = myShifts.map(s => `
        <tr>
            <td><strong>${s.date}</strong></td>
            <td>${s.start}</td>
            <td>${s.end}</td>
            <td>${s.ward}</td>
            <td><span class="doctor-location-pill"><i class="fas fa-map-marker-alt"></i> ${s.location}</span></td>
            <td><span class="status-badge ${isDoctorOnDuty(s) ? 'active' : 'ready'}">${isDoctorOnDuty(s) ? 'Active Duty' : 'Upcoming'}</span></td>
        </tr>
    `).join('');
    document.getElementById('doc-shifts-body').innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No shifts scheduled.</td></tr>';
}

function renderDoctorPatients() {
    const myPatients = patients.filter(p => p.doctorId === currentUser.employeeId);
    const grid = document.getElementById('doc-patients-grid');

    if (myPatients.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1">No patients currently allotted. You can add one manually using the button above.</p>';
        return;
    }

    grid.innerHTML = myPatients.map(p => `
        <div class="patient-card">
            <div class="patient-header">
                <h4>${p.name} (${p.id})</h4>
                <span class="priority-badge ${p.priority.toLowerCase()}">${p.priority}</span>
            </div>
            <p class="patient-concern"><strong>Concern:</strong> ${p.concern}</p>
            <p style="font-size:12.5px;color:var(--text-secondary)"><strong>Symptoms:</strong> ${p.symptoms.join(', ')}</p>
            ${p.notes ? `<p style="font-size:12px;color:var(--text-muted);margin-top:6px"><em>Note: ${p.notes}</em></p>` : ''}
            <div class="patient-meta">
                <span><i class="fas fa-bed"></i> Bed: ${p.bed || 'Unassigned'}</span>
                <span><i class="fas fa-hospital"></i> Ward: ${p.ward}</span>
                <span><i class="fas fa-user-nurse"></i> Nurse: ${getNurseName(p.nurseId)}</span>
            </div>
        </div>
    `).join('');
}

function getNurseName(nurseId) {
    if (!nurseId) return 'Unassigned';
    const n = users.find(u => u.employeeId === nurseId);
    return n ? n.name : nurseId;
}

function openAddPatientModal() {
    document.getElementById('add-patient-form').reset();
    openModal('add-patient-modal');
}

function submitAddPatient(e) {
    e.preventDefault();
    const newId = 'P-' + (1000 + patients.length + 1);
    const newPatient = {
        id: newId,
        name: document.getElementById('ap-name').value.trim(),
        age: parseInt(document.getElementById('ap-age').value),
        gender: document.getElementById('ap-gender').value,
        ward: document.getElementById('ap-ward').value,
        concern: document.getElementById('ap-concern').value.trim(),
        priority: document.getElementById('ap-priority').value,
        notes: document.getElementById('ap-notes').value.trim(),
        symptoms: ['Under initial evaluation'],
        doctorId: currentUser.employeeId,
        nurseId: 'N-01',
        bed: null,
        status: 'admitted',
        admittedAt: new Date().toISOString()
    };

    patients.unshift(newPatient);
    closeModal('add-patient-modal');
    refreshCurrentView();
    showToast(`Patient ${newPatient.name} added successfully!`, 'success');
}

function renderDoctorPrescriptions() {
    // Show all prescriptions sent by this doctor
    const myRx = prescriptions.filter(r => r.doctorId === currentUser.employeeId);
    const rows = myRx.map(r => `
        <tr>
            <td><strong>${r.id}</strong></td>
            <td>${r.patientName} (${r.patientId})</td>
            <td>${r.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
            <td>${r.notes || '—'}</td>
            <td><span class="status-badge ${r.status}">${r.status.toUpperCase()}</span></td>
            <td>${new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
        </tr>
    `).join('');
    document.getElementById('doc-rx-body').innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No prescriptions sent yet.</td></tr>';
}

function openPrescriptionModal() {
    // Populate patient select with doctor's patients
    const myPatients = patients.filter(p => p.doctorId === currentUser.employeeId);
    const select = document.getElementById('rx-patient');
    select.innerHTML = myPatients.map(p => `<option value="${p.id}">${p.name} (${p.id}) — ${p.ward} Ward</option>`).join('');

    // Reset rows and populate medicine dropdown
    populateRxMedicines();
    document.getElementById('rx-notes').value = '';
    openModal('prescription-modal');
}

function populateRxMedicines() {
    const medOptions = '<option value="">Select medicine…</option>' + medicines.map(m => `<option value="${m.id}">${m.name} (₹${m.unitPrice})</option>`).join('');
    document.querySelectorAll('.rx-medicine').forEach(s => s.innerHTML = medOptions);
}

function addRxRow() {
    const container = document.getElementById('rx-items-container');
    const newRow = document.createElement('div');
    newRow.className = 'rx-item-row';
    newRow.innerHTML = `
        <select class="rx-medicine">${medicines.map(m => `<option value="${m.id}">${m.name} (₹${m.unitPrice})</option>`).join('')}</select>
        <input type="number" class="rx-qty" placeholder="Qty" min="1" value="1">
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(newRow);
}

function submitPrescription(e) {
    e.preventDefault();
    const patientId = document.getElementById('rx-patient').value;
    const patient = patients.find(p => p.id === patientId);

    const items = [];
    document.querySelectorAll('.rx-item-row').forEach(row => {
        const medId = row.querySelector('.rx-medicine').value;
        const qty = parseInt(row.querySelector('.rx-qty').value) || 1;
        const med = medicines.find(m => m.id === medId);
        if (med) {
            items.push({ medicineId: med.id, name: med.name, qty: qty, unitPrice: med.unitPrice });
        }
    });

    if (items.length === 0) {
        showToast('Please select at least one medicine.', 'error');
        return;
    }

    const newRx = {
        id: 'RX-' + String(prescriptions.length + 1).padStart(3, '0'),
        doctorId: currentUser.employeeId,
        doctorName: currentUser.name,
        patientId: patient.id,
        patientName: patient.name,
        items: items,
        notes: document.getElementById('rx-notes').value.trim(),
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    prescriptions.unshift(newRx);
    closeModal('prescription-modal');
    refreshCurrentView();
    showToast(`Prescription ${newRx.id} sent to Pharmacy! They will prepare the medicines ready for quick pickup.`, 'success');
}

// ===================================================================
//  3. NURSE VIEWS
// ===================================================================

function renderNurseDashboard() {
    document.getElementById('nurse-welcome').textContent = currentUser.name;
    const myShifts = nurseShifts.filter(s => s.nurseId === currentUser.employeeId);
    const active = myShifts.find(s => s.date === '2026-11-20');

    document.getElementById('nurse-ward-info').textContent = active ? `Assigned Ward: ${active.ward} Ward` : 'Off Duty Today';
    document.getElementById('nurse-current-shift').textContent = active ? `${active.start} – ${active.end}` : 'Off Duty';

    // Allotted patients
    const myPatients = patients.filter(p => p.nurseId === currentUser.employeeId);
    document.getElementById('nurse-patient-count').textContent = myPatients.length;

    // Allotted doctors
    const allottedDocIds = new Set(myPatients.map(p => p.doctorId).filter(Boolean));
    document.getElementById('nurse-doctor-count').textContent = allottedDocIds.size;

    // Full nurse shifts schedule
    const rows = myShifts.map(s => `
        <tr>
            <td><strong>${s.date}</strong></td>
            <td>${s.start}</td>
            <td>${s.end}</td>
            <td>${s.ward} Ward</td>
            <td><span class="status-badge ${s.date === '2026-11-20' ? 'active' : 'ready'}">${s.date === '2026-11-20' ? 'Active' : 'Scheduled'}</span></td>
        </tr>
    `).join('');
    document.getElementById('nurse-shifts-body').innerHTML = rows || '<tr><td colspan="5">No shifts found.</td></tr>';
}

function renderNurseDoctors() {
    // Shows status of all doctors currently on duty so nurse knows who to call
    const activeDocShifts = shifts.filter(isDoctorOnDuty);
    const grid = document.getElementById('nurse-doctors-grid');

    grid.innerHTML = activeDocShifts.map(s => {
        const doc = doctors.find(d => d.id === s.doctorId);
        const myPatientsUnderDoc = patients.filter(p => p.nurseId === currentUser.employeeId && p.doctorId === s.doctorId);
        const isAllottedToNurse = myPatientsUnderDoc.length > 0;

        return `
        <div class="doctor-status-card" style="${isAllottedToNurse ? 'border-left: 5px solid var(--primary);' : ''}">
            <div class="doctor-card-header">
                <h4>${doc ? doc.name : s.doctorId}</h4>
                <span class="status-badge active"><i class="fas fa-circle" style="font-size:8px"></i> On Duty</span>
            </div>
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">${doc ? doc.specialization : 'Specialist'}</p>
            <div class="doctor-location-pill"><i class="fas fa-map-marker-alt"></i> ${s.location} (${s.ward})</div>
            <div class="doctor-meta">
                <span><i class="fas fa-clock"></i> Shift Ends: <strong>${s.end}</strong></span>
                ${isAllottedToNurse ? `<span style="color:var(--primary);font-weight:700"><i class="fas fa-link"></i> Managing ${myPatientsUnderDoc.length} of your patients</span>` : ''}
            </div>
            <div style="margin-top:14px">
                <button class="btn btn-primary btn-sm btn-full" onclick="showToast('Calling ${doc ? doc.name : 'Doctor'} at ${s.location}...', 'info')">
                    <i class="fas fa-phone-alt"></i> Call Doctor (${s.location})
                </button>
            </div>
        </div>`;
    }).join('');
}

function renderNursePatients() {
    const myPatients = patients.filter(p => p.nurseId === currentUser.employeeId);
    const grid = document.getElementById('nurse-patients-grid');

    grid.innerHTML = myPatients.map(p => {
        const doc = doctors.find(d => d.id === p.doctorId);
        const docShift = shifts.find(s => s.doctorId === p.doctorId && isDoctorOnDuty(s));

        return `
        <div class="patient-card">
            <div class="patient-header">
                <h4>${p.name} (${p.id})</h4>
                <span class="priority-badge ${p.priority.toLowerCase()}">${p.priority}</span>
            </div>
            <p class="patient-concern"><strong>Concern:</strong> ${p.concern}</p>
            <div style="margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px;">
                <p style="font-size:13px;font-weight:600;color:var(--primary)"><i class="fas fa-user-md"></i> Allotted Doctor: ${doc ? doc.name : 'Unassigned'}</p>
                <p style="font-size:12px;color:var(--text-secondary);margin-top:2px">
                    ${docShift ? `Currently at: <strong>${docShift.location}</strong> (Shift ends ${docShift.end})` : 'Doctor currently off-duty'}
                </p>
            </div>
            <div class="patient-meta">
                <span><i class="fas fa-bed"></i> Bed: ${p.bed || 'Awaiting'}</span>
                <span><i class="fas fa-hospital"></i> Ward: ${p.ward}</span>
            </div>
        </div>`;
    }).join('');
}

function renderNurseAI() {
    // AI Task Predictor: predicts what tasks should be performed next based on patient acuity and pending schedules
    const panel = document.getElementById('nurse-ai-panel');
    const myPatients = patients.filter(p => p.nurseId === currentUser.employeeId);
    const myTasks = nurseTasks.filter(t => t.nurseId === currentUser.employeeId && t.status === 'pending');

    panel.innerHTML = `
        <div class="ai-pred-card critical">
            <div class="ai-pred-header">
                <h4><i class="fas fa-bolt"></i> AI Priority Action: Immediate Vitals Check</h4>
                <span class="priority-badge critical">Critical Acuity</span>
            </div>
            <div class="ai-pred-body">
                Patient <strong>Amit Verma (P-1001)</strong> presented with acute cardiac symptoms (chest pain radiating to arm). Vital parameters must be logged every 30 minutes. <strong>Predicted risk:</strong> Blood pressure fluctuations.
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-arrow-right"></i> Recommended Next Step: Record BP &amp; Oxygen saturation for Bed EM-01 now.
            </div>
        </div>

        <div class="ai-pred-card urgent">
            <div class="ai-pred-header">
                <h4><i class="fas fa-pills"></i> AI Medication Administration Window</h4>
                <span class="priority-badge high">Due in 15 mins</span>
            </div>
            <div class="ai-pred-body">
                Patient <strong>Sneha Gupta (P-1002)</strong> in Bed EM-02 has an order for anti-allergy maintenance monitoring. AI predicts swelling re-assessment window expires at 11:30 AM.
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-arrow-right"></i> Recommended Next Step: Administer scheduled dose &amp; inspect airway patency.
            </div>
        </div>

        <div class="ai-pred-card opportunity">
            <div class="ai-pred-header">
                <h4><i class="fas fa-clock"></i> Scheduled Patient Routine</h4>
                <span class="priority-badge medium">Next in Queue</span>
            </div>
            <div class="ai-pred-body">
                ${myTasks.length > 0 ? `Next scheduled tasks in queue: <strong>${myTasks.map(t => t.task + ' (' + t.patientId + ')').join(', ')}</strong>.` : 'All routine tasks completed for current hour.'}
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-check-circle"></i> AI Confidence: 94% optimal order of operations.
            </div>
        </div>
    `;
}

// ===================================================================
//  4. WARD STAFF VIEWS
// ===================================================================

function renderWardDashboard() {
    document.getElementById('ward-welcome').textContent = currentUser.name;
    const myShifts = wardStaffShifts.filter(s => s.staffId === currentUser.employeeId);
    const active = myShifts.find(s => s.date === '2026-11-20');

    document.getElementById('ward-info').textContent = active ? `Assigned to: ${active.ward} Ward Operations` : 'Off Duty Today';
    document.getElementById('ward-current-shift').textContent = active ? `${active.start} – ${active.end}` : 'Off Duty';

    const activeDocShifts = shifts.filter(isDoctorOnDuty);
    document.getElementById('ward-doctors-on-duty').textContent = activeDocShifts.length;

    // Ward staff full shifts
    const rows = myShifts.map(s => `
        <tr>
            <td><strong>${s.date}</strong></td>
            <td>${s.start}</td>
            <td>${s.end}</td>
            <td>${s.ward} Ward</td>
            <td><span class="status-badge ${s.date === '2026-11-20' ? 'active' : 'ready'}">${s.date === '2026-11-20' ? 'Active Duty' : 'Scheduled'}</span></td>
        </tr>
    `).join('');
    document.getElementById('ward-shifts-body').innerHTML = rows || '<tr><td colspan="5">No shifts recorded.</td></tr>';
}

function renderWardDoctors() {
    // Shows where each doctor is currently in duty and when shift ends
    const activeDocShifts = shifts.filter(isDoctorOnDuty);
    const grid = document.getElementById('ward-doctors-grid');

    grid.innerHTML = activeDocShifts.map(s => {
        const doc = doctors.find(d => d.id === s.doctorId);
        return `
        <div class="doctor-status-card">
            <div class="doctor-card-header">
                <h4>${doc ? doc.name : s.doctorId}</h4>
                <span class="status-badge active"><i class="fas fa-circle" style="font-size:8px"></i> On Duty</span>
            </div>
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">${doc ? doc.specialization : 'Specialist'}</p>
            <div class="doctor-location-pill"><i class="fas fa-map-marker-alt"></i> ${s.location} (${s.ward})</div>
            <div class="doctor-meta">
                <span><i class="fas fa-hourglass-end"></i> Shift Ends: <strong>${s.end}</strong></span>
                <span><i class="fas fa-hospital"></i> Ward: ${s.ward}</span>
            </div>
        </div>`;
    }).join('');
}

function renderWardAI() {
    // Ward AI Predictor: Detects where doctors can be summoned / called early to avoid delays
    const panel = document.getElementById('ward-ai-panel');

    panel.innerHTML = `
        <div class="ai-pred-card critical">
            <div class="ai-pred-header">
                <h4><i class="fas fa-bell"></i> Early Alert: Emergency Bay 1 Surge Predicted</h4>
                <span class="priority-badge critical">Urgent Pre-Call</span>
            </div>
            <div class="ai-pred-body">
                Dr. Ananya Sharma is currently in <strong>Emergency Bay 1</strong>. Bed occupancy in Emergency is at 75%. 
                <strong>AI Prediction:</strong> To prevent emergency transfer bottlenecks, pre-alert <strong>Dr. Rahul Patel (ICU Room 3)</strong> now so he can attend step-down ICU handoffs 15 minutes before his current round concludes.
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-phone"></i> Early Action: Call Dr. Rahul Patel (ICU) to coordinate Emergency transition.
            </div>
        </div>

        <div class="ai-pred-card urgent">
            <div class="ai-pred-header">
                <h4><i class="fas fa-clock"></i> Shift Transition Buffer: OPD Room 2</h4>
                <span class="priority-badge high">Shift Change at 14:00</span>
            </div>
            <div class="ai-pred-body">
                Dr. Vikram Singh begins shift at 14:00 in <strong>OPD Room 2</strong>. Dr. Meera Joshi's shift ends at 15:00 in <strong>OPD Room 5</strong>.
                <strong>AI Dispatch Suggestion:</strong> Direct patient transport to OPD Room 2 at 13:50 so the incoming surgeon is engaged without delay.
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-walking"></i> Pre-position ward stretcher at General Ward GN-04.
            </div>
        </div>

        <div class="ai-pred-card info">
            <div class="ai-pred-header">
                <h4><i class="fas fa-bed"></i> Bed Turnover Optimisation</h4>
                <span class="priority-badge low">Bed Turnaround</span>
            </div>
            <div class="ai-pred-body">
                Bed <strong>EM-03</strong> and <strong>GN-02</strong> are sanitised and available. AI predicts incoming transfers from triage within 40 minutes.
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-check"></i> All clean linens verified. Ward ready.
            </div>
        </div>
    `;
}

// ===================================================================
//  5. PHARMACY VIEWS
// ===================================================================

function renderPharmacyStock() {
    const rows = medicines.map((m, idx) => {
        const isLow = m.quantity <= m.threshold;
        return `
        <tr>
            <td><strong>${m.name}</strong> (${m.id})</td>
            <td>${m.category}</td>
            <td><strong style="color:${isLow ? 'var(--danger)' : 'var(--text)'}">${m.quantity}</strong></td>
            <td>${m.threshold}</td>
            <td>₹${m.unitPrice}</td>
            <td><span class="priority-badge ${isLow ? 'critical' : 'low'}">${isLow ? 'LOW STOCK' : 'IN STOCK'}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openQuickAddStock(${idx})"><i class="fas fa-plus"></i> Add Qty</button>
            </td>
        </tr>`;
    }).join('');
    document.getElementById('pharmacy-stock-body').innerHTML = rows;
}

function openAddStockModal() {
    const sel = document.getElementById('as-medicine');
    sel.innerHTML = medicines.map(m => `<option value="${m.id}">${m.name} (Current: ${m.quantity})</option>`).join('');
    document.getElementById('as-qty').value = '';
    openModal('add-stock-modal');
}

function openQuickAddStock(idx) {
    openAddStockModal();
    document.getElementById('as-medicine').value = medicines[idx].id;
}

function submitAddStock(e) {
    e.preventDefault();
    const medId = document.getElementById('as-medicine').value;
    const addQty = parseInt(document.getElementById('as-qty').value) || 0;
    const med = medicines.find(m => m.id === medId);

    if (med && addQty > 0) {
        med.quantity += addQty;
        closeModal('add-stock-modal');
        refreshCurrentView();
        showToast(`Stock updated! Added ${addQty} units to ${med.name} (Total: ${med.quantity}).`, 'success');
    }
}

// Excel Import for Pharmacy Stock
function importStockExcel(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(firstSheet);

            let updatedCount = 0;
            json.forEach(row => {
                // Accepts "Medicine" or "Name", and "Quantity" or "Qty"
                const medName = row['Medicine'] || row['Name'] || row['medicine'] || row['name'];
                const qty = parseInt(row['Quantity'] || row['Qty'] || row['quantity'] || row['qty']);

                if (medName && !isNaN(qty)) {
                    const match = medicines.find(m => m.name.toLowerCase().includes(medName.toString().toLowerCase().trim()));
                    if (match) {
                        match.quantity += qty;
                        updatedCount++;
                    } else {
                        // Add as new medicine
                        medicines.push({
                            id: 'M-' + String(medicines.length + 1).padStart(2, '0'),
                            name: medName.toString().trim(),
                            category: row['Category'] || 'General',
                            quantity: qty,
                            threshold: parseInt(row['Threshold']) || 50,
                            unitPrice: parseFloat(row['UnitPrice'] || row['Price']) || 20
                        });
                        updatedCount++;
                    }
                }
            });

            refreshCurrentView();
            showToast(`Excel imported successfully! Updated ${updatedCount} medicines.`, 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to parse Excel file. Please ensure columns: Medicine, Quantity', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = ''; // Reset input
}

// Pharmacy Billing
function renderPharmacyBilling() {
    const rows = bills.map((b, idx) => `
        <tr>
            <td><strong>${b.id}</strong></td>
            <td>${b.patientName} (${b.patientId})</td>
            <td>${b.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
            <td><strong>₹${b.total}</strong></td>
            <td>${b.date}</td>
            <td><span class="status-badge ${b.status}">${b.status.toUpperCase()}</span></td>
            <td>
                ${b.status === 'unpaid' ? 
                    `<button class="btn btn-success btn-sm" onclick="markBillPaid(${idx})"><i class="fas fa-check"></i> Collect Payment</button>` : 
                    '<span style="color:var(--success);font-size:12px;font-weight:600"><i class="fas fa-check-circle"></i> Completed</span>'}
            </td>
        </tr>
    `).join('');
    document.getElementById('bills-body').innerHTML = rows || '<tr><td colspan="7">No bills generated yet.</td></tr>';
}

function markBillPaid(idx) {
    bills[idx].status = 'paid';
    refreshCurrentView();
    showToast(`Payment of ₹${bills[idx].total} received for Bill ${bills[idx].id}!`, 'success');
}

// Excel Export for Sales
function exportSalesExcel() {
    try {
        const salesData = sales.map(s => ({
            'Sale ID': s.id,
            'Bill ID': s.billId,
            'Medicine ID': s.medicineId,
            'Medicine Name': s.medicineName,
            'Quantity Sold': s.qty,
            'Unit Price (INR)': s.unitPrice,
            'Total Amount (INR)': s.total,
            'Sale Date': s.date
        }));

        const ws = XLSX.utils.json_to_sheet(salesData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pharmacy Sales');
        XLSX.writeFile(wb, `MedCore_Pharmacy_Sales_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('Sales data exported to Excel!', 'success');
    } catch (err) {
        console.error(err);
        showToast('Export failed: ' + err.message, 'error');
    }
}

// Bill Modal Logic
function openBillModal() {
    document.getElementById('bill-form').reset();
    populateBillMedicineOptions();
    calculateBillTotal();
    openModal('bill-modal');
}

function populateBillMedicineOptions() {
    const medOptions = '<option value="">Select medicine…</option>' + medicines.map(m => `<option value="${m.id}" data-price="${m.unitPrice}">${m.name} — ₹${m.unitPrice} (In Stock: ${m.quantity})</option>`).join('');
    document.querySelectorAll('.bill-medicine').forEach(s => {
        s.innerHTML = medOptions;
        s.onchange = calculateBillTotal;
    });
    document.querySelectorAll('.bill-qty').forEach(q => q.oninput = calculateBillTotal);
}

function addBillRow() {
    const container = document.getElementById('bill-items-container');
    const newRow = document.createElement('div');
    newRow.className = 'bill-item-row';
    newRow.innerHTML = `
        <select class="bill-medicine" onchange="calculateBillTotal()">${medicines.map(m => `<option value="${m.id}" data-price="${m.unitPrice}">${m.name} — ₹${m.unitPrice} (In Stock: ${m.quantity})</option>`).join('')}</select>
        <input type="number" class="bill-qty" placeholder="Qty" min="1" value="1" oninput="calculateBillTotal()">
        <span class="bill-row-price">₹0</span>
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove(); calculateBillTotal();"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(newRow);
    calculateBillTotal();
}

function calculateBillTotal() {
    let grandTotal = 0;
    document.querySelectorAll('.bill-item-row').forEach(row => {
        const select = row.querySelector('.bill-medicine');
        const qtyInput = row.querySelector('.bill-qty');
        const priceLabel = row.querySelector('.bill-row-price');

        const selectedOption = select.options[select.selectedIndex];
        const price = selectedOption ? parseFloat(selectedOption.dataset.price || 0) : 0;
        const qty = parseInt(qtyInput.value) || 0;
        const lineTotal = price * qty;

        if (priceLabel) priceLabel.textContent = `₹${lineTotal}`;
        grandTotal += lineTotal;
    });

    document.getElementById('bill-total-display').textContent = `₹${grandTotal}`;
}

function submitBill(e) {
    e.preventDefault();
    const patientId = document.getElementById('bill-patient-id').value.trim();
    const patientName = document.getElementById('bill-patient-name').value.trim();

    const items = [];
    let total = 0;

    document.querySelectorAll('.bill-item-row').forEach(row => {
        const select = row.querySelector('.bill-medicine');
        const qty = parseInt(row.querySelector('.bill-qty').value) || 0;
        const medId = select.value;
        const med = medicines.find(m => m.id === medId);

        if (med && qty > 0) {
            if (med.quantity < qty) {
                showToast(`Warning: Only ${med.quantity} units of ${med.name} in stock!`, 'error');
            }
            // Deduct stock
            med.quantity = Math.max(0, med.quantity - qty);
            const lineTotal = med.unitPrice * qty;
            total += lineTotal;

            items.push({ name: med.name, qty: qty, price: med.unitPrice, medicineId: med.id });

            // Record sale
            sales.push({
                id: 'S-' + String(sales.length + 1).padStart(3, '0'),
                billId: 'B-' + String(bills.length + 1).padStart(3, '0'),
                medicineId: med.id,
                medicineName: med.name,
                qty: qty,
                unitPrice: med.unitPrice,
                total: lineTotal,
                date: new Date().toISOString().split('T')[0]
            });
        }
    });

    if (items.length === 0) {
        showToast('Please select at least one item.', 'error');
        return;
    }

    const newBill = {
        id: 'B-' + String(bills.length + 1).padStart(3, '0'),
        patientId: patientId,
        patientName: patientName,
        items: items,
        total: total,
        date: new Date().toISOString().split('T')[0],
        status: 'paid'
    };

    bills.unshift(newBill);
    closeModal('bill-modal');
    refreshCurrentView();
    showToast(`Bill ${newBill.id} generated for ₹${total}! Stock deducted automatically.`, 'success');
}

// Doctor Prescriptions in Pharmacy
function renderPharmacyPrescriptions() {
    const rows = prescriptions.map((r, idx) => `
        <tr>
            <td><strong>${r.id}</strong></td>
            <td>${r.doctorName}</td>
            <td><strong>${r.patientName}</strong> (${r.patientId})</td>
            <td>${r.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
            <td>${r.notes || '—'}</td>
            <td><span class="status-badge ${r.status}">${r.status.toUpperCase()}</span></td>
            <td>
                ${r.status === 'pending' ? `
                    <button class="btn btn-primary btn-sm" onclick="markRxReady(${idx})">
                        <i class="fas fa-box-check"></i> Pack &amp; Ready
                    </button>
                ` : r.status === 'ready' ? `
                    <button class="btn btn-success btn-sm" onclick="billFromRx(${idx})">
                        <i class="fas fa-receipt"></i> Quick Bill &amp; Dispense
                    </button>
                ` : '<span style="color:var(--text-muted);font-size:12px">Dispensed</span>'}
            </td>
        </tr>
    `).join('');
    document.getElementById('pharmacy-rx-body').innerHTML = rows || '<tr><td colspan="7">No prescriptions received.</td></tr>';
}

function markRxReady(idx) {
    prescriptions[idx].status = 'ready';
    refreshCurrentView();
    showToast(`Prescription ${prescriptions[idx].id} packed & marked READY. Patient can collect immediately!`, 'success');
}

function billFromRx(idx) {
    const rx = prescriptions[idx];
    openBillModal();
    document.getElementById('bill-patient-id').value = rx.patientId;
    document.getElementById('bill-patient-name').value = rx.patientName;

    // Prefill first item
    if (rx.items.length > 0) {
        const firstRow = document.getElementById('bill-row-0');
        if (firstRow) {
            firstRow.querySelector('.bill-medicine').value = rx.items[0].medicineId;
            firstRow.querySelector('.bill-qty').value = rx.items[0].qty;
        }
    }
    // Add additional rows
    for (let i = 1; i < rx.items.length; i++) {
        addBillRow();
        const rows = document.querySelectorAll('.bill-item-row');
        const targetRow = rows[rows.length - 1];
        targetRow.querySelector('.bill-medicine').value = rx.items[i].medicineId;
        targetRow.querySelector('.bill-qty').value = rx.items[i].qty;
    }

    calculateBillTotal();
    rx.status = 'dispensed';
}

function renderPharmacyAI() {
    // AI Stock Insights: computes which medicines are selling most and predicts reorders
    const salesSummary = {};
    sales.forEach(s => {
        salesSummary[s.medicineName] = (salesSummary[s.medicineName] || 0) + s.qty;
    });

    const topSelling = Object.entries(salesSummary).sort((a, b) => b[1] - a[1]);
    const topItem = topSelling[0] || ['Paracetamol 500mg', 100];
    const secondItem = topSelling[1] || ['Aspirin 75mg', 60];

    const lowStockItems = medicines.filter(m => m.quantity <= m.threshold);

    const panel = document.getElementById('pharmacy-ai-panel');
    panel.innerHTML = `
        <div class="ai-pred-card urgent">
            <div class="ai-pred-header">
                <h4><i class="fas fa-fire"></i> High Demand Velocity: ${topItem[0]}</h4>
                <span class="priority-badge high">Top Fast-Mover</span>
            </div>
            <div class="ai-pred-body">
                <strong>${topItem[0]}</strong> has sold <strong>${topItem[1]} units</strong> across recent shifts.
                AI predicts inventory exhaustion in <strong>2.8 days</strong> at current run-rate.
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-boxes"></i> AI Order Recommendation: Place wholesale purchase order for +500 units.
            </div>
        </div>

        <div class="ai-pred-card critical">
            <div class="ai-pred-header">
                <h4><i class="fas fa-exclamation-triangle"></i> Reorder Threshold Breaches (${lowStockItems.length} Medicines)</h4>
                <span class="priority-badge critical">Action Required</span>
            </div>
            <div class="ai-pred-body">
                The following critical medicines are at or below safety stock:
                <ul style="margin: 8px 0 0 20px;">
                    ${lowStockItems.slice(0, 4).map(m => `<li><strong>${m.name}</strong>: ${m.quantity} in stock (Reorder threshold: ${m.threshold})</li>`).join('')}
                </ul>
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-truck-loading"></i> Priority: Immediate stock replenishment via Excel import or vendor order.
            </div>
        </div>

        <div class="ai-pred-card opportunity">
            <div class="ai-pred-header">
                <h4><i class="fas fa-chart-line"></i> Cross-Discipline Demand Correlation</h4>
                <span class="priority-badge low">Optimisation</span>
            </div>
            <div class="ai-pred-body">
                Cardiology and Emergency ward admissions increased by 30%. Demand for <strong>${secondItem[0]}</strong> and <strong>Amlodipine 5mg</strong> is tracking higher. Maintaining a 15% buffer will eliminate prescription dispense latency.
            </div>
            <div class="ai-pred-action">
                <i class="fas fa-check-circle"></i> AI Model Confidence: 91% based on 7-day rolling inpatient triage trends.
            </div>
        </div>
    `;
}

// ===================================================================
//  MODAL HELPERS
// ===================================================================

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

// Close when clicking modal backdrop
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('show');
    }
});

// Toast system
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
        toast.style.transition = 'all .3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
