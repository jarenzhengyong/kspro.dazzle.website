class dzPaymentCode extends dzEditableComponent {

  static get is() {
    return 'dz-payment';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }
  static get observedAttributes() {
    return ['order'];
  
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    await this._bindData();
  }
  attributeUpdate(name,text){
    try {
      this.querySelector('['+name+']').innerHTML = text;
    } catch(e){
      return;
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async _bindData() {
      console.log('Items',this.items);
      this.attributeUpdate('dz-payment-method',this.order.jsonPaymentMethod.text);
      this.attributeUpdate('dz-payment-status',this.order.status);

      if (this.order.status ==="unpaid"){
        let div = document.createElement('div');
        div.setAttribute('class','paypal-button-container');
        this.appendChild(div);
        this.loadPaypalSdk();
      }

  }
  async loadPaypalSdk() {
    this.orderManager = new DataPackage('order');
    // let url = "https://www.paypal.com/cgi-bin/webscr?currency=HKD";
    let url = `https://www.paypal.com/sdk/js?currency=${window.helpers.getMyConfig().paypal.currency}&client-id=${window.helpers.getMyConfig().paypal.clientId}`;
    await window.helpers.loadScript(url);
    // this.order.total = 1;
    let that = this;
    window.paypal['Buttons']({
   
      createOrder: (data, actions) => {
        // console.log('this_total', this.total,this.order,'check',id);
        return actions.order.create({
          purchase_units: [
            {
              description: Dazzle.uid+ ' checkout:'+that.order.description,
              // payee: {
              //     email_address: 'henry.uk@01power.net',
              // },
              amount: {
                currency_code: window.helpers.getMyConfig().paypal.currency,
                value: this.order.total,
                // breakdown: {
                //   item_total: {
                //     currency_code: window.helpers.getMyConfig().paypal.currency,
                //     value: this.order.total
                //   }
                // }
              },
              // items: window.store.get('cartProducts'),
            }],
          // application_context: {
          //   brand_name: Dazzle.uid+' payment',
          //   //brand_name: 'Poko payment',

          //   // TODO implement handle shipping address
          // }
        });
      },
      onApprove: async (data, actions) => {
        console.log('OnApprove', data, actions);
        return actions.order.capture().then(async function(orderData) {
            
          // Full available details
          console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
          that.order['status'] = 'paid';
          that.order['payerID'] = data.payerID;
          await that.orderManager.saveDataWithCache(that.order.id,that.order);
          location.reload();
          
        });
        // setTimeout(async () => {
        //   that.order['status'] = 'paid';
        //   that.order['payerID'] = data.payerID;
        //   // await that.orderManager.saveDataWithCache(that.order.id,that.order);
        //   location.reload();

        //   // waiing to add function to modify the db from unpaid to paid order.
        // })
      }
    }).render('.paypal-button-container');
  }
  getPaymentAdddress(){
  }

  async onCreated() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);
    
    // this._bindData();
  
  }
}

customElements.define(dzPaymentCode.is, dzPaymentCode);
