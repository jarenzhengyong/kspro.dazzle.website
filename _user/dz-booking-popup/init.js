class dzUserRegisterConfirmationInit extends dzEditableComponent{
  static getName() {
    return 'dz-user-register-confirmation-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzUserRegisterConfirmationInit.getName(), dzUserRegisterConfirmationInit);
