class dzSliderCode extends dzEditableComponent {
  static getName() {
    return 'dz-slider';
  }

  async _initWebEditor() {
    this.label = 'Slider';
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

customElements.define(dzSliderCode.getName(), dzSliderCode);
