// Auto-detect API: use localhost when developing locally, Render when deployed
const REMOTE_API = "https://vihang-woya.onrender.com/api";
const LOCAL_API = "http://localhost:5000/api";  // backend PORT from .env
const API_BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? LOCAL_API
  : REMOTE_API;
console.log("🔗 API:", API_BASE_URL);

// Gradient colors for club capsules (edit these to change capsule colors)
const clubGradients = {
  "Ether Rox": "linear-gradient(180deg, #eeebff, #2c2083)",
  "Hydro Heroes": "linear-gradient(180deg, #b1f8fd, #2002b7)",
  "Gravitas Elites": "linear-gradient(180deg, #eadcc8, #814402)",
  FireStorm: "linear-gradient(200deg, #ffcc91,rgb(244, 42, 42))",
  "Aero Knights": "linear-gradient(180deg, #ffffff, #6e9fb6)",
};

// Helper to get gradient for a club name (falls back to solid color)
function getClubGradient(clubName, fallbackColor) {
  return clubGradients[clubName] || fallbackColor || "#ccc";
}

// Clubs data will be fetched from backend
let clubs = [];

// Function to fetch clubs data from backend
async function fetchClubsData() {
  try {
    const response = await fetch(`${API_BASE_URL}/clubs`);
    if (response.ok) {
      clubs = await response.json();

      // Map the icons and full descriptions to the dynamic data since backend only saves basic theme details
      const clubDetails = {
        "Ether Rox": {
          element: `<img src="../images/clubs_logos/club1_logo.png" alt="Ether Rox" class="club-logo">`,
          description: "Cosmic energy, boundless reach.",
          backgroundColor: "#f9f6fc",
          captainBoy: "Sameer Bobde",
          captainGirl: "Aabriti Saha",
          viceCaptainBoy: "Ankan Chanda",
          viceCaptainGirl: "TS Anjana",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
          instagramLink:
            "https://www.instagram.com/ether_rox?igsh=MWFqMnVqbzhyYTA2bw==",
        },
        "Gravitas Elites": {
          element: `<img src="../images/clubs_logos/club2_logo.PNG" alt="Gravitas Elites" class="club-logo">`,
          description: "Steady stance, absolute strength.",
          backgroundColor: "#fcf7f2",
          captainBoy: "Rapelli S Prathik",
          captainGirl: "Kottapalli Navina",
          viceCaptainBoy: "Mohd Amjath Khan",
          viceCaptainGirl: "Sharvari K Sahare",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
          instagramLink:
            "https://www.instagram.com/gravitaselites?igsh=MWFnbnI1bXYyZGZkdQ==",
        },

        "Hydro Heroes": {
          element: `<img src="../images/clubs_logos/club3_logo.png" alt="Hydro Heroes" class="club-logo">`,
          description: "Calm in form, powerful in motion.",
          backgroundColor: "#eef8f6",
          captainBoy: "Vinit Vats",
          captainGirl: "Kanika Gupta",
          viceCaptainBoy: "Shivank Bramhe",
          viceCaptainGirl: "Vishu Bishnoi",
          captainBoyImage: "../club-3-images/Vinit_CC_club_02.png",
          captainGirlImage: "../club-3-images/CC_Club03.jpg",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "../club-3-images/Club3VC.jpg",
          instagramLink:
            "https://www.instagram.com/hydro__heroes?igsh=MWpuamV2cGtlNXV0ZQ==",
        },
        FireStorm: {
          element: `<img src="../images/clubs_logos/club4_logo.png" alt="Firestorm" class="club-logo">`,
          description: "Blazing passion, relentless drive.",
          backgroundColor: "#fff8f8",
          captainBoy: "Shashi Kumar ",
          captainGirl: "Kavi Sheoran",
          viceCaptainBoy: "Shivam Yadav",
          viceCaptainGirl: "Aashtha Guptha",
          captainBoyImage: "club 3 images/",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
          instagramLink:
            "https://www.instagram.com/firestorm_vihang26?igsh=MTBkMGQ3b3hjMGJkaw==",
        },

        "Aero Knights": {
          element: `<img src="../images/clubs_logos/Club_5 logo.png" alt="Aero Knights" class="club-logo">`,
          description: "Swift movement, boundless freedom.",
          backgroundColor: "#f4f9fe",
          captainBoy: "Divyansh P Singh",
          captainGirl: "Sweta Tiwari",
          viceCaptainBoy: "Yash Ingalkar",
          viceCaptainGirl: "Anusree V",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
          instagramLink:
            "https://www.instagram.com/aeroknights__vihang26?igsh=N2Vqam1rcDBobzdk",
        },
      };

      // Merge details
      clubs = clubs.map((club) => {
        const details = clubDetails[club.name] || {};
        return { ...club, ...details, id: club._id };
      });

      return clubs;
    }
  } catch (error) {
    console.error("Error fetching clubs:", error);
  }
  return [];
}


