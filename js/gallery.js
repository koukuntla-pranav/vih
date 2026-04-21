// js/gallery.js

document.addEventListener("DOMContentLoaded", async () => {
    // We can await Clubs data if we need dynamic clubs
    await fetchClubsData();
    initGallery();
});

// Mock Data for Gallery
const mockPhotos = [
    { id: 1, src: "https://placehold.co/600x400/2c2083/FFF?text=Cricket+Match", title: "Cricket Finals", mainTab: "Sports", subTab: "Outdoor", club: "Ether Rox" },
    { id: 2, src: "https://placehold.co/600x600/2002b7/FFF?text=Badminton", title: "Badminton Singles", mainTab: "Sports", subTab: "Indoor", club: "Hydro Heroes" },
    { id: 3, src: "https://placehold.co/400x600/814402/FFF?text=Relay+Race", title: "4x100 Relay", mainTab: "Sports", subTab: "Athletics", club: "Gravitas Elites" },
    { id: 4, src: "https://placehold.co/600x400/f42a2a/FFF?text=BGMI+Tournament", title: "BGMI Finals", mainTab: "Sports", subTab: "E-Sports", club: "FireStorm" },
    { id: 5, src: "https://placehold.co/800x600/6e9fb6/FFF?text=Flash+Mob", title: "Opening Flash Mob", mainTab: "Cultural", subTab: "Cultural", club: "Aero Knights" },
    { id: 6, src: "https://placehold.co/600x600/2c2083/FFF?text=Debate", title: "English Debate", mainTab: "Cultural", subTab: "Literary", club: "Ether Rox" },
    { id: 7, src: "https://placehold.co/500x700/2002b7/FFF?text=March+Past", title: "Inaugural March Past", mainTab: "Cultural", subTab: "Inaugural", club: "Hydro Heroes" },
    { id: 8, src: "https://placehold.co/600x400/814402/FFF?text=Football", title: "Football Semi-Finals", mainTab: "Sports", subTab: "Outdoor", club: "Gravitas Elites" },
    { id: 9, src: "https://placehold.co/400x400/f42a2a/FFF?text=Chess", title: "Chess Tournament", mainTab: "Sports", subTab: "Indoor", club: "FireStorm" },
    { id: 10, src: "https://placehold.co/600x800/6e9fb6/FFF?text=Singing", title: "Solo Singing Performance", mainTab: "Cultural", subTab: "Cultural", club: "Aero Knights" },
];

function initGallery() {
    const primaryTabs = document.querySelectorAll('.gallery-tab-btn');
    const secondaryContainer = document.getElementById('gallerySecondaryFilters');
    const gridContainer = document.getElementById('galleryGrid');
    const noResults = document.getElementById('galleryNoResults');
    
    // Lightbox elements
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");

    let currentMainTab = 'all';
    let currentSubTab = 'All';

    // Sub-tab definitions
    // The user requested:
    // Sports -> Indoor, Outdoor, Athletics (and E-Sports from data.js)
    // Cultural -> Cultural, Literary, Inaugural
    // Clubs -> We map dynamically from clubs array
    const subTabMap = {
        'Sports': ['All', 'Outdoor', 'Indoor', 'Athletics', 'E-Sports'],
        'Cultural': ['All', 'Cultural', 'Literary', 'Inaugural'],
        'Clubs': ['All', ...clubs.map(c => c.name)]
    };

    function renderSecondaryFilters(mainTab) {
        secondaryContainer.innerHTML = '';
        currentSubTab = 'All'; // Reset sub tab on main tab change

        if (mainTab === 'all' || mainTab === 'Athletics') {
            // Athletics is kept as a primary tab in HTML currently but might act like 'all' if we don't have sub tabs for it.
            // But if user meant Athletics is just a subtab in Sports, we'll handle it.
            secondaryContainer.style.display = 'none';
        } else {
            const subTabs = subTabMap[mainTab];
            if (subTabs && subTabs.length > 0) {
                secondaryContainer.style.display = 'flex';
                subTabs.forEach(tab => {
                    const btn = document.createElement('button');
                    btn.className = `gallery-subtab-btn ${tab === 'All' ? 'active' : ''}`;
                    btn.textContent = tab;
                    btn.addEventListener('click', () => {
                        // Update active state
                        document.querySelectorAll('.gallery-subtab-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        currentSubTab = tab;
                        renderGallery();
                    });
                    secondaryContainer.appendChild(btn);
                });
            } else {
                secondaryContainer.style.display = 'none';
            }
        }
    }

    function renderGallery() {
        gridContainer.innerHTML = '';
        let filteredImages = mockPhotos;

        // Filter by Primary Tab
        if (currentMainTab !== 'all') {
            if (currentMainTab === 'Clubs') {
                // If main tab is clubs, we don't filter out by mainTab field. 
                // We just rely on the sub-tab filter. Wait, if sub-tab is 'All' under Clubs, we show all images.
            } else if (currentMainTab === 'Athletics') {
                // If they click Athletics as a primary tab
                filteredImages = filteredImages.filter(img => img.subTab === 'Athletics');
            } else {
                filteredImages = filteredImages.filter(img => img.mainTab === currentMainTab);
            }
        }

        // Filter by Secondary Tab
        if (currentSubTab !== 'All' && currentMainTab !== 'all') {
            if (currentMainTab === 'Clubs') {
                filteredImages = filteredImages.filter(img => img.club === currentSubTab);
            } else if (currentMainTab !== 'Athletics') {
                filteredImages = filteredImages.filter(img => img.subTab === currentSubTab);
            }
        }

        if (filteredImages.length === 0) {
            noResults.style.display = 'block';
            gridContainer.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            gridContainer.style.display = 'grid';

            filteredImages.forEach(imgData => {
                const imgWrap = document.createElement('div');
                imgWrap.className = 'gallery-item';

                const img = document.createElement('img');
                img.src = imgData.src;
                img.alt = imgData.title;
                img.loading = "lazy";

                imgWrap.appendChild(img);
                
                // Add click listener for Lightbox
                imgWrap.addEventListener("click", () => {
                    lightbox.style.display = "flex";
                    // Brief timeout to allow display:flex to apply before adding show class for fade-in
                    setTimeout(() => lightbox.classList.add("show"), 10);
                    lightboxImg.src = imgData.src;
                    lightboxCaption.textContent = imgData.title + (imgData.club ? ` (${imgData.club})` : '');
                });

                gridContainer.appendChild(imgWrap);
            });
        }
    }

    // Event Listeners for Primary Tabs
    primaryTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            primaryTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMainTab = btn.getAttribute('data-tab');
            renderSecondaryFilters(currentMainTab);
            renderGallery();
        });
    });

    // Lightbox Close Events
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove("show");
        // Wait for fade out transition before hiding
        setTimeout(() => {
            lightbox.style.display = "none";
        }, 300);
    }

    // Initial render
    renderSecondaryFilters('all');
    renderGallery();
}
