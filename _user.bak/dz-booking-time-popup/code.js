class dzBookingTimePopup extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-booking-time-popup';
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
    
    // document.addEventListener('DOMContentLoaded', function() {
      console.log('Create Calendar');
      var calendarEl = this;
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'listDay',
        customButtons: {
          bookButton: {
            text: '預約',
            click: function() {
                alert('Start Booking');
            }
          },
        },
        headerToolbar: {
          right: 'bookButton'
        },
        // resources:[
        //   { id: 'a', title: '房A' },
        //   { id: 'b', title: '房B'},
        //   { id: 'c', title: '房C' },
        // ],
        // visibleRange: {
        //   start: '09:00',
        //   end: '20:00'
        // },
        events: [
          {
            title: '紫砂療程',
            start: '2021-09-30T14:30:00',
            end: '2021-09-30T16:30:00',
            extendedProps: {
              status: 'done'
            }
          },
          {
            title: '美容',
            start: '2021-09-30T17:00:00',
            end: '2021-09-30T18:30:00'
          }
        ],
      });
      calendar.render();
      calendar.changeView('listDay', '2021-09-30');
    // });
  }
}

customElements.define(dzBookingTimePopup.is, dzBookingTimePopup);
