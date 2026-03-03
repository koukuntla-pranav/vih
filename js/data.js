// Mock Data for Vihaang - Pancha Boothalu Clubs (5 Elements: Fire, Water, Earth, Air, Space)

// Shared Configuration
// For live: const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
const API_BASE_URL = 'http://localhost:5000/api';

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
                "Agni": { element: "🔥", description: "The Fire element - representing energy, passion, and determination.", backgroundColor: "#fff8f8", captainBoy: "Arjun Kumar", captainGirl: "Priya Singh", viceCaptainBoy: "Rajesh Nair", viceCaptainGirl: "Ananya Verma", captainBoyImage: "👨‍💼", captainGirlImage: "👩‍💼", viceCaptainBoyImage: "👨‍💼", viceCaptainGirlImage: "👩‍💼" },
                "Jala": { element: "💧", description: "The Water element - representing flow, adaptability, and harmony.", backgroundColor: "#eef8f6", captainBoy: "Rajesh Patel", captainGirl: "Ananya Desai", viceCaptainBoy: "Rohan Singh", viceCaptainGirl: "Neha Gupta", captainBoyImage: "👨‍💼", captainGirlImage: "👩‍💼", viceCaptainBoyImage: "👨‍💼", viceCaptainGirlImage: "👩‍💼" },
                "Prithvi": { element: "🌍", description: "The Earth element - representing stability, strength, and grounding.", backgroundColor: "#fcf7f2", captainBoy: "Vikram Sharma", captainGirl: "Neha Verma", viceCaptainBoy: "Sanjay Kumar", viceCaptainGirl: "Divya Nair", captainBoyImage: "👨‍💼", captainGirlImage: "👩‍💼", viceCaptainBoyImage: "👨‍💼", viceCaptainGirlImage: "👩‍💼" },
                "Vayu": { element: "💨", description: "The Air element - representing freedom, movement, and communication.", backgroundColor: "#f4f9fe", captainBoy: "Rohit Menon", captainGirl: "Divya Nair", viceCaptainBoy: "Arun Mishra", viceCaptainGirl: "Riya Choudhury", captainBoyImage: "👨‍💼", captainGirlImage: "👩‍💼", viceCaptainBoyImage: "👨‍💼", viceCaptainGirlImage: "👩‍💼" },
                "Akasha": { element: "🌌", description: "The Space/Ether element - representing cosmic energy and boundless possibilities.", backgroundColor: "#f9f6fc", captainBoy: "Aditya Gupta", captainGirl: "Riya Choudhury", viceCaptainBoy: "Vikash Singh", viceCaptainGirl: "Shreya Sharma", captainBoyImage: "👨‍💼", captainGirlImage: "👩‍💼", viceCaptainBoyImage: "👨‍💼", viceCaptainGirlImage: "👩‍💼" }
            };

            // Merge details
            clubs = clubs.map(club => {
                const details = clubDetails[club.name] || {};
                return { ...club, ...details, id: club._id };
            });

            return clubs;
        }
    } catch (error) {
        console.error('Error fetching clubs:', error);
    }
    return [];
}

// Organizers Data
const organizers = [
    {
        id: 1,
        name: "Dr. Ramesh Verma",
        role: "Chief Organizer",
        image: "👨‍💼",
        bio: "Visionary leader with 15+ years of experience in organizing youth events and competitions.",
        category: "faculty"
    },
    {
        id: 2,
        name: "Ms. Priya Sharma",
        role: "Co-Organizer",
        image: "👩‍💼",
        bio: "Passionate about fostering teamwork and excellence among students.",
        category: "faculty"
    },
    {
        id: 3,
        name: "Mr. Sanjay Patel",
        role: "Sports Coordinator",
        image: "👨‍💼",
        bio: "Dedicated sports enthusiast focused on building competitive sports culture.",
        category: "committee"
    },
    {
        id: 4,
        name: "Ms. Anjali Gupta",
        role: "Cultural Events Lead",
        image: "👩‍💼",
        bio: "Creative director dedicated to celebrating cultural talents and diversity.",
        category: "committee"
    },
    {
        id: 5,
        name: "Mr. Rohit Kumar",
        role: "Finance & Operations",
        image: "👨‍💼",
        bio: "Ensures smooth operations and fair management of all competitions.",
        category: "committee"
    }
];


