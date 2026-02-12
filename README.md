# 👑 Raja Mantri Chor Sipahi - Online Multiplayer

> A real-time, digital recreation of the classic Indian childhood paper chit game. 
> **Gather 4 friends, grab a chit, and find the thief!**

![Game Screenshot](screenshots/gameplay.png)
*(Replace this link with a screenshot of your actual game)*

## 📜 About The Game
**Raja Mantri Chor Sipahi** (King, Minister, Thief, Soldier) is a popular traditional game played in India. 
This web version brings the nostalgia online using **Firebase Realtime Database**, allowing 4 friends to play together from anywhere.

### 🎭 The Roles:
1.  **Raja (King) - 1000 Pts:** The ruler. Total safety.
2.  **Mantri (Minister) - 800 Pts:** The detective. Must guess who the *Chor* is.
3.  **Sipahi (Soldier) - 500 Pts:** The protector. Just enjoys the show.
4.  **Chor (Thief) - 0 Pts:** The culprit. Must hide their identity from the *Mantri*.

### 🎮 How to Play
1.  **Create a Room:** One player creates a room and shares the **Room Code**.
2.  **Join:** 3 other players enter the code to join the lobby.
3.  **Throw Chits:** The host starts the round. 4 paper chits are thrown onto the table.
4.  **Grab a Chit!** It's **First Come, First Serve!** Click a chit quickly to claim your role.
5.  **The Guess:** If you are the **Mantri**, you must click on the player you suspect is the **Chor**.
    * **Correct Guess:** Mantri gets 800 points, Chor gets 0.
    * **Wrong Guess:** Mantri gets 0 points, Chor gets 800.

---

## ✨ Features
* **Real-time Multiplayer:** Powered by Google Firebase for instant updates.
* **Physics-style Animations:** Chits are "thrown" onto the table and scatter randomly.
* **First-Come-First-Serve:** A chaotic "grab" mechanic where speed matters!
* **Live Scoreboard:** Tracks scores over 10 rounds.
* **Responsive UI:** Works on Desktop and Mobile.

---

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript (ES6+).
* **Backend / Database:** Firebase Realtime Database (v12.9.0 Modular SDK).
* **Hosting:** Can be hosted on GitHub Pages, Vercel, or Netlify.

---

## 🚀 Setup & Run Locally

To run this game on your own machine:

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/your-username/raja-mantri-online.git](https://github.com/your-username/raja-mantri-online.git)
    cd raja-mantri-online
    ```

2.  **Add Firebase Config**
    * Open `script.js`.
    * Ensure the `firebaseConfig` object contains your valid API keys.

3.  **Run a Local Server**
    * Because this project uses ES6 Modules (`type="module"`), you cannot just double-click `index.html`. You need a local server.
    * **Python:** `python -m http.server`
    * **Node (http-server):** `npx http-server .`
    * **VS Code:** Right-click `index.html` -> *Open with Live Server*.

4.  **Play!**
    * Open `http://localhost:8000` in your browser.
    * Open 3 other tabs (Incognito mode works best for testing) to simulate 4 players.

---

## 📸 Screenshots
| Lobby Screen | Gameplay |
| :---: | :---: |
| ![Lobby](screenshots/lobby.png) | ![Table](screenshots/table.png) |

---

## 🔮 Future Improvements
- [ ] Add Sound Effects (Shuffling paper, coins).
- [ ] Add Chat functionality in the lobby.
- [ ] Add "Kick Player" feature for the host.
- [ ] Custom Avatar selection.

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---

Made with ❤️ by [Your Name]
