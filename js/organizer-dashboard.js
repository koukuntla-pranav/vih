// organizer-dashboard.js
// Moved from organizer-dashboard.html

// Configuration
var API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';


// ...All the script logic from <script>...</script> in organizer-dashboard.html...
// (The full script will be pasted here in the next step)


var clubsOriginal = [];

var SPORTS_DATA = [
    // Outdoor
    { name: 'Cricket', type: 'Outdoor', genders: ['male', 'female'] },
    { name: 'Football', type: 'Outdoor', genders: ['male'] },
    { name: 'Kho-Kho', type: 'Outdoor', genders: ['male', 'female'] },
    { name: 'Throw Ball', type: 'Outdoor', genders: ['female'] },
    { name: 'Basketball', type: 'Outdoor', genders: ['male', 'female'] },
    { name: 'Volleyball', type: 'Outdoor', genders: ['male', 'female'] },
    { name: 'Handball', type: 'Outdoor', genders: ['male'] },
    { name: 'Box Cricket', type: 'Outdoor', genders: ['neutral'] },
    { name: 'Tug of War', type: 'Outdoor', genders: ['neutral'] },
    { name: 'Swimming', type: 'Outdoor', genders: ['male', 'female'] },
    { name: 'Vihang Letters', type: 'Outdoor', genders: ['neutral'] },
    { name: 'Inaugural March Past', type: 'Outdoor', genders: ['neutral'] },
    // Indoor
    { name: 'Badminton', type: 'Indoor', genders: ['male', 'female', 'mixed'] },
    { name: 'Table Tennis', type: 'Indoor', genders: ['male', 'female'] },
    { name: 'Carrom', type: 'Indoor', genders: ['male', 'female'] },
    { name: 'Chess', type: 'Indoor', genders: ['male', 'female'] },
    { name: 'Powerlifting', type: 'Indoor', genders: ['male'] },
    { name: 'Yoga', type: 'Indoor', genders: ['neutral'] },
    // E-Sports
    { name: 'BGMI', type: 'E-Sports', genders: ['neutral'] },
    { name: 'Valorant', type: 'E-Sports', genders: ['neutral'] },
    // Athletics
    { name: 'Discus Throw', type: 'Athletics', genders: ['male', 'female'] },
    { name: 'Javelin Throw', type: 'Athletics', genders: ['male', 'female'] },
    { name: 'Marathon', type: 'Athletics', genders: ['male', 'female'] },
    { name: 'Relay 4x100m', type: 'Athletics', genders: ['male'] },
    { name: 'Shot Put', type: 'Athletics', genders: ['male', 'female'] },
    { name: 'Slow Cycling', type: 'Athletics', genders: ['male', 'female'] },
    { name: 'Sprint 100m', type: 'Athletics', genders: ['male', 'female'] },
    { name: 'Sprint 200m', type: 'Athletics', genders: ['male', 'female'] },
    { name: 'Triathlon Relay', type: 'Athletics', genders: ['neutral'] },
    { name: 'Long Jump', type: 'Athletics', genders: ['male'] },
    { name: 'Swimming 100m', type: 'Athletics', genders: ['male'] }
];
var  SPORTS = SPORTS_DATA.map(s => s.name);
var CULTURE_EVENTS = [
    'Debate (English)', 'Debate (Hindi)', 'Poetry (English)', 'Poetry (Hindi)',
    'Quiz', 'Pic of the Day', 'Reel of the Day', 'Meme of the Day',
    'Pic of Vihang', 'Flash Mob', 'Face Painting', 'Short Film',
    'Instrumental', 'Solo Dance', 'Duo Dance', 'Group Dance',
    'Solo Singing', 'Duet Singing', 'Group Singing', 'Rangoli',
    'Poster Making', 'Treasure Hunt', 'Vihang Letters'
];

var authToken = localStorage.getItem('orgToken');
var loginType = localStorage.getItem('loginType') || 'core';
var clubs = [];

