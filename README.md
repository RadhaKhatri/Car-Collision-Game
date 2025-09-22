# 🚗 Car Collision Game (Three.js)

A simple **3D car runner game** built with **HTML + JavaScript + Three.js**.  
The player controls a car that drives forward on an endless road, dodging oncoming traffic.  
Survive as long as possible to get a high score!

---

## 🎮 Gameplay

- The player car starts on a 3-lane road.
- Use the keyboard to control your car:
  - **← / →** : Switch lanes (left / right)
  - **↑** : Accelerate
  - **↓** : Brake
- Enemy cars spawn randomly in lanes and move toward the player.
- If you collide with an enemy → **Game Over**.
- Score increases over time (faster at higher speeds).
- Difficulty increases as you survive longer (faster enemy spawns).
- Game has headlights, wheel animation, and basic sound effects.

---

## 🛠️ Features (Implemented)

✅ Level 1 – Scene setup with Three.js  
✅ Level 2 – Player car (body, cabin, wheels)  
✅ Level 3 – Infinite road + grass environment  
✅ Level 4 – Smooth chase camera  
✅ Level 5 – Car controls (lanes, acceleration, braking)  
✅ Level 6 – Enemy cars with random colors/lane spawning  
✅ Level 7 – Collision detection with **Box3 AABB**  
✅ Level 8 – HUD with score + speed display  
✅ Level 9 – Dynamic difficulty (spawn rate increases with score)  
✅ Level 10 – Polish: headlights, wheel rotation, engine + crash sounds  

---

## 🚀 How to Run

1. Clone this repository or download the files:
   ```bash
   git clone https://github.com/RadhaKhatri/Car-Collision-Game

2. Open index.html in your browser (or run with VSCode Live Server).

3. Enjoy playing! 🎮
   
## 📂 Project Structure
.
├── index.html   # Main HTML file (HUD + script import)
├── main.js      # Game logic with Three.js

## 🎨 Color Scheme

Road → Dark Gray (#333333)

Grass → Forest Green (#228B22)

Sky → Sky Blue (#87CEEB)

Player Car → Red (stands out clearly)

## 🧑‍💻 Tech Stack

1. HTML5 – Page structure & HUD

2. CSS3 – HUD styling (optional file)

3. JavaScript (ES6) – Game logic

4. Three.js – 3D rendering

## 🕹 How to Play

1. Arrow Left / Right: Move car between lanes.

2. Arrow Up: Accelerate your car.

3. Arrow Down: Brake / reduce speed.

4. Avoid: Enemy cars and roadside objects.

5. Objective: Survive as long as possible and get a high score.

6. When your car collides with an enemy, game over is displayed and you can restart the game.

