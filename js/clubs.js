// Script for clubs.html - Clubs Page

document.addEventListener('DOMContentLoaded', async function () {
    await fetchClubsData();
    renderClubs();
    renderClubLeaderboard();
});

function renderClubs() {
    const clubsGrid = document.getElementById('clubsGrid');
    clubsGrid.innerHTML = '';

    clubs.forEach(club => {
        const swiperSlide = document.createElement('div');
        swiperSlide.className = 'swiper-slide';

        const clubCard = document.createElement('div');
        clubCard.className = 'club-card';
        clubCard.style.borderColor = club.color;
        clubCard.style.backgroundColor = club.backgroundColor;
        clubCard.onclick = () => goToClubDetails(club.id);

        clubCard.innerHTML = `
            <div class="club-image">${club.element}</div>
            <div class="club-name">${club.name}</div>
            <div class="club-theme">${club.theme}</div>
            <div class="club-description">${club.description}</div>
            <div class="club-leadership">
                <div class="leader">
                    <span class="label">Captain:</span>
                    <span class="names">${club.captainBoy} / ${club.captainGirl}</span>
                </div>
                <div class="leader">
                    <span class="label">Vice-Captain:</span>
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
                <th>Rank</th>
                <th>Club</th>
                <th>Sports Pts</th>
                <th>Culture Pts</th>
                <th>Total Pts</th>
            </tr>
        </thead>
        <tbody>
    `;

    sortedClubs.forEach((club, index) => {
        headerHTML += `
            <tr style="cursor: pointer;" onclick="goToClubDetails(${club.id})">
                <td class="rank">${index + 1}</td>
                <td class="club-name-cell" style="border-left: 4px solid ${club.color}">${club.name}</td>
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

function goToClubDetails(clubId) {
    sessionStorage.setItem('selectedClubId', clubId);
    window.location.href = 'club-details.html';
}
