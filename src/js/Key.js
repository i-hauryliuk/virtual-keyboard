export default class Key {
  constructor(keyData, tags, classes, mods) {
    this.code = keyData.code;
    this.mainValue = keyData.mainValue;
    this.otherValue = keyData.otherValue;
    this.label = keyData.label;
    this.isControl = keyData.isControl;
    this.domNode = this.createDomNode(tags, classes, mods);
  }

  createDomNode(tags, classes, mods) {
    const keyElement = document.createElement(tags.keyTag);
    if (tags.keyTag === 'button') {
      keyElement.setAttribute('type', 'button');
      keyElement.setAttribute('tabindex', '-1');
    }
    keyElement.setAttribute('data-code', this.code);
    keyElement.classList.add(...classes.keyClasses);

    if (this.isControl) {
      keyElement.classList.add(...mods.keyModifiers.keyControl);
    }
    if (this.code === 'Backspace') {
      keyElement.classList.add(...mods.keyModifiers.keyBackspace);
    }
    if (this.code === 'Tab') {
      keyElement.classList.add(...mods.keyModifiers.keyTab);
    }
    if (this.code === 'CapsLock') {
      keyElement.classList.add(...mods.keyModifiers.keyCaps);
    }
    if (this.code === 'Enter') {
      keyElement.classList.add(...mods.keyModifiers.keyEnter);
    }
    if (this.code.startsWith('Shift')) {
      keyElement.classList.add(...mods.keyModifiers.keyShift);
    }
    if (this.code.startsWith('Control')) {
      keyElement.classList.add(...mods.keyModifiers.keyCtrl);
    }
    if (this.code === 'Space') {
      keyElement.classList.add(...mods.keyModifiers.keySpace);
    }

    const keyMainValueElement = document.createElement(tags.keyMainValueTag);
    keyMainValueElement.classList.add(...classes.keyMainValueClasses);
    keyMainValueElement.textContent = this.label ? this.label : this.mainValue;

    keyElement.append(keyMainValueElement);

    if (this.otherValue) {
      const keyOtherValueElement = document.createElement(tags.keyOtherValueTag);
      keyOtherValueElement.classList.add(...classes.keyOtherValueClasses);
      keyOtherValueElement.textContent = this.otherValue;
      keyElement.prepend(keyOtherValueElement);
    }

    return keyElement;
  }

  getDomNode() {
    return this.domNode;
  }

  highlight(classes) {
    this.domNode.classList.add(...classes);
  }

  deHighlight(classes) {
    this.domNode.classList.remove(...classes);
  }

  changeLang(data, kbcase) {
    this.code = data.code;
    this.mainValue = kbcase === 'upper' ? data.mainValue.toUpperCase() : data.mainValue;
    this.domNode.querySelector('.key__main-label').textContent = this.mainValue;
    if (data.otherValue) {
      this.otherValue = kbcase === 'upper' ? data.otherValue.toUpperCase() : data.otherValue;
      this.domNode.querySelector('.key__other-label').textContent = this.otherValue;
    }
    if (data.label) {
      this.label = data.label;
    }
  }
}
