class dzProductDetailInit extends dzEditableComponent {
  static getName() {
    return 'dz-product-detail-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzProductDetailInit.getName(), dzProductDetailInit);
