class dzUserLoginInit extends dzEditableComponent{
  static getName() {
    return 'dz-user-login-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzUserLoginInit.getName(), dzUserLoginInit);