// Attach functions to window for HTML event handlers
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.setLoginType = setLoginType;
window.toggleAuthForm = toggleAuthForm;
window.registerCoordinator = registerCoordinator;
window.saveClubRow = saveClubRow;
window.cancelEditField = cancelEditField;
window.startEditField = startEditField;
window.saveClubMapping = saveClubMapping;
window.cancelClubMapping = cancelClubMapping;
window.handleScoreUpdate = handleScoreUpdate;
window.handlePenaltyUpdate = handlePenaltyUpdate;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    if (authToken) {
        showDashboard();
        loadClubs();
        loadScoreLogs();
        updateEventDropdown(); // Initialize event dropdown
    } else {
        showAuthForm();
    }
    initLoginTypeSelector();
});

function initLoginTypeSelector() {
    const group = document.getElementById('loginTypeGroup');
    if (!group) return;
    const buttons = Array.from(group.querySelectorAll('.login-type-button'));

    function setActive(type) {
        buttons.forEach(button => {
            button.classList.toggle('active', button.dataset.loginType === type);
        });
        loginType = type;
        localStorage.setItem('loginType', loginType);
        updateRoleLabel();
        updateRoleHint();
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            setActive(button.dataset.loginType);
        });
    });

    setActive(loginType || 'core');
}

function setLoginType(type) {
    const group = document.getElementById('loginTypeGroup');
    if (!group) return;
    const buttons = Array.from(group.querySelectorAll('.login-type-button'));
    buttons.forEach(button => {
        button.classList.toggle('active', button.dataset.loginType === type);
    });
    loginType = type;
    localStorage.setItem('loginType', loginType);
    updateRoleLabel();
    updateRoleHint();
}

function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.textContent = 'Login';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.textContent = 'Register';
    }
}

function showAuthForm() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    // Show navbar on login page
    const navbar = document.getElementById('mainNavbar');
    if (navbar) navbar.style.display = '';
}

function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    updateRoleLabel();
    // Hide navbar on dashboard
    const navbar = document.getElementById('mainNavbar');
    if (navbar) navbar.style.display = 'none';
}

function updateRoleLabel() {
    const label = document.getElementById('roleLabel');
    if (!label) return;
    const roleText = loginType === 'coordinator' ? 'Coordinator' : 'Core';
    label.textContent = `(${roleText})`;
}

function updateRoleHint() {
    const hint = document.getElementById('roleHint');
    if (!hint) return;
    hint.textContent = loginType === 'coordinator'
        ? 'Coordinator login is limited to assigned event updates.'
        : 'Core login allows full access to scoring updates.';
}

function updateEventDropdown() {
    const scoreType = document.getElementById('scoreType').value;
    const eventSelect = document.getElementById('eventSelect');
    const genderGroup = document.getElementById('genderGroup');
    const genderSelect = document.getElementById('genderSelect');

    const events = scoreType === 'sports' ? SPORTS : CULTURE_EVENTS;

    // Show gender box only for sports
    if (scoreType === 'sports') {
        genderGroup.style.display = 'block';
    } else {
        genderGroup.style.display = 'none';
    }

    eventSelect.innerHTML = '<option value="">-- Choose an event --</option>';
    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event;
        option.textContent = event;
        eventSelect.appendChild(option);
    });

    // Auto-select gender when sport changes
    eventSelect.onchange = function () {
        if (scoreType !== 'sports') return;
        const selectedSport = SPORTS_DATA.find(s => s.name === eventSelect.value);
        if (!selectedSport) return;

        const genders = selectedSport.genders;
        // Reset gender options to only relevant ones
        genderSelect.innerHTML = '<option value="">-- Choose Gender --</option>';
        const genderLabels = { male: 'Boys', female: 'Girls', mixed: 'Mixed', neutral: 'Neutral/N/A' };
        genders.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g;
            opt.textContent = genderLabels[g] || g;
            genderSelect.appendChild(opt);
        });

        // Auto-select if only one gender
        if (genders.length === 1) {
            genderSelect.value = genders[0];
            genderGroup.style.display = 'none';
        } else {
            genderSelect.value = '';
            genderGroup.style.display = 'block';
        }
    };
}

