class dzCartPaymentMethodInit extends dzEditableComponent {
  static getName() {
    return 'dz-cart-payment-method-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCartPaymentMethodInit.getName(), dzCartPaymentMethodInit);
