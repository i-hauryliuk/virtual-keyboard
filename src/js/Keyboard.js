import LayoutData from './LayoutsData';
import Key from './Key';
import Output from './Output';

const keyOptions = {
  tags: {
    keyTag: 'button',
    keyMainValueTag: 'span',
    keyOtherValueTag: 'span',
  },
  classes: {
    keyClasses: ['key'],
    keyMainValueClasses: ['key__main-label'],
    keyOtherValueClasses: ['key__other-label'],
  },
  modifiers: {
    keyModifiers: {
      keyPressed: ['key_pressed'],
      shiftActive: ['key_shift_active'],
      keyControl: ['key_control'],
      keyBackspace: ['key_backspace'],
      keyTab: ['key_tab'],
      keyCaps: ['key_caps'],
      keyEnter: ['key_enter'],
      keyShift: ['key_shift'],
      keyCtrl: ['key_ctrl'],
      keySpace: ['key_space'],
    },
  },
};

const keyboardOptions = {
  tags: {
    keyboardTag: 'div',
    keyboardKeysTag: 'div',
    keyboardKeyTag: 'div',
  },
  classes: {
    keyboardClasses: ['keyboard'],
    keyboardKeysClasses: ['keyboard__keys'],
    keyboardKeyClasses: ['keyboard__key'],
  },
};

const outputOptions = {
  tags: {
    outputTag: 'div',
    outputFieldTag: 'textarea',
  },
  classes: {
    outputClasses: ['output'],
    outputFieldClasses: ['output__field'],
  },
};

export default class Keyboard {
  constructor(lang) {
    this.lang = lang || 'en';
    this.domNode = null;
    this.repeating = false;
    this.isCapsLockActive = false;
    this.isShiftHold = false;
    this.isAltHold = false;
    this.isCtrlHold = false;
    this.case = 'lower';
    this.keys = this.createKeys();
    this.keysCodes = null;
    this.specialKeyCodes = [
      'Backspace',
      'Home',
      'End',
      'CapsLock',
      'PageUp',
      'ShiftLeft',
      'ShiftRight',
      'PageDown',
      'ControlLeft',
      'MetaLeft',
      'AltLeft',
      'AltRight',
      'ContextMenu',
      'ControlRight',
    ];
    this.output = null;
  }

  init() {
    this.keysCodes = this.getKeysCodes();
    const keyboardWrapperElement = document.createElement('div');
    keyboardWrapperElement.classList.add('wrapper');
    const output = new Output();
    this.output = output;
    output.createOutput(outputOptions.tags, outputOptions.classes);
    keyboardWrapperElement.append(output.domNode);
    this.createDomNode(keyboardOptions.tags, keyboardOptions.classes);
    const headerElement = document.createElement('div');
    headerElement.classList.add('header');
    const headerDescrElement = document.createElement('p');
    headerDescrElement.classList.add('header__description');
    headerDescrElement.textContent = 'Made in Windows. Language switcher: Alt+Shift';
    headerElement.append(headerDescrElement);
    keyboardWrapperElement.prepend(headerElement);
    keyboardWrapperElement.append(this.domNode);
    document.body.classList.add('page');
    document.body.prepend(keyboardWrapperElement);
  }

  createKeys() {
    const keys = [];
    LayoutData.filter((layout) => this.lang in layout)[0][this.lang]
      .forEach((keyData) => {
        const newKey = new Key(keyData, keyOptions.tags, keyOptions.classes, keyOptions.modifiers);
        keys.push(newKey);
      });
    return keys;
  }

  createDomNode(tags, classes) {
    const keyboardElement = document.createElement(tags.keyboardTag);
    keyboardElement.setAttribute('tabindex', '0');
    keyboardElement.classList.add(...classes.keyboardClasses);
    keyboardElement.addEventListener('mousedown', this.processClickedElement.bind(this));
    keyboardElement.addEventListener('mouseup', this.processClickedElement.bind(this));
    keyboardElement.addEventListener('keydown', this.processPressedKey.bind(this));
    keyboardElement.addEventListener('keyup', this.processPressedKey.bind(this));
    const keyboarKeysElement = document.createElement(tags.keyboardKeysTag);
    keyboarKeysElement.classList.add(...classes.keyboardKeysClasses);
    const keysDocFragment = new DocumentFragment();
    this.keys.forEach((key) => {
      const keyElement = document.createElement(tags.keyboardKeyTag);
      keyElement.classList.add(...classes.keyboardKeyClasses);
      keyElement.append(key.domNode);
      keysDocFragment.append(keyElement);
    });
    keyboarKeysElement.append(keysDocFragment);
    keyboardElement.append(keyboarKeysElement);
    this.domNode = keyboardElement;
  }

  getKeysCodes() {
    return this.keys.map((key) => key.code);
  }

