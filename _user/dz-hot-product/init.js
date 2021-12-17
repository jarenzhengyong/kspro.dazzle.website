class dzProductWrapperInit extends dzEditableComponent{
  static getName() {
    return 'dz-product-wrapper-init';
  }

  async onCreated() {
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzProductWrapperInit.getName(), dzProductWrapperInit);
