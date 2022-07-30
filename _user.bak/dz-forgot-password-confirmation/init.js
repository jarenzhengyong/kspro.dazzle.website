class dzForgotPasswordConfirmationInit extends dzEditableComponent {
  static getName() {
    return 'dz-forgot-password-confirmation-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzForgotPasswordConfirmationInit.getName(), dzForgotPasswordConfirmationInit);
