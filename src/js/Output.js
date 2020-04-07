export default class Output {
  constructor() {
    this.domNode = null;
    this.outputFieldDomNode = null;
    this.currentValue = [];
  }

  createOutput(tags, classes) {
    const outputElement = document.createElement(tags.outputTag);
    outputElement.classList.add(...classes.outputClasses);
    const outputFieldElement = document.createElement(tags.outputFieldTag);
    outputFieldElement.setAttribute('tabindex', '-1');
    outputFieldElement.setAttribute('disabled', '');
    outputFieldElement.classList.add(...classes.outputFieldClasses);
    outputFieldElement.textContent = this.currentValue.join('');

    outputElement.append(outputFieldElement);
    this.domNode = outputElement;
    this.outputFieldDomNode = this.domNode.querySelector('.output__field');
  }

  updateValue(value) {
    this.currentValue.push(value);
    this.updateDom();
  }

  updateDom() {
    this.outputFieldDomNode.textContent = this.currentValue.join('');
  }
}
