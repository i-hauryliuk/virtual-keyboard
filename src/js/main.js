import Keyboard from './Keyboard';

window.onload = () => {
  const lang = localStorage.kblang ? localStorage.kblang : 'en';

  const keyboard = new Keyboard(lang);
  keyboard.init();

  window.addEventListener('beforeunload', () => {
    localStorage.kblang = keyboard.lang;
  });
};
