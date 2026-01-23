// app.js - What Matters to Me version

// Global state
let currentSection = 'welcome';

// Global surveyData structure
if (typeof window.surveyData === 'undefined') {
  window.surveyData = {
    language: localStorage.getItem('appLanguage') || 'ja',
    preSurvey: {},
    gamePlay: {
      rankedItems: [],
      deepThoughts: {},
      summary: '',
      startTime: null,
      endTime: null
    },
    postSurvey: {}
  };
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Show welcome screen
  showSection('welcome');

  // Add fade-in animation to welcome screen
  const welcomeSection = document.getElementById('welcome');
  if (welcomeSection) {
    welcomeSection.classList.add('fade-in');
  }

  // Warning on page refresh
  window.addEventListener('beforeunload', (e) => {
    if (currentSection !== 'welcome' && currentSection !== 'completion') {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
    }
  });
}

function navigateTo(sectionId) {
  // Hide current section
  const currentSectionEl = document.getElementById(currentSection);
  if (currentSectionEl) {
    currentSectionEl.classList.remove('active');
    currentSectionEl.classList.add('fade-out');
  }

  // Show new section after short delay
  setTimeout(() => {
    if (currentSectionEl) {
      currentSectionEl.classList.remove('fade-out');
    }

    const newSection = document.getElementById(sectionId);
    if (newSection) {
      newSection.classList.add('active', 'fade-in');
      newSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      currentSection = sectionId;

      // Remove fade-in class after animation
      setTimeout(() => {
        newSection.classList.remove('fade-in');
      }, 500);
      
      // Initialize section-specific logic if needed
      onSectionShow(sectionId);
    }
  }, 300);
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.screen').forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionId;
    onSectionShow(sectionId);
  }
}

function onSectionShow(sectionId) {
    // Hooks for specific section initialization
    switch(sectionId) {
        case 'step1':
            initializeStep1();
            break;
        case 'step3':
            initializeStep3();
            break;
    }
}

async function completeGameAndSend() {
  // Show loading state
  const button = document.querySelector('#step4 .btn-primary'); // Updated selector
  if (button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending Data...';

    try {
      // Save summary from textarea
      window.surveyData.gamePlay.summary = document.getElementById('final-summary').value.trim();
      
      // payloadにはゲームの全データを含める
      window.surveyData.gamePlay.endTime = new Date().toISOString();
      window.surveyData.language = localStorage.getItem('appLanguage') || 'ja';
      const gamePayload = window.surveyData.gamePlay;

      // Send data using the common submission function
      const success = await submitToGAS({ page: 'game', payload: gamePayload });

      if (success) {
        navigateTo('completion');
      } else {
        throw new Error('Submission to GAS failed.');
      }

    } catch (error) {
      console.error('Failed to send data:', error);
      alert(`データの送信に失敗しました。Error: ${error.message}`);
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Placeholder functions for new logic

function initializeStep1() { 

    const inputs = document.querySelectorAll('.item-input');

    inputs.forEach(input => {

        input.addEventListener('input', validateStep1);

    });

    window.surveyData.gamePlay.startTime = new Date().toISOString();

}



function validateStep1() {

    const inputs = document.querySelectorAll('.item-input');

    const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '');

    const count = filledInputs.length;

    

    const statusEl = document.getElementById('item-count-status');

    const btn = document.getElementById('btn-to-ranking');

    

    if (count >= 5) {

        statusEl.classList.remove('invalid');

        statusEl.classList.add('valid');

        statusEl.textContent = '✓';

        btn.disabled = false;

    } else {

        statusEl.classList.remove('valid');

        statusEl.classList.add('invalid');

        // Get localized string from i18n if available, else fallback

        statusEl.textContent = window.i18n ? window.i18n.t('validationMinItems') : '最低5つ入力してください';

        btn.disabled = true;

    }

}



function showRanking() {

    const inputs = document.querySelectorAll('.item-input');

    const items = Array.from(inputs)

        .map(input => input.value.trim())

        .filter(val => val !== '');

    

    const container = document.getElementById('ranked-items-list');

    container.innerHTML = '';

    

    items.forEach((item, index) => {

        const itemEl = document.createElement('div');

        itemEl.className = 'ranked-item-row';

        itemEl.style.display = 'flex';

        itemEl.style.alignItems = 'center';

        itemEl.style.gap = '1rem';

        itemEl.style.marginBottom = '0.5rem';

        

        itemEl.innerHTML = `

            <input type="number" class="number-input rank-input" min="1" max="${items.length}" value="${index + 1}" style="width: 60px;">

            <span class="item-text">${item}</span>

        `;

        container.appendChild(itemEl);

    });

    

    document.getElementById('ranking-container').style.display = 'block';

    document.getElementById('btn-to-ranking').style.display = 'none';

    document.getElementById('btn-to-step3').style.display = 'inline-block';

    

    // Smooth scroll to ranking

    document.getElementById('ranking-container').scrollIntoView({ behavior: 'smooth' });

}



function initializeStep3() {

    // Get ranked items

    const rows = document.querySelectorAll('.ranked-item-row');

    const rankedData = Array.from(rows).map(row => {

        return {

            text: row.querySelector('.item-text').textContent,

            rank: parseInt(row.querySelector('.rank-input').value, 10)

        };

    }).sort((a, b) => a.rank - b.rank);

    

    // Save ranked items to state

    window.surveyData.gamePlay.rankedItems = rankedData.map(d => d.text);

    

    // Select top 2 items

    const topItems = rankedData.slice(0, 2);

    

    const container = document.getElementById('deep-thinking-container');

    container.innerHTML = '';

    

    topItems.forEach(item => {

        const box = document.createElement('div');

        box.className = 'reflection-box survey-section';

        box.innerHTML = `

            <h3>${item.text}</h3>

            <div class="question-group">

                <label class="question-label">${window.i18n.t('whyImportant')}</label>

                <textarea class="text-input why-textarea" data-item="${item.text}" rows="4" style="width: 100%; max-width: 100%;"></textarea>

            </div>

            <div class="question-group">

                <label class="question-label">${window.i18n.t('howInfluence')}</label>

                <textarea class="text-input how-textarea" data-item="${item.text}" rows="4" style="width: 100%; max-width: 100%;"></textarea>

            </div>

        `;

        container.appendChild(box);

    });

}



// When navigating to Step 4, we should save Step 3 data

function prepareStep4() {

    const reflections = {};

    const whyTextareas = document.querySelectorAll('.why-textarea');

    const howTextareas = document.querySelectorAll('.how-textarea');

    

    whyTextareas.forEach((ta, index) => {

        const item = ta.dataset.item;

        reflections[item] = {

            why: ta.value.trim(),

            how: howTextareas[index].value.trim()

        };

    });

    

    window.surveyData.gamePlay.deepThoughts = reflections;

}



// Overriding navigateTo to include state saving

const originalNavigateTo = navigateTo;

navigateTo = function(sectionId) {

    if (currentSection === 'step3' && sectionId === 'step4') {

        prepareStep4();

    }

    if (currentSection === 'step4' && sectionId === 'completion') {

        window.surveyData.gamePlay.summary = document.getElementById('final-summary').value.trim();

    }

    originalNavigateTo(sectionId);

};
