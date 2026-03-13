// Script for about.html - About Us Page

document.addEventListener('DOMContentLoaded', function() {
    renderOrganizers();
});

function renderOrganizers() {
    const organizersGrid = document.getElementById('organizersGrid');
    organizersGrid.innerHTML = '';

    organizers.forEach(org => {
        const orgCard = document.createElement('div');
        orgCard.className = 'organizer-card';
        
        orgCard.innerHTML = `
            <div class="organizer-image">${org.image}</div>
            <div class="organizer-name">${org.name}</div>
            <div class="organizer-role">${org.role}</div>
            <div class="organizer-bio">${org.bio}</div>
        `;

        organizersGrid.appendChild(orgCard);
    });
}
