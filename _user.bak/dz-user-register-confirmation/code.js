class dzUserRegisterConfirmationCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-user-register-confirmation';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Register Confirmation');
  }

  // _confirmSignUp = async (data) => {
  //   try {
  //     const user = await this.Amplify_Lib.Auth.confirmSignUp(data.username, data.code);
  //     window.helpers.notify(window.helpers.getDefaultConfig().messages.registerUserSuccessfully);
  //     setTimeout(() => {
  //       window.location = window.helpers.getDefaultConfig().urls.login;
  //     }, 1000);
  //   } catch (error) {
  //     console.log('error', error);
  //     window.helpers.notify(window.helpers.getDefaultConfig().messages.commonError, 'error');
  //   }
  // };

  _handleFormValidate() {
    const loginForm = this.querySelector('form');
    window.domQuery(loginForm).validate({
      rules: {
        'code': 'required',
      },
      messages: {
        'code': window.helpers.getDefaultConfig().messages.requiredField,
      },
      submitHandler: async (form, event) => {
        event.preventDefault();

        const mapping = {};
        const formItems = window.domQuery(form).serializeArray();
        formItems.map(item => {
          mapping[item.name] = item.value;
        });

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        try {
          await window.authUser().confirmRegister({
            email: params.email,
            confirmationCode: mapping.code
          });

          window.helpers.notify(window.helpers.getDefaultConfig().messages.registerUserSuccessfully);
          setTimeout(() => {
            window.location = window.helpers.getDefaultConfig().urls.login;
          }, 1000);
        } catch (error) {
          console.log('error', error);
          window.helpers.notify(window.helpers.getDefaultConfig().messages.commonError, 'error');
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
  }
}

customElements.define(dzUserRegisterConfirmationCode.is, dzUserRegisterConfirmationCode);
