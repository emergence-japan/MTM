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
function initializeStep1() { console.log('Step 1 init'); }
function initializeStep3() { console.log('Step 3 init'); }