const sports = [
  // Outdoor
  {
    id: 1,
    name: "Cricket",
    icon: "🏏",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  { id: 2, name: "Football", icon: "⚽", type: "Outdoor", genders: ["male"] },
  {
    id: 3,
    name: "Kho-Kho",
    icon: "🏃",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  {
    id: 4,
    name: "Throw Ball",
    icon: "🏐",
    type: "Outdoor",
    genders: ["female"],
  },
  {
    id: 5,
    name: "Basketball",
    icon: "🏀",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  {
    id: 6,
    name: "Volleyball",
    icon: "🏐",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  { id: 7, name: "Handball", icon: "🤾", type: "Outdoor", genders: ["male"] },
  {
    id: 8,
    name: "Box Cricket",
    icon: "🏏",
    type: "Outdoor",
    genders: ["neutral"],
  },
  {
    id: 9,
    name: "Swimming",
    icon: "🏊",
    type: "Outdoor",
    genders: ["male", "female"],
  },

  // Indoor
  {
    id: 10,
    name: "Badminton",
    icon: "🏸",
    type: "Indoor",
    genders: ["male", "female", "mixed"],
  },
  {
    id: 11,
    name: "Table Tennis",
    icon: "🏓",
    type: "Indoor",
    genders: ["male", "female"],
  },
  {
    id: 12,
    name: "Carrom",
    icon: "🎯",
    type: "Indoor",
    genders: ["male", "female"],
  },
  {
    id: 13,
    name: "Chess",
    icon: "♟️",
    type: "Indoor",
    genders: ["male", "female"],
  },
  {
    id: 14,
    name: "Powerlifting",
    icon: "🏋️",
    type: "Indoor",
    genders: ["male"],
  },
  { id: 15, name: "Yoga", icon: "🧘", type: "Indoor", genders: ["neutral"] },

  // E-Sports
  { id: 16, name: "BGMI", icon: "📱", type: "E-Sports", genders: ["neutral"] },
  {
    id: 17,
    name: "Valorant",
    icon: "💻",
    type: "E-Sports",
    genders: ["neutral"],
  },

  // Athletics
  {
    id: 18,
    name: "Discus Throw",
    icon: "🥏",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 19,
    name: "Javelin Throw",
    icon: "🏹",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 20,
    name: "Marathon",
    icon: "🏃",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 21,
    name: "Relay 4x100m",
    icon: "🏃‍♂️",
    type: "Athletics",
    genders: ["male"],
  },
  {
    id: 22,
    name: "Shot Put",
    icon: "⚫",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 23,
    name: "Slow Cycling",
    icon: "🚴",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 24,
    name: "Sprint 100m",
    icon: "🏃",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 25,
    name: "Sprint 200m",
    icon: "🏃",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 26,
    name: "Triathlon Relay",
    icon: "🏃",
    type: "Athletics",
    genders: ["neutral"],
  },
  {
    id: 27,
    name: "Long Jump",
    icon: "🦘",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 28,
    name: "Swimming 100m",
    icon: "🏊",
    type: "Indoor",
    genders: ["male"],
  },
  {
    id: 29,
    name: "Swimming 50m",
    icon: "🏊",
    type: "Indoor",
    genders: ["female"],
  },
];

const cultureEvents = [
  { id: 1, name: "Debate (English)", type: "Literary" },
  { id: 2, name: "Debate (Hindi)", type: "Literary" },
  { id: 3, name: "Poetry (English)", type: "Literary" },
  { id: 4, name: "Poetry (Hindi)", type: "Literary" },
  { id: 5, name: "Quiz", type: "Literary" },
  { id: 6, name: "Pic of the Day", type: "Cultural" },
  { id: 7, name: "Reel of the Day", type: "Cultural" },
  { id: 8, name: "Meme of the Day", type: "Cultural" },
  { id: 9, name: "Pic of Vihang", type: "Cultural" },
  { id: 10, name: "Flash Mob", type: "Cultural" },
  { id: 11, name: "Face Painting", type: "Cultural" },
  { id: 12, name: "Short Film", type: "Cultural" },
  { id: 13, name: "Instrumental", type: "Cultural" },
  { id: 14, name: "Solo Dance", type: "Cultural" },
  { id: 15, name: "Duo Dance", type: "Cultural" },
  { id: 16, name: "Group Dance", type: "Cultural" },
  { id: 17, name: "Solo Singing", type: "Cultural" },
  { id: 18, name: "Duet Singing", type: "Cultural" },
  { id: 19, name: "Group Singing", type: "Cultural" },
  { id: 20, name: "Rangoli", type: "Cultural" },
  { id: 21, name: "Poster Making", type: "Cultural" },
  { id: 22, name: "Treasure Hunt", type: "Cultural" },
  { id: 23, name: "Crowd(Enthusiasm)", type: "Cultural" },
  { id: 24, name: "Crowd(Enthusiasm)", type: "Literary" },
  { id: 25, name: "Inagural march past", type: "Inaugural" },
  { id: 26, name: "Vihang Letters", type: "Inaugural" }
];

// ============================================
// PAGE LOADER — fade out once page is fully loaded
// ============================================
(function () {
  const loaderStart = Date.now();
  const MIN_DISPLAY_MS = 1250; // minimum loader display time (half circle of 2.5s spin)

  window.addEventListener("load", () => {
    const loader = document.getElementById("loader-wrapper");
    if (!loader) return;
    const elapsed = Date.now() - loaderStart;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => { loader.style.display = "none"; }, 600);
    }, remaining);
  });
})();

// Mobile Navbar Logic - Global
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
      mobileMenu.classList.toggle("is-active");
      navLinks.classList.toggle("active");

      if (navbar) {
        navbar.classList.toggle("menu-active");
      }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-active");
        navLinks.classList.remove("active");
        if (navbar) {
          navbar.classList.remove("menu-active");
        }
      });
    });
  }
});
