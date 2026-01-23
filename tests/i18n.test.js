/**
 * @jest-environment jsdom
 */
const { I18n } = require('../js/i18n');

describe('I18n', () => {
    let i18n;
    const mockTranslations = {
        ja: {
            title: 'タイトル',
            greeting: 'こんにちは'
        },
        en: {
            title: 'Title',
            greeting: 'Hello'
        }
    };

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        i18n = new I18n(mockTranslations);
    });

    test('should initialize with default language (ja)', () => {
        expect(i18n.currentLang).toBe('ja');
    });

    test('should load saved language from localStorage', () => {
        localStorage.setItem('appLanguage', 'en');
        i18n = new I18n(mockTranslations);
        expect(i18n.currentLang).toBe('en');
    });

    test('should return correct translation for key', () => {
        expect(i18n.t('title')).toBe('タイトル');
        i18n.setLanguage('en');
        expect(i18n.t('title')).toBe('Title');
    });

    test('should return key if translation missing', () => {
        expect(i18n.t('missing.key')).toBe('missing.key');
    });

    test('should switch language and persist to localStorage', () => {
        i18n.setLanguage('en');
        expect(i18n.currentLang).toBe('en');
        expect(localStorage.getItem('appLanguage')).toBe('en');
    });
});
