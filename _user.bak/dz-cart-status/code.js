class dzCartStatusCode extends dzEditableComponent {
  static get is() {
    return 'dz-cart-status';
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async onCreated() {
    this._listenButtons();
    this._updateCartCounters();
    setInterval(() => {
      this._updateCartCounters()
    }, 500);
  }

  _listenButtons() {
    // Use dz-func to handle click event
    let buttons = document.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', e => {
        switch (fc) {
          case '_gotoCart':
            if (Object.keys(this.cartItems).length) {
              location.href = window.helpers.getDefaultConfig().urls.cart;
            } else {
              window.helpers.showModal(window.helpers.getDefaultConfig().messages.noItemInCart).then();
            }
            break;
        }
      });
    });
  }

  _updateCartCounters() {
    this.cartItems = window.store.get('cartItems') || {};

    let totalItems = 0;
    Object.keys(this.cartItems).forEach(key => {
      totalItems = totalItems + this.cartItems[key].quantity
    })

    this.querySelector('.cart-counter').innerText = totalItems;
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }
}

customElements.define(dzCartStatusCode.is, dzCartStatusCode);
