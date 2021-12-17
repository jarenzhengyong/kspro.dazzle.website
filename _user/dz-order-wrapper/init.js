class dzOrderWrapperInit extends dzEditableComponent {
  static getName() {
    return 'dz-order-wrapper-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzOrderWrapperInit.getName(), dzOrderWrapperInit);
