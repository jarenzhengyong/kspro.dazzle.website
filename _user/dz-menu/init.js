class dzMenuListInit extends dzEditableComponent {
  static getName() {
    return 'dz-menu-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzMenuListInit.getName(), dzMenuListInit);
