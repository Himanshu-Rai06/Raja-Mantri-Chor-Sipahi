// ============================================================
//  RAJA MANTRI CHOR SIPAHI — script.js
//  Fixed: race conditions, role lookup, state guards,
//         mobile chit bounds, fullscreen, custom modal,
//         host-only controls, proper chit class management
// ============================================================

// --- 1. FIREBASE IMPORTS & CONFIG ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase, ref, set, onValue, update, get, child
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDp1jpgkbQhmf5CTstcJzBwVGO3UZHQ3Sw",
    authDomain: "rmcs-game.firebaseapp.com",
    databaseURL: "https://rmcs-game-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rmcs-game",
    storageBucket: "rmcs-game.firebasestorage.app",
    messagingSenderId: "520572114445",
    appId: "1:520572114445:web:c239efae854a4589202744"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// --- 2. STATE ---
let myName        = "";
let roomCode      = "";
let myPlayerIndex = -1;
let isHost        = false;   // Only index-0 player is host
let currentGameState = {};
let guessTarget   = null;    // { playerIdx, role } — pending modal

// --- 3. DOM REFS ---
const lobbyScreen = document.getElementById('lobby-screen');
const gameScreen  = document.getElementById('game-screen');
const dock        = document.getElementById('player-dock');
const tableEl     = document.getElementById('table-surface');
const logArea     = document.getElementById('log-area');
const statusDiv   = document.getElementById('game-status');
const actionBtn   = document.getElementById('main-action-btn');
const guessModal  = document.getElementById('guess-modal');
const toast       = document.getElementById('result-toast');

// ============================================================
//  4. LOBBY FUNCTIONS
// ============================================================

window.createRoom = async function () {
    const name = document.getElementById('username').value.trim();
    if (!name) { showLobbyMsg("Please enter your name!"); return; }

    myName   = name;
    roomCode = String(Math.floor(1000 + Math.random() * 9000));

    const initialData = {
        players: [{ name: myName, score: 0 }],
        state: 'WAITING',
        round: 1,
        roles: [],
        chits: []
    };

    await set(ref(db, 'rooms/' + roomCode), initialData);
    enterGame(roomCode, 0);
};

window.joinRoom = function () {
    const name = document.getElementById('username').value.trim();
    const code = document.getElementById('room-code-input').value.trim();

    if (!name) { showLobbyMsg("Please enter your name!"); return; }
    if (!code) { showLobbyMsg("Please enter a room code!"); return; }

    myName   = name;
    roomCode = code;

    get(child(ref(db), `rooms/${roomCode}`)).then((snapshot) => {
        if (!snapshot.exists()) { showLobbyMsg("Room not found! Check the code."); return; }

        const data = snapshot.val();

        // Re-joining by name (same session / refresh)
        const existingIdx = data.players
            ? data.players.findIndex(p => p.name === myName)
            : -1;

        if (existingIdx !== -1) {
            enterGame(roomCode, existingIdx);
            return;
        }

        const playerCount = data.players ? data.players.length : 0;
        if (playerCount >= 4) { showLobbyMsg("Room is full (4/4)!"); return; }

        const newIndex = playerCount;
        set(ref(db, `rooms/${roomCode}/players/${newIndex}`), {
            name: myName, score: 0
        }).then(() => enterGame(roomCode, newIndex));
    }).catch(() => showLobbyMsg("Connection error. Try again."));
};

function showLobbyMsg(msg) {
    document.getElementById('lobby-msg').textContent = msg;
}

function enterGame(code, index) {
    roomCode      = code;
    myPlayerIndex = index;
    isHost        = (index === 0);

    lobbyScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    document.getElementById('display-room-code').textContent = code;

    // Subscribe to all state changes
    onValue(ref(db, 'rooms/' + roomCode), (snapshot) => {
        const data = snapshot.val();
        if (!data) { alert("Room was deleted."); location.reload(); return; }
        
        renderGame(data);

        // CENTRALIZED HOST CHECK: Move game forward when all players have picked
        if (isHost && data.state === 'PICKING' && data.chits) {
            const playerCount = data.players ? data.players.length : 4;
            const pickedCount = data.chits.filter(c => c.pickedBy !== -1).length;

            if (pickedCount === playerCount) {
                // Instantly switch to REVEAL to prevent multiple triggers
                update(ref(db, `rooms/${roomCode}`), { state: 'REVEAL' });
                
                setTimeout(() => {
                    get(child(ref(db), `rooms/${roomCode}/state`)).then(s => {
                        if (s.val() === 'REVEAL') {
                            update(ref(db, `rooms/${roomCode}`), { state: 'GUESSING' });
                        }
                    });
                }, 2200);
            }
        }
    });
}

