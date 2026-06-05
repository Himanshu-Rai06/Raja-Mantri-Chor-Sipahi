/* =========================================
   ROOT VARIABLES
   ========================================= */
:root {
    --bg-wood: #7a5c4e;
    --wood-dark: #4e342e;
    --wood-light: #9c7b6e;
    --paper: #fffef0;
    --paper-aged: #f5f0d8;
    --paper-line: #c4bfa0;
    --ink: #2c3e50;
    --ink-light: #546e7a;
    --accent-red: #c0392b;
    --accent-green: #27ae60;
    --accent-gold: #f1c40f;
    --accent-blue: #2980b9;
    --shadow-deep: rgba(0,0,0,0.5);
    --shadow-light: rgba(0,0,0,0.2);

    --wood-gradient: linear-gradient(160deg, #9c7b6e 0%, #7a5c4e 40%, #4e342e 100%);
    --paper-lines: repeating-linear-gradient(
        transparent, transparent 27px, var(--paper-line) 28px
    );
    --wood-grain: repeating-linear-gradient(
        87deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.03) 2px,
        rgba(0,0,0,0.03) 4px
    );
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
    height: 100%;
    overflow: hidden;
}

body {
    font-family: 'Indie Flower', cursive;
    background: #1a1a1a;
    color: var(--ink);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
}

.hidden { display: none !important; }

/* =========================================
   1. LOBBY SCREEN
   ========================================= */
#lobby-screen {
    position: fixed;
    inset: 0;
    background: var(--wood-gradient);
    background-image: var(--wood-gradient), var(--wood-grain);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.center-box {
    width: 100%;
    max-width: 380px;
    background: var(--paper);
    background-image: var(--paper-lines);
    padding: 36px 32px 28px;
    box-shadow: 
        0 20px 60px rgba(0,0,0,0.6),
        4px 4px 0 #d4c9a0,
        inset 0 0 0 1px rgba(0,0,0,0.05);
    transform: rotate(-1.2deg);
    border-radius: 2px;
    position: relative;
}

/* Red margin line */
.center-box::before {
    content: '';
    position: absolute;
    left: 52px;
    top: 0; bottom: 0;
    width: 2px;
    background: rgba(220, 60, 60, 0.35);
}

.center-box h1 {
    font-family: 'Caveat', cursive;
    font-size: 3rem;
    color: var(--accent-red);
    text-align: center;
    line-height: 1;
    text-decoration: underline wavy var(--accent-red);
    margin-bottom: 2px;
}

.subtitle {
    text-align: center;
    color: var(--ink-light);
    font-size: 1rem;
    margin-bottom: 20px;
    letter-spacing: 2px;
}

.center-box input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px 12px;
    font-family: 'Indie Flower', cursive;
    font-size: 1.15rem;
    background: transparent;
    border: none;
    border-bottom: 2px dashed var(--ink);
    text-align: center;
    outline: none;
    color: var(--ink);
    transition: border-color 0.2s;
}
.center-box input:focus {
    border-bottom-color: var(--accent-red);
}

.btn-ink {
    display: block;
    width: 100%;
    margin-top: 12px;
    padding: 12px;
    background: var(--ink);
    color: #fff;
    border: none;
    font-family: 'Indie Flower', cursive;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 3px;
    transition: transform 0.1s, box-shadow 0.1s;
    box-shadow: 0 4px 0 #1a252f;
    position: relative;
}
.btn-ink:hover { transform: translateY(-1px); box-shadow: 0 6px 0 #1a252f; }
.btn-ink:active { transform: translateY(2px); box-shadow: 0 2px 0 #1a252f; }

.btn-ink.secondary {
    background: transparent;
    color: var(--ink);
    border: 2px dashed var(--ink);
    box-shadow: none;
    flex: 1;
    margin-top: 0;
}
.btn-ink.secondary:hover { background: rgba(0,0,0,0.05); }

.divider {
    text-align: center;
    color: var(--ink-light);
    font-size: 0.9rem;
    margin: 12px 0 4px;
    position: relative;
}
.divider::before, .divider::after {
    content: '';
    position: absolute;
    top: 50%; width: 40%;
    height: 1px;
    background: var(--paper-line);
}
.divider::before { left: 0; }
.divider::after { right: 0; }

.join-group {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
}
.join-group input {
    flex: 1;
    margin: 0;
    letter-spacing: 3px;
    font-size: 1.1rem;
}

#lobby-msg {
    text-align: center;
    color: var(--accent-red);
    font-size: 0.9rem;
    min-height: 20px;
    margin-top: 10px;
}

/* =========================================
   2. GAME SCREEN LAYOUT
   ========================================= */
#game-screen {
    display: flex;
    width: 100%;
    height: 100%;
    height: 100dvh; /* Dynamic viewport for mobile */
    overflow: hidden;
}

