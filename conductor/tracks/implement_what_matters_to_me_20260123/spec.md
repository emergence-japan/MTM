# Specification: Implement "What Matters to Me" with Multi-language Support

## Overview
Replace the existing "Dice of Destiny" game mechanics with "What Matters to Me" and implement a comprehensive multi-language (Japanese/English) system across the entire application (Landing Page, Pre-survey, Game, Post-survey).

## User Flow & Localization
1.  **Language Selection:**
    *   A persistent language toggle (JP/EN) will be available on all screens.
    *   The selected language will persist across all pages in the session.
2.  **Introduction (Intro):**
    *   Display "What Matters to Me" intro in the selected language.
3.  **Step 1-4 (Activity):**
    *   All prompts and instructions for the 4 steps will be localized.
4.  **Surveys (Pre/Post):**
    *   All questions, labels, and placeholders will switch between JP and EN based on the global setting.

## Functional Requirements
*   **Localization Infrastructure:**
    *   Create a centralized translation system (e.g., `js/i18n.js`) to manage all UI strings.
    *   Implement a language switcher UI element.
*   **Game Logic Replacement:** 
    *   Remove legacy stages 1-3.
    *   Implement new 4-step activity.
*   **Data Structure:**
    *   Include the language used during the session in the final data payload.
*   **Data Submission:**
    *   Maintain compatibility with the GAS backend.

## UI/UX
*   Language switcher should be clearly visible (e.g., top-right corner).
*   Switching language should update all text content immediately without page reload where possible, or handle state correctly across page transitions.

