class dzCartShippingMethodCode extends dzEditableComponent {

  static get is() {
    return 'dz-cart-shipping-method';
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
    const currentData = window.store.get('shippingMethod') || {
      key: '',
      text: '',
      amount: 0,
      note: ''
    };

    try {
      this.querySelector(`[name=shippingMethod][data-key=${currentData.key}]`).checked = true;
    } catch (e) {}
  }

  async _renderHtml() {
    const dataWrapper = this.querySelector('[data-wrapper]');
    const template = this.querySelector('template').innerHTML;

    dataWrapper.innerHTML = '';
    let innerHTML = '';
    window.helpers.getDefaultConfig().shippingMethods.forEach(item => {
      innerHTML = innerHTML + window.helpers.replaceToken(item, template);
    })
    dataWrapper.innerHTML = innerHTML;
  }

  async onCreated() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);
    await this._renderHtml();
    await this._bindData();

    const form = this.querySelector('form');
    window.domQuery(form).validate({
      rules: {
        shippingMethod: 'required',
      },
      messages: {
        shippingMethod: window.helpers.getDefaultConfig().messages.requiredField,
      },
      errorElement : 'div',
      errorLabelContainer: '.shipping-errorTxt',
      submitHandler: async (form, event) => {
        event.preventDefault();
        const selectedKey = this.querySelector('input[name=shippingMethod]:checked').getAttribute('data-key');
        let selectShippingMethod;

        window.helpers.getDefaultConfig().shippingMethods.forEach(shippingMethod => {
          if (shippingMethod.key === selectedKey) {
            selectShippingMethod = shippingMethod;
          }
        })

        window.store.set('shippingMethod', selectShippingMethod);
        await window.helpers.showModal(window.helpers.getDefaultConfig().messages.updateSuccessfully, {autoClose: true})
      },
    });
  }
}

customElements.define(dzCartShippingMethodCode.is, dzCartShippingMethodCode);
