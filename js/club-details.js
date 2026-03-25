// Script for club-details.html

document.addEventListener('DOMContentLoaded', async function () {
    await apiReadyPromise;
    await fetchClubsData();
    const clubId = sessionStorage.getItem('selectedClubId');
    if (clubId) {
        // Fetch logos
        let clubLogosData = [];
        let coordinatorsData = [];
        try {
            const res = await fetch(`${API_BASE_URL}/images/club-logos`);
            if (res.ok) clubLogosData = await res.json();
        } catch (e) {
            console.error('Failed to fetch club logos', e);
        }
        try {
            const coordRes = await fetch(`${API_BASE_URL}/images/coordinators`);
            if (coordRes.ok) coordinatorsData = await coordRes.json();
        } catch (e) {
            console.error('Failed to fetch coordinators images', e);
        }
        displayClubDetails(clubId, clubLogosData, coordinatorsData); // Pass the logo and coordinators data

        // Show trophy animation if this club is winner or runner-up
        const club = clubs.find(c => c.id === clubId);
        if (club && (club.rank === 'winner' || club.rank === 'runner-up')) {
            showTrophyAnimation(club);
        }
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

    // Find coordinator entry for this club by matching club name
    const coordEntry = coordinatorsData.find(
        c => c.club && c.club.toLowerCase() === club.name.toLowerCase()
    );

    const members = [
        {
            name: club.captainBoy,
            role: 'Coordinator (Boy)',
            image: (coordEntry && coordEntry.captainBoyImage) || club.captainBoyImage,
            type: 'primary'
        },
        {
            name: club.captainGirl,
            role: 'Coordinator (Girl)',
            image: (coordEntry && coordEntry.captainGirlImage) || club.captainGirlImage,
            type: 'primary'
        },
        {
            name: club.viceCaptainBoy,
            role: 'Vice-Coordinator (Boy)',
            image: (coordEntry && coordEntry.viceCaptainBoyImage) || club.viceCaptainBoyImage,
            type: 'secondary'
        },
        {
            name: club.viceCaptainGirl,
            role: 'Vice-Coordinator (Girl)',
            image: (coordEntry && coordEntry.viceCaptainGirlImage) || club.viceCaptainGirlImage,
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

// ============================================
// TROPHY / CUP ANIMATION FOR WINNER/RUNNER-UP
// ============================================
function showTrophyAnimation(club) {
    const isWinner = club.rank === 'winner';
    const emoji = isWinner ? '🏆' : '🥈';
    const title = isWinner ? 'WINNER!' : 'RUNNER-UP!';
    const gradientBg = isWinner
        ? 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(192,192,192,0.15) 0%, transparent 70%)';
    const glowColor = isWinner ? 'rgba(255, 215, 0, 0.6)' : 'rgba(192, 192, 192, 0.6)';
    const bannerBg = isWinner
        ? 'linear-gradient(135deg, #ffd700, #ff8c00)'
        : 'linear-gradient(135deg, #c0c0c0, #888)';

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'trophyOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        z-index: 10000; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        background: rgba(0,0,0,0.7); opacity: 0;
        transition: opacity 0.5s ease; cursor: pointer;
    `;

    // Trophy emoji
    const trophy = document.createElement('div');
    trophy.style.cssText = `
        font-size: 0; transition: font-size 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: drop-shadow(0 0 30px ${glowColor});
        animation: trophyPulse 2s ease-in-out infinite;
    `;
    trophy.textContent = emoji;

    // Club name & rank banner
    const banner = document.createElement('div');
    banner.style.cssText = `
        background: ${bannerBg}; color: #fff; padding: 15px 40px;
        border-radius: 50px; font-family: 'Outfit', sans-serif;
        font-size: 1.4rem; font-weight: 800; letter-spacing: 2px;
        text-transform: uppercase; margin-top: 20px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        transform: translateY(30px); opacity: 0;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s;
    `;
    banner.textContent = `${club.name} — ${title}`;

    // Dismiss text
    const dismiss = document.createElement('div');
    dismiss.style.cssText = `
        color: rgba(255,255,255,0.5); font-size: 0.85rem;
        margin-top: 20px; font-family: 'Outfit', sans-serif;
        transform: translateY(20px); opacity: 0;
        transition: all 0.5s ease 1.2s;
    `;
    dismiss.textContent = 'Tap anywhere to continue';

    overlay.appendChild(trophy);
    overlay.appendChild(banner);
    overlay.appendChild(dismiss);
    document.body.appendChild(overlay);

    // Add pulse keyframes
    if (!document.getElementById('trophyPulseStyle')) {
        const style = document.createElement('style');
        style.id = 'trophyPulseStyle';
        style.textContent = `
            @keyframes trophyPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
            }
        `;
        document.head.appendChild(style);
    }

    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        trophy.style.fontSize = '8rem';
        banner.style.transform = 'translateY(0)';
        banner.style.opacity = '1';
        dismiss.style.transform = 'translateY(0)';
        dismiss.style.opacity = '1';
    });

    // Trigger confetti with themed colors
    setTimeout(() => {
        if (typeof confetti !== 'undefined') {
            const colors = isWinner ? ['#ffd700', '#ff8c00', '#ffec80'] : ['#c0c0c0', '#888888', '#e8e8e8'];
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 40, spread: 360, ticks: 80, zIndex: 10001, colors };

            const intervalId = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(intervalId);
                const particleCount = 80 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() * 0.4 } }));
            }, 200);
        }
    }, 500);

    // Dismiss on click
    overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
    });

    // Auto dismiss after 6 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }
    }, 6000);
}
