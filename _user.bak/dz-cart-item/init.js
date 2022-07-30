class dzCartItemInit extends dzEditableComponent {
  static getName() {
    return 'dz-cart-item-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCartItemInit.getName(), dzCartItemInit);
