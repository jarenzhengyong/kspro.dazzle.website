class dzOrderItemInit extends dzEditableComponent {
  static getName() {
    return 'dz-order-item-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzOrderItemInit.getName(), dzOrderItemInit);
