
// class cartItemPackage extends dzEditableComponent{
        
    

//     constructor(elm){
//         this = elm;
//         this._listenDzFunction();
//         this._handleCartStatus();
//         this._handleLikeStatus();
//     }
  
//     _handleCartStatus() {
//         const cartItemIds = window.store.get('cartItems') || {};
//         const itemId = this.elm.id;
//         const elm = this.elm;
//         const btnAddCart = elm.querySelector('.btn-add-cart');
//         const btnRemoveCart = elm.querySelector('.btn-remove-cart');
//         const hasCartBtns = btnAddCart || btnRemoveCart;
//         if (hasCartBtns) {
//           if (cartItemIds[itemId]) {
//             btnAddCart.style.display = 'none';
//             btnRemoveCart.style.display = '';
//           } else {
//             btnAddCart.style.display = '';
//             btnRemoveCart.style.display = 'none';
//           }
//         }
//       }
    
//       _handleLikeStatus() {
//         const likedItems = window.store.get('likedItems') || {};
//         const itemId = this.elm.id;
//         const btnLikeItem = this.elm.querySelector('.btn-like-item');
//         const btnUnlikeItem = this.elm.querySelector('.btn-unlike-item');
//         const hasStatusBtns = btnLikeItem || btnUnlikeItem;
//         if (hasStatusBtns) {
//           if (likedItems[itemId]) {
//             btnLikeItem.style.display = 'none';
//             btnUnlikeItem.style.display = '';
//           } else {
//             btnLikeItem.style.display = '';
//             btnUnlikeItem.style.display = 'none';
//           }
//         }
//       }
    
//       _onClickItemImage() {
//         window.location.href = `/product/${this.id}`;
//       }
    
//       async _listenDzFunction() {
//         let buttons = this.elm.querySelectorAll('[dz-func]');
    
//         buttons.forEach(item => {
//           let fc = item.getAttribute('dz-func') || null;
//           item.addEventListener('click', () => {
//             switch (fc) {
//               case '_ItemImage':
//                 this._onClickItemImage();
//                 break;
//               case '_AddToCart':
//                 this._onClickAddToCart();
//                 break;
//               case '_RemoveFromCart':
//                 this._onClickRemoveFromCart();
//                 break;
//               case '_LikeItem':
//                 this._onClickLikeItem();
//                 break;
//               case '_UnlikeItem':
//                 this._onClickUnlikeItem();
//                 break;
//             }
//           });
//         });
//       }
    
//       async _onClickRemoveFromCart() {
//         const itemId = this.elm.id;
//         const cartItems = window.store.get('cartItems') || {};
//         if (cartItems[itemId]) {
//           delete cartItems[itemId];
//           window.store.set('cartItems', cartItems);
//           await window.helpers.showModal(window.helpers.getDefaultConfig().messages.removeItemFromCartSuccessfully, {autoClose: true});
//         }
//         Dazzle.dzFire('cart-change',{});
//         // this._handleCartStatus();
//       }
    
//       async _onClickAddToCart() {
//         const itemId = this.elm.id;
//         const cartItems = window.store.get('cartItems') || {};
//         if (!cartItems[itemId]) {
//           cartItems[itemId] = {
//             id: itemId,
//             quantity: 1,
//           };
//           window.store.set('cartItems', cartItems);
//           await window.helpers.showModal(window.helpers.getDefaultConfig().messages.addItemToCartSuccessfully, {autoClose: true});
//         } else {
//           cartItems[itemId]['quantity']++;
//           window.store.set('cartItems', cartItems);
//           await window.helpers.showModal(window.helpers.getDefaultConfig().messages.addItemToCartSuccessfully, {autoClose: true});
//           // await window.helpers.showModal(window.helpers.getDefaultConfig().messages.itemAlreadyInCart, {autoClose: true});
//         }
    
//         Dazzle.dzFire('cart-change',{});
//         // this._handleCartStatus();
//       }
    
//       async _onClickLikeItem() {
//         const itemId = this.elm.id;
//         const likedItems = window.store.get('likedItems') || {};
//         if (!likedItems[itemId]) {
//           likedItems[itemId] = {
//             id: itemId
//           };
//           window.store.set('likedItems', likedItems);
//           await window.helpers.showModal(window.helpers.getDefaultConfig().messages.likeItemSuccessfully, {autoClose: true});
//         } else {
//           await window.helpers.showModal(window.helpers.getDefaultConfig().messages.itemAlreadyLiked, {autoClose: true});
//         }
    
//         this._handleLikeStatus();
//       }
    
//       async _onClickUnlikeItem() {
//         const itemId = this.elm.id;
//         const likedItems = window.store.get('likedItems') || {};
//         if (likedItems[itemId]) {
//           delete likedItems[itemId];
//           window.store.set('likedItems', likedItems);
//           await window.helpers.showModal(window.helpers.getDefaultConfig().messages.unlikeItemSuccessfully, {autoClose: true});
//         }
    
//         this._handleLikeStatus();
//       }
    

// }
// window['cartItemPackage'] = cartItemPackage;
// export {cartItemPackage};



class dzCartItemCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-cart-item';
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
  }

  async _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');
    let qtyValue = this.querySelector('[dz-cart-item-qty]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', () => {
        switch (fc) {
          case '_clickItemImage':
            this._onClickItemImage();
            break;
          case '_removeFromCart':
            this._onClickRemoveFromCart();
            break;
        }
      });
    });
    qtyValue.addEventListener('change',e=>{
        this._updateCart();
       
    });


  }

  _onClickItemImage() {
    const itemId = this.getAttribute('id');
    //location.href = `/product/${itemId}`;
    location.href = `/productdetail.html#${itemId}`;
  }

  async _onClickRemoveFromCart() {
    const itemId = this.getAttribute('id');
    const cartItems = window.store.get('cartItems') || {};
    if (cartItems[itemId]) {
      delete cartItems[itemId];
      window.store.set('cartItems', cartItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.removeItemFromCartSuccessfully, {autoClose: true});
    }
    Dazzle.dzFire('cart-change',{});
    // window.store.set('cartChanged', new Date().getTime());
  }
  _setStore(key, value) {
    window.store.set(key, value);
  }

  _getStore(key) {
    return window.store.get(key);
  }
  async _updateCart() {
    const productId = this.id;
    console.log('Cart Item',productId);
    const cartItems = this._getStore('cartItems') || {};
    const purchaseQuantity = Number(this.querySelector('[dz-cart-item-qty]').value);
    const updatedCartItems = {
      ...cartItems,
      [productId]: {
        id: productId,
        quantity: purchaseQuantity,
      },
    };
    await window['helpers'].showModal('Cart Updated', {autoClose: true});
    this._setStore('cartItems', updatedCartItems);
    console.log('Cart Json',updatedCartItems);
    Dazzle.dzFire('cart-change',{});
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

customElements.define(dzCartItemCode.is, dzCartItemCode);
