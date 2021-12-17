class dzBookingPopup extends dzEditableComponent {
  constructor() {
    super();
  }
  static get is() {
    return 'dz-booking-popup';
  }
  render() {
    return this.html`
        <vaadin-dialog></vaadin-dialog>
        <slot></slot>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
  }
  async onCreated() {
    
  }
}

customElements.define(dzBookingPopup.is, dzBookingPopup);
