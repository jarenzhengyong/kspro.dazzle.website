class dzBlockInit extends dzEditableComponent {
  static getName() {
    return 'dz-block-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzBlockInit.getName(), dzBlockInit);
