// Script for club-details.html

document.addEventListener('DOMContentLoaded', async function () {
    await fetchClubsData();
    const clubId = sessionStorage.getItem('selectedClubId');
    if (clubId) {
        // Fetch logos
        let clubLogosData = [];
        let coordinatorsData = [];
        try {
            const res = await fetch('https://vihang-woya.onrender.com/api/images/club-logos');
            if (res.ok) clubLogosData = await res.json();
        } catch (e) {
            console.error('Failed to fetch club logos', e);
        }
        try {
            if (typeof fetchCoordinatorsImages === 'function') {
                coordinatorsData = await fetchCoordinatorsImages();
            }
        } catch (e) {
            console.error('Failed to fetch coordinators images', e);
        }
        displayClubDetails(clubId, clubLogosData, coordinatorsData); // Pass the logo and coordinators data
    } else {
        window.location.href = 'clubs.html';
    }
});

function displayClubDetails(clubId, clubLogosData = [], coordinatorsData = []) {
    const club = clubs.find(c => c.id === clubId);

    if (!club) {
        window.location.href = 'clubs.html';
        return;
    }

    // Find logo from data fetched
    const logoData = clubLogosData.find(l => l.name.toLowerCase() === club.name.toLowerCase());
    const logoUrl = logoData ? logoData.image_url : null;

    let imageHtml = logoUrl 
        ? `<div class="detail-image" style="background-color: #fff"><img src="${logoUrl}" alt="${club.name} logo" style="width:100%; height:100%; object-fit:contain; border-radius:inherit;"></div>`
        : `<div class="detail-image" style="background-color: ${club.color}">${club.element}</div>`;

    // Update club details
    const clubDetailsDiv = document.getElementById('clubDetails');
    clubDetailsDiv.innerHTML = `
        <div class="club-detail-card" style="border-color: ${club.color}; background-color: ${club.backgroundColor}">
            <div class="detail-header">
                ${imageHtml}
                <div class="detail-info">
                    <h1>${club.name}</h1>
                    <h3 style="color: ${club.color}; margin-bottom: 10px;">Element: ${club.theme}</h3>
                    <p>${club.description}</p>
                    ${club.instagramLink ? `
                    <div style="margin-top: 15px;">
                        <a href="${club.instagramLink}" target="_blank" class="club-social-icon" style="color: #ff6b6b; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 500; transition: opacity 0.3s; opacity: 0.9;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Follow on Instagram
                        </a>
                    </div>` : ''}
                </div>
            </div>
        </div>
    `;

    // Render team members
    renderTeamMembers(club, coordinatorsData);

    // Update stats
    document.getElementById('totalPoints').textContent = club.totalPoints;
    document.getElementById('sportsPoints').textContent = club.sportsPoints;
    document.getElementById('culturePoints').textContent = club.culturePoints;

    document.title = `${club.name} - Vihaang`;
}

function renderTeamMembers(club, coordinatorsData = []) {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';

    // Try to match coordinator images from API by name (case-insensitive)
    function getCoordinatorImage(name, fallback) {
        if (!name) return fallback;
        const found = coordinatorsData.find(c => c.name && c.name.toLowerCase() === name.toLowerCase());
        return found && found.image_url ? found.image_url : fallback;
    }

    const members = [
        {
            name: club.captainBoy,
            role: 'Coordinator (Boy)',
            image: getCoordinatorImage(club.captainBoy, club.captainBoyImage),
            type: 'primary'
        },
        {
            name: club.captainGirl,
            role: 'Coordinator (Girl)',
            image: getCoordinatorImage(club.captainGirl, club.captainGirlImage),
            type: 'primary'
        },
        {
            name: club.viceCaptainBoy,
            role: 'Vice-Coordinator (Boy)',
            image: getCoordinatorImage(club.viceCaptainBoy, club.viceCaptainBoyImage),
            type: 'secondary'
        },
        {
            name: club.viceCaptainGirl,
            role: 'Vice-Coordinator (Girl)',
            image: getCoordinatorImage(club.viceCaptainGirl, club.viceCaptainGirlImage),
            type: 'secondary'
        }
    ];

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = `member-card ${member.type}`;

        memberCard.innerHTML = `
           <div class="member-image"><img src="${member.image}" alt="${member.name}" /></div>
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
        `;

        teamGrid.appendChild(memberCard);
    });
}
