
class dzUserLoginCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-user-login';
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }


  connectedCallback() {
    super.connectedCallback();
    console.log('User Login');
  }

  _checkUsernamePassword = async (credentials) => {
    try {
      const res = await window.authUser().login(credentials);
      localStorage.setItem('token', res.data.data.jwt);
      localStorage.setItem('authUser', JSON.stringify(res.data.data.data));

      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.loginSuccessfully, {autoClose: true});
      window.location = '/';
    } catch (error) {
      window.helpers.notify(window.helpers.getDefaultConfig().messages.invalidUsernamePassword, 'error');
      console.log('error login', error);
    }
  };

  async _handleFormValidateAndLogin() {
    const loginForm = this.querySelector('form');
    console.log(loginForm);
    // jquery.validate.min.js
    window.domQuery(loginForm).validate({
      rules: {
        email: 'required',
        password: 'required',
      },
      messages: {
        email: window.helpers.getDefaultConfig().messages.requiredField,
        password: window.helpers.getDefaultConfig().messages.requiredField,
      },
      submitHandler: (form) => {
        const credentials = {};
        const formItems = window.domQuery(form).serializeArray();
        formItems.map(item => {
          credentials[item.name] = item.value;
        });

        this._checkUsernamePassword({
          email: credentials['email'],
          password: credentials['password'],
        }).then(r => {
        });
      },
    });
  }

  _logoutCurrentUserIfExist = () => {
    if (location.href.indexOf('logout=true') < 0) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
  }

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

    // Load other js modules
    this._listenButtons();
    await this._handleFormValidateAndLogin();
    this._logoutCurrentUserIfExist();
  }

  _listenButtons() {
    let buttons = document.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', e => {
        switch (fc) {
          case '_loginBySocial':
            const socialType = item.getAttribute('dz-data');
            if (socialType === 'google') {
              alert('NOT IMPLEMENTED');
            }

            if (socialType === 'facebook') {
              alert('NOT IMPLEMENTED');
            }

            break;
        }
      });
    });
  }
}

customElements.define(dzUserLoginCode.is, dzUserLoginCode);
