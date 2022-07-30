class dzBookingPopup extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-booking-popup';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }


  async onCreated() {
    
    document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = this;
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth'
      });
      calendar.render();
    });
  }
}

customElements.define(dzBookingPopup.is, dzBookingPopup);