// ============================================================
//  5. MAIN RENDERER
// ============================================================

function renderGame(data) {
    currentGameState = data;

    const round      = data.round || 1;
    const state      = data.state || 'WAITING';
    const players    = data.players || [];
    const playerCount = players.length;

    document.getElementById('round-num').textContent = round;

    // --- Render Player Slots & Scoreboard ---
    dock.innerHTML = '';
    const scoreBody = document.getElementById('score-body');
    if (scoreBody) scoreBody.innerHTML = '';

    // Find highest score for highlight
    const maxScore = Math.max(...players.map(p => p.score || 0));

    players.forEach((p, idx) => {
        // Player slot
        const slot = document.createElement('div');
        slot.className = 'p-slot';
        slot.id        = `slot-${idx}`;
        if (idx === myPlayerIndex) slot.classList.add('me');

        const nameEl = document.createElement('span');
        nameEl.className   = 'p-name';
        nameEl.textContent = p.name;
        slot.appendChild(nameEl);
        dock.appendChild(slot);

        // Scoreboard row
        if (scoreBody) {
            const tr = document.createElement('tr');
            if ((p.score || 0) === maxScore && maxScore > 0) {
                tr.className = 'highlight-row';
            }
            tr.innerHTML = `<td>${p.name}</td><td>${p.score || 0}</td>`;
            scoreBody.appendChild(tr);
        }
    });

    // --- Render Chits ---
    renderChits(data);

    // --- Status Text & Action Button ---
    actionBtn.classList.add('hidden');
    actionBtn.onclick = window.handleActionBtn;

    switch (state) {
        case 'WAITING': {
            statusDiv.textContent = `Waiting for players… (${playerCount}/4)`;
            // Host sees Start button when ≥2 players (for testing) or exactly 4
            if (isHost && playerCount >= 2) {
                actionBtn.textContent = playerCount < 4
                    ? `Start with ${playerCount}p`
                    : "🎲 Start Game!";
                actionBtn.classList.remove('hidden');
            }
            break;
        }
        case 'PICKING': {
            const myChit = data.chits ? data.chits.find(c => c.pickedBy === myPlayerIndex) : null;
            const pickedCount = data.chits ? data.chits.filter(c => c.pickedBy !== -1).length : 0;
            const totalCount  = players.length;
            if (myChit) {
                statusDiv.textContent = `⏳ Waiting for others… (${pickedCount}/${totalCount} picked)`;
            } else {
                statusDiv.textContent = "🖐 Grab a Parchi!";
            }
            break;
        }
        case 'REVEAL': {
            statusDiv.textContent = "🎴 Revealing roles…";
            break;
        }
        case 'GUESSING': {
            if (amIMantri()) {
                statusDiv.textContent = "🕵️ Mantri: Tap a player to guess Chor!";
            } else {
                // Find who the Mantri is and show their name
                const mantriChitIdx = data.chits
                    ? data.chits.findIndex((c, i) => data.roles && data.roles[i] === 'MANTRI' && c.pickedBy !== -1)
                    : -1;
                const mantriName = mantriChitIdx !== -1 && data.players
                    ? (data.players[data.chits[mantriChitIdx].pickedBy] || {}).name || 'Mantri'
                    : 'Mantri';
                statusDiv.textContent = `🕵️ ${mantriName} is guessing…`;
            }
            break;
        }
        case 'RESULT': {
            statusDiv.textContent = round >= 10 ? "🏆 Game Over!" : "Round Over!";
            if (isHost) {
                if (round < 10) {
                    actionBtn.textContent = "Next Round →";
                    actionBtn.classList.remove('hidden');
                } else {
                    actionBtn.textContent = "New Game";
                    actionBtn.classList.remove('hidden');
                }
            }
            break;
        }
    }
}

// ============================================================
//  6. CHIT RENDERING (Fixed state management)
// ============================================================

