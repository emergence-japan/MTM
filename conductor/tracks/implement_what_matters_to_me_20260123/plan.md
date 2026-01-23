# Implementation Plan - Implement "What Matters to Me" with Multi-language Support

## Phase 1: Localization Infrastructure
- [x] Task: Create `js/i18n.js` to manage translations for all pages. <!-- c6ff554 -->
- [x] Task: Implement a global language switcher UI component. <!-- 1e3f206 -->
- [x] Task: Integrate `i18n.js` into `index.html`, `pre-survey.html`, `game.html`, and `post-survey.html`. <!-- c3b5b0d -->

## Phase 2: Game Logic and UI Overhaul
- [x] Task: Remove legacy game HTML and JS from `game.html` and `js/app.js`. <!-- 602c6a2 -->
- [x] Task: Implement the 4-step "What Matters to Me" activity with multi-language support. <!-- d50a5d0 -->
- [x] Task: Update `js/app.js` to handle the new game state (listing, ranking, deep thinking, summary). <!-- d50a5d0 -->

## Phase 3: Survey Localization [checkpoint: 4c2fe47]
- [x] Task: Apply translation logic to `pre-survey.html` (Questions, categories, instructions). <!-- 1334152 -->
- [x] Task: Apply translation logic to `post-survey.html` (Questions, categories, instructions). <!-- 995da9c -->
- [x] Task: Conductor - User Manual Verification 'Multi-language Survey Flow' (Protocol in workflow.md) <!-- 4c2fe47 -->

## Phase 4: Data Integration and Finalization
- [x] Task: Update data payload to include the user's selected language. <!-- f94ea5d -->
- [ ] Task: Verify end-to-end data submission to GAS for both languages.
- [ ] Task: Conductor - User Manual Verification 'Full End-to-End Multilingual Experience' (Protocol in workflow.md)
