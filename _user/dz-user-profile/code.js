class dzUserProfileCode extends dzEditableComponent {

  static get is() {
    return 'dz-user-profile';
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
    const profileForm = this.querySelector('.profile-form');
    const passwordForm = this.querySelector('.password-form');

    window.domQuery(profileForm).validate({
      rules: {
        'firstname': 'required',
        'lastname': 'required',
        'email': 'required',
        /* 'month': 'required',
        'day': 'required',
        'year': 'required', */
        'gender': 'required',
      },
      messages: {
        'firstname': window.helpers.getDefaultConfig().messages.requiredField,
        'lastname': window.helpers.getDefaultConfig().messages.requiredField,
        'email': window.helpers.getDefaultConfig().messages.requiredField,
        /* 'month': window.helpers.getDefaultConfig().messages.requiredField,
        'day': window.helpers.getDefaultConfig().messages.requiredField,
        'year': window.helpers.getDefaultConfig().messages.requiredField, */
        'gender': window.helpers.getDefaultConfig().messages.requiredField,
      },
      submitHandler: async (form, event) => {
        event.preventDefault();

        const mapping = {};
        const formItems = window.domQuery(form).serializeArray();
        formItems.map(item => {
          mapping[item.name] = item.value;
        });

        try {
          await window.authUser().updateProfile({
            profile: {
              firstName: mapping.firstname,
              lastName: mapping.lastname,
              birthday: `${mapping.year}/${mapping.month}/${mapping.day}`,
              gender: mapping.gender
            },
            publicJsonOther: {},
            privateJsonOther: {}
          });
          await window.helpers.showModal(window.helpers.getDefaultConfig().messages.profileWasUpdated);
        } catch (err) {
          await window.helpers.showModal(window.helpers.getDefaultConfig().messages.commonError);
          console.error(err)
        }
      },
    });

    window.domQuery(passwordForm).validate({
      rules: {
        'password': {
          'required': true,
          'minlength': 6
        },
        'confirmation': {
          required: true,
          equalTo: '#password',
        },
      },
      messages: {
        'password': {
          'required': window.helpers.getDefaultConfig().messages.requiredField,
          'minlength': window.helpers.getDefaultConfig().messages.minLengthPassword
        },
        'confirmation': {
          required: window.helpers.getDefaultConfig().messages.requiredField,
          equalTo: window.helpers.getDefaultConfig().messages.matchToPasswordField,
        },
      },
      submitHandler: async (form, event) => {
        event.preventDefault();

        const mapping = {};
        const formItems = window.domQuery(form).serializeArray();
        formItems.map(item => {
          mapping[item.name] = item.value;
        });

        try {
          await window.authUser().changePassword({
            password: mapping.password
          });

          await window.helpers.showModal(window.helpers.getDefaultConfig().messages.passwordWasChangedSuccessfully, {autoClose: true});
          location.reload();
        } catch (err) {
          await window.helpers.showModal(window.helpers.getDefaultConfig().messages.commonError);
          console.error(err)
        }
      },
    });
  }

  async _setCurrentUserProfile() {
    const res = await window.authUser().getCurrentUser();
    const profile = res.data.data.profile || {};

    this.querySelector('[name=firstname]').value = profile.firstName;
    this.querySelector('[name=lastname]').value = profile.lastName;
    this.querySelector('[name=email]').value = profile.email;

    /* this.querySelector('[name=day]').value = profile.birthday?.split('/')[2] || '';
    this.querySelector('[name=month]').value = profile.birthday?.split('/')[1] || '';
    this.querySelector('[name=year]').value = profile.birthday?.split('/')[0] || ''; 
    console.log(profile,'099090') */
    this.querySelector('[name=gender]').value = profile.gender;
  }

  _handleButtons() {
    // Use dz-func to handle click event
    let buttons = document.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', e => {
        switch (fc) {
          case '_TBD':
            break;
        }
      });
    });
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

    this._handleButtons();
    this._handleFormValidate();
    this._setCurrentUserProfile();
  }
}

customElements.define(dzUserProfileCode.is, dzUserProfileCode);
