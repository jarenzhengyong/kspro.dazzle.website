class dzCartShippingAddressCode extends dzEditableComponent {

  static get is() {
    return 'dz-cart-shipping-address';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _bindData() {
    const currentData = window.store.get('shippingAddress') || {
      shippingFullName: '',
      shippingPhone: '',
      shippingAddress: '',
    };

    let subUser = store.get('subUser');
    
    if (subUser) {
        currentData.shippingAddress = '';
        currentData.shippingFullName = subUser['firstName'] +' '+subUser['lastName'];
        currentData.shippingPhone = subUser['phone'];
    }
    this.querySelector('[name=shippingFullName]').value = currentData.shippingFullName || '';
    this.querySelector('[name=shippingPhone]').value = currentData.shippingPhone || '';
    this.querySelector('[name=shippingAddress]').value = currentData.shippingAddress || '';
  }

  getShippingAdddress(){
     return this.querySelector('[name=shippingAddress]').value || null;
  }

  async onCreated() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);

    this._bindData();
    // this.querySelector('[name=shippingAddress]').addEventListener('change',e=>{
    //   console.log('Shipping UPdated');
    //   const shippingAddress = {
    //     shippingFullName: this.querySelector('[name=shippingFullName]').value || '',
    //     shippingPhone: this.querySelector('[name=shippingPhone]').value || '',
    //     shippingAddress: this.querySelector('[name=shippingAddress]').value || '',
    //   };

    //   window.store.set('shippingAddress', shippingAddress);
    //   console.log('Shipping UPdated');
    // });

        // await window.helpers.showModal(window.helpers.getDefaultConfig().messages.updateSuccessfully, {autoClose: true})

    

    // const form = this.querySelector('form');
    // window.domQuery(form).validate({
    //   rules: {
    //     shippingFullName: 'required',
    //     shippingPhone: 'required',
    //     shippingAddress: 'required',
    //   },
    //   messages: {
    //     shippingFullName: window.helpers.getDefaultConfig().messages.requiredField,
    //     shippingPhone: window.helpers.getDefaultConfig().messages.requiredField,
    //     shippingAddress: window.helpers.getDefaultConfig().messages.requiredField,
    //   },
    //   submitHandler: async (form, event) => {
    //     event.preventDefault();

    //     const shippingAddress = {
    //       shippingFullName: this.querySelector('[name=shippingFullName]').value || '',
    //       shippingPhone: this.querySelector('[name=shippingPhone]').value || '',
    //       shippingAddress: this.querySelector('[name=shippingAddress]').value || '',
    //     };

    //     window.store.set('shippingAddress', shippingAddress);
    //     await window.helpers.showModal(window.helpers.getDefaultConfig().messages.updateSuccessfully, {autoClose: true})
    //   },
    // });
  }
}

customElements.define(dzCartShippingAddressCode.is, dzCartShippingAddressCode);
