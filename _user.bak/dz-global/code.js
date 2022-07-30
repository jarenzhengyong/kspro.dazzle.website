class dzGlobalCode extends dzEditableComponent {
  static getName() {
    return 'dz-global';
  }

  async _initWebEditor() {
    this.dataManager = new DataPackage('_config');

    const self = this;
    this.label = 'Global';
    this.menu = this.menu || [];

    this.menu.push({
      'text': 'Global attributes',
      'event': 'openGlobalAttributeManager',
    });

    this.addEventListener('openGlobalAttributeManager', e => {
      this._openGlobalAttributeManager();
    });

    this.addEventListener('openGlobalDataManager', e => {
      this._openGlobalDataManager();
    });

    this.addEventListener('openGlobalEditDirectly', e => {
      if (this.globalAttributes && this.globalAttributes.length) {
        this.globalAttributes.forEach(attribute => {
          this.querySelectorAll(`[${attribute}]`).forEach(globalEl => {
            new defaultPackage(globalEl);
          });
        });
      }
    });

    if (this.findGlobalAttributes) {
      this.globalAttributes = this.findGlobalAttributes();
      if (this.globalAttributes && this.globalAttributes.length) {
        self.menu.unshift({
          'text': 'Content update',
          'event': 'openGlobalDataManager',
        });

        self.menu.unshift({
          'text': 'Edit directly',
          'event': 'openGlobalEditDirectly',
        });
      }
    }
  }

  async _openGlobalDataManager() {
    try {
      this.schema = await this.dataManager.getDataByES('dz-global-attributes');
    } catch (e) {
      this.schema = {
        'id': '',
        'field': [],
      };
    }

    try {
      this.record = await this.dataManager.getDataByES('dz-global-data');
    } catch (e) {
      this.record = {};
    }

    this.dzContentUpdate = document.createElement('dz-content-update');
    this.dzContentUpdate.sidebarTitle = `Global content update`;
    this.dzContentUpdate.save = () => {
      const formValues = this.dzContentUpdate._getDataForm();
      delete formValues.id;

      // Save to database
      const newGlobalData = {
        ...this.record,
        ...formValues,
      };
      this.dataManager.saveData('dz-global-data', newGlobalData);

      // Update to DOM
      const globalComponents = window.document.querySelectorAll(dzGlobalCode.getName());
      globalComponents.forEach((globalComponent) => {
        globalComponent.updateGlobalAttributeValue(newGlobalData);
      });

      // Close
      const existed = window.parent.document.querySelector('.right-sidebar-editor dz-content-update');
      if (existed) {
        existed.parentElement.removeChild(existed);
      }
    };

    this.dzContentUpdate.sidebarWidth = 300;

    // Only display field that exists in current dz-global, do not show all
    const existedAttributes = this.findGlobalAttributes();
    const cloneSchema = {...this.schema};
    cloneSchema.field = cloneSchema.field.filter(field => {
      return existedAttributes.includes(field);
    });
    cloneSchema.columnDefs = cloneSchema.columnDefs.filter(column => {
      return existedAttributes.includes(column.field);
    });

    this.dzContentUpdate.setAttribute('schema', JSON.stringify(cloneSchema));
    this.dzContentUpdate.setAttribute('record', JSON.stringify(this.record));

    const existed = window.parent.document.querySelector('.right-sidebar-editor dz-content-update');
    if (existed) {
      existed.parentElement.removeChild(existed);
    }

    window.parent.document.querySelector('.right-sidebar-editor').appendChild(this.dzContentUpdate);
  }

  _openGlobalAttributeManager() {
    const dzWrap = window.parent.document.querySelector('dz-wrap');
    const dzPopup = document.createElement(`dz-global-attribute-manager`);
    window.helpers.openDzPopup.bind(this, dzWrap, dzPopup)();
  }

  static get properties() {
    return {};
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzGlobalCode.getName(), dzGlobalCode);