const sponsors = [
    {
        id: 1,
        name: "Sponsor Name",
        logo: "👑",
        category: "Title Sponsor",
        description: "Main sponsor for Vihaang"
    },
    {
        id: 2,
        name: "Sponsor Name",
        logo: "🌟",
        category: "Co-title Sponsor",
        description: "Co-title sponsor for Vihaang"
    },
    {
        id: 3,
        name: "Sponsor Name",
        logo: "⚡",
        category: "Equipment Sponsor",
        description: "Equipment sponsor for Vihaang events"
    }
];


const sports = [
    // Outdoors
    { id: 1, name: "Cricket", icon: "🏏" },
    { id: 2, name: "Football", icon: "⚽" },
    { id: 3, name: "Kho-Kho", icon: "🏃" },
    { id: 4, name: "Throw Ball", icon: "🏐" },
    { id: 5, name: "Basketball", icon: "🏀" },
    { id: 6, name: "Volleyball", icon: "🏐" },
    { id: 7, name: "Handball", icon: "🤾" },
    { id: 8, name: "Box Cricket", icon: "🏏" },
    { id: 9, name: "Tug of War", icon: "🪢" },
    { id: 10, name: "Swimming", icon: "🏊" },
    { id: 11, name: "Vihang Letters", icon: "🔠" },
    { id: 12, name: "Inaugural March Past", icon: "🚶" },

    // Indoors
    { id: 13, name: "Badminton", icon: "🏸" },
    { id: 14, name: "Table Tennis", icon: "🏓" },
    { id: 15, name: "Carrom", icon: "🎯" },
    { id: 16, name: "Chess", icon: "♟️" },
    { id: 17, name: "BGMI", icon: "📱" },
    { id: 18, name: "Valorant", icon: "💻" },
    { id: 19, name: "Powerlifting", icon: "🏋️" },
    { id: 20, name: "Yoga", icon: "🧘" },

    // Athletics
    { id: 21, name: "Discus Throw", icon: "🥏" },
    { id: 22, name: "Javelin Throw", icon: "🏹" },
    { id: 23, name: "Marathon", icon: "🏃" },
    { id: 24, name: "Relay 4x100m", icon: "🏃‍♀️" },
    { id: 25, name: "Shot-Put", icon: "⚫" },
    { id: 26, name: "Slow Cycling", icon: "🚴" },
    { id: 27, name: "Sprint 100m", icon: "🏃" },
    { id: 28, name: "Sprint 200m", icon: "🏃" },
    { id: 29, name: "Sprint 400m", icon: "🏃" },
    { id: 30, name: "Sprint Triathlon Relay", icon: "🏃" }
];

const cultureEvents = [
    { id: 1, name: "Debate (English & Hindi)" },
    { id: 2, name: "Poetry (Hindi & English)" },
    { id: 3, name: "Quiz" },
    { id: 4, name: "Pic of the Day" },
    { id: 5, name: "Reel of the Day" },
    { id: 6, name: "Meme of the Day" },
    { id: 7, name: "Pic of Vihang" },
    { id: 8, name: "Stand-Up Comedy" },
    { id: 9, name: "Flash Mob" },
    { id: 10, name: "Fashion Show" },
    { id: 11, name: "Face Painting" },
    { id: 12, name: "Group Dance" },
    { id: 13, name: "Solo Dance" },
    { id: 14, name: "Dance Duo" },
    { id: 15, name: "Poster Making" },
    { id: 16, name: "Group Singing" },
    { id: 17, name: "Solo Singing" },
    { id: 18, name: "Duet Singing" },
    { id: 19, name: "Instrumental" },
    { id: 20, name: "Short Film" },
    { id: 21, name: "Rangoli" }
];

// Mobile Navbar Logic - Global
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            navLinks.classList.toggle('active');

            if (navbar) {
                navbar.classList.toggle('menu-active');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                navLinks.classList.remove('active');
                if (navbar) {
                    navbar.classList.remove('menu-active');
                }
            });
        });
    }
});