  processClickedElement(event) {
    event.currentTarget.focus();
    const code = event.target.classList.contains('key') ? event.target.dataset.code : null;
    if (code && this.keysCodes.includes(code)) {
      const currentKey = this.getCurrentKey(code);
      if (event.type === 'mousedown' && event.which === 1) {
        currentKey.highlight(keyOptions.modifiers.keyModifiers.keyPressed);
        if (code === 'CapsLock') {
          this.processPressingCaps(code);
        }
        if (code.startsWith('Shift')) {
          this.isShiftHold = true;
          this.toggleCase();
        }
        if (!this.specialKeyCodes.includes(code)) {
          this.output.updateValue(this.getKeyCurrentValue(currentKey));
        }
      } else if (event.type === 'mouseup') {
        if (code.startsWith('Shift')) {
          this.isShiftHold = false;
          this.toggleCase();
        }
        currentKey.deHighlight(keyOptions.modifiers.keyModifiers.keyPressed);
      }
    }
  }

  processPressedKey(event) {
    event.preventDefault();
    const { code } = event;
    if (this.keysCodes.includes(code)) {
      const currentKey = this.getCurrentKey(code);
      if (event.type === 'keydown') {
        currentKey.highlight(keyOptions.modifiers.keyModifiers.keyPressed);
        if (!this.repeating || this.isShiftHold || this.isAltHold) {
          this.repeating = true;
          if (code.startsWith('Shift') && !this.isShiftHold) {
            this.isShiftHold = true;
            if (this.isAltHold) {
              this.changeKeyboardLang();
            } else {
              this.toggleCase();
            }
          }
          if (code === 'CapsLock') {
            this.processPressingCaps(code);
          }
          if (code.startsWith('Alt') && !this.isAltHold) {
            this.isAltHold = true;
          }
          if (!this.specialKeyCodes.includes(code)) {
            this.output.updateValue(this.getKeyCurrentValue(currentKey));
          }
        }
      } else if (event.type === 'keyup') {
        currentKey.deHighlight(keyOptions.modifiers.keyModifiers.keyPressed);
        if (code.startsWith('Shift')) {
          this.isShiftHold = false;
          if (!this.isAltHold) {
            this.toggleCase();
          }
        }
        if (code.startsWith('Alt')) {
          this.isAltHold = false;
        }
        this.repeating = false;
      }
    }
  }

  getCurrentKey(code) {
    return this.keys.filter((key) => key.code === code)[0];
  }

  getKeyCurrentValue(key) {
    if (this.isShiftHold && key.otherValue) {
      return key.otherValue;
    }
    return key.mainValue;
  }

  toggleCase() {
    if (this.case === 'lower') {
      this.keys.forEach((key) => {
        const button = key;
        if (!this.specialKeyCodes.includes(button.code) && button.code !== 'Enter' && button.code !== 'Tab') {
          button.mainValue = button.mainValue.toUpperCase();
          if (button.otherValue) {
            button.otherValue.toUpperCase();
          }
          Array.from(button.domNode.children).forEach((child) => {
            const childEl = child;
            if (childEl.classList.contains('key__main-label')) {
              childEl.textContent = button.mainValue;
            } else if (childEl.classList.contains('key__other-label')) {
              childEl.textContent = button.otherValue;
            }
          });
        }
      });
      this.case = 'upper';
    } else {
      this.keys.forEach((key) => {
        const button = key;
        if (!this.specialKeyCodes.includes(button.code) && button.code !== 'Enter' && button.code !== 'Tab') {
          button.mainValue = button.mainValue.toLowerCase();
          if (button.otherValue) {
            button.otherValue.toLowerCase();
          }
          Array.from(button.domNode.children).forEach((child) => {
            const childEl = child;
            if (childEl.classList.contains('key__main-label')) {
              childEl.textContent = button.mainValue;
            } else if (childEl.classList.contains('key__other-label')) {
              childEl.textContent = button.otherValue;
            }
          });
        }
      });
      this.case = 'lower';
    }
  }

  changeKeyboardLang() {
    if (this.lang === 'en') {
      this.keys.forEach((key, i) => {
        if (!this.specialKeyCodes.includes(key.code) && key.code !== 'Enter' && key.code !== 'Tab') {
          key.changeLang(LayoutData[1].ru[i], this.case);
        }
      });
      this.lang = 'ru';
    } else {
      this.keys.forEach((key, i) => {
        if (!this.specialKeyCodes.includes(key.code) && key.code !== 'Enter' && key.code !== 'Tab') {
          key.changeLang(LayoutData[0].en[i], this.case);
        }
      });
      this.lang = 'en';
    }
  }

  processPressingCaps(keyCode) {
    this.isCapsLockActive = !this.isCapsLockActive;
    if (this.isCapsLockActive) {
      this.getCurrentKey(keyCode).domNode.classList
        .add(keyOptions.modifiers.keyModifiers.shiftActive);
      this.toggleCase();
    } else {
      this.getCurrentKey(keyCode).domNode.classList
        .remove(keyOptions.modifiers.keyModifiers.shiftActive);
      this.toggleCase();
    }
  }
}
