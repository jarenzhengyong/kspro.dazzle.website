class dzListCode extends dzEditableComponent {
  static getName() {
    return 'dz-list';
  }

  async _initWebEditor() {
    this.label = 'List items';
  }

  static get properties() {
    return {
    };
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzListCode.getName(), dzListCode);
