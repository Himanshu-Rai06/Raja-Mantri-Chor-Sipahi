// --- 1. IMPORTS & CONFIG ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
    getDatabase, ref, set, onValue, update, get, child, remove
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDp1jpgkbQhmf5CTstcJzBwVGO3UZHQ3Sw",
    authDomain: "rmcs-game.firebaseapp.com",
    databaseURL: "https://rmcs-game-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rmcs-game",
    storageBucket: "rmcs-game.firebasestorage.app",
    messagingSenderId: "520572114445",
    appId: "1:520572114445:web:c239efae854a4589202744",
    measurementId: "G-P0Q8M9DZNE"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- 2. STATE MANAGEMENT ---
let myName = "";
let roomCode = "";
let myPlayerIndex = -1;
let currentGameState = {};

// DOM Elements
const screens = { lobby: document.getElementById('lobby-screen'), game: document.getElementById('game-screen') };
const dock = document.getElementById('player-dock');
const table = document.getElementById('table-surface');
const logArea = document.getElementById('log-area');

// --- 3. LOBBY FUNCTIONS ---

window.createRoom = async function() {
    myName = document.getElementById('username').value.trim() || "Host";
    roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    const initialData = {
        players: [{ name: myName, score: 0, id: 0 }],
        state: 'WAITING',
        round: 1,
        roles: [],
        chits: [] 
    };

    await set(ref(db, 'rooms/' + roomCode), initialData);
    enterGame(roomCode, 0);
};

window.joinRoom = function() {
    myName = document.getElementById('username').value.trim() || "Player";
    roomCode = document.getElementById('room-code-input').value.trim();
    
    if(!roomCode) { alert("Enter a room code!"); return; }

    get(child(ref(db), `rooms/${roomCode}`)).then((snapshot) => {
        if (!snapshot.exists()) { alert("Room not found!"); return; }
        const data = snapshot.val();
        
        // Check if I am re-joining (already exist)
        const existingIdx = data.players ? data.players.findIndex(p => p.name === myName) : -1;
        
        if (existingIdx !== -1) {
             enterGame(roomCode, existingIdx);
             return;
         }

        if (data.players && data.players.length >= 4) { alert("Room is Full!"); return; }
        
        const newIndex = data.players ? data.players.length : 0;
        
        set(ref(db, `rooms/${roomCode}/players/${newIndex}`), {
            name: myName, score: 0, id: newIndex
        });
        enterGame(roomCode, newIndex);
    });
};

function enterGame(code, index) {
    roomCode = code;
    myPlayerIndex = index;
    
    screens.lobby.classList.add('hidden');
    screens.game.classList.remove('hidden');
    document.getElementById('display-room-code').innerText = code;

    onValue(ref(db, 'rooms/' + roomCode), (snapshot) => {
        const data = snapshot.val();
        if (data) renderGame(data);
        else { alert("Room deleted."); location.reload(); }
    });
}

// --- 4. GAME RENDERER (Visuals) ---

function renderGame(data) {
    currentGameState = data;
    
    // Status & Header
    const statusDiv = document.getElementById('game-status');
    const actionBtn = document.getElementById('main-action-btn');
    document.getElementById('round-num').innerText = data.round || 1;

    // --- RENDER PLAYERS ---
    dock.innerHTML = '';
    const scoreBody = document.getElementById('score-body');
    if(scoreBody) scoreBody.innerHTML = '';
    
    if(data.players) {
        data.players.forEach((p, idx) => {
            // Create Player Slot
            const slot = document.createElement('div');
            slot.className = `p-slot ${idx === myPlayerIndex ? 'me' : ''}`;
            slot.id = `slot-${idx}`; 
            
            // Player Name - Force high Z-index to sit on top of chits
            slot.innerHTML = `<span class="p-name" style="position: relative; z-index: 100;">${p.name}</span>`;
            
            // Highlight Mantri during guessing
            if(data.state === 'GUESSING' && isMantri(idx)) {
                slot.classList.add('active'); 
            }
            dock.appendChild(slot);

            // Update Scoreboard Table
            if(scoreBody) {
                scoreBody.innerHTML += `<tr><td>${p.name}</td><td>${p.score}</td></tr>`;
            }
        });
    }

    // --- RENDER CHITS ---
    renderChits(data);

    // --- GAME FLOW / BUTTON VISIBILITY ---
    actionBtn.classList.add('hidden'); 
    actionBtn.onclick = handleActionBtn; 

    if (data.state === 'WAITING') {
        const count = data.players ? data.players.length : 1;
        statusDiv.innerText = `Waiting for players... (${count}/4)`;
        
        if (count === 4) { 
            actionBtn.innerText = "Start Game";
            actionBtn.classList.remove('hidden');
        }
    } 
    else if (data.state === 'PICKING') {
        const myChit = data.chits ? data.chits.find(c => c.pickedBy === myPlayerIndex) : null;
        if (myChit) statusDiv.innerText = "Waiting for others...";
        else statusDiv.innerText = "Grab a Chit!";
    }
    else if (data.state === 'REVEAL') {
        statusDiv.innerText = "Revealing Roles...";
    }
    else if (data.state === 'GUESSING') {
        statusDiv.innerText = isMantri(myPlayerIndex) ? "You are Mantri! Find the Chor!" : "Mantri is guessing...";
    }
    else if (data.state === 'RESULT') {
        statusDiv.innerText = "Round Over!";
        
        if ((data.round || 1) < 10) {
            actionBtn.innerText = "Next Round";
            actionBtn.classList.remove('hidden');
        } else {
            statusDiv.innerText = "Game Over!";
        }
    }
}

