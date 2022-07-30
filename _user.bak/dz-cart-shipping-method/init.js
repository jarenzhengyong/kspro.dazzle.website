class dzCartShippingMethodInit extends dzEditableComponent {
  static getName() {
    return 'dz-cart-shipping-method-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCartShippingMethodInit.getName(), dzCartShippingMethodInit);
