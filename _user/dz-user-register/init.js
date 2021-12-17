class dzUserRegisterInit extends dzEditableComponent{
  static getName() {
    return 'dz-user-register-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzUserRegisterInit.getName(), dzUserRegisterInit);
