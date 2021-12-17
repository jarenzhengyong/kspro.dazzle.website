class dzProductItemInit extends dzEditableComponent {
  static getName() {
    return 'dz-product-item-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzProductItemInit.getName(), dzProductItemInit);
