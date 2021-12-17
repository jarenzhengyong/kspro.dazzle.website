
class dzOrderWrapperCode extends dzEditableComponent {
  static get is() {
    return 'dz-order-wrapper';
  }

  constructor() {
    super();
    this.itemManager = new DataPackage('order');
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async loadDomQueryAndPlugins() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);
  }

  formatData(data) {
    return data.map(item => ({
      ...item,
      total: window.helpers.formatNumber(item.total) || '',
      status: window.helpers.getOrderStatusText(item.status),
      createdAt: item.createdAt || '',
    }));
  }

  async search(filterConditions = {}) {
    try {
      let wrapper = this.querySelector('[data-wrapper]');
      //let template = this._template['order-item'];
      //let templateItem = this._template['order-item-product'];
      let template = this.querySelector('template#order-item').innerHTML;
      let res = await authUser().getMyOrders();
      console.log(res, '90909')
      if (res && res.data.data) {
        let data = res.data.data;

        if (filterConditions.sort) {
          const extracted = filterConditions.sort.split('|');
          const sortBy = extracted[0];
          const sortType = extracted[1];

          data.sort((a, b) => {
            if (sortBy === 'price') {
              try {
                return Number(a[sortBy]) - Number(b[sortBy]);
              } catch (e) {
                return a[sortBy] - b[sortBy];
              }
            } else {
              return a[sortBy] - b[sortBy];
            }
          });

          if (sortType === 'desc') {
            data.reverse();
          }
        }

        data = this.formatData(data);
        window.domQuery(this.querySelector('.pagination')).pagination({
          dataSource: data,
          pageSize: 4,
          showPrevious: false,
          showNext: false,
          callback: (currentPageItems) => {
            wrapper.innerHTML = '';
            let allHtml = '';
            currentPageItems.forEach(item => {
              let html = window.helpers.replaceToken(item, template);
              /* let list = '';
              JSON.parse(item.jsonProducts).forEach(child => {
                list += window.helpers.replaceToken(child, templateItem)
              })
              html += list; */
              allHtml = allHtml + html;
            });

            wrapper.innerHTML = allHtml;
          },
        });
      }

    } catch (e) {
      console.error(e);
    }
  }

  _handleSearchForm() {
    const searchForm = this.querySelector('#search');
    window.domQuery(searchForm).validate({
      submitHandler: (form, event) => {
        event.preventDefault();
        const formValues = {};
        const formItems = window.domQuery(form).serializeArray();
        formItems.map(item => {
          formValues[item.name] = item.value;
        });

        this.search(formValues);
      },
    });
  }

  async loadJsLibs() {
    // Load notification
    await import(window.helpers.getDefaultConfig().jsLibs.pagination);
    window.helpers.loadCSS(window.helpers.getDefaultConfig().cssLibs.pagination);
  }

  async onCreated() {
    await this.loadDomQueryAndPlugins();
    await this.loadJsLibs();
    await this.search();
    this._handleSearchForm();
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }
}

customElements.define(dzOrderWrapperCode.is, dzOrderWrapperCode);
