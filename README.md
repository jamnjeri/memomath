# MemoMath
> *"A game where memory meets math."*

A game I saw while watching The Devil's Plan on Netflix. It stuck with me, so I decided to build my own version — with a few twists 😏.
Watching The Devil's Plan, I saw a version of this game and immediately thought: *“This could be a fun coding project.”*

I wanted to:
- Explore game state logic

## 🧠 What is MemoMath?
MemoMath is a game that blends memory and math. Think: matching cards meets mental math. The goal is to match pairs of cards that, when combined, satisfy a simple equation (e.g., match two numbers that add up to 10).
1.  **Memorize:** A honeycomb grid of numbers is revealed briefly.
2.  **Calculate:** A "Target Number" appears (e.g., 12).
3.  **Solve:** You must select tiles from memory that sum up to that target.
4.  **Clear:** Correct tiles vanish, and a new target is generated from the remaining pieces. Clear the board to win!

## 🚀 Features (so far aka MemoMath v1 Core Rules:)
* **Grid:**Honeycomb of hexagonal tiles (fixed number to start)
* **Dynamic Targets:** The game ensures targets are always mathematically solvable from the remaining tiles.
* **Arcade Mode:** Game doesn't end on one match. You must clear the entire board.
* **Assistance:** A "Peek" feature allows you to briefly check the board if you get stuck (to prevent rage-quitting!).
* **Responsive:** Works on Mobile and Desktop.

## 🛠️ Tech Stack
* **React + TypeScript** (Logic & UI)
* **Vite** (Build Tool)
* **Tailwind CSS** (Styling)
* **Framer Motion** (Animations)

## 👨‍💻 A Note from the Developer
This project gave me a newfound respect for **Game Designers** and **System Designers**—the unsung heroes who don't just write code, but craft the *rules* that make a game fun. 

Balancing difficulty, ensuring "solvability," and handling edge cases (like what happens when only 2 tiles are left?) is a complex logic puzzle in itself. It is significantly harder than it looks!

## 🧪 Development Concepts
- Hexagonal coordinates: I opted for point-topped hexagons aka Odd-q (vertical layout, pointy -topped hexes.)

**Project Status:**
This is **Version 1.0**. It was built as a rapid prototype to "ship" the core idea rather than letting it sit in "development hell" forever. While there are many features I'd love to add (multiplayer, complex hex-neighbor rules, leaderboards), I prioritized a playable, stable, and fun experience for now.

*Built with 💻 and ☕ in Nairobi.*


- [Documentation](https://docs.google.com/document/d/1FkV1ed6WoJQe_ocxhwGgdI0OaudJtb5iL92mqxuZBLo/edit?usp=sharing)