.game-area {
    flex: 3;
    background: var(--wood-gradient);
    background-image: var(--wood-gradient), var(--wood-grain);
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: inset -5px 0 20px rgba(0,0,0,0.4);
    z-index: 1;
    min-width: 0;
}

.scoreboard-area {
    flex: 0 0 300px;
    background: #e8e0c8;
    position: relative;
    z-index: 2;
    box-shadow: -5px 0 15px rgba(0,0,0,0.25);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

/* =========================================
   3. TOP BAR
   ========================================= */
.top-bar {
    padding: 10px 16px;
    background: rgba(0,0,0,0.25);
    backdrop-filter: blur(4px);
    color: rgba(255,255,255,0.92);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    z-index: 10;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}

.room-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 4px 12px;
    border-radius: 20px;
    white-space: nowrap;
}
.room-label { font-size: 0.8rem; opacity: 0.7; }
.room-code {
    font-family: 'Patrick Hand', cursive;
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 2px;
    color: var(--accent-gold);
}

.status-text {
    font-size: 1rem;
    text-align: center;
    flex: 1;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    font-family: 'Patrick Hand', cursive;
}

.top-bar-actions {
    display: flex;
    align-items: center;
    gap: 6px;
}

.icon-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.1s;
    flex-shrink: 0;
}
.icon-btn:hover { background: rgba(255,255,255,0.25); }
.icon-btn:active { transform: scale(0.92); }

/* =========================================
   4. TABLE SURFACE
   ========================================= */
#table-surface {
    flex: 1;
    position: relative;
    width: 100%;
    overflow: hidden;
    min-height: 0;
}

/* Wood ring on table */
#table-surface::before {
    content: '';
    position: absolute;
    width: 160px; height: 160px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.06);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

/* =========================================
   5. MAIN ACTION BUTTON
   ========================================= */
.btn-action {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
    padding: 16px 44px;
    font-family: 'Caveat', cursive;
    font-size: 1.6rem;
    font-weight: 600;
    background: var(--ink);
    color: #fff;
    border: 3px solid rgba(255,255,255,0.8);
    box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 2px 0 #1a252f;
    border-radius: 50px;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: pulse-btn 2s ease-in-out infinite;
}
.btn-action:hover {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 12px 35px rgba(0,0,0,0.7), 0 2px 0 #1a252f;
    animation: none;
}
.btn-action:active { transform: translate(-50%, -50%) scale(0.97); }

