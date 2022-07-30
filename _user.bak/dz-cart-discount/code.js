class dzCartDiscountCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-cart-discount';
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
    await this._listenDzFunction();
    await this.showCurrentDiscount();
  }

  async showCurrentDiscount() {
    const cartDiscount = window.store.get('cartDiscount') || {
      code: '',
      amount: 0,
    };

    this.querySelector('input').value = cartDiscount.code;
  }

  async _onClickApplyCoupon() {
    let cartDiscount = {
      code: '',
      amount: 0,
    }

    const code = this.querySelector('input').value;

    // Mock coupon
    if (code === 'OFF100') {
      cartDiscount.code = code;
      cartDiscount.amount = 100;
    }

    if (code === 'OFF500') {
      cartDiscount.code = code;
      cartDiscount.amount = 500;
    }

    window.store.set('cartDiscount', cartDiscount);

    if (cartDiscount.code) {
      window.store.set('cartChanged', new Date().getTime())
      await window.helpers.showModal('Coupon was applied');
    } else {
      this.querySelector('input').value = '';
      await window.helpers.showModal('Coupon is invalid');
    }

  }

  async _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');

    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', () => {
        switch (fc) {
          case '_applyCoupon':
            this._onClickApplyCoupon();
            break;
        }
      });
    });
  }
}

customElements.define(dzCartDiscountCode.is, dzCartDiscountCode);
