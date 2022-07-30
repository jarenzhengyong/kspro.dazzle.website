class dzCartShippingAddressInit extends dzEditableComponent {
  static getName() {
    return 'dz-cart-shipping-address-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCartShippingAddressInit.getName(), dzCartShippingAddressInit);