function renderChits(data) {
    if (!data.chits || data.chits.length === 0) {
        // Clean up all existing chit elements
        document.querySelectorAll('.chit').forEach(el => el.remove());
        return;
    }

    const state = data.state || 'WAITING';
    const roles = data.roles || [];

    data.chits.forEach((chit, chitIdx) => {
        let div = document.getElementById(`chit-piece-${chitIdx}`);

        // Create element if it doesn't exist yet
        if (!div) {
            div = document.createElement('div');
            div.id        = `chit-piece-${chitIdx}`;
            div.className = 'chit';

            // Start at center for throw animation
            div.style.left = '50%';
            div.style.top  = '50%';
            tableEl.appendChild(div);
        }

        // ── CHIT IS PICKED (in someone's hand) ──
        if (chit.pickedBy !== undefined && chit.pickedBy !== -1) {
            const ownerSlot = document.getElementById(`slot-${chit.pickedBy}`);

            // Move into slot if not already there
            if (ownerSlot && div.parentElement !== ownerSlot) {
                // Clear table-positioning before reparenting
                div.style.left      = '';
                div.style.top       = '';
                div.style.transform = '';
                div.onclick         = null;

                ownerSlot.appendChild(div);
            }

            // Decide what to show
            const role       = roles[chitIdx]; // roles is indexed by chit array position
            const isMyChit   = (chit.pickedBy === myPlayerIndex);
            const isFullReveal = (state === 'RESULT');

            // Visibility rules:
            // - You always see your own role
            // - RESULT: everyone sees everything
            // - REVEAL phase: only RAJA is announced publicly (not MANTRI)
            // - GUESSING phase: only RAJA stays public; Mantri/Sipahi/Chor stay hidden
            //   (Mantri player still sees their own via isMyChit)
            const showRole =
                isMyChit                                                   ||
                isFullReveal                                               ||
                (state === 'REVEAL'   && role === 'RAJA')                  ||
                (state === 'GUESSING' && role === 'RAJA');

            if (showRole && role) {
                // Revealed state — big card inside slot
                div.className = 'chit revealed';
                div.style.left = div.style.top = div.style.transform = '';
                div.innerHTML  = chitRoleHTML(role);
            } else {
                // Folded — small corner tuck
                div.className = 'chit in-hand';
                div.style.left = div.style.top = div.style.transform = '';
                div.innerHTML  = '';
            }

            div.onclick = null;
        }
        // ── CHIT IS ON TABLE ──
        else {
            // Move back to table if it was in a slot before
            if (div.parentElement !== tableEl) {
                tableEl.appendChild(div);
            }

            // Clear in-hand/revealed classes
            div.className = 'chit';
            div.innerHTML = '<div class="chit-back"></div>';

            // Position (CSS transition will animate to this)
            requestAnimationFrame(() => {
                div.style.left      = chit.x + '%';
                div.style.top       = chit.y + '%';
                div.style.transform = `translate(-50%, -50%) rotate(${chit.rot}deg)`;
            });

            // Click to pick
            div.onclick = () => {
                if (state === 'PICKING') attemptPick(chitIdx);
            };
        }
    });

    // ── GUESSING: Make other players' slots tappable for Mantri ──
    clearSlotGuessHandlers();
    if (state === 'GUESSING' && amIMantri()) {
        data.players.forEach((p, idx) => {
            if (idx === myPlayerIndex) return; // Can't guess yourself

            const slot = document.getElementById(`slot-${idx}`);
            if (!slot) return;

            // Find what chit this player holds
            const heldChitIdx = data.chits.findIndex(c => c.pickedBy === idx);
            if (heldChitIdx === -1) return;

            const playerRole = roles[heldChitIdx];

            // Mantri should only guess between unknown players (not RAJA — already revealed)
            if (playerRole === 'RAJA') return;

            slot.classList.add('mantri-can-pick');
            slot.style.cursor = 'pointer';
            slot.onclick = () => openGuessModal(idx, p.name, playerRole);
        });
    }
}

function clearSlotGuessHandlers() {
    document.querySelectorAll('.p-slot').forEach(s => {
        s.classList.remove('mantri-can-pick');
        s.style.cursor = 'default';
        s.onclick      = null;
    });
}

function chitRoleHTML(role) {
    const info = {
        RAJA:   { emoji: '👑', pts: '1000 pts', color: '#b7950b' },
        MANTRI: { emoji: '🎖️', pts: '800 pts',  color: '#1a5276' },
        CHOR:   { emoji: '🦹', pts: '0 pts',    color: '#922b21' },
        SIPAHI: { emoji: '🛡️', pts: '500 pts',  color: '#1e8449' }
    };
    const r = info[role] || { emoji: '?', pts: '', color: '#333' };
    return `<div class="chit-role">
        <span class="role-emoji">${r.emoji}</span>
        <span class="role-name" style="color:${r.color}">${getHindi(role)}</span>
        <span class="role-pts">${r.pts}</span>
    </div>`;
}

