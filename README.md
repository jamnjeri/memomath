# MemoMath
A game I saw while watching The Devil's Plan on Netflix. It stuck with me, so I decided to build my own version — with a few twists.
Watching The Devil's Plan, I saw a version of this game and immediately thought: *“This could be a fun coding project.”*

I wanted to:
- Explore game state logic

## 🧠 What is MemoMath?
MemoMath is a game that blends memory and math. Think: matching cards meets mental math. The goal is to match pairs of cards that, when combined, satisfy a simple equation (e.g., match two numbers that add up to 10).

## 🛠️ Features (so far aka MemoMath v1 Core Rules:)
- **Grid:**Honeycomb of hexagonal tiles (fixed number to start)
- **Reveal Phase:**Numbers shown for a few seconds, then flipped
- **Game Phase:**
- - Only letter-backs visible
- - A target number is shown
- - Player selects adjacent hexes **in a straight line** whose **hidden numbers add up** to the target
- - Correct = +1 point, incorrect = -1 point
- **No flipping back:**—guesses are made from memory
- **Score is tracked:**, maybe with a timer

## 🧪 Development Concepts
- Hexagonal coordinates: I opted for point-topped hexagons aka Odd-q (vertical layout, pointy -topped hexes.)




- [Documentation](https://docs.google.com/document/d/1FkV1ed6WoJQe_ocxhwGgdI0OaudJtb5iL92mqxuZBLo/edit?usp=sharing)

## 🎯 Next Steps/ Future Features in Consideration (Optional, for v2+)
- Multiplayer mode (turn-based or real-time)
- Power-ups (e.g., peek at one tile)
- Custom challenges / puzzles
- Leaderboards
- Accessibility settings (colorblind mode, larger text, etc.)
- Mobile responsive layout

## 📸 Screenshots / Demos

## Tech Stack: React + TypeScript + Vite

## 🧾 License