async function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const selectedButton = document.querySelector('.login-type-button.active');
    loginType = selectedButton ? selectedButton.dataset.loginType : 'core';
    localStorage.setItem('loginType', loginType);

    if (!username || !password) {
        showMessage('Please fill all fields', 'error');
        return;
    }

    try {
        let response, data;
        if (loginType === 'coordinator') {
            // Coordinator login: send to /coordinators/login with username, password
            response = await fetch(`${API_BASE_URL}/coordinators/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
        } else {
            // Core/admin login: send to /auth/login with username, password only
            response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
        }
        data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('orgToken', authToken);
            showMessage('Login successful!', 'success');
            setTimeout(() => {
                if (loginType === 'coordinator') {
                    window.location.href = '/coordinator-dashboard';
                } else {
                    window.location.href = '/organizer-dashboard';
                }
            }, 500);
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

async function handleRegister() {
    const name = document.getElementById('regName').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    if (!name || !username || !password) {
        showMessage('Please fill all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('orgToken', authToken);
            showMessage('Registration successful!', 'success');
            setTimeout(() => {
                showDashboard();
                loadClubs();
                loadScoreLogs();
                updateEventDropdown();
            }, 500);
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('orgToken');
    showAuthForm();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    updateRoleLabel();
}


// Fetch club names and themes from backend for mapping and theme section
async function loadClubs() {
    try {
        // Fetch both names and themes in one go (assuming /club-names returns both)
        const response = await fetch(`${API_BASE_URL}/club-names`);
        clubs = await response.json();
        // Deep copy for cancel
        clubsOriginal = JSON.parse(JSON.stringify(clubs));

        // Populate selects for score/penalty
        const select = document.getElementById('clubSelect');
        const penaltySelect = document.getElementById('penaltyClubSelect');
        select.innerHTML = '<option value="">-- Choose a club --</option>';
        penaltySelect.innerHTML = '<option value="">-- Choose a club --</option>';
        clubs.forEach(club => {
            const option = document.createElement('option');
            option.value = club._id || club.clubNumber;
            option.textContent = club.name;
            select.appendChild(option);
            const penaltyOption = document.createElement('option');
            penaltyOption.value = club._id || club.clubNumber;
            penaltyOption.textContent = club.name;
            penaltySelect.appendChild(penaltyOption);
        });

        // Render mapping UI
        renderClubMapping();
    } catch (error) {
        console.error('Error loading clubs:', error);
    }
}

// Render editable mapping UI for club names and themes
function renderClubMapping() {
    const form = document.getElementById('clubMappingForm');
    form.innerHTML = '';
    for (let i = 0; i < clubs.length; i++) {
        const club = clubs[i];
        const item = document.createElement('div');
        item.className = 'mapping-item';
        const editing = (window.editingField && window.editingField.idx === i);
        item.innerHTML = `
                    <div class="club-number">Club ${club.clubNumber}</div>
                    <div class="club-name-editable" id="club-name-${i}" style="flex:2; margin-right:1.5rem; min-width:180px; display:flex; align-items:center;">
                        ${editing
                ? `<input type='text' id='edit-name-${i}' value="${club.name || ''}" placeholder='Club Name' style='font-size:1.15rem; padding:0.5rem; border-radius:6px; border:1.5px solid #bbb; min-width:140px;' />`
                : `<span class='club-name-text'>${club.name || '<span style=\'color:#bbb\'>Club Name</span>'}</span>`}
                    </div>
                    <div class="club-theme-editable" id="club-theme-${i}" style="flex:2; min-width:180px; display:flex; align-items:center;">
                        <span style="color:#888; margin-right:0.5rem;">Theme:</span>
                        ${editing
                ? `<input type='text' id='edit-theme-${i}' value="${club.theme || ''}" placeholder='Theme' style='font-size:1.15rem; padding:0.5rem; border-radius:6px; border:1.5px solid #bbb; min-width:140px;' />`
                : `<span class='club-theme-text'>${club.theme || '<span style=\'color:#bbb\'>Theme</span>'}</span>`}
                    </div>
                    <div class="club-actions" id="club-actions-${i}">
                        ${editing
                ? `<span class='save-icon' title='Save' onclick='saveClubRow(${i})'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/></svg>
                               </span>
                               <span class='cancel-icon' title='Cancel' onclick='cancelEditField()'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/></svg>
                               </span>`
                : `<span class='edit-icon' title='Edit' onclick='startEditField(${i})'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h12'/></svg>
                               </span>`}
                    </div>
                `;
        form.appendChild(item);
        if (editing) {
            setTimeout(() => {
                const nameInput = document.getElementById(`edit-name-${i}`);
                const themeInput = document.getElementById(`edit-theme-${i}`);
                if (nameInput) {
                    nameInput.onkeydown = function (e) {
                        if (e.key === 'Enter') saveClubRow(i);
                        if (e.key === 'Escape') cancelEditField();
                    };
                }
                if (themeInput) {
                    themeInput.onkeydown = function (e) {
                        if (e.key === 'Enter') saveClubRow(i);
                        if (e.key === 'Escape') cancelEditField();
                    };
                }
                if (nameInput) nameInput.focus();
            }, 10);
        }
    }
}

// Render name/theme field (text or input with save/cancel icons)
function renderField(idx, field) {
    const club = clubs[idx];
    const containerId = field === 'name' ? `club-name-${idx}` : `club-theme-${idx}`;
    const container = document.getElementById(containerId);
    if (!container) return;
    const editing = (window.editingField && window.editingField.idx === idx && window.editingField.field === field);
    container.innerHTML = '';
    if (!editing) {
        const span = document.createElement('span');
        span.className = field === 'name' ? 'club-name-text' : 'club-theme-text';
        span.textContent = field === 'name' ? club.name : club.theme;
        container.appendChild(span);
        // Only show edit icon on hover of mapping-item
        const icon = document.createElement('span');
        icon.className = 'edit-icon';
        icon.title = field === 'name' ? 'Edit Name' : 'Edit Theme';
        icon.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h12'/></svg>`;
        icon.onclick = () => startEditField(idx, field);
        container.appendChild(icon);
    } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = field === 'name' ? club.name : club.theme;
        input.style.fontSize = '1.15rem';
        input.style.padding = '0.5rem';
        input.style.borderRadius = '6px';
        input.style.border = '1.5px solid #bbb';
        input.style.minWidth = '140px';
        input.onblur = () => saveFieldEdit(idx, field, input.value.trim());
        input.onkeydown = function (e) {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') cancelEditField();
        };
        container.appendChild(input);
        // Save icon
        const saveIcon = document.createElement('span');
        saveIcon.className = 'save-icon';
        saveIcon.title = 'Save';
        saveIcon.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/></svg>`;
        saveIcon.onclick = () => { input.blur(); };
        container.appendChild(saveIcon);
        // Cancel icon
        const cancelIcon = document.createElement('span');
        cancelIcon.className = 'cancel-icon';
        cancelIcon.title = 'Cancel';
        cancelIcon.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/></svg>`;
        cancelIcon.onclick = () => cancelEditField();
        container.appendChild(cancelIcon);
        input.focus();
    }
}

