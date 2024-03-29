class dzOrderDetailCode extends dzEditableComponent {
  constructor() {
    super();
    this.itemsManager = new DataPackage('order');
    this.total = 1;
  }

  static get is() {
    return 'dz-order-detail';
  }

  render () {
    return this.html`
        <slot></slot>
    `;
  }

  getOrderId() {
     let id = window.location.hash.substring(1) || null;
     console.log('ID',id);
    return id; 
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async _getDataDetail(id) {

    console.log('ID',id);
    try {
      let res = await this.itemsManager.searchDataByES({
        'ids': {
          'type': '_doc',
          'values': [id],
        },
      });
      // console.log('Res',res);
      this.order = res[0] || {};
    } catch (e) {
      console.error(e);
    }
  }

  _formatData(res) {
    let products = res.products.map(item => ({
      productId: item.id || '',
      productName: item.name || '',
      productPrice: window.helpers.formatNumber(item.price) || '',
      productQuantity: window.helpers.formatNumber(item.quantity) || '',
    }));
    return {
      ...res,
      status: window.helpers.getOrderStatusText(res.status),
      products,
      shippingFee: window.helpers.formatNumber(res.shippingFee) || '',
      total: window.helpers.formatNumber(res.total) || '',
    };
  }

  selectorUpdate(component,property,item) {
    try {
      // console.log('Component',this.querySelector(component));
      this.querySelector(component)[property] = item;    
      this.querySelector(component).setAttribute(property,item);      
    } catch(e){
      return;
    }
  }
  itemUpdate(item){

    // "id" : 1646945222246,
    // "orderDatetime" : 1646945222246,
    // "status" : "unpaid",
    // "description" : "鎖環x1,",
    // "total" : 59,
    // "userId" : "poko-1646026550473"
    try {
      console.log('Item',item);
      this.querySelector('[dz-order-id]').innerHTML = item.id;
      this.querySelector('[dz-order-date]').innerHTML = new Date(item.orderDatetime).toLocaleDateString("en-US");
      this.querySelector('[dz-order-status]').innerHTML = item.status;
      this.querySelector('[dz-order-description]').innerHTML = item.description;
      this.querySelector('[dz-order-total]').innerHTML = item.total;
      
    } catch(e){
       return;
    }
  }
  async _bindData() {
    let user = localStorage.getItem('user') || null;


    console.log(user, '099009');
    // if (user=== null){
    //   await window.helpers.showModal('No user login, you are not allowed to view this page');
    //   location.href = '/';
    // } else {
    //   user = JSON.parse(user);
    // }
    let params = window.helpers.getParamsUrl();
    //let id = window.helpers.getHashId();
    await this._getDataDetail(params.id);
    // console.log('ID',this.order.userId,user.profile.id);
   
    // if (this.order.userId !== user.profile.id) {
    //   await window.helpers.showModal('You are not this order owner, you are not allowed to view this page');
    //   location.href = '/';
    // }
    console.log('User',user,params.id,this.order);


      this.itemUpdate(this.order);
      this.selectorUpdate('dz-order-product','items',this.order.jsonCartItems);
      this.selectorUpdate('dz-user-detail','items',this.order.userId);
      this.selectorUpdate('dz-shipping','method', this.order.jsonShippingMethod);
      this.selectorUpdate('dz-shipping', 'address',this.order.jsonShippingAddress);
      
      this.selectorUpdate('dz-payment','order',this.order);
      this.selectorUpdate('dz-discount','items', this.order.jsonDiscount);



        // let products = JSON.parse(res.jsonProducts || '[]');
    // let jsonShippingInfo = JSON.parse(res.jsonShippingAddress || '{}');
    // let jsonShippingMethod = JSON.parse(res.jsonShippingMethod || '{}');
    // let jsonPaymentMethod = JSON.parse(res.jsonPaymentMethod || '{}');
    // let jsonDiscount = JSON.parse(res.jsonCartDiscount || '{}');
    // let jsonCartItems = JSON.parse(res.jsonCartItems || '{}');
    // let date = res.date || null;



    // // console.log (date, 'datedata',jsonPaymentMethod );
    // // if (date)
    // //   date = date.toString();
    // // else 
    // //   date =  'No Date'; 
    // // // res.status="paid";
    // // if (res.status !=="paid")
    // //     this.loadPaypalSdk();
    // // let subTotal = 0;
    // // let newProducts = [];
    // // products.forEach(item => {
    // //   if (jsonCartItems[item.id]) {
    // //     subTotal = subTotal + jsonCartItems[item.id].quantity * item.price;
    // //     newProducts.push({
    // //       ...item,
    // //       price: window.helpers.formatNumber(item.price || 0),
    // //       amount: window.helpers.formatNumber(jsonCartItems[item.id].quantity * item.price),
    // //       quantity: window.helpers.formatNumber(jsonCartItems[item.id].quantity),
    // //     });
    // //     console.log(subTotal,'9900909')
    // //   }
    // // });
    // // // Binding information order
    // // try {
    // //   this.querySelector('.order-id').innerText = params.id || '';
    // //   /* this.querySelector('.shipping-full-name').innerText = jsonShippingInfo || '';
    // //   this.querySelector('.shipping-phone').innerText = jsonShippingInfo || '';
    // //   this.querySelector('.shipping-address').innerText = jsonShippingInfo || ''; */
    // //   this.querySelector('.shipping-method').innerText = jsonShippingMethod || '';
    // //   this.querySelector('.payment-method').innerText = jsonPaymentMethod || '';
    // //   //this.querySelector('.order-date').innerText = date;
    // //   console.log(window.helpers.formatNumber(subTotal || 0),'90900990')
    // //   // Binding summary
    // //   /* this.querySelector('.summary-sub-total').innerText = window.helpers.formatNumber(subTotal || 0);
    // //   this.querySelector('.summary-shipping-fee').innerText = window.helpers.formatNumber(jsonShippingMethod.amount || 0);
    // //   this.querySelector('.summary-discount').innerText = window.helpers.formatNumber(jsonDiscount.amount || 0); */
    // //   this.querySelector('.summary-status').innerText = window.helpers.getOrderStatusText(res.status || '');
    // //   //this.querySelector('.summary-total').innerText = window.helpers.formatNumber((subTotal + jsonShippingMethod.amount - jsonDiscount.amount) || 0);
    // //   // this.querySelector('.summary-total').innerText = window.helpers.formatNumber(subTotal || 0);
    // //   this.querySelector('.summary-total').innerText = window.helpers.formatNumber(res.total || 0);

    // } catch(e) {
    //   console.error(e);
    // }
    // let wrapper = this.querySelector('[data-wrapper]');
    // let template = this.querySelector('template#order-item').innerHTML;
    // let allHtml = '';
    // newProducts.forEach(item => {
    //   let html = window.helpers.replaceToken(item, template);
    //   allHtml = allHtml + html;
    // });
    // wrapper.innerHTML = allHtml;

    // Binding products table
    /* let wrapperTable = this.querySelector('[data-wrapper]');
    let allHtmlTable = '';
    let templateProductItem = this._template['order-item'];
    wrapperTable.innerHTML = '';
    newProducts.forEach(item => {
      let htmlTable = window.helpers.replaceToken(item, templateProductItem);
      console.log(htmlTable, '09990')
      let elm = this.htmlToElement(htmlTable);
      elm.id = item.id;
      new ItemPackage(elm);
      wrapperTable.appendChild(elm);
      allHtmlTable = allHtmlTable + htmlTable; 
    });
    wrapperTable.innerHTML = allHtmlTable;*/
  }

  _clickToBack() {
    window.location.href = window.helpers.getDefaultConfig().urls.profile;
  }
  // async loadPaypalSdk() {
  //   await window.helpers.loadScript(`https://www.paypal.com/sdk/js?currency=${window.helpers.getDefaultConfig().paypal.currency}&client-id=${window.helpers.getDefaultConfig().paypal.clientId}`);

  //   window.paypal['Buttons']({
  //     createOrder: (data, actions) => {
  //       console.log('this.total', this.total);
  //       return actions.order.create({
  //         purchase_units: [
  //           {
  //             reference_id: 'TODO',
  //             description: 'Mingkee checkout',
  //             custom_id: 'TODO',
  //             soft_descriptor: 'Mingkee checkout',
  //             amount: {
  //               currency_code: window.helpers.getDefaultConfig().paypal.currency,
  //               value: this.total,
  //               breakdown: {
  //                 item_total: {
  //                   currency_code: window.helpers.getDefaultConfig().paypal.currency,
  //                   value: this.total
  //                 }
  //               }
  //             },
  //             // items: window.store.get('cartProducts'),
  //           }],
  //         application_context: {
  //           brand_name: 'Mingkee payment',
  //           // TODO implement handle shipping address
  //         }
  //       });
  //     },
  //     onApprove: async (data, actions) => {
  //       console.log('OnApprove', data, actions);
  //       setTimeout(async () => {
  //         await this._handleSubmitOrder(true)
  //       })
  //     }
  //   }).render('.paypal-button-container');
  // }

  
  async loadPaypalSdk() {
    await window.helpers.loadScript(`https://www.paypal.com/sdk/js?currency=${window.helpers.getDefaultConfig().paypal.currency}&client-id=${window.helpers.getDefaultConfig().paypal.clientId}`);

    window.paypal['Buttons']({
      createOrder: (data, actions) => {
        // console.log('this_total', this.total,this.order,'check',id);
        return actions.order.create({
          purchase_units: [
            {
              reference_id: '12345',
              description: 'T2 checkout',
              custom_id: 'TODO',
              soft_descriptor: 'Mingkee checkout',
              //soft_descriptor: 'Poko checkout',

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
            //brand_name: 'Poko payment',

            // TODO implement handle shipping address
          }
        });
      },
      onApprove: async (data, actions) => {
        console.log('OnApprove', data, actions);
        setTimeout(async () => {
          console ('result of paypal process is successed');
          alert ('result of paypal process is successed');
          // waiing to add function to modify the db from unpaid to paid order.
        })
      }
    }).render('.paypal-button-container');
  }


  async _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', () => {
        switch (fc) {
          case '_clickToBack':
            this._clickToBack();
            break;
          
        }
      });
    });
  }

  async onCreated() {
    await this._bindData();
    await this._listenDzFunction();
  }
}

customElements.define(dzOrderDetailCode.is, dzOrderDetailCode);
