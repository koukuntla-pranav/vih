const fs = require('fs');
let s = fs.readFileSync('css/style.css', 'utf8');

// The string was appended in UTF-16LE, creating null bytes ' ' between chars.
// We remove the null bytes first.
s = s.replace(/\x00/g, '');

// Now we find the place where the old valid CSS ended and our new stuff began (around line 1354).
// Looking for the string "COUNTDOWN TIMER" that we appended.
const markerIndex = s.indexOf('COUNTDOWN TIMER');
if (markerIndex !== -1) {
    // Find the last actual CSS brace before this.
    const lastBrace = s.lastIndexOf('}', markerIndex);
    if (lastBrace !== -1) {
        s = s.substring(0, lastBrace + 1) + '\n\n';
    }
}

const newCss = `/* ============================================
   COUNTDOWN TIMER 
   ============================================ */
.countdown-section {
    padding: 80px 0;
    text-align: center;
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
}

.countdown-section h2 {
    font-size: 2.8rem;
    margin-bottom: 3rem;
    background: linear-gradient(135deg, #FF6B6B 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
}

.countdown-timer {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.time-box {
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
    min-width: 140px;
    padding: 2rem 1.5rem;
    border-radius: 16px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 5px solid #FF6B6B;
    border-bottom: 5px solid #4ECDC4;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.time-box:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1);
}

.time-box:nth-child(1) { border-top-color: #FF6B6B; border-bottom-color: #FF8E8B; }
.time-box:nth-child(2) { border-top-color: #FFA500; border-bottom-color: #FFC04D; }
.time-box:nth-child(3) { border-top-color: #4ECDC4; border-bottom-color: #7AEOEB; }
.time-box:nth-child(4) { border-top-color: #667eea; border-bottom-color: #764ba2; }

.time-value {
    font-size: 4rem;
    font-weight: 900;
    color: #2d3436;
    line-height: 1;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
}

.time-label {
    font-size: 1.1rem;
    color: #636e72;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-top: 1rem;
    font-weight: 700;
}

/* ============================================
   MEDIA SECTION (YOUTUBE/MAPS)
   ============================================ */
.media-section {
    padding: 80px 0;
    background: white;
}

.media-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
}

.media-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
}

.media-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.12);
}

.media-card h3 {
    padding: 1.5rem;
    text-align: center;
    background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
    margin: 0;
    font-size: 1.5rem;
    color: #2d3436;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.video-container,
.map-container {
    padding: 1.5rem;
    background: #fafafa;
}

.video-container iframe,
.map-container iframe {
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

@media (max-width: 768px) {
    .media-grid {
        grid-template-columns: 1fr;
    }
    .countdown-timer {
        gap: 1rem;
    }
    .time-box {
        min-width: 100px;
        padding: 1.5rem 1rem;
    }
    .time-value {
        font-size: 2.5rem;
    }
    .time-label {
        font-size: 0.9rem;
        letter-spacing: 1px;
    }
}
`;

fs.writeFileSync('css/style.css', s + newCss);
