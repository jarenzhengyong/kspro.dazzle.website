class dzSetupInit extends dzEditableComponent{
  static getName() {
    return 'dz-setup-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzSetupInit.getName(), dzSetupInit);
