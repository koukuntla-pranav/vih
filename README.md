# Vihaang - Club Management & Scoring System

A modern, responsive website for managing and displaying club information, sports events, and cultural activities with a comprehensive scoring system.

## Features

### 📊 **Clubs Section**

- Display all 5 clubs with their information
- Show club captains and vice-captains
- Display club points
- Click on any club to view detailed information

### 🏆 **Club Details Page**

- Comprehensive club information
- Captain and Vice-Captain details
- Overall points breakdown:
  - Total points
  - Sports points
  - Culture points

### 📋 **Events Page**

- View all sports and culture events
- Toggle between sports and culture tabs
- See leading club for each event
- Overall leaderboard showing all clubs with their points

## Structure

```
vihaang-website/
├── index.html              # Main clubs page
├── club-details.html       # Club details page
├── events.html             # Events overview page
├── css/
│   └── style.css           # All styling
└── js/
    ├── data.js             # Mock data (clubs, sports, culture events)
    ├── main.js             # Index page logic
    ├── club-details.js     # Club details page logic
    ├── events.js           # Events page logic

```

## How to Use

1. **Open the website**: Open `index.html` in a web browser
2. **Navigate using the navigation bar**:
   - Clubs: View all clubs
   - Events: See sports and culture events overview

3. **Click on a club card**: Redirects to detailed view with captain, VC, and point breakdown

## Data Structure

### Clubs (5 total)

- Phoenix
- Dragons
- Eagles
- Titans
- Wolves

### Sports (5 total)

- Cricket
- Football
- Badminton
- Basketball
- Tennis

### Culture Events (5 total)

- Dance
- Music
- Drama
- Debate
- Art & Design

## Customization

### Edit Club Information

Open `js/data.js` and modify the `clubs` array:

```javascript
{
    id: 1,
    name: "Club Name",
    color: "#FF6B6B",
    captain: "Captain Name",
    vc: "VC Name",
    description: "Club description",
    image: "🔥",  // Emoji icon
    totalPoints: 450,
    sportsPoints: 280,
    culturePoints: 170
}
```

### Edit Sports

Modify the `sports` array in `js/data.js` to add/change sports and their standings.

### Edit Culture Events

Modify the `cultureEvents` array in `js/data.js` to add/change culture events and their standings.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Features Included

✅ Responsive Design (Mobile, Tablet, Desktop)
✅ Modern UI with gradients and animations
✅ All 5 clubs with details
✅ Club captains and VCs
✅ Dynamic points system
✅ Multiple sports with separate standings
✅ Multiple culture events with separate standings
✅ Leaderboards and rankings
✅ Tab switching for events
✅ Dropdown selectors for sports and culture
✅ Clean navigation
✅ Performance optimized

## No Backend Required

This is a **static website** using only HTML, CSS, and JavaScript with mock data. No server or backend is needed to run it locally.

## Future Enhancements

- Add real database integration
- User authentication
- Real-time scoring updates
- Event schedule
- Photo gallery
- PDF export for leaderboards
- API integration for live data

---

**Created for Vihaang Club Management System**
