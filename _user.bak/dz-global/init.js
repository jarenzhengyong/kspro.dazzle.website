class dzGlobalInit extends dzEditableComponent {
  static getName() {
    return 'dz-global-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzGlobalInit.getName(), dzGlobalInit);
