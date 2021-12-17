class dzCartPaymentMethodCode extends dzEditableComponent {
  static get is() {
    return 'dz-cart-payment-method';
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
    const currentData = window.store.get('paymentMethod') || {
      key: '',
      text: '',
      amount: 0,
      note: ''
    };

    try {
      this.querySelector(`[name=paymentMethod][data-key=${currentData.key}]`).checked = true;
    } catch (e) {}
  }

  async _renderHtml() {
    const dataWrapper = this.querySelector('[data-wrapper]');
    const template = this.querySelector('template').innerHTML;

    dataWrapper.innerHTML = '';
    let innerHTML = '';
    window.helpers.getDefaultConfig().paymentMethods.forEach(item => {
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
        paymentMethod: 'required',
      },
      messages: {
        paymentMethod: window.helpers.getDefaultConfig().messages.requiredField,
      },
      errorElement : 'div',
      errorLabelContainer: '.payment-errorTxt',
      submitHandler: async (form, event) => {
        event.preventDefault();
        const selectedKey = this.querySelector('input[name=paymentMethod]:checked').getAttribute('data-key');
        let selectPaymentMethod;

        window.helpers.getDefaultConfig().paymentMethods.forEach(paymentMethod => {
          if (paymentMethod.key === selectedKey) {
            selectPaymentMethod = paymentMethod;
          }
        })

        console.log('selectPaymentMethod', selectPaymentMethod)
        window.store.set('paymentMethod', selectPaymentMethod);
        await window.helpers.showModal(window.helpers.getDefaultConfig().messages.updateSuccessfully, {autoClose: true})
      },
    });
  }
}

customElements.define(dzCartPaymentMethodCode.is, dzCartPaymentMethodCode);