@keyframes pulse-btn {
    0%, 100% { box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 2px 0 #1a252f; }
    50% { box-shadow: 0 8px 40px rgba(241,196,15,0.4), 0 2px 0 #1a252f; }
}

/* =========================================
   6. PLAYER DOCK
   ========================================= */
.player-dock {
    height: 120px;
    background: rgba(0,0,0,0.35);
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
    padding: 10px 12px;
    border-top: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
    overflow-x: auto;
    overflow-y: visible;
}

.p-slot {
    flex: 0 0 auto;
    width: 90px;
    height: 90px;
    position: relative;
    border: 2px dashed rgba(255,255,255,0.25);
    border-radius: 12px;
    background: rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    overflow: visible; /* Allow chit corner poke out */
}

.p-name {
    position: relative;
    z-index: 10;
    font-family: 'Patrick Hand', cursive;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.9);
    text-align: center;
    font-weight: bold;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    background: rgba(0,0,0,0.35);
    padding: 2px 8px;
    border-radius: 10px;
    pointer-events: none;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-slot.active {
    border-color: var(--accent-gold);
    border-style: solid;
    box-shadow: 0 0 20px rgba(241,196,15,0.5), inset 0 0 15px rgba(241,196,15,0.1);
    background: rgba(241,196,15,0.15);
    animation: slot-pulse 1.5s ease-in-out infinite;
}

.p-slot.me {
    border-style: solid;
    border-color: var(--accent-green);
    background: rgba(39,174,96,0.15);
    box-shadow: 0 0 12px rgba(39,174,96,0.3);
}

.p-slot.mantri-can-pick {
    cursor: pointer;
    border-color: var(--accent-red);
    border-style: solid;
    box-shadow: 0 0 18px rgba(192,57,43,0.5);
    animation: slot-pulse-red 1.2s ease-in-out infinite;
}

@keyframes slot-pulse {
    0%, 100% { box-shadow: 0 0 12px rgba(241,196,15,0.4); }
    50% { box-shadow: 0 0 25px rgba(241,196,15,0.8); }
}
@keyframes slot-pulse-red {
    0%, 100% { box-shadow: 0 0 12px rgba(192,57,43,0.4); }
    50% { box-shadow: 0 0 25px rgba(192,57,43,0.8); }
}

/* =========================================
   7. CHITS
   ========================================= */
.chit {
    position: absolute;
    z-index: 50;
    cursor: pointer;
    transform: translate(-50%, -50%);
    transition: 
        left 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
        top 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
        transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
        width 0.3s ease,
        height 0.3s ease,
        box-shadow 0.2s ease;

    width: 62px;
    height: 62px;
    background: linear-gradient(135deg, #fffef5 0%, #f5f0e0 100%);
    border: 1px solid #ddd5b0;
    border-radius: 3px;
    box-shadow: 3px 4px 8px rgba(0,0,0,0.35), 1px 1px 0 rgba(255,255,255,0.5) inset;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Patrick Hand', cursive;
    font-weight: bold;
    color: var(--ink);
    overflow: hidden;
}

/* Folded corner */
.chit::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 0 16px 16px;
    border-color: transparent transparent #c8b880 transparent;
    pointer-events: none;
}

/* Hover (on table, not in-hand) */
.chit:not(.in-hand):not(.open):hover {
    transform: translate(-50%, -50%) scale(1.12);
    box-shadow: 5px 6px 14px rgba(0,0,0,0.45);
    z-index: 60;
}

/* --- STATE: IN HAND (corner tuck) --- */
.chit.in-hand {
    /* Absolute within the slot */
    position: absolute !important;
    top: -8px !important;
    right: -8px !important;
    left: auto !important;
    bottom: auto !important;

    width: 36px !important;
    height: 36px !important;
    transform: rotate(12deg) !important;

    box-shadow: 2px 2px 5px rgba(0,0,0,0.25) !important;
    z-index: 5 !important;
    cursor: default;
    pointer-events: none;
    transition: width 0.3s ease, height 0.3s ease, transform 0.3s ease !important;
}
.chit.in-hand::after {
    border-width: 0 0 10px 10px;
}

/* --- STATE: REVEALED (big card in slot) --- */
.chit.revealed {
    /* Filled inside the slot */
    position: absolute !important;
    top: 5px !important;
    left: 5px !important;
    right: 5px !important;
    bottom: 5px !important;
    width: auto !important;
    height: auto !important;

    transform: rotate(0deg) !important;
    background: var(--paper) !important;
    background-image: var(--paper-lines) !important;
    border: 2px solid var(--ink) !important;
    z-index: 20 !important;
    cursor: default;
    animation: revealPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.chit.revealed::after { display: none; }

@keyframes revealPop {
    0% { opacity: 0; transform: rotate(15deg) scale(0.5) !important; }
    100% { opacity: 1; transform: rotate(0deg) scale(1) !important; }
}

/* Chit role text */
.chit-role {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 2px;
}
.chit-role .role-name {
    font-family: 'Caveat', cursive;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent-red);
    text-transform: uppercase;
    line-height: 1;
}
.chit-role .role-emoji {
    font-size: 1.4rem;
    line-height: 1;
}
.chit-role .role-pts {
    font-size: 0.65rem;
    color: var(--ink-light);
    font-family: 'Indie Flower', cursive;
}

/* Chit folded (face down) lines — pencil sketch feel */
.chit-back {
    width: 70%;
    height: 2px;
    background: rgba(0,0,0,0.1);
    border-radius: 2px;
    box-shadow: 0 8px 0 rgba(0,0,0,0.08), 0 16px 0 rgba(0,0,0,0.06);
}

/* =========================================
   8. SCOREBOARD
   ========================================= */
.notebook-paper {
    background: var(--paper-aged);
    background-image: var(--paper-lines);
    padding: 20px 18px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-left: 4px solid #e05035;
    position: relative;
    overflow-y: auto;
}

/* Red margin left-line inside */
.notebook-paper::before {
    content: '';
    position: absolute;
    left: 44px;
    top: 0; bottom: 0;
    width: 1px;
    background: rgba(220,80,60,0.2);
    pointer-events: none;
}

.notebook-paper h3 {
    font-family: 'Caveat', cursive;
    font-size: 1.6rem;
    text-align: center;
    margin-bottom: 4px;
    color: var(--accent-red);
    text-decoration: underline wavy;
}

.round-indicator {
    text-align: center;
    font-size: 0.9rem;
    color: var(--ink-light);
    margin-bottom: 14px;
    font-family: 'Patrick Hand', cursive;
}

table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
td, th {
    padding: 7px 8px;
    border-bottom: 1px solid var(--paper-line);
    text-align: left;
    font-family: 'Patrick Hand', cursive;
    font-size: 0.95rem;
}
td:last-child, th:last-child { text-align: right; }
th {
    border-bottom: 2px solid var(--ink);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--ink-light);
}
tr.highlight-row td { color: var(--accent-red); font-weight: bold; }

#log-area {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px dashed var(--paper-line);
    font-size: 0.85rem;
    color: var(--ink-light);
    font-family: 'Patrick Hand', cursive;
    max-height: 160px;
    overflow-y: auto;
}
.log-entry { padding: 3px 0; }
.log-entry::before { content: '> '; color: var(--accent-red); }

