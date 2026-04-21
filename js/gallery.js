// js/gallery.js

document.addEventListener("DOMContentLoaded", async () => {
    // We can await Clubs data if we need dynamic clubs
    await fetchClubsData();
    await fetchGalleryData();
    initGallery();
});

let galleryPhotos = [];

async function fetchGalleryData() {
    await apiReadyPromise; // From data.js
    try {
        const response = await fetch(`${API_BASE_URL}/gallery`);
        if (response.ok) {
            const data = await response.json();
            // Map the DB fields (img_url, cat, sub cat, club) to our internal structure
            galleryPhotos = data.map((item, index) => ({
                id: item._id || index,
                src: item.img_url,
                title: item.title || `${item.cat} Photo`,
                mainTab: item.cat,
                subTab: item['sub cat'] || item.sub_cat || item.subcat || item.subCat || '',
                club: item.club || ''
            }));
        } else {
            console.error("Failed to fetch gallery data");
        }
    } catch (error) {
        console.error("Error fetching gallery data:", error);
    }
}

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
        'Clubs': ['All', 'Ether Rox', 'Gravitas Elites', 'Hydro Heroes', 'FireStorm', 'Aero Knights']
    };

    function renderSecondaryFilters(mainTab) {
        secondaryContainer.innerHTML = '';
        currentSubTab = 'All'; // Reset sub tab on main tab change

        if (mainTab === 'all') {
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
        let filteredImages = galleryPhotos;

        // Filter by Primary Tab
        if (currentMainTab !== 'all') {
            if (currentMainTab === 'Clubs') {
                // If main tab is clubs, we don't filter out by mainTab field. 
                // We just rely on the sub-tab filter. Wait, if sub-tab is 'All' under Clubs, we show all images.
            } else {
                filteredImages = filteredImages.filter(img => img.mainTab === currentMainTab);
            }
        }

        // Filter by Secondary Tab
        if (currentSubTab !== 'All' && currentMainTab !== 'all') {
            if (currentMainTab === 'Clubs') {
                filteredImages = filteredImages.filter(img => img.club === currentSubTab);
            } else {
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