// --- 5. CHIT PHYSICS & ANIMATION (THE FIX) ---

function renderChits(data) {
    if (!data.chits) {
        table.innerHTML = ''; 
        return;
    }

    data.chits.forEach((chit, chitIdx) => {
        let div = document.getElementById(`chit-piece-${chitIdx}`);

        // Create if missing
        if (!div) {
            div = document.createElement('div');
            div.id = `chit-piece-${chitIdx}`;
            div.className = 'chit';
            // Start at center for explosion effect
            div.style.left = '50%';
            div.style.top = '50%';
            table.appendChild(div);
        }

        // === 1. IS CHIT PICKED? (IN HAND) ===
        if (chit.pickedBy !== -1) {
            const slot = document.getElementById(`slot-${chit.pickedBy}`);
            
            // Move into the player slot if not already there
            if (slot && div.parentElement !== slot) {
                div.classList.add('in-hand'); // Applies the CSS for Corner + Small
                div.classList.remove('open'); 
                slot.appendChild(div); 
                
                // CRITICAL: Clear manual positioning so CSS class takes over!
                div.style.left = '';
                div.style.top = '';
                div.style.transform = '';
            }

            // Reveal Logic (Show Role Text)
            const role = data.roles ? data.roles[chitIdx] : null;
            let show = false;
            
            // Show if it's mine, or if it's Reveal/Result phase
            if (chit.pickedBy === myPlayerIndex) show = true;
            if (data.state === 'REVEAL' && role === 'RAJA') show = true;
            if (data.state === 'GUESSING' && (role === 'RAJA' || role === 'MANTRI')) show = true;
            if (data.state === 'RESULT') show = true;

            if (show && role) {
                div.innerHTML = `<div class="chit-role">${getHindi(role)}</div>`;
                div.classList.add('open'); // Makes it big if needed, or keeps styled text
                
                // If it's OPEN, we might want to center it, or keep it cornered?
                // For now, let's keep 'in-hand' styling dominant unless it's full reveal
                if(data.state === 'RESULT' || chit.pickedBy === myPlayerIndex) {
                     div.classList.add('open');
                }
            } else {
                div.innerHTML = ""; // Folded
                div.classList.remove('open');
            }
            
            // No clicking once in hand
            div.onclick = null;

        } 
        // === 2. IS CHIT ON TABLE? (SCATTERED) ===
        else {
            // Move back to table if needed
            if (div.parentElement !== table) {
                table.appendChild(div);
                div.classList.remove('in-hand');
                div.classList.remove('open');
                div.innerHTML = "";
            }

            // Apply Random Coordinates from Database
            // The CSS 'transition' will make this slide smoothly
            requestAnimationFrame(() => {
                div.style.left = chit.x + '%';
                div.style.top = chit.y + '%';
                div.style.transform = `translate(-50%, -50%) rotate(${chit.rot}deg)`;
            });

            // Click to Pick
            div.onclick = () => {
                if (data.state === 'PICKING') attemptPick(chitIdx);
            };
        }
    });
    
    // Mantri Guessing Interactions
    if (data.state === 'GUESSING' && isMantri(myPlayerIndex)) {
        data.players.forEach((p, idx) => {
            if (idx === myPlayerIndex) return; 
            
            const slot = document.getElementById(`slot-${idx}`);
            if (slot) {
                slot.style.cursor = "pointer";
                slot.onclick = () => {
                    if(confirm(`Is ${p.name} the CHOR?`)) {
                        const targetChit = data.chits.find(c => c.pickedBy === idx);
                        const targetRole = data.roles[targetChit.id];
                        makeGuess(idx, targetRole);
                    }
                };
            }
        });
    } else {
        document.querySelectorAll('.p-slot').forEach(s => {
            s.style.cursor = "default";
            s.onclick = null;
        });
    }
}

