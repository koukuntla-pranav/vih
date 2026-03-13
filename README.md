# Vihang'26 — VNIT PG Sports & Cultural Festival

The official website for **Vihang 2026**, the Postgraduate Sports and Cultural festival of **VNIT Nagpur** (March 25 – April 5, 2026). Five elemental clubs compete across 31 sports and 23 cultural events, with live scoring powered by a Node.js + MongoDB backend.

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `index.html` | Hero section, flip-card countdown, events strip, sponsors, clubs overview, gallery carousel |
| **Clubs** | `src/clubs.html` | Swiper coverflow carousel of all 5 clubs + club rankings table |
| **Club Details** | `src/club-details.html` | Individual club page — element info, captains, points breakdown |
| **Leaderboard** | `src/leadboard.html` | Overall standings + tabbed Sports / Culture event standings with cascading dropdowns |
| **Team** | `src/team.html` | Professors In-Charge, PG Secretary, Cultural / Technical / Sponsorship Heads, Web Team |
| **Sponsors** | `src/sponsors.html` | Title, Co-title and Equipment sponsors grid |
| **Organizer Dashboard** | `src/organizer-dashboard.html` | JWT-authenticated admin panel — login/register, score updater, score logs |

## The Five Clubs

| Club | Element | Color |
|------|---------|-------|
| **Agni** | Fire | `#FF6B6B` |
| **Jala** | Water | `#4ECDC4` |
| **Prithvi** | Earth | `#8B6F47` |
| **Vayu** | Air | `#87CEEB` |
| **Akasha** | Space | `#483D8B` |

## Project Structure

```
vihaang-website/
├── index.html                      # Home page
├── css/
│   └── style.css                   # All styling
├── js/
│   ├── data.js                     # Clubs, sports & culture event data
│   ├── main.js                     # Home page logic (countdown, gallery, events strip)
│   ├── clubs.js                    # Clubs carousel & rankings
│   ├── club-details.js             # Club details page logic
│   ├── events.js                   # Leaderboard & event standings
│   ├── sponsors.js                 # Sponsors page logic
│   └── about.js                    # About section logic
├── src/
│   ├── clubs.html                  # Clubs page
│   ├── club-details.html           # Club details page
│   ├── leadboard.html              # Leaderboard page
│   ├── team.html                   # Team page
│   ├── sponsors.html               # Sponsors page
│   └── organizer-dashboard.html    # Admin dashboard
├── images/                         # Logos, photos, sponsor images
└── backend/
    ├── server.js                   # Express API server
    ├── models.js                   # Mongoose models
    ├── seed.js                     # Database seed script
    └── package.json                # Backend dependencies
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | HTML, CSS, Vanilla JS, [Swiper.js](https://swiperjs.com/), Google Fonts (Poppins, Outfit) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Hosting** | Render (`vihang-woya.onrender.com`) |

## Getting Started

### Frontend

Simply open `index.html` in a browser — no build step required.

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Seed the database and start the server:

```bash
node seed.js      # Populate clubs, sports & culture events
npm start         # Production
npm run dev       # Development (nodemon)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register an organizer |
| POST | `/api/auth/login` | — | Login and receive JWT |
| GET | `/api/clubs` | — | All clubs sorted by points |
| GET | `/api/clubs/:id/breakdown` | — | Detailed score breakdown for a club |
| POST | `/api/clubs/:id/add-sport-points` | JWT | Add sport points (sport name + gender) |
| POST | `/api/clubs/:id/add-culture-points` | JWT | Add culture event points |
| GET | `/api/sports` | — | All sports |
| POST | `/api/sports/:id/update-standings` | JWT | Update sport standings |
| GET | `/api/culture` | — | All culture events |
| POST | `/api/culture/:id/update-standings` | JWT | Update culture standings |
| GET | `/api/score-logs` | JWT | Last 50 score update logs |
| POST | `/api/init-clubs` | — | Seed initial club data |

## Features

- **Flip-card countdown** to March 25, 2026 with CSS 3D transforms
- **Swiper coverflow carousel** for clubs with auto-rotation
- **Infinite-scroll events strip** with pause-on-hover
- **Cascading dropdowns** — Type → Sport → Gender for granular standings
- **Gallery carousel** (14 photos, auto-advance, manual controls)
- **5-element animated background** — floating glassmorphism orbs
- **Responsive design** — mobile hamburger menu, CSS grid/flexbox layouts
- **Organizer dashboard** — authenticated score management with audit logs
- **Navbar scroll effect** — glassmorphism on scroll

## Browser Compatibility

Chrome, Firefox, Safari, Edge (latest) and mobile browsers.

---

**VNIT Nagpur — Vihang'26**