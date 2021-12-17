class dzCartStatusInit extends dzEditableComponent {
  static getName() {
    return 'dz-cart-status-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCartStatusInit.getName(), dzCartStatusInit);
