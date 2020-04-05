export default class Key {
  constructor(keyData, tags, classes) {
    this.code = keyData.code;
    this.mainValue = keyData.mainValue;
    this.otherValue = keyData.otherValue;
    this.domNode = this.createDomNode(tags, classes);
  }

  createDomNode(tags, classes) {
    const keyElement = document.createElement(tags.keyTag);
    if (tags.keyTag === 'button') {
      keyElement.setAttribute('type', 'button');
    }
    keyElement.classList.add(...classes.keyClasses);

    const keyMainValueElement = document.createElement(tags.keyMainValueTag);
    keyMainValueElement.classList.add(...classes.keyMainValueClasses);
    keyMainValueElement.textContent = this.mainValue;

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
}
