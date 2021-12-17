class dzProductItemCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-product-item';
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
    this._handleCartStatus();
    this._handleLikeStatus();
  }

  _handleCartStatus() {
    const cartItemIds = window.store.get('cartItems') || {};
    const itemId = this.getAttribute('id');
    const btnAddCart = this.querySelector('.btn-add-cart');
    const btnRemoveCart = this.querySelector('.btn-remove-cart');
    const hasCartBtns = btnAddCart || btnRemoveCart;
    if (hasCartBtns) {
      if (cartItemIds[itemId]) {
        btnAddCart.style.display = 'none';
        btnRemoveCart.style.display = '';
      } else {
        btnAddCart.style.display = '';
        btnRemoveCart.style.display = 'none';
      }
    }
  }

  _handleLikeStatus() {
    const likedItems = window.store.get('likedItems') || {};
    const itemId = this.getAttribute('id');
    const btnLikeItem = this.querySelector('.btn-like-item');
    const btnUnlikeItem = this.querySelector('.btn-unlike-item');
    const hasStatusBtns = btnLikeItem || btnUnlikeItem;
    if (hasStatusBtns) {
      if (likedItems[itemId]) {
        btnLikeItem.style.display = 'none';
        btnUnlikeItem.style.display = '';
      } else {
        btnLikeItem.style.display = '';
        btnUnlikeItem.style.display = 'none';
      }
    }
  }

  _onClickItemImage() {
    window.location.href = `/product/${this.id}`;
  }

  async _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');

    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', () => {
        switch (fc) {
          case '_clickItemImage':
            this._onClickItemImage();
            break;
          case '_clickAddToCart':
            this._onClickAddToCart();
            break;
          case '_clickRemoveFromCart':
            this._onClickRemoveFromCart();
            break;
          case '_clickLikeItem':
            this._onClickLikeItem();
            break;
          case '_clickUnlikeItem':
            this._onClickUnlikeItem();
            break;
        }
      });
    });
  }

  async _onClickRemoveFromCart() {
    const itemId = this.getAttribute('id');
    const cartItems = window.store.get('cartItems') || {};
    if (cartItems[itemId]) {
      delete cartItems[itemId];
      window.store.set('cartItems', cartItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.removeItemFromCartSuccessfully, {autoClose: true});
    }

    this._handleCartStatus();
  }

  async _onClickAddToCart() {
    const itemId = this.getAttribute('id');
    const cartItems = window.store.get('cartItems') || {};
    if (!cartItems[itemId]) {
      cartItems[itemId] = {
        id: itemId,
        quantity: 1,
      };
      window.store.set('cartItems', cartItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.addItemToCartSuccessfully, {autoClose: true});
    } else {
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.itemAlreadyInCart, {autoClose: true});
    }

    this._handleCartStatus();
  }

  async _onClickLikeItem() {
    const itemId = this.getAttribute('id');
    const likedItems = window.store.get('likedItems') || {};
    if (!likedItems[itemId]) {
      likedItems[itemId] = {
        id: itemId
      };
      window.store.set('likedItems', likedItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.likeItemSuccessfully, {autoClose: true});
    } else {
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.itemAlreadyLiked, {autoClose: true});
    }

    this._handleLikeStatus();
  }

  async _onClickUnlikeItem() {
    const itemId = this.getAttribute('id');
    const likedItems = window.store.get('likedItems') || {};
    if (likedItems[itemId]) {
      delete likedItems[itemId];
      window.store.set('likedItems', likedItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.unlikeItemSuccessfully, {autoClose: true});
    }

    this._handleLikeStatus();
  }

  getToken(html) {
    var re = new RegExp('(\[\[([0-9a-zA-Z_| ]*)\]\])');
    const regexp = /(\[\[([0-9a-zA-Z_| ]*)\]\])/g;
    const array = [...html.matchAll(regexp)];
    array.forEach(item => {
      let orgItem, token, action, result;
      orgItem = item;
      item = item.replace('[[', '');
      item = item.replace(']]', '');
      [token, action] = item.split('|');
      token = trim(token);
      action = trim(action);
      result = this.preprocess(token, action);
      html = html.replace(orgItem, result);
    });
    return html;
  }

  replaceToken(data, html) {
    let index = this.index;
    data = reformData(data);
    // var re = new RegExp('(\[\[([0-9a-zA-Z_| ]*)\]\])');
    const regexp = /(\[\[([0-9a-zA-Z_| ]*)\]\])/g;
    const array = [...html.matchAll(regexp)];
    let arr = [];
    array.forEach(item => {
      arr.push(item[0]);
    });

    console.log('Array', array);
    arr.forEach(item => {

      let orgItem, token, action, result;
      if (item) {
        console.log('Item', item);
        orgItem = item;
        item = item.replace('[[', '');
        item = item.replace(']]', '');
        [token, action] = item.split('|');
        if (typeof action === 'undefined')
          action = null;
        console.log('Token', token, action);
        token = token.trim();
        token = data[token];

        if (action)
          action = action.trim();

        else
          action = null;

        if (action)
          result = this.preprocess(token, action);
        else
          result = token;

        html = html.replace(orgItem, result);

      }

    });

    return html;

    // for(let k in data){
    //     let token = "[["+k+"]]";
    //     html = html.replaceAll(token,data[k]);

    //     console.log('Token',token,data[k]);
    // }
    // return html;

    function reformData(data) {
      data['_index'] = index;
      for (let k in data) {
        if (Array.isArray(data[k])) {
          let item = data[k];
          for (let i = 0; i < item.length; i++)
            data[k + i.toString()] = item[i];
        }
      }
      return data;
    }

  }
}

customElements.define(dzProductItemCode.is, dzProductItemCode);
