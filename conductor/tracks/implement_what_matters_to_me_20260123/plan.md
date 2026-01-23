# Implementation Plan - Implement "What Matters to Me" Game Logic

## Phase 1: Cleanup and Preparation
- [ ] Task: Remove existing game HTML structure (Stage 1-3) from `game.html`.
- [ ] Task: Remove existing game logic (Dice, Card Loss, Old Stage management) from `js/app.js`.
- [ ] Task: Clean up unused CSS related to the dice game in `css/main.css` (or `css/game.css` if separated).

## Phase 2: Implementation of New Game Flow
- [ ] Task: Implement "Introduction" screen in `game.html` and logic in `js/app.js`.
- [ ] Task: Implement "Step 1 & 2: Listing and Ranking" screen and logic.
    - [ ] Create HTML structure for list inputs.
    - [ ] Implement JavaScript logic to handle input and reordering (or numbering).
    - [ ] Add validation (ensure 5-6 items are entered).
- [ ] Task: Implement "Step 3: Deep Thinking" screen and logic.
    - [ ] Create HTML structure for reflection prompts.
    - [ ] Implement JS to dynamically display the top ranked items.
- [ ] Task: Implement "Step 4: Summary" screen and logic.
- [ ] Task: Conductor - User Manual Verification 'Implementation of New Game Flow' (Protocol in workflow.md)

## Phase 3: Data Integration and Finalization
- [ ] Task: Update `surveyData` structure in `js/app.js` to accommodate new game data.
- [ ] Task: Verify `completeGameAndSend` function transmits the new payload correctly.
- [ ] Task: Add basic unit tests for the new `gamePlay` data structure validation if possible (or manual verification plan).
- [ ] Task: Conductor - User Manual Verification 'Data Integration and Finalization' (Protocol in workflow.md)