// ============================================================
//  7. GAME ACTIONS
// ============================================================

window.handleActionBtn = function () {
    if (!isHost) return; // Guard: only host

    const state = currentGameState.state;
    if (state === 'WAITING' || state === 'RESULT') {
        if ((currentGameState.round || 1) >= 10 && state === 'RESULT') {
            resetGame();
        } else {
            startRound();
        }
    }
};

function startRound() {
    const playerCount = currentGameState.players
        ? currentGameState.players.length
        : 4;

    // Build role set based on player count
    const allRoles = ['RAJA', 'MANTRI', 'CHOR', 'SIPAHI'];
    const gameRoles = shuffle(allRoles.slice(0, playerCount));

    // Scatter chits on the table
    // Keep chits within safe bounds: 20%–80% so they don't hide under dock/bar
    const scatteredChits = gameRoles.map((_, id) => ({
        id,
        x:   Math.floor(20 + Math.random() * 60),
        y:   Math.floor(20 + Math.random() * 55), // 55 gives room above dock
        rot: Math.floor(Math.random() * 360),
        pickedBy: -1
    }));

    // Determine current round (stays same if starting fresh or carries on)
    const currentRound = currentGameState.state === 'RESULT'
        ? (currentGameState.round || 1)   // already incremented at end of last round
        : (currentGameState.round || 1);

    update(ref(db, `rooms/${roomCode}`), {
        state:  'PICKING',
        roles:  gameRoles,
        chits:  scatteredChits,
        round:  currentRound
    });
}

function resetGame() {
    // Reset scores and start fresh
    const updates = {};
    if (currentGameState.players) {
        currentGameState.players.forEach((_, idx) => {
            updates[`rooms/${roomCode}/players/${idx}/score`] = 0;
        });
    }
    updates[`rooms/${roomCode}/round`] = 1;
    updates[`rooms/${roomCode}/state`] = 'WAITING';
    updates[`rooms/${roomCode}/chits`] = [];
    updates[`rooms/${roomCode}/roles`] = [];
    update(ref(db), updates);
}

// ── PICKING ──

function attemptPick(chitIdx) {
    // Guard: already have a chit
    if (currentGameState.chits.some(c => c.pickedBy === myPlayerIndex)) return;
    // Guard: wrong state
    if (currentGameState.state !== 'PICKING') return;

    // Optimistic lock: read fresh value before writing
    get(child(ref(db), `rooms/${roomCode}/chits/${chitIdx}`)).then((snap) => {
        const chit = snap.val();
        if (!chit) return;
        if (chit.pickedBy !== -1) return; // Already taken

        // Mark as mine — then every client tries checkAllPicked (host guards the write)
        set(ref(db, `rooms/${roomCode}/chits/${chitIdx}/pickedBy`), myPlayerIndex);
    });
}

function checkAllPicked() {
    // Small delay to let Firebase propagate
    setTimeout(() => {
        // Read the fresh state and chits from DB to avoid stale local cache
        get(child(ref(db), `rooms/${roomCode}`)).then((snapshot) => {
            const room = snapshot.val();
            if (!room) return;

            // Only the host drives state transitions to avoid race conditions
            // But every client checks so the host's check definitely fires
            if (!isHost) return;
            if (room.state !== 'PICKING') return;

            const chits = room.chits;
            if (!chits || !Array.isArray(chits)) return;

            const playerCount = room.players ? room.players.length : 4;
            const pickedCount = chits.filter(c => c.pickedBy !== -1).length;

            if (pickedCount < playerCount) return; // Not all picked yet

            // All picked → REVEAL for 2 seconds, then GUESSING
            update(ref(db, `rooms/${roomCode}`), { state: 'REVEAL' });
            setTimeout(() => {
                // Double-check we're still in REVEAL (guard against double-trigger)
                get(child(ref(db), `rooms/${roomCode}/state`)).then(s => {
                    if (s.val() === 'REVEAL') {
                        update(ref(db, `rooms/${roomCode}`), { state: 'GUESSING' });
                    }
                });
            }, 2200);
        });
    }, 400);
}

// ── GUESSING ──

function openGuessModal(targetPlayerIdx, targetName, targetRole) {
    guessTarget = { playerIdx: targetPlayerIdx, role: targetRole };
    document.getElementById('modal-target-name').textContent = targetName;
    guessModal.classList.remove('hidden');

    document.getElementById('modal-yes-btn').onclick = () => {
        if (guessTarget) {
            makeGuess(guessTarget.playerIdx, guessTarget.role);
        }
        closeGuessModal();
    };
}

