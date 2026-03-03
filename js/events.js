// Script for events.html

document.addEventListener('DOMContentLoaded', async function () {
    await fetchClubsData();
    renderLeaderboard();
    setupTabs();
    populateSportsDropdown();
    populateCultureDropdown();
    setupEventListeners();
});

function renderLeaderboard() {
    const leaderboard = document.getElementById('eventsLeaderboard');
    leaderboard.innerHTML = '';

    // Sort clubs by total points
    const sortedClubs = [...clubs].sort((a, b) => b.totalPoints - a.totalPoints);

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    let headerHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Club</th>
                <th>Element</th>
                <th>Sports Pts</th>
                <th>Culture Pts</th>
                <th>Total Pts</th>
            </tr>
        </thead>
        <tbody>
    `;

    sortedClubs.forEach((club, index) => {
        headerHTML += `
            <tr>
                <td class="rank">${index + 1}</td>
                <td class="club-name-cell" style="border-left: 4px solid ${club.color}">${club.name}</td>
                <td class="element-cell">${club.theme}</td>
                <td class="points">${club.sportsPoints}</td>
                <td class="points">${club.culturePoints}</td>
                <td class="points" style="font-weight: bold; color: ${club.color};">${club.totalPoints}</td>
            </tr>
        `;
    });

    headerHTML += '</tbody>';
    table.innerHTML = headerHTML;
    leaderboard.appendChild(table);
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

function populateSportsDropdown() {
    const select = document.getElementById('sportsEventSelect');

    sports.forEach(sport => {
        const option = document.createElement('option');
        option.value = sport.id;
        option.textContent = sport.name;
        select.appendChild(option);
    });
}

function populateCultureDropdown() {
    const select = document.getElementById('cultureEventSelect');

    cultureEvents.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.name;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    document.getElementById('sportsEventSelect').addEventListener('change', function () {
        const sportId = parseInt(this.value);
        const sport = sports.find(s => s.id === sportId);
        if (!sport) return;

        // Auto-detect if this sport is neutral (has no boy/girl variants)
        const isNeutral = !clubs.some(c => c.sportBreakdown.some(sb => sb.sport === sport.name && (sb.gender === 'male' || sb.gender === 'female')));

        const genderSelect = document.getElementById('genderSelect');
        const genderSelectorGroup = document.getElementById('genderSelectorGroup');
        const genderValue = genderSelect.value;

        if (isNeutral) {
            genderSelectorGroup.style.display = 'none'; // Hide gender dropdown for neutral sports
            displaySportStandings(sportId, 'neutral');
        } else {
            genderSelectorGroup.style.display = 'flex';
            if (genderValue) {
                displaySportStandings(sportId, genderValue);
            } else {
                document.getElementById('sportsTableContainer').innerHTML = '<div class="placeholder">Please select both sport and gender to view standings</div>';
            }
        }
    });

    document.getElementById('genderSelect').addEventListener('change', function () {
        const sportId = parseInt(document.getElementById('sportsEventSelect').value);
        const genderValue = this.value;
        if (sportId && genderValue) {
            displaySportStandings(sportId, genderValue);
        }
    });

    document.getElementById('cultureEventSelect').addEventListener('change', function () {
        const eventId = parseInt(this.value);
        if (eventId) {
            displayCultureStandings(eventId);
        } else {
            document.getElementById('cultureTableContainer').innerHTML = '<div class="placeholder">Select a culture event to view standings</div>';
        }
    });
}

function displaySportStandings(sportId, gender) {
    const sport = sports.find(s => s.id === sportId);
    if (!sport) return;

    const container = document.getElementById('sportsTableContainer');
    container.innerHTML = '';

    // Calculate dynamic standings for specifically this gender
    const standings = [];
    clubs.forEach(club => {
        let genderPoints = 0;
        club.sportBreakdown.forEach(s => {
            if (s.sport === sport.name && s.gender === gender) genderPoints += s.points;
        });
        standings.push({
            club: club.name,
            points: genderPoints,
            color: club.color
        });
    });

    standings.sort((a, b) => b.points - a.points);

    if (standings.length === 0) {
        container.innerHTML = '<div class="placeholder">No data available for selected criteria</div>';
        return;
    }

    const genderLabel = gender.charAt(0).toUpperCase() + gender.slice(1);
    const title = document.createElement('h3');
    title.textContent = `${sport.name} - ${genderLabel} - Standings`;
    container.appendChild(title);

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    let html = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Club</th>
                <th>Total Points</th>
            </tr>
        </thead>
        <tbody>
    `;

    standings.forEach((standing, index) => {
        html += `
            <tr>
                <td class="rank">${index + 1}</td>
                <td class="club-name-cell" style="border-left: 4px solid ${standing.color}">${standing.club}</td>
                <td class="points" style="font-weight: bold; color: ${standing.color};">${standing.points}</td>
            </tr>
        `;
    });

    html += '</tbody>';
    table.innerHTML = html;
    container.appendChild(table);
}

function displayCultureStandings(eventId) {
    const event = cultureEvents.find(e => e.id === eventId);
    if (!event) return;

    const container = document.getElementById('cultureTableContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    let html = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Club</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
    `;

    const standings = [];
    clubs.forEach(club => {
        let eventPoints = 0;
        club.cultureBreakdown.forEach(c => {
            if (c.event === event.name) {
                eventPoints += c.points;
            }
        });
        standings.push({
            club: club.name,
            points: eventPoints,
            color: club.color
        });
    });

    standings.sort((a, b) => b.points - a.points);

    standings.forEach((standing, index) => {
        html += `
            <tr>
                <td class="rank">${index + 1}</td>
                <td class="club-name-cell" style="border-left: 4px solid ${standing.color}">${standing.club}</td>
                <td class="points">${standing.points}</td>
            </tr>
        `;
    });

    html += '</tbody>';
    table.innerHTML = html;
    container.appendChild(table);
}
