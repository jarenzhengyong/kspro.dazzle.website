// import '../dz-cart-item/code.js';
class dzCartCode extends dzEditableComponent {
  static get is() {
    return 'dz-cart';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async loadPlugins() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);
  }

  async _listenButtons() {
    let buttons = document.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', e => {
        switch (fc) {
          case '_updateCart':
            this._updateCart();
            break;
          case '_clickGoToCheckout':
            this._handleGoToCheckout();
            break;
          default:
            break;
        }
      });
    });
  }
  
  async _handleGoToCheckout() {
    location.href = window.helpers.getDefaultConfig().urls.checkout;
  }

  async _updateCart() {
    const inputs = this.querySelectorAll('.item-quantity');
    const cartItems = window.store.get('cartItems');

    inputs.forEach(input => {
      const id = input.getAttribute('data-id');
      let quantity;
      try {
        quantity = Number(Math.round(input.value));
      } catch (e) {
        quantity = 1;
      }

      try {
        cartItems[id].quantity = quantity;
      } catch (e) {}
    });

    window.store.set('cartItems', cartItems);

    // Reload
    await this._updateCartInfo();

    await window.helpers.showModal(window.helpers.getDefaultConfig().messages.updateCartSuccessfully, {autoClose: true})
  }

  async onCreated() {
    this.productManager = new DataPackage('product');
    await this.loadPlugins();
    await this._listenButtons();
    await this._updateCartInfo();
    console.log(this.productManager, '888888')
    // Interval detect changes
    this.currentCartState = {
      cartItems: window.store.get('cartItems') || {},
      shippingMethod: window.store.get('shippingMethod') || {
        amount: 0
      },
      cartDiscount: window.store.get('cartDiscount') || {
        amount: 0
      },
      cartChanged: window.store.get('cartChanged'),
    }
    console.log(this.currentCartState, '1909090990')
    document.addEventListener('cart-change',e=>{
      console.log('Cart Change');
        this._updateCartInfo();
    });


    // setInterval(async () => {
    //   const lastCartState = {
    //     cartItems: window.store.get('cartItems') || {},
    //     shippingMethod: window.store.get('shippingMethod') || {
    //       amount: 0
    //     },
    //     cartDiscount: window.store.get('cartDiscount') || {
    //       amount: 0
    //     },
    //     cartChanged: window.store.get('cartChanged'),
    //   }

    //   if (JSON.stringify(lastCartState) !== JSON.stringify(this.currentCartState)) {
    //     this.currentCartState = JSON.parse(JSON.stringify(lastCartState));
    //     await this._updateCartInfo();
    //   }
    // }, window.helpers.getDefaultConfig().intervalCartCheck);
  }

  async _updateCartInfo() {
    const cartItems = window.store.get('cartItems') || {};
    const itemIds = Object.keys(cartItems);
    

    const products = await this.productManager.searchDataByES({
      'ids': {
        'type': '_doc',
        'values': itemIds,
      },
    })
    console.log(products, '09909090');



    const dataWrapper = this.querySelector('[data-wrapper]');
    // const cartItemTemplate = this.querySelector('template.cart-item').innerHTML;
    const cartItemTemplate = this._template['cart-item'];
    let htmlContent = '';
    let subTotal = 0;
    dataWrapper.innerHTML = '';
    products.forEach(item => {
      try {
        item.cartQuantity = cartItems[item.id].quantity;
      } catch (e) {
        item.cartQuantity = 1;
      }
      if (!item.shortDesc) 
        item.shortDesc = '';
      item.subTotal = item.cartQuantity * item.price;
      subTotal = subTotal + item.subTotal;

      htmlContent  =this.productManager.replaceToken(item, cartItemTemplate);
      let elm = document.createElement('tr');
      elm.className = 'cross';
      elm.innerHTML = htmlContent;
      // let elm = this.htmlToElement(htmlContent);
      elm.id = item.id;
      // new ItemPackage(elm);
      // new dzCartItemCode(elm);
      console.log(elm, subTotal,'90099009')
      dataWrapper.appendChild(elm);
    })
    // dataWrapper.innerHTML = htmlContent;
    
    const shippingMethod = window.store.get('shippingMethod') || {
      type: 'free',
      amount: 15
    }
    window.store.set('shippigMethod',shippingMethod);

    const cartDiscount = window.store.get('cartDiscount') || {
      code: '',
      amount: 0
    }
    window.store.set('cartDiscount',cartDiscount);
    
    const cartItemTotal = products.length;
    try {
      if (!products.length) {
        this.querySelector('[dz-cart-no-item]').style.display = "block";      
        this.querySelector('[dz-cart-have-item]').style.display = "none";      
      } else {
        this.querySelector('[dz-cart-no-item]').style.display = "none";      
        this.querySelector('[dz-cart-have-item]').style.display = "block";    
      }
      this.updateAttrValue('dz-order-subtotal',`${window.helpers.formatNumber(subTotal)}`);
      // this.updateAttrValue('dz-cart-item-total',cartItemTotal);
      // this.updateAttrValue('dz-order-shipping',`$${window.helpers.formatNumber(shippingMethod.amount)}`);
      // this.updateAttrValue('dz-order-discount',`$${window.helpers.formatNumber(cartDiscount.amount)}`);
      this.updateAttrValue('dz-order-total', `${window.helpers.formatNumber(subTotal + shippingMethod.amount - cartDiscount.amount)}`);
    }catch(e){
        console.log('Cart Update Error');
    }

  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }
}

customElements.define(dzCartCode.is, dzCartCode);
