// Script for club-details.html

document.addEventListener('DOMContentLoaded', async function () {
    await fetchClubsData();
    const clubId = sessionStorage.getItem('selectedClubId');
    if (clubId) {
        displayClubDetails(clubId); // Note: _id is a string from mongo now
        renderClubsNavigation(clubId); // Add clubs navigation
    } else {
        window.location.href = '/clubs';
    }
});

function displayClubDetails(clubId) {
    const club = clubs.find(c => c.id === clubId);

    if (!club) {
        window.location.href = '/clubs';
        return;
    }

    // Update club details
    const clubDetailsDiv = document.getElementById('clubDetails');
    clubDetailsDiv.innerHTML = `
        <div class="club-detail-card" style="border-color: ${club.color}; background-color: ${club.backgroundColor}">
            <div class="detail-header">
                <div class="detail-image" style="background-color: ${club.color}">${club.element}</div>
                <div class="detail-info">
                    <h1>${club.name}</h1>
                    <h3 style="color: ${club.color}; margin-bottom: 10px;">Element: ${club.theme}</h3>
                    <p>${club.description}</p>
                </div>
            </div>
        </div>
    `;

    // Render team members
    renderTeamMembers(club);

    // Update stats
    document.getElementById('totalPoints').textContent = club.totalPoints;
    document.getElementById('sportsPoints').textContent = club.sportsPoints;
    document.getElementById('culturePoints').textContent = club.culturePoints;

    // Update gallery
    updateGallery(club);

    document.title = `${club.name} - Vihaang`;
}

function renderTeamMembers(club) {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';

    const members = [
        {
            name: club.captainBoy,
            role: 'Coordinator (Boy)',
            image: club.captainBoyImage,
            type: 'primary'
        },
        {
            name: club.captainGirl,
            role: 'Coordinator (Girl)',
            image: club.captainGirlImage,
            type: 'primary'
        },
        {
            name: club.viceCaptainBoy,
            role: 'Vice-Coordinator (Boy)',
            image: club.viceCaptainBoyImage,
            type: 'secondary'
        },
        {
            name: club.viceCaptainGirl,
            role: 'Vice-Coordinator (Girl)',
            image: club.viceCaptainGirlImage,
            type: 'secondary'
        }
    ];

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = `member-card ${member.type}`;

        memberCard.innerHTML = `
            <div class="member-image">${member.image}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
        `;

        teamGrid.appendChild(memberCard);
    });
}

function renderClubsNavigation(currentClubId) {
    const clubsNavLinks = document.getElementById('clubsNavLinks');
    clubsNavLinks.innerHTML = '';

    clubs.forEach(club => {
        const navLink = document.createElement('a');
        navLink.href = '#';
        navLink.className = 'club-nav-link';
        navLink.textContent = club.name;
        
        // Add active class to current club
        if (club.id === currentClubId) {
            navLink.classList.add('active');
        }
        
        // Add click handler to navigate to club
        navLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('selectedClubId', club.id);
            displayClubDetails(club.id);
            renderClubsNavigation(club.id); // Re-render navigation to update active state
        });
        
        clubsNavLinks.appendChild(navLink);
    });
}

// Gallery functionality
function updateGallery(club) {
    const galleryCarousel = document.getElementById('galleryCarousel');
    const galleryTitle = document.getElementById('galleryClubName');
    
    // Update gallery title
    galleryTitle.textContent = club.name;
    
    // Map club names to their respective images
    const clubGalleryImages = {
        'Ether Rox': [
            'images/pics/CLUB CAPTURE_218.jpg.jpeg',
            'images/pics/IMG_5268.JPG.jpeg',
            'images/pics/pic3day.jpg.jpeg',
            'images/pics/Pic_of_the_Day4.jpg.jpeg'
        ],
        'Gravitas Elites': [
            'images/pics/CLUB 2 PIC OF THE DAY.jpg.jpeg',
            'images/pics/CLUB 2 POTD 22.jpg.jpeg',
            'images/pics/IMG_5699.PNG.jpeg',
            'images/pics/Pic_of_the_Day_Vihang.jpg.jpeg'
        ],
        'Hydro Heroes': [
            'images/pics/3.RR.JPG.jpeg',
            'images/pics/3.RR (1).JPG.jpeg',
            'images/pics/IMG_20250327_020926.jpg.jpeg',
            'images/pics/1.GT.jpg.jpeg'
        ],
        'Firestorm': [
            'images/pics/IMG_20250327_020926.jpg.jpeg',
            'images/pics/CLUB 2 PIC OF THE DAY.jpg.jpeg',
            'images/pics/CLUB CAPTURE_215.jpg.jpeg',
            'images/pics/CLUB CAPTURE_218.jpg.jpeg'
        ],
        'Aero Knights': [
            'images/pics/IMG_5268.JPG.jpeg',
            'images/pics/pic8day.jpg.jpeg',
            'images/pics/Pic_of_the_Day4.jpg.jpeg',
            'images/pics/IMG_5699.PNG.jpeg'
        ]
    };
    
    const images = clubGalleryImages[club.name] || [];
    
    // Clear existing slides
    galleryCarousel.innerHTML = '';
    
    // Create gallery slides
    images.forEach((imageSrc, index) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.innerHTML = `<img src="${imageSrc}" alt="${club.name} moment">`;
        galleryCarousel.appendChild(slide);
    });
    
    // Initialize carousel
    initGalleryCarousel();
}

function initGalleryCarousel() {
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    
    let currentIndex = 0;
    
    if (slides.length === 0) return;
    
    // Set initial positions
    updateSlidePositions();
    
    function updateSlidePositions() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
            
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.classList.add('next');
            } else if (index === (currentIndex - 2 + slides.length) % slides.length) {
                slide.classList.add('far-prev');
            } else if (index === (currentIndex + 2) % slides.length) {
                slide.classList.add('far-next');
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePositions();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePositions();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play (optional)
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}