/* =========================================
   9. MODALS
   ========================================= */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(3px);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
}

.modal-paper {
    background: var(--paper);
    background-image: var(--paper-lines);
    padding: 32px 28px;
    max-width: 340px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 4px 4px 0 #d4c9a0;
    transform: rotate(-1deg);
    border-radius: 2px;
    text-align: center;
    border-left: 4px solid var(--accent-red);
}

.modal-prompt {
    font-size: 0.9rem;
    color: var(--ink-light);
    margin-bottom: 8px;
}

.modal-question {
    font-family: 'Caveat', cursive;
    font-size: 1.6rem;
    color: var(--ink);
    margin-bottom: 24px;
    line-height: 1.3;
}
.modal-question strong { color: var(--accent-red); }

.modal-actions {
    display: flex;
    gap: 12px;
}

.btn-modal {
    flex: 1;
    padding: 12px;
    font-family: 'Indie Flower', cursive;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: transform 0.1s, box-shadow 0.1s;
    box-shadow: 0 3px 0 rgba(0,0,0,0.3);
}
.btn-modal:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(0,0,0,0.3); }

.btn-yes {
    background: var(--accent-green);
    color: white;
    border: 2px solid #1e8449;
}
.btn-no {
    background: #f0f0f0;
    color: var(--ink);
    border: 2px solid #ccc;
}

/* =========================================
   10. TOAST
   ========================================= */
.toast {
    position: fixed;
    bottom: 140px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--ink);
    color: white;
    font-family: 'Patrick Hand', cursive;
    font-size: 1.1rem;
    padding: 12px 24px;
    border-radius: 30px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    z-index: 2000;
    white-space: nowrap;
    animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast.toast-win { background: var(--accent-green); }
.toast.toast-lose { background: var(--accent-red); }

@keyframes toastIn {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to   { transform: translateX(-50%) translateY(0); opacity: 1; }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* =========================================
   11. CLOSE BUTTON (Scoreboard mobile)
   ========================================= */
.close-btn {
    position: absolute;
    top: 14px; right: 14px;
    width: 38px; height: 38px;
    border-radius: 50%;
    border: 2px solid var(--accent-red);
    background: transparent;
    color: var(--accent-red);
    font-size: 1.2rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Indie Flower', cursive;
    z-index: 10;
}

/* =========================================
   12. MOBILE RESPONSIVE
   ========================================= */
.hidden-desktop { display: none; }

@media (max-width: 700px) {
    .hidden-desktop { display: flex !important; }

    #game-screen { flex-direction: column; }

    .game-area {
        width: 100%;
        flex: 1;
        min-height: 0;
    }

    /* Scoreboard becomes full-screen slide-up overlay */
    .scoreboard-area {
        position: fixed;
        inset: 0;
        z-index: 2000;
        /* Hidden below screen — transition animates it up */
        transform: translateY(105%);
        box-shadow: none;
        flex: none;
        width: 100%;
        /* Backdrop effect when opening */
        transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .scoreboard-area.active {
        transform: translateY(0);
        box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
    }
    .notebook-paper {
        border-left: none;
        border-top: 5px solid var(--accent-red);
        padding-top: 56px;
    }
    .notebook-paper::before { display: none; }

    /* Chit sizes on mobile */
    .chit { width: 52px; height: 52px; }
    .chit.in-hand { width: 30px !important; height: 30px !important; }

    /* Dock */
    .player-dock { height: 110px; gap: 6px; padding: 8px; }
    .p-slot { width: 78px; height: 84px; }
    .p-name { font-size: 0.82rem; }

    /* Toast above dock */
    .toast { bottom: 125px; font-size: 0.95rem; }

    /* Log hidden on mobile (space saver) */
    #log-area { display: none; }

    /* Modal */
    .modal-paper { transform: none; }
}

/* Fullscreen tweaks — on desktop fullscreen the sidebar stays as-is.
   On mobile fullscreen we do NOT force the scoreboard open; it keeps
   its slide-up state (controlled by .active class via JS). */
:fullscreen .game-area,
:-webkit-full-screen .game-area {
    height: 100vh;
}
:fullscreen #game-screen,
:-webkit-full-screen #game-screen {
    height: 100vh;
}
/* Desktop fullscreen: scoreboard sidebar stays visible normally */
@media (min-width: 701px) {
    :fullscreen .scoreboard-area,
    :-webkit-full-screen .scoreboard-area {
        position: relative;
        transform: none !important;
        flex: 0 0 300px;
    }
}
