/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const submitScriptPath = path.resolve(__dirname, '../js/submit.js');
const participantScriptPath = path.resolve(__dirname, '../js/participant.js');

describe('Data Submission Logic', () => {
  beforeAll(() => {
    // Load scripts
    const participantContent = fs.readFileSync(participantScriptPath, 'utf8');
    window.eval(participantContent);
    const submitContent = fs.readFileSync(submitScriptPath, 'utf8');
    window.eval(submitContent);
  });

  beforeEach(() => {
    // Clear storage
    sessionStorage.clear();
    localStorage.clear();
    
    // Setup participant
    sessionStorage.setItem('participant', JSON.stringify({
      anonymousCode: 'USER123',
      gender: 'female',
      age: 25
    }));

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      })
    );
    
    // Mock i18n
    window.i18n = {
      currentLang: 'ja'
    };
  });

  test('should include current language in submission payload (i18n available)', async () => {
    window.i18n.currentLang = 'en';
    
    const payload = { test: 'data' };
    await window.submitToGAS({ page: 'test-page', payload });

    expect(global.fetch).toHaveBeenCalled();
    const fetchArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(fetchArgs[1].body);
    
    expect(body.language).toBe('en');
    expect(body.anonymous_code).toBe('USER123');
    expect(body.page).toBe('test-page');
  });

  test('should fallback to localStorage for language if i18n is not defined', async () => {
    delete window.i18n;
    localStorage.setItem('appLanguage', 'en');
    
    const payload = { test: 'data' };
    await window.submitToGAS({ page: 'test-page', payload });

    const fetchArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(fetchArgs[1].body);
    
    expect(body.language).toBe('en');
  });

  test('should default to ja if no language info is found', async () => {
    delete window.i18n;
    localStorage.clear();
    
    const payload = { test: 'data' };
    await window.submitToGAS({ page: 'test-page', payload });

    const fetchArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(fetchArgs[1].body);
    
    expect(body.language).toBe('ja');
  });

  test('should include participant attributes in the payload', async () => {
    const payload = { q1: 5 };
    await window.submitToGAS({ page: 'pre', payload });

    const fetchArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(fetchArgs[1].body);
    
    expect(body.gender).toBe('female');
    expect(body.age).toBe(25);
    expect(body.payload).toEqual(payload);
  });
});
