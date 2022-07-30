class dzCartDiscountInit extends dzEditableComponent {
  static getName() {
    return 'dz-cart-discount-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCartDiscountInit.getName(), dzCartDiscountInit);
