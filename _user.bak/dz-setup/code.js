class dzSetupCode extends dzEditableComponent {
  static getName() {
    return 'dz-setup';
  }

  async firstUpdated() {
    this.addEventListener('click', () => {
      const global = this.querySelector('dz-global');
      if (global._openGlobalDataManager) {
        global._openGlobalDataManager();
      }
    })
  }

  static get properties() {
    return {
    };
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzSetupCode.getName(), dzSetupCode);
