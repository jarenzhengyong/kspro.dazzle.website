class dzCheckoutInit extends dzEditableComponent {
  static getName() {
    return 'dz-checkout-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzCheckoutInit.getName(), dzCheckoutInit);
