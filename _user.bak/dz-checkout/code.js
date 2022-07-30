class dzCheckoutCode extends dzEditableComponent {
  constructor() {
    super();
    this.itemsManager = new DataPackage('product');
    this.dataCartItems = null;
    this.total = 0;
  }

  static get is() {
    return 'dz-checkout';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async _checkCartHasItems() {
    const cartItems = window.store.get('cartItems');
    if (!cartItems) {
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.noItemInCart, {autoClose: true});
      setTimeout(() => {
        location.href = '/';
      });
    }
  }

  async _checkLogin() {
    const authToken = window.store.get('token');
    if (!authToken) {
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.loginRequired, {autoClose: false});
      setTimeout(() => {
        location.href = window.helpers.getDefaultConfig().urls.login;
      });
    }
  }
  async cartToDesc(products){
    let str = '';
    products.forEach(item=>{
        let title = item.name + 'x'+item.quantity;
        str += title+',';
    });
    return str;
  }

  async _calculateSummary() {
    const cartItems = window.store.get('cartItems');

    const products = await this.itemsManager.searchDataByES({
      'ids': {
        'type': '_doc',
        'values': Object.keys(cartItems),
      },
    });

    let subTotal = 0;
    const cartProducts = [];
    products.forEach(item => {
      if (cartItems[item.id]) {
        subTotal = subTotal + cartItems[item.id].quantity * item.price;

        // Mapping to use in Paypal checkout
        cartProducts.push({
          id: item.id,
          name: item.title,
          description: item.title,
          sku: item.id,
          quantity: cartItems[item.id].quantity,
          unit_amount: {
            currency_code: window.helpers.getDefaultConfig().paypal.currency,
            price: item.price
          },
        });
        // Mapping to use in Paypal checkout -- END
      }
    });

    window.store.set('cartProducts', cartProducts);
    this.cartToDesc(cartProducts);

    const cartDiscount = window.store.get('cartDiscount') || {amount: 0};
    const shippingMethod = window.store.get('shippingMethod') || {amount: 0};

    // this.querySelector('.summary-subTotal').innerText = `$${window.helpers.formatNumber(subTotal)}`;
    // this.querySelector('.summary-shippingMethod').innerText = `$${window.helpers.formatNumber(shippingMethod.amount)}`;
    // this.querySelector('.summary-cartDiscount').innerText = `$${window.helpers.formatNumber(cartDiscount.amount)}`;
    // this.querySelector('.summary-total').innerText = `$${window.helpers.formatNumber(subTotal + shippingMethod.amount - cartDiscount.amount)}`;
    this.total = subTotal + shippingMethod.amount - cartDiscount.amount;
    console.log('Total',this.total,shippingMethod.amount,cartDiscount.amount);
    // Handle checkout button
    const paymentMethod = window.store.get('paymentMethod');
    // this.querySelectorAll('[data-payment-method]').forEach(button => {
    //   const method = button.getAttribute('data-payment-method');
    //   if (paymentMethod && paymentMethod.key === method) {
    //     button.style.display = 'block';
    //   } else {
    //     button.style.display = 'none';
    //   }
    // });
  }

  async loadPaypalSdk() {
    await window.helpers.loadScript(`https://www.paypal.com/sdk/js?currency=${window.helpers.getDefaultConfig().paypal.currency}&client-id=${window.helpers.getDefaultConfig().paypal.clientId}`);

    window.paypal['Buttons']({
      createOrder: (data, actions) => {
        console.log('this.total', this.total,this.order);
        return actions.order.create({
          purchase_units: [
            {
              reference_id: this.order.id,
              description: 'T2 checkout',
              custom_id: 'TODO',
              soft_descriptor: 'Mingkee checkout',
              amount: {
                currency_code: window.helpers.getDefaultConfig().paypal.currency,
                value: this.total,
                breakdown: {
                  item_total: {
                    currency_code: window.helpers.getDefaultConfig().paypal.currency,
                    value: this.total
                  }
                }
              },
              // items: window.store.get('cartProducts'),
            }],
          application_context: {
            brand_name: 'Mingkee payment',
            // TODO implement handle shipping address
          }
        });
      },
      onApprove: async (data, actions) => {
        console.log('OnApprove', data, actions);
        setTimeout(async () => {
          await this._handleSubmitOrder(true)
        })
      }
    }).render('.paypal-button-container');
  }

  async onCreated() {
    // await this._checkCartHasItems();
    // await this._checkLogin();
    // await this._calculateSummary();
    // this.intervalCheckCart();

    // Load paypal if it is support payment methods
    // for (let i = 0; i < window.helpers.getDefaultConfig().paymentMethods.length; i++) {
    //   if (window.helpers.getDefaultConfig().paymentMethods[i].key === 'paypal') {
    //     await this.loadPaypalSdk();
    //   }
    // }

    //await this.loadPaypalSdk();
    // Interval detect changes
    this.currentState = {
      cartItems: window.store.get('cartItems') || {},
      shippingMethod: window.store.get('shippingMethod') || {
        amount: 0,
      },
      paymentMethod: window.store.get('paymentMethod') || {
        amount: 0,
      },
      cartDiscount: window.store.get('cartDiscount') || {
        amount: 0,
      },
      cartChanged: window.store.get('cartChanged'),
    };

    // setInterval(async () => {
    //   const lastState = {
    //     cartItems: window.store.get('cartItems') || {},
    //     shippingMethod: window.store.get('shippingMethod') || {
    //       amount: 0,
    //     },
    //     paymentMethod: window.store.get('paymentMethod') || {
    //       amount: 0,
    //     },
    //     cartDiscount: window.store.get('cartDiscount') || {
    //       amount: 0,
    //     },
    //     cartChanged: window.store.get('cartChanged'),
    //   };

    //   if (JSON.stringify(lastState) !== JSON.stringify(this.currentState)) {
    //     this.currentState = JSON.parse(JSON.stringify(lastState));
    //     await this._calculateSummary();
    //   }
    // }, window.helpers.getDefaultConfig().intervalCartCheck);

    await this._listenButtons();
  }
  async _listenButtons() {
    let buttons = this.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', async (e) => {
        switch (fc) {
          case '_submitOrder':
            await this._calculateSummary();
            await this._handleSubmitOrder();
            await this.loadPaypalSdk();
            item.style.display = 'none'
            break;
        }
      });
    });
  }
  /* async _booking(){
    let dzPopup = document.createElement('dz-booking-popup');
    dzPopup.width = '600px';
    dzPopup.height = '400px';
    dzPopup.dialog = document.querySelector('vaadin-dialog');
    Dazzle.componentPopup(dzPopup, dzPopup.width, dzPopup.height);
    this.loadPaypalSdk();
  } */
  async _cleanCart() {
    localStorage.removeItem('shippingMethod');
    localStorage.removeItem('cartDiscount');
    localStorage.removeItem('cartChanged');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  }

  intervalCheckCart() {
    const check = () => {
      const order = {
        'cartItems': window.store.get('cartItems'),
        'shippingAddress': window.store.get('shippingAddress'),
        'shippingMethod': window.store.get('shippingMethod'),
        'paymentMethod': window.store.get('paymentMethod'),
        'cartDiscount': window.store.get('cartDiscount'),
      };

      // if (order.shippingAddress && order.shippingMethod && order.paymentMethod) {
      //   this.querySelector('.wrap-checkout-buttons').style.display = 'block';
      // } else {
      //   this.querySelector('.wrap-checkout-buttons').style.display = 'none';
      // }
    }

    check();

    setInterval(() => {
      check();
    }, window.helpers.getDefaultConfig().intervalCartCheck)
  }


  async _getValidOrder() {
    console.log('User',store.get('subUser'));
    let cartProducts = window.store.get('cartProducts');
    let cartDesc = await this.cartToDesc(cartProducts);
    
    const order = {
      'cartItems': window.store.get('cartItems'),
      'description': cartDesc,
      'shippingAddress': '-',
      'shippingMethod': '自取',
      'paymentMethod':  'payPal',
      'date': new Date().getTime(),
      'total':this.total
    };
    
    if (!order.cartItems) {
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.noItemInCart);
      return;
    }

    // if (!order.shippingAddress) {
    //   await window.helpers.showModal(window.helpers.getDefaultConfig().messages.shippingAddressRequired);
    //   return;
    // }

    // if (!order.shippingMethod) {
    //   await window.helpers.showModal(window.helpers.getDefaultConfig().messages.shippingMethodRequired);
    //   return;
    // }

    // if (!order.paymentMethod) {
    //   await window.helpers.showModal(window.helpers.getDefaultConfig().messages.paymentMethodRequired);
    //   return;
    // }

    return order;
  }

  async _handleSubmitOrder(isPaid = false) {
    const order = await this._getValidOrder();
    if (isPaid)
      order.status = 'paid';
    else
      order.status = 'not paid';
    console.log('Before',order);
    if (!order) {
      return;
    }
    this.order = order;
    const orderRes = await window.authUser().submitOrder({
      ...order,
      status: isPaid ? window.helpers.getDefaultConfig().orderStatus.inProgress.key : window.helpers.getDefaultConfig().orderStatus.new.key,
    });
    await window.helpers.showModal(window.helpers.getDefaultConfig().messages.submitOrderSuccessfully);

    await this._cleanCart();
    //location.href="/user-profile.html";
    // location.href = `${window.helpers.getDefaultConfig().urls.orderDetail}?id=${orderRes.data.data.id}`;
  }
}

customElements.define(dzCheckoutCode.is, dzCheckoutCode);
