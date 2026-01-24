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
// Removed automatic initialization on DOMContentLoaded to allow for participant check first
// document.addEventListener('DOMContentLoaded', () => {
//   initializeApp();
// });

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
        case 'step2':
            initializeStep2();
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

    const btn = document.getElementById('btn-to-step2');

    

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



function initializeStep2() {
    const inputs = document.querySelectorAll('.item-input');
    const items = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(val => val !== '');
    
    const container = document.getElementById('ranked-items-list');
    if (!container) return;
    
    container.innerHTML = '';
    container.className = 'sortable-list';
    
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'sortable-item';
        itemEl.draggable = true;
        itemEl.dataset.index = index;
        
        itemEl.innerHTML = `
            <div class="rank-badge">${index + 1}</div>
            <div class="item-content">${item}</div>
            <div class="drag-handle">☰</div>
        `;
        
        // Drag events
        itemEl.addEventListener('dragstart', handleDragStart);
        itemEl.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(itemEl);
    });
    
    container.addEventListener('dragover', handleDragOver);
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    updateRanks();
}

function handleDragOver(e) {
    e.preventDefault();
    const container = document.getElementById('ranked-items-list');
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
        container.appendChild(draggedItem);
    } else {
        container.insertBefore(draggedItem, afterElement);
    }
    updateRanks();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateRanks() {
    const container = document.getElementById('ranked-items-list');
    const items = container.querySelectorAll('.sortable-item');
    items.forEach((item, index) => {
        item.querySelector('.rank-badge').textContent = index + 1;
        item.dataset.rank = index + 1;
    });
}

function initializeStep3() {
    // 画面上の現在の順番を取得
    const items = document.querySelectorAll('.sortable-item');
    const rankedItems = Array.from(items).map(item => item.querySelector('.item-content').textContent);
    
    // Save ranked items to state
    window.surveyData.gamePlay.rankedItems = rankedItems;
    
    // Select top 2 items
    const topItems = rankedItems.slice(0, 2);
    
    const container = document.getElementById('deep-thinking-container');
    if (!container) return;
    container.innerHTML = '';
    
    topItems.forEach(itemText => {
        const box = document.createElement('div');
        box.className = 'reflection-box survey-section';
        box.innerHTML = `
            <h3>${itemText}</h3>
            <div class="question-group">
                <label class="question-label">${window.i18n.t('whyImportant')}</label>
                <textarea class="text-input why-textarea" data-item="${itemText}" rows="4" style="width: 100%; max-width: 100%;"></textarea>
            </div>
            <div class="question-group">
                <label class="question-label">${window.i18n.t('howInfluence')}</label>
                <textarea class="text-input how-textarea" data-item="${itemText}" rows="4" style="width: 100%; max-width: 100%;"></textarea>
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
