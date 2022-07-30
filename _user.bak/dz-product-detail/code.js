// const { join } = require("path/posix");

class dzProductDetailCode extends dzEditableComponent {
  static getName() {
    return 'dz-product-detail';
  }

  async _initWebEditor() {
    this.label = 'Product detail';
    this.contextMenuWidth = 300;
    try {
      this.recordId = document.querySelector('[property="dz:data-id"]').getAttribute('content');
    } catch(e){
      this.recordId = this.getProductId();
    }

    // this.tableId = document.querySelector('[property="dz:table"]').getAttribute('content');
    this.tableId = 'product';

    helpers.initWebEditorForRecordDetail(this, {
      recordId: this.recordId,
      tableId: this.tableId ,
      sidebarTitle: 'Product update'
    });

    new defaultPackage(this);
  }

  _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');

    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      console.log('Booking',fc,item);
      item.addEventListener('click', async (e) => {
        console.log('Buttons',item,fc);
        switch (fc) {
          case '_booking':
            await this._booking();
            break;
          case '_addToCart':
            await this._addToCart();
            break;
          case '_likeItem':
            await this._likeItem();
            break;
          case '_unlikeItem':
            await this._unlikeItem();
            break;
        }
      });
    });
  }

  async _booking(){
    console.log('Booking');
    let dzPopup = document.createElement('dz-booking-popup');
    dzPopup.width = '800px';
    dzPopup.height = '800px';
    dzPopup.dialog =  document.querySelector('vaadin-dialog');
    // dzPopup.dialog = dzWrap.shadowRoot.querySelector('vaadin-dialog');
    Dazzle.componentPopup(dzPopup, dzPopup.width, dzPopup.height);

  }
  _setStore(key, value) {
    window.store.set(key, value);
  }

  _getStore(key) {
    return window.store.get(key);
  }

  _hideLikeButton() {
    const buttonLike = this.querySelector('[dz-func="_likeItem"]');
    const buttonUnlike = this.querySelector('[dz-func="_unlikeItem"]');

    if (buttonLike) {
      buttonLike.style.display = 'none';
    }

    if (buttonUnlike) {
      buttonUnlike.style.display = '';
    }
  }

  _hideUnlikeButton() {
    const buttonLike = this.querySelector('[dz-func="_likeItem"]');
    const buttonUnlike = this.querySelector('[dz-func="_unlikeItem"]');

    if (buttonLike) {
      buttonLike.style.display = '';
    }

    if (buttonUnlike) {
      buttonUnlike.style.display = 'none';
    }
  }

  getProductId() {
    let metaId;
    try{
      const meta = document.querySelector('meta[property="dz:data-id"]');
      metaId = meta.getAttribute('content') || null;
    }catch(e){
      metaId = null;
    }
    let id;
    // console.log('Hash',window.location.hash,window.location.pathname);
    const queryString = window.location.search;
    // console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    let path = urlParams.get('path') || store.get('thisPath') || '';
    console.log('Path',path,urlParams.get('path'),store.get('thisPath'));
    let hash = window.location.hash.substring(1);
    let dataId = store.get('dataId')|| null;
    id = hash ||  metaId || dataId || null;    
    this.dataId = id;
    return id; 
  }

  // async addProduct(){
  //   let dataId= prompt('Please input the Product ID.');
  //   this.dataId = dataId;

  //   console.log('Data',this.dataId);
  //   if (dataId) {
  //     try{
  //       await this.getItem();
  //     }catch(e){
  //       this.item = null;
  //     }
  //   } 
  //   console.log('Item',this.item);
  //   if (this.item){
  //       alert('Your ID has been used. Please reenter again');
  //       this.addProduct();
  //   }
  //   console.log('This Data',this.dataId);
  //   Dazzle.dzWindowFire('add-product-page',{
  //     'detail':{
  //       'data-id':dataId
  //     }
  //   });
  //   // window.parent.location.href = "https://portal.dazzle.website/web-editor.html?product-detail.html";
  // }
  async _addToCart() {
    const productId = this.getProductId();
    const cartItems = this._getStore('cartItems') || {};
    const purchaseQuantity = Number(this.querySelector('[dz-quantity]').value);
    const updatedCartItems = {
      ...cartItems,
      [productId]: {
        id: productId,
        quantity: productId in cartItems ? cartItems[productId].quantity + purchaseQuantity : purchaseQuantity,
      },
    };
    await window['helpers'].showModal('Add item successfully', {autoClose: true});
    this._setStore('cartItems', updatedCartItems);
  }

  async _likeItem() {
    const productId = this.getProductId();
    const likedItems = this._getStore('likedItems') || {};
    likedItems[productId] = {
      id: productId,
    };
    await window['helpers'].showModal('Added successfully', {autoClose: true});
    this._setStore('likedItems', likedItems);
    this._hideLikeButton();
  }

  async _unlikeItem() {
    const productId = this.getProductId();
    const likedItems = this._getStore('likedItems') || {};
    if (productId in likedItems) {
      delete likedItems[productId];
    }
    await window['helpers'].showModal('Removed successfully', {autoClose: true});
    this._setStore('likedItems', likedItems);
    this._hideUnlikeButton();
  }

  _handleLikeStatus() {
    const productId = this.getProductId();
    const likedItem = this._getStore('likedItems') || {};
    productId in likedItem ? this._hideLikeButton() : this._hideUnlikeButton();
  }

  async onCreated() {
    console.log('Product Detail');
    this.productManager = new DataPackage('product');
    let id = this.getProductId();
    // if (!id && Dazzle.editMode==="admin") {
    //   let cfm = confirm('No Product ID. Would you like to add a new product?');
    //   if (cfm) 
    //     this.addProduct();      
    // }
    await this.reloadData();
    this._listenDzFunction();

    new ItemPackage(this);
    document.addEventListener('save',e=>{
      this.saveData();
    });
    // document.addEventListener('add-product',e=>{
    //   if (Dazzle.editMode==="admin")
    //     this.addProduct();
    // });
    // this._handleLikeStatus();
  }
  async getItem(){
      let item = this.getAttribute('item') || null;
      if (!item)
          this.item = await this.productManager.getDataByES(this.dataId);
      else 
          this.item = JSON.parse(item);
  }
  static get properties() {
    return {
    };
  }

  async reloadData(){
    let item = await this.getItem();
    console.log(this.item, '9900990')
      let template = this.innerHTML;
      let html = this.productManager.replaceToken(this.item,this.innerHTML);
      this.innerHTML = html;
      // this.querySelectorAll('[dz-field]').forEach(elm=>{
      //     let myField = elm.getAttribute('dz-field');
      //     let myValue = this.item[myField];
      //     let tagName = elm.tagName;
      //     console.log('Tag',tagName);
      //     if (myValue)
      //         switch(tagName){
      //             case 'A':
      //                     elm.setAttribute('href',myValue);
      //             break;
                  
      //             case 'IMG':

      //                     elm.setAttribute('src',myValue);
      //             break;

      //             case 'INPUT':
      //                 elm.value = myValue;
      //             break;
      //             default:
      //                     elm.innerHTML = myValue;                
      //             break;

      //         }


      // });
  }

  async saveData(){
    this.querySelectorAll('[dz-field]').forEach(item=>{
      try {
        let field = item.getAttribute('dz-field') || null;
        let value = item.getFieldValue();
        let id;
        id = this.getProductId();
        console.log('Data',id,field,value);
        this.productManager.saveField(id,field,value);
      } catch(e){
        console.log('Error',e);
        // alert('Cannot Save Product');
      }
    });
  }
  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzProductDetailCode.getName(), dzProductDetailCode);
