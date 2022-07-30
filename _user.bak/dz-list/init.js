class dzListInit extends dzEditableComponent {
  static getName() {
    return 'dz-list-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzListInit.getName(), dzListInit);
