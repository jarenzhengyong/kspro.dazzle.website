class dzForgotPasswordConfirmationCode extends dzEditableComponent {
  static get is() {
    return 'dz-forgot-password-confirmation';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async _handleFormValidate() {
    const targetForm = this.querySelector('form');
    domQuery(targetForm).validate({
      rules: {
        email: 'required',
        code: 'required',
        password: 'required',
        confirmPassword: {
          required: true,
          equalTo: '#password',
        },
      },
      messages: {
        email: window.helpers.getDefaultConfig().messages.requiredField,
        code: window.helpers.getDefaultConfig().messages.requiredField,
        password: window.helpers.getDefaultConfig().messages.requiredField,
        confirmPassword: {
          required: window.helpers.getDefaultConfig().messages.requiredField,
          equalTo: window.helpers.getDefaultConfig().messages.matchToPasswordField,
        },
      },
      submitHandler: async (form, event) => {
        event.preventDefault();

        const formItems = domQuery(form).serializeArray();
        const formData = {};
        formItems.map(item => {
          formData[item.name] = item.value;
        });

        try {
          await window.authUser().confirmForgotPassword({
            'email': formData.email,
            'confirmationCode': formData.code,
            'password': formData.password,
          });

          //await window.helpers.showModal(window.helpers.getDefaultConfig().messages.passwordWasChangedSuccessfully);
          window.helpers.showModal(window.helpers.getDefaultConfig().messages.passwordWasChangedSuccessfully);
          setTimeout(() => {
            location.href = window.helpers.getDefaultConfig().urls.login;
          });
        } catch (error) {
          console.error(error.response);
          try {
            if (error.response.data.error.code === 'InvalidPasswordException') {
              return window.helpers.notify(window.helpers.getDefaultConfig().messages.passwordTooEasy, 'error');
            }

            if (error.response.data.error.code === 'CodeMismatchException') {
              return window.helpers.notify(window.helpers.getDefaultConfig().messages.invalidPasswordCode, 'error');
            }
          } catch (e) {}

          window.helpers.notify(window.helpers.getDefaultConfig().messages.commonError, 'error');
        }
      },
    });
  }

  _confirmChangePassword = async (data) => {
    try {
      await this.Amplify_Lib.Auth.forgotPasswordSubmit(data.email, data.code, data.password);
      window.helpers.notify(window.helpers.getDefaultConfig().messages.passwordWasChangedSuccessfully);

      setTimeout(() => {
        location.href = window.helpers.getDefaultConfig().urls.login;
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
    // Load notification
    await import(window.helpers.getDefaultConfig().jsLibs.toastr);
    window.helpers.loadCSS(window.helpers.getDefaultConfig().cssLibs.toastr);
  }

  async onCreated() {
    await this.loadDomQueryAndPlugins();
    await this.loadJsLibs();

    const params = window.helpers.getParamsUrl();
    if (params.email) {
      this.querySelector('[name=email]').value = params.email;
    }

    // Load other js modules
    await this._handleFormValidate();
  }
}

customElements.define(dzForgotPasswordConfirmationCode.is, dzForgotPasswordConfirmationCode);