// --- 6. GAME ACTIONS ---

window.handleActionBtn = function() {
    if (currentGameState.state === 'WAITING' || currentGameState.state === 'RESULT') {
        startRound();
    }
};

function startRound() {
    // Generate roles
    const roles = shuffle(['RAJA', 'MANTRI', 'CHOR', 'SIPAHI']);
    
    // Create random positions immediately
    // We use a simplified single-step update here to avoid syncing issues
    const scatteredChits = [0,1,2,3].map(id => ({
        id: id, 
        // Random X: Keep between 15% and 85% to stay ON the table
        x: Math.floor(15 + Math.random() * 70), 
        // Random Y: Keep between 15% and 85%
        y: Math.floor(15 + Math.random() * 70), 
        rot: Math.floor(Math.random() * 360), 
        pickedBy: -1
    }));

    update(ref(db, `rooms/${roomCode}`), {
        state: 'PICKING',
        roles: roles,
        chits: scatteredChits
    });
}

function attemptPick(chitIdx) {
    const alreadyHasChit = currentGameState.chits.some(c => c.pickedBy === myPlayerIndex);
    if (alreadyHasChit) return;

    get(child(ref(db), `rooms/${roomCode}/chits/${chitIdx}`)).then((snap) => {
        if(snap.val().pickedBy === -1) {
            set(ref(db, `rooms/${roomCode}/chits/${chitIdx}/pickedBy`), myPlayerIndex)
            .then(() => checkAllPicked());
        }
    });
}

function checkAllPicked() {
    setTimeout(() => {
        get(child(ref(db), `rooms/${roomCode}/chits`)).then((snapshot) => {
            const chits = snapshot.val();
            if(!chits) return;
            const allPicked = chits.every(c => c.pickedBy !== -1);
            
            if (allPicked && currentGameState.state === 'PICKING') {
                update(ref(db, `rooms/${roomCode}`), { state: 'REVEAL' });
                setTimeout(() => {
                    update(ref(db, `rooms/${roomCode}`), { state: 'GUESSING' });
                }, 2000); 
            }
        });
    }, 200);
}

function makeGuess(targetPlayerIdx, targetRole) {
    const isCorrect = (targetRole === 'CHOR');
    log(isCorrect ? "Mantri caught the Chor! (+800)" : "Wrong! Mantri arrested the Sipahi.");

    let updates = {};
    updates[`rooms/${roomCode}/state`] = 'RESULT';
    
    currentGameState.players.forEach((p, idx) => {
        const chitIdx = currentGameState.chits.findIndex(c => c.pickedBy === idx);
        const role = currentGameState.roles[chitIdx];
        let points = 0;

        if (role === 'RAJA') points = 1000;
        if (role === 'SIPAHI') points = 500;
        if (role === 'MANTRI') points = isCorrect ? 800 : 0;
        if (role === 'CHOR') points = isCorrect ? 0 : 800;

        updates[`rooms/${roomCode}/players/${idx}/score`] = (p.score || 0) + points;
    });

    updates[`rooms/${roomCode}/round`] = (currentGameState.round || 1) + 1;
    update(ref(db), updates);
}

// --- 7. UTILITIES ---
function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

function getHindi(role) {
    const map = { RAJA: 'Raja', MANTRI: 'Mantri', CHOR: 'Chor', SIPAHI: 'Sipahi' };
    return map[role] || role;
}

function isMantri(playerIdx) {
    if(!currentGameState.chits || !currentGameState.roles) return false;
    const chitIdx = currentGameState.chits.findIndex(c => c.pickedBy === playerIdx);
    if(chitIdx === -1) return false;
    return currentGameState.roles[chitIdx] === 'MANTRI';
}

function log(msg) {
    const p = document.createElement('div');
    p.innerText = "> " + msg;
    if(logArea) logArea.prepend(p);
}

window.toggleScoreboard = function() {
    const board = document.getElementById('scoreboard-panel');
    if(board) board.classList.toggle('active');
};