window.closeGuessModal = function () {
    guessModal.classList.add('hidden');
    guessTarget = null;
};

function makeGuess(targetPlayerIdx, targetRole) {
    if (currentGameState.state !== 'GUESSING') return; // Guard
    if (!amIMantri()) return;                           // Guard

    const isCorrect = (targetRole === 'CHOR');
    const resultMsg = isCorrect
        ? "✅ Mantri caught the Chor! +800"
        : "❌ Wrong! Mantri arrested the Sipahi.";

    log(resultMsg);
    showToast(resultMsg, isCorrect ? 'toast-win' : 'toast-lose');

    // Build score updates
    const updates = {};

    currentGameState.players.forEach((p, idx) => {
        // Find which chit this player holds (by array index, not chit.id)
        const heldChitIdx = currentGameState.chits.findIndex(c => c.pickedBy === idx);
        if (heldChitIdx === -1) return;

        const role = currentGameState.roles[heldChitIdx];
        let points = 0;

        if (role === 'RAJA')   points = 1000;
        if (role === 'SIPAHI') points = 500;
        if (role === 'MANTRI') points = isCorrect ? 800 : 0;
        if (role === 'CHOR')   points = isCorrect ? 0   : 800;

        updates[`rooms/${roomCode}/players/${idx}/score`] = (p.score || 0) + points;
    });

    const nextRound = (currentGameState.round || 1) + 1;
    updates[`rooms/${roomCode}/state`] = 'RESULT';
    updates[`rooms/${roomCode}/round`] = nextRound;

    update(ref(db), updates);
}

// ============================================================
//  8. HELPERS
// ============================================================

/** Is the current player holding the MANTRI chit right now? */
function amIMantri() {
    if (!currentGameState.chits || !currentGameState.roles) return false;
    const heldChitIdx = currentGameState.chits.findIndex(c => c.pickedBy === myPlayerIndex);
    if (heldChitIdx === -1) return false;
    return currentGameState.roles[heldChitIdx] === 'MANTRI';
}

/** Fallback: is there a MANTRI player at all (not necessarily me) */
function amIMantriPlayer(data) {
    if (!data.chits || !data.roles) return false;
    const idx = data.chits.findIndex(c => c.pickedBy === myPlayerIndex);
    if (idx === -1) return false;
    return data.roles[idx] === 'MANTRI';
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getHindi(role) {
    return { RAJA: 'Raja', MANTRI: 'Mantri', CHOR: 'Chor', SIPAHI: 'Sipahi' }[role] || role;
}

function log(msg) {
    if (!logArea) return;
    const div = document.createElement('div');
    div.className   = 'log-entry';
    div.textContent = msg;
    logArea.prepend(div);
}

let toastTimer = null;
function showToast(msg, cls = '') {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.className   = `toast ${cls}`;
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

// ============================================================
//  9. FULLSCREEN
// ============================================================

window.toggleFullscreen = function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
};

document.addEventListener('fullscreenchange', () => {
    const btn   = document.getElementById('fullscreen-btn');
    const panel = document.getElementById('scoreboard-panel');
    const isMobile = window.innerWidth <= 700;

    if (document.fullscreenElement) {
        // Entered fullscreen
        if (btn) btn.textContent = '⛶';
        if (isMobile && panel) {
            // On mobile fullscreen: keep panel in its current slide state, don't force-show
            panel.classList.add('fullscreen-mobile');
        }
    } else {
        // Exited fullscreen
        if (btn) btn.textContent = '⛶';
        if (panel) {
            panel.classList.remove('fullscreen-mobile');
        }
    }
});

// ============================================================
//  10. MOBILE SCOREBOARD TOGGLE
// ============================================================

window.toggleScoreboard = function () {
    const panel = document.getElementById('scoreboard-panel');
    if (!panel) return;
    const isOpen = panel.classList.contains('active');
    if (isOpen) {
        panel.classList.remove('active');
    } else {
        panel.classList.add('active');
    }
};

// Close scoreboard when tapping the dimmed overlay area (mobile)
document.getElementById('scoreboard-panel')?.addEventListener('click', (e) => {
    // Only close if the user tapped the panel background itself, not inner content
    if (e.target === e.currentTarget) {
        const panel = document.getElementById('scoreboard-panel');
        if (panel) panel.classList.remove('active');
    }
});
