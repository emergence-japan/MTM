# Specification: Implement "What Matters to Me" Game Logic

## Overview
Replace the existing "Dice of Destiny" game mechanics (dice rolling, card loss simulation) with a new reflective activity called "What Matters to Me". This new activity focuses on self-reflection, prioritizing personal values, and deep contemplation without the "loss" mechanic of the previous game. The existing pre/post survey flows and data submission infrastructure will be preserved.

## User Flow
1.  **Introduction (Intro):**
    *   Display the "Introduction" and "Remarks" text provided.
    *   Explain the purpose: Self-discovery, not evaluation.
    *   Show time estimate (25-30 mins).
2.  **Step 1: Reflection & Listing:**
    *   Prompt user to think about important things/people/experiences.
    *   Input: User enters 5-6 items into a list.
3.  **Step 2: Organizing (Ranking):**
    *   User reorders the items from Step 1 based on importance (1 = Most Important).
    *   UI should support drag-and-drop or simple numbering inputs.
4.  **Step 3: Deep Thinking:**
    *   System selects the top 1 or 2 items from the ranked list.
    *   User answers prompts for these items:
        *   "Why is this important to you?"
        *   "How does this affect your daily life/feelings?"
5.  **Step 4: Summary:**
    *   Final reflection prompt: "What did you realize or rediscover about yourself through this activity?"
    *   Example text provided in requirements.
6.  **Completion:**
    *   Transition to the existing `completion` screen or directly to data submission/post-survey flow.

## Functional Requirements
*   **Game Logic Replacement:** Completely remove `stage1` (card creation), `stage2` (stories), and `stage3` (dice game) logic from `js/app.js` and `game.html`.
*   **New Data Structure:**
    *   `gamePlay` object in `surveyData` must be updated to store:
        *   `rankedItems`: Array of strings (ordered).
        *   `deepThoughts`: Object mapping item to reflection text.
        *   `summary`: String (final reflection).
*   **Data Submission:** Ensure `completeGameAndSend` in `js/app.js` correctly packages this new data structure for the GAS backend.
*   **UI/UX:**
    *   Use existing `css/main.css` variables and styling (dark theme, fonts) for consistency.
    *   Ensure inputs are accessible and styled correctly.

## Non-Functional Requirements
*   **Code Cleanliness:** Remove unused code related to the old dice game (e.g., dice animation CSS, card loss logic).
*   **Compatibility:** Must work within the existing `index.html` -> `pre-survey` -> `game` -> `post-survey` flow.
