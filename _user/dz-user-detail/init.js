class dzUserProfileInit extends dzEditableComponent{
  static getName() {
    return 'dz-user-profile-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzUserProfileInit.getName(), dzUserProfileInit);
