class dzShippingCode extends dzEditableComponent {

  static get is() {
    return 'dz-shipping';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }
  static get observedAttributes() {
    return ['method','address'];
  
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
    console.log('Method',this.method);
    console.log('Address',this.address);
    this.attributeUpdate('dz-shipping-fullname',this.address.shippingFullName);
    this.attributeUpdate('dz-shipping-phone',this.address.shippingPhone);
    this.attributeUpdate('dz-shipping-address',this.address.shippingAddress);
    this.attributeUpdate('dz-shipping-method',this.method.text);
    this.attributeUpdate('dz-shipping-fee',this.method.amount);
  }

  getShippingAdddress(){
  }

  async onCreated() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);

    // this._bindData();
  
  }
}

customElements.define(dzShippingCode.is, dzShippingCode);
