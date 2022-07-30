class dzOrderItemCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-order-item';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
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

customElements.define(dzOrderItemCode.is, dzOrderItemCode);
