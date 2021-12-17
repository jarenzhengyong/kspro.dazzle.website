class dzSliderInit extends dzEditableComponent{
  static getName() {
    return 'dz-slider-init';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzSliderInit.getName(), dzSliderInit);
