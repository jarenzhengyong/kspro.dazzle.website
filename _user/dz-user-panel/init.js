class dzUserPanelInit extends dzEditableComponent{
  static getName() {
    return 'dz-user-panel-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzUserPanelInit.getName(), dzUserPanelInit);
