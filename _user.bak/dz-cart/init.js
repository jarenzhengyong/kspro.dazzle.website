class dzCartInit extends dzEditableComponent {
  static getName() {
    return 'dz-cart-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCartInit.getName(), dzCartInit);
