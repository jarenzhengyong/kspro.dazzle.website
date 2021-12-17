class dzForgotPasswordInit extends dzEditableComponent {
  static getName() {
    return 'dz-forgot-password-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzForgotPasswordInit.getName(), dzForgotPasswordInit);