// Render actions (for Apple-like UX, actions are now per-field, so this is just for spacing)
function renderActions(idx) {
    const actions = document.getElementById(`club-actions-${idx}`);
    actions.innerHTML = '';
}

// Start editing a row (both name and theme)
function startEditField(idx) {
    window.editingField = { idx };
    renderClubMapping();
}

// Cancel editing
function cancelEditField() {
    // Flash red on cancel
    if (window.editingField) {
        const idx = window.editingField.idx;
        const nameInput = document.getElementById(`edit-name-${idx}`);
        const row = nameInput ? nameInput.closest('.mapping-item') : null;
        if (row) {
            row.classList.add('flash-red');
            setTimeout(() => row.classList.remove('flash-red'), 700);
        }
    }
    window.editingField = null;
    renderClubMapping();
}

// Save both name and theme for a club
async function saveClubRow(idx) {
    const nameInput = document.getElementById(`edit-name-${idx}`);
    const themeInput = document.getElementById(`edit-theme-${idx}`);
    const name = nameInput ? nameInput.value.trim() : '';
    const theme = themeInput ? themeInput.value.trim() : '';
    if (!name || !theme) {
        showMessage('Both club name and theme are required', 'error');
        return;
    }
    const club = clubs[idx];
    const clubNumber = club.clubNumber;
    const row = nameInput ? nameInput.closest('.mapping-item') : null;
    try {
        await fetch(`${API_BASE_URL}/club-names/${clubNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, theme })
        });
        window.editingField = null;
        if (row) {
            row.classList.add('flash-green');
            setTimeout(() => row.classList.remove('flash-green'), 700);
        }
        showMessage('Club name saved!', 'success');
        await loadClubs();
    } catch (e) {
        showMessage('Failed to update', 'error');
        cancelEditField();
    }
}

// Individual edit logic for name/theme
async function editField(idx, field) {
    const club = clubs[idx];
    const containerId = field === 'name' ? `club-name-${idx}` : `club-theme-${idx}`;
    const container = document.getElementById(containerId);
    if (!container) return;
    // Prevent multiple inputs
    if (container.querySelector('input')) return;
    const currentValue = field === 'name' ? club.name : club.theme;
    container.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue || '';
    input.style.fontSize = '1.15rem';
    input.style.padding = '0.5rem';
    input.style.borderRadius = '6px';
    input.style.border = '1.5px solid #bbb';
    input.style.minWidth = '140px';
    input.onblur = async function () {
        await saveFieldEdit(idx, field, input.value.trim());
    };
    input.onkeydown = function (e) {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') renderClubMapping();
    };
    container.appendChild(input);
    input.focus();
}

async function saveFieldEdit(idx, field, value) {
    if (!value) { renderClubMapping(); return; }
    const club = clubs[idx];
    const clubNumber = club.clubNumber;
    let url, body;
    if (field === 'name') {
        url = `${API_BASE_URL}/club-names/${clubNumber}`;
        body = { name: value };
    } else {
        url = `${API_BASE_URL}/club-names/${clubNumber}`;
        body = { theme: value };
    }
    try {
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(body)
        });
        await loadClubs();
    } catch (e) {
        showMessage('Failed to update', 'error');
        renderClubMapping();
    }
}

// Save mapping (bulk save both names and themes)
async function saveClubMapping(event) {
    if (event) event.preventDefault();
    // Gather names and themes
    const nameInputs = document.querySelectorAll('.club-name-input');
    const themeInputs = document.querySelectorAll('.club-theme-input');
    const names = Array.from(nameInputs).map(input => input.value.trim());
    const themes = Array.from(themeInputs).map(input => input.value.trim());
    // Validate
    if (names.some(n => !n) || themes.some(t => !t)) {
        showMessage('All club names and themes are required', 'error');
        return;
    }
    try {
        // Save names
        const resNames = await fetch(`${API_BASE_URL}/club-names/bulk`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ names })
        });
        // Save themes
        const resThemes = await fetch(`${API_BASE_URL}/club-themes/bulk`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ themes })
        });
        const dataNames = await resNames.json();
        const dataThemes = await resThemes.json();
        if (dataNames.success && dataThemes.success) {
            showMessage('Club names and themes saved!', 'success');
            await loadClubs();
        } else {
            showMessage((dataNames.message || dataThemes.message || 'Save failed'), 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Cancel mapping edits (revert to last loaded)
function cancelClubMapping() {
    clubs = JSON.parse(JSON.stringify(clubsOriginal));
    renderClubMapping();
}



async function handleScoreUpdate() {
    const clubId = document.getElementById('clubSelect').value;
    const scoreType = document.getElementById('scoreType').value;
    const eventName = document.getElementById('eventSelect').value;
    const genderValue = document.getElementById('genderSelect').value;
    const points = parseInt(document.getElementById('pointsInput').value);

    if (!clubId || !eventName || !points) {
        showMessage('Please fill all fields', 'error');
        return;
    }
    if (scoreType === 'sports' && !genderValue) {
        showMessage('Please select Male/Female for sports', 'error');
        return;
    }

    // Determine endpoint and parameter name based on score type
    let endpoint, reqBody;
    if (scoreType === 'sports') {
        endpoint = `${API_BASE_URL}/clubs/${clubId}/add-sport-points`;
        reqBody = { sport: eventName, gender: genderValue, points };
    } else {
        endpoint = `${API_BASE_URL}/clubs/${clubId}/add-culture-points`;
        reqBody = { event: eventName, points };
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(reqBody)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(`${scoreType === 'sports' ? 'Sports' : 'Culture'} points updated successfully!`, 'success');
            document.getElementById('clubSelect').value = '';
            document.getElementById('pointsInput').value = '';
            document.getElementById('eventSelect').value = '';
            loadScoreLogs();
        } else {
            showMessage(data.message || 'Update failed', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

async function handlePenaltyUpdate() {
    const clubId = document.getElementById('penaltyClubSelect').value;
    const reason = document.getElementById('penaltyReason').value.trim();
    const points = parseInt(document.getElementById('penaltyPoints').value);

    if (!clubId || !reason || isNaN(points) || points <= 0) {
        showMessage('Please select a club, enter a valid reason, and provide positive penalty points', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/penalty`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ clubId, reason, points })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(`Penalty of ${points} points added to ${data.club.name} for: ${reason}`, 'success');
            document.getElementById('penaltyClubSelect').value = '';
            document.getElementById('penaltyReason').value = '';
            document.getElementById('penaltyPoints').value = '';
            loadScoreLogs();
            loadClubs(); // Refresh clubs data to show updated penalty points
        } else {
            showMessage(data.message || 'Penalty update failed', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

async function loadScoreLogs() {
    try {
        const response = await fetch(`${API_BASE_URL}/score-logs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const logs = await response.json();
        const tbody = document.getElementById('logsTableBody');
        tbody.innerHTML = '';

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No updates yet</td></tr>';
            return;
        }

        logs.forEach(log => {
            const row = document.createElement('tr');
            const date = new Date(log.timestamp).toLocaleString();
            const evtLabel = log.gender ? `${log.eventName} (${log.gender})` : log.eventName;
            const pointSymbol = log.pointsAdded > 0 ? '+' : '';
            const pointColor = log.pointsAdded >= 0 ? '#4CAF50' : '#f44336';
            row.innerHTML = `
                        <td><strong>${log.club}</strong></td>
                        <td>${log.eventType}</td>
                        <td>${evtLabel}</td>
                        <td style="font-weight: bold; color: ${pointColor};">${pointSymbol}${log.pointsAdded}</td>
                        <td>${log.updatedBy}</td>
                        <td>${date}</td>
                    `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading logs:', error);
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Dummy or actual implementation for registerCoordinator to prevent ReferenceError
function registerCoordinator(event) {
    event?.preventDefault();
    // TODO: Implement coordinator registration logic here if needed
    showMessage('Coordinator registration is not implemented yet.', 'error');
}

// Auto-refresh logs every 10 seconds
setInterval(() => {
    if (authToken) {
        loadScoreLogs();
    }
}, 10000);
