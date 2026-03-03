// Script for sponsors.html

document.addEventListener('DOMContentLoaded', function () {
    renderSponsors();
});



function renderSponsors() {
    const sponsorsGrid = document.getElementById('sponsorsGrid');
    sponsorsGrid.innerHTML = '';

    sponsors.forEach(sponsor => {
        const sponsorCard = document.createElement('div');
        sponsorCard.className = 'sponsor-card';

        sponsorCard.innerHTML = `
            <div class="sponsor-category">${sponsor.category}</div>
            <div class="sponsor-logo">${sponsor.logo}</div>
            <div class="sponsor-name">${sponsor.name}</div>
        `;

        sponsorsGrid.appendChild(sponsorCard);
    });
}
