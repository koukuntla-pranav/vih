// Script for clubs.html - Clubs Page

document.addEventListener('DOMContentLoaded', async function () {
    await apiReadyPromise;
    await fetchClubsData();

    // Fetch logos
    let clubLogosData = [];
    try {
        const res = await fetch(`${API_BASE_URL}/images/club-logos`);
        if (res.ok) clubLogosData = await res.json();
    } catch (e) {
        console.error('Failed to fetch club logos', e);
    }

    renderClubs(clubLogosData);
    renderClubLeaderboard();

    // Show winner/runner-up popup banner if results are finalized
    const winner = clubs.find(c => c.rank === 'winner');
    const runnerUp = clubs.find(c => c.rank === 'runner-up');
    if (winner) {
        showWinnerBanner(winner, runnerUp);
    }
});

function showWinnerBanner(winner, runnerUp) {
    const banner = document.createElement('div');
    banner.id = 'winnerBanner';
    banner.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; z-index: 10000;
        background: linear-gradient(135deg, #ffd700, #ff8c00, #ffd700);
        color: #333; text-align: center; padding: 20px 15px;
        font-family: 'Outfit', sans-serif; font-weight: 700;
        box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
        transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    banner.innerHTML = `
        <div style="font-size: 1.6rem; margin-bottom: 6px;">🏆 ${winner.name} — WINNER! 🏆</div>
        ${runnerUp ? `<div style="font-size: 1.1rem; opacity: 0.85;">🥈 ${runnerUp.name} — Runner-up</div>` : ''}
        <div style="font-size: 0.8rem; margin-top: 8px; opacity: 0.6; cursor: pointer;" onclick="this.parentElement.style.transform='translateY(-100%)'">Tap to dismiss</div>
    `;
    document.body.appendChild(banner);

    // Slide in after a tiny delay
    setTimeout(() => { banner.style.transform = 'translateY(0)'; }, 300);

    // Auto dismiss after 8 seconds
    setTimeout(() => { banner.style.transform = 'translateY(-100%)'; }, 8000);
}

function renderClubs(clubLogosData = []) {
    const clubsGrid = document.getElementById('clubsGrid');
    if (!clubsGrid) return;
    clubsGrid.innerHTML = '';

    clubs.forEach(club => {
        // Find logo from data fetched
        const logoData = clubLogosData.find(l => l.name.toLowerCase() === club.name.toLowerCase());
        const logoUrl = logoData ? logoData.image_url : null;

        const swiperSlide = document.createElement('div');
        swiperSlide.className = 'swiper-slide';

        const clubCard = document.createElement('div');
        clubCard.className = 'club-card';
        clubCard.style.borderColor = club.color;
        clubCard.style.backgroundColor = club.backgroundColor;
        clubCard.onclick = () => goToClubDetails(club.id);

        let imageHtml = logoUrl
            ? `<div class="club-image"><img src="${logoUrl}" alt="${club.name} logo" style=" margin-top: 25px; margin-bottom: -10px; width:300px; height:125px; object-fit:contain;"></div>`
            : `<div class="club-image">${club.element}</div>`;

        clubCard.innerHTML = `
            ${imageHtml}
            <div class="club-name">${club.name}</div>
            <div class="club-theme">${club.theme}</div>
            <div class="club-description">${club.description}</div>
            <div class="club-leadership">
                <div class="leader">
                    <span class="label">Coordinators:</span>
                    <span class="names">${club.captainBoy} / ${club.captainGirl}</span>
                </div>
                <div class="leader">
                    <span class="label">Vice-Coordinators:</span>
                    <span class="names">${club.viceCaptainBoy} / ${club.viceCaptainGirl}</span>
                </div>
            </div>
            <div class="club-points">
                <span class="points-label">Total Points:</span>
                <span class="points-value">${club.totalPoints}</span>
            </div>
        `;

        swiperSlide.appendChild(clubCard);
        clubsGrid.appendChild(swiperSlide);
    });

    new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
        },
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        mousewheel: {
            forceToAxis: true,
            thresholdDelta: 10,
            sensitivity: 0,
        }
    });
}

function renderClubLeaderboard() {
    const leaderboard = document.getElementById('clubLeaderboard');
    leaderboard.innerHTML = '';

    // Sort clubs by total points
    const sortedClubs = [...clubs].sort((a, b) => b.totalPoints - a.totalPoints);

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    let headerHTML = `
        <thead>
            <tr>
                <th>S.No</th>
                <th colspan="2">Club</th>
                <th>Sports Pts</th>
                <th>Culture Pts</th>
                <th>Total Pts</th>
            </tr>
        </thead>
        <tbody>
    `;

    sortedClubs.forEach((club, index) => {
        const badge = club.rank === 'winner' ? ' 🏆' : club.rank === 'runner-up' ? ' 🥈' : '';
        const rowStyle = club.rank === 'winner' ? 'background: linear-gradient(90deg, #fff9e6, #fff3cc);' : club.rank === 'runner-up' ? 'background: linear-gradient(90deg, #f5f5f5, #e8e8e8);' : '';
        headerHTML += `
            <tr style="cursor: pointer; ${rowStyle}" onclick="goToClubDetails(${club.id})">
                <td class="rank">${index + 1}</td>
                <td class="club-capsule-cell"><div class="club-capsule" style="background: ${getClubGradient(club.name, club.color)};"></div></td>
                <td class="club-name-cell">${club.name}${badge}</td>
                <td class="points">${club.sportsPoints}</td>
                <td class="points">${club.culturePoints}</td>
                <td class="points" style="font-weight: bold; color: black;">${club.totalPoints}</td>
            </tr>
        `;
    });

    headerHTML += '</tbody>';
    table.innerHTML = headerHTML;
    leaderboard.appendChild(table);

    // Trigger confetti if results are finalized
    const hasWinner = clubs.some(c => c.rank === 'winner');
    if (hasWinner) {
        triggerWinnerConfetti();
    }
}

function triggerWinnerConfetti() {
    if (typeof confetti === 'undefined') return;
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 100 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const intervalId = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(intervalId);

        const particleCount = 100 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } }));
    }, 200);
}

function goToClubDetails(clubId) {
    sessionStorage.setItem('selectedClubId', clubId);
    window.location.href = 'club-details.html';
}
