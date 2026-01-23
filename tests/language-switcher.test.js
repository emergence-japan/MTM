/**
 * @jest-environment jsdom
 */
const { LanguageSwitcher } = require('../js/language-switcher');
const { I18n } = require('../js/i18n');

describe('LanguageSwitcher', () => {
    let switcher;
    let i18n;
    let container;

    beforeEach(() => {
        document.body.innerHTML = '<div id="lang-switcher-container"></div>';
        container = document.getElementById('lang-switcher-container');
        i18n = new I18n({ ja: {}, en: {} }); // valid langs
        switcher = new LanguageSwitcher(i18n, container);
    });

    test('should render switcher buttons', () => {
        switcher.render();
        expect(container.querySelector('.lang-btn[data-lang="ja"]')).not.toBeNull();
        expect(container.querySelector('.lang-btn[data-lang="en"]')).not.toBeNull();
    });

    test('should highlight current language', () => {
        i18n.currentLang = 'en';
        switcher.render();
        expect(container.querySelector('.lang-btn[data-lang="en"]').classList).toContain('active');
        expect(container.querySelector('.lang-btn[data-lang="ja"]').classList).not.toContain('active');
    });

    test('should switch language on click', () => {
        switcher.render();
        const enBtn = container.querySelector('.lang-btn[data-lang="en"]');
        
        // Mock i18n.setLanguage
        const spy = jest.spyOn(i18n, 'setLanguage');
        
        enBtn.click();
        
        expect(spy).toHaveBeenCalledWith('en');
        expect(container.querySelector('.lang-btn[data-lang="en"]').classList).toContain('active');
    });
});
