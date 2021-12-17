
class dzItem extends dzEditableComponent{
  constructor(elm) {
    
    this._listenDzFunction(elm);
    this._handleCartStatus(elm);
    this._handleLikeStatus(elm);


  }

  // async onCreated() {
  //   await this._listenDzFunction(elm);
  //   // this._handleCartStatus();
  //   // this._handleLikeStatus();
  // }

  _handleCartStatus(elm) {
    const cartItemIds = window.store.get('cartItems') || {};
    const itemId = elm.id;
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

  _handleLikeStatus(elm) {
    const likedItems = window.store.get('likedItems') || {};
    const itemId = elm.getAttribute('id');
    const btnLikeItem = elm.querySelector('.btn-like-item');
    const btnUnlikeItem = elm.querySelector('.btn-unlike-item');
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

  _onClickItemImage(elm) {
    window.location.href = `/product/${elm.id}`;
  }

  async _listenDzFunction(elm) {
    let buttons = elm.querySelectorAll('[dz-func]');

    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', () => {
        switch (fc) {
          case '_clickItemImage':
            this._onClickItemImage(elm);
            break;
          case '_clickAddToCart':
            this._onClickAddToCart(elm);
            break;
          case '_clickRemoveFromCart':
            this._onClickRemoveFromCart(elm);
            break;
          case '_clickLikeItem':
            this._onClickLikeItem(elm);
            break;
          case '_clickUnlikeItem':
            this._onClickUnlikeItem(elm);
            break;
        }
      });
    });
  }

  async _onClickRemoveFromCart(elm) {
    const itemId = elm.id;
    const cartItems = window.store.get('cartItems') || {};
    if (cartItems[itemId]) {
      delete cartItems[itemId];
      window.store.set('cartItems', cartItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.removeItemFromCartSuccessfully, {autoClose: true});
    }

    this._handleCartStatus(elm);
  }

  async _onClickAddToCart(elm) {
    const itemId = elm.id;
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

  async _onClickLikeItem(elm) {
    const itemId = elm.id;
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

    this._handleLikeStatus(elm);
  }

  async _onClickUnlikeItem(elm) {
    const itemId = elm.id;
    const likedItems = window.store.get('likedItems') || {};
    if (likedItems[itemId]) {
      delete likedItems[itemId];
      window.store.set('likedItems', likedItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.unlikeItemSuccessfully, {autoClose: true});
    }

    this._handleLikeStatus(elm);
  }

 
}

