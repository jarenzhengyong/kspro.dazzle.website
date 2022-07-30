class dzUserRegisterCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-user-register';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _handleFormValidate() {
    const loginForm = this.querySelector('form');
    window.domQuery(loginForm).validate({
      rules: {
        //'firstname': 'required',
        'lastname': 'required',
        'email': 'required',
        // 'month': 'required',
        // 'day': 'required',
        // 'year': 'required',
        // 'gender': 'required',
        'password': 'required',
        'confirmation': {
          required: true,
          equalTo: '#password2',
        },
        /*'phone': 'required',
        'address_1': 'required', */
      },
      messages: {
        //'firstname': window.helpers.getDefaultConfig().messages.requiredField,
        'lastname': window.helpers.getDefaultConfig().messages.requiredField,
        'email': window.helpers.getDefaultConfig().messages.requiredField,
        'password': window.helpers.getDefaultConfig().messages.requiredField,
        'confirmation': {
          required: window.helpers.getDefaultConfig().messages.requiredField,
          equalTo: window.helpers.getDefaultConfig().messages.matchToPasswordField,
        },
        /* 'phone': window.helpers.getDefaultConfig().messages.requiredField,
        'address_1': window.helpers.getDefaultConfig().messages.requiredField, */
      },
      submitHandler: async (form, event) => {
        event.preventDefault();

        const mapping = {};
        const formItems = window.domQuery(form).serializeArray();
        formItems.map(item => {
          mapping[item.name] = item.value;
        });
        try {
          await window.authUser().register({
            'password': mapping.password,
            'profile': {
              'email': mapping.email,
              'firstName': mapping.lastname,
              'lastName': mapping.lastname,
              //'phone': mapping.phone,
              // 'birthday': `${mapping.year}/${mapping.month}/${mapping.day}`,
              //'address_1': mapping.address_1
            },
            'publicJsonOther': {
              // 'email': mapping.email,
              // 'firstName': mapping.firstname,
              // 'lastName': mapping.lastname,
              // 'phone': mapping.phone,
              // // 'birthday': `${mapping.year}/${mapping.month}/${mapping.day}`,
              // 'address_1': mapping.address_1
              // company: mapping['company'],
              // address_1: mapping['address_1'],
              // address_2: mapping['address_2'],
              // city: mapping['city'],
              // postcode: mapping['postcode'],
              // country_id: mapping['country_id'],
              // state: mapping['state'],
              // newsletter: mapping['newsletter'],
            },
            'privateJsonOther': {},
          });
          window.helpers.notify(window.helpers.getDefaultConfig().messages.registerUserSuccessfully);
          setTimeout(() => {
            window.location = `${window.helpers.getDefaultConfig().urls.registerConfirmation}?${window.helpers.queryUrlFromObject({email: mapping.email})}`;
          }, 1000);

        } catch (e) {
          console.log('e', e);
          window.helpers.notify(window.helpers.getDefaultConfig().messages.commonError, 'error')
        }
      },
    });
  }

  async loadDomQueryAndPlugins() {
    // Form validate
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);
  }

  async loadJsLibs() {
    // Notification
    await import(window.helpers.getDefaultConfig().jsLibs.toastr);
    window.helpers.loadCSS(window.helpers.getDefaultConfig().cssLibs.toastr);
  }

  async onCreated() {
    await this.loadDomQueryAndPlugins();
    await this.loadJsLibs();
    // Load other js modules
    this._handleFormValidate();

    this.label = '用戶註冊';
    this.menu = [
            {		
                'text': '設定用戶字段',
                'event': 'manualEditor'
            },
            {
                'text': '設定用戶驗證方法',
                'event': 'setMaster'
            }, 
            {
                'text': '設定Google/facebook 登入',
                'event': 'stock'
            }];

  }
}

customElements.define(dzUserRegisterCode.is, dzUserRegisterCode);
