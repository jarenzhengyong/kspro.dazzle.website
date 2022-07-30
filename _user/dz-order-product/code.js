class dzOrderProductCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-order-product';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }
  static get observedAttributes() {
    return ['items'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // super.attributeChangedCallback();
    console.log('Custom square element attributes changed.');
    // this.items = this.getAttribute('items');
    // console.log('Items',this.items);  
    this.bindData();
  }
  async bindData(){
    let template = this._template['order-product'];
    let productManager = new DataPackage('product');
    let wrapper = this.querySelector('[data-wrapper]');
    
    let html = '';
    for (let k in this.items){
      let item = await productManager.getDataByES(k);
      item['quantity']= this.items[k].quantity;
      item['subtotal'] = parseFloat(item['price'])*item['quantity'];
      html += productManager.replaceToken(item,template);
    }
    wrapper.innerHTML = html;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Custom square element property changed.');
    this.items = this.getAttribute('items');
    console.log('Items',this.items);  
    

  }

  onCreated() {
    this._listenDzFunction();
  }

  _onClickViewDetail() {
    window.location.href = `${window.helpers.getDefaultConfig().urls.orderDetail}?id=${this.id}`;
    //window.location.href = `${window.helpers.getDefaultConfig().urls.orderDetail}#${this.id}`;
  }

  _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');

    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', e => {
        switch (fc) {
          case '_onClickViewDetail':
            this._onClickViewDetail();
            break;
        }
      });
    });
  }
}

customElements.define(dzOrderProductCode.is, dzOrderProductCode);