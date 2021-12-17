class dzForgotPasswordCode extends dzEditableComponent {
  static get is() {
    return 'dz-forgot-password';
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
    const targetForm = this.querySelector('form');
    window.domQuery(targetForm).validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        email: {
          required: window.helpers.getDefaultConfig().messages.requiredField,
          email: window.helpers.getDefaultConfig().messages.emailField,
        },
      },
      submitHandler: async (form, event) => {
        event.preventDefault();

        const formItems = window.domQuery(form).serializeArray();
        const email = formItems[0].value;
        try {
          await authUser().forgotPassword({
            email
          });

          //await window.helpers.showModal(window.helpers.getDefaultConfig().messages.passwordResetWasSent);
          window.helpers.showModal(window.helpers.getDefaultConfig().messages.passwordResetWasSent);
          setTimeout(() => {
            location.href = `${window.helpers.getDefaultConfig().urls.forgotPasswordConfirmation}?${window.helpers.queryUrlFromObject({email})}`;
            console.log(location.href)
          }, 1000);
        } catch (error) {
          console.error(error.response.data.error.code);
          try {
            if (error.response.data.error.code === 'USER_NOT_EXISTS') {
              return window.helpers.notify(window.helpers.getDefaultConfig().messages.userNotExisted, 'error');
            }
          } catch (e) {}

          window.helpers.notify(window.helpers.getDefaultConfig().messages.commonError, 'error');
        }
      },
    });
  }

  _sendResetPassword = async (email) => {
    try {
      await this.Amplify_Lib.Auth.forgotPassword(email);
      window.helpers.notify(window.helpers.getDefaultConfig().messages.passwordResetWasSent);
      setTimeout(() => {
        location.href = window.helpers.getDefaultConfig().urls.forgotPasswordConfirmation;
      }, 1000);
    } catch (error) {
      window.helpers.notify(window.helpers.getDefaultConfig().messages.commonError, 'error');
      console.log('error', error);
    }
  };

  async loadDomQueryAndPlugins() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);
  }

  async loadJsLibs() {
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

customElements.define(dzForgotPasswordCode.is, dzForgotPasswordCode);
