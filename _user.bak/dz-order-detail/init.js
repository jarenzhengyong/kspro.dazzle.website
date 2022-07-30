class dzOrderDetailInit extends dzEditableComponent {
  static getName() {
    return 'dz-order-detail-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzOrderDetailInit.getName(), dzOrderDetailInit);
