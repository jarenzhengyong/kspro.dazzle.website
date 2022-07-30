
class dzHotProductCode extends dzEditableComponent{
  constructor() {
    super();
    this.itemManager = new DataPackage('product');

  }
  static getName() {
    return 'dz-hot-product';
  }


  async onCreated() {
    // alert('hello')
    await this.loadDomQueryAndPlugins();
    await this.loadJsLibs();

    this.search();
  }

  _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', async () => {
        switch (fc) {
          case '_addToCart':
            await this._addToCart();
            break;
          case '_likeItem':
            await this._likeItem();
            break;
          case '_unlikeItem':
            await this._unlikeItem();
            break;
        }
      });
    });
  }

  _setStore(key, value) {
    window.store.set(key, value);
  }

  formatData(data) {
    return data.map(item => ({
      ...item,
      price: window.helpers.formatNumber(item.price || 0),
      salePrice: item.salePrice ? window.helpers.formatNumber(item.salePrice) : '-',
    }));
  }

  search() {
    let that = this;
    let wrapper = this.querySelector('[data-wrapper]');
    let filterConditions = window.helpers.getParamsUrl();
    this.query = {
      'match': {
        'isHot': true
      },
    };
    // if (Object.keys(filterConditions).length) {
    //   if (filterConditions.keyword) {
    //     this.query.match.title = {
    //       'query': filterConditions.keyword || '',
    //     };
    //   }
    //   if (filterConditions.categories) {
    //     this.query.match.category = {
    //       'query': filterConditions.categories || '',
    //     };
    //   }
    // } else {
    //   this.query = {
    //     'match_all': {},
    //   };
    // }

    let json = this.query;
    // let template = this.querySelector('template#product-item').innerHTML;
    let template = this._template['product-item'];
    console.log('Template',this._template);
    const defaultImage = window.helpers.getDefaultConfig().urls.defaultImage;

    this.itemManager.searchDataByES(json).then(items => {
      // Sort items if it was defined in filterConditions
      console.log(items);
      items = this.formatData(items);
      if (filterConditions.sort) {
        const extracted = filterConditions.sort.split('|');
        const sortBy = extracted[0];
        const sortType = extracted[1];

        items.sort((a, b) => {
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
          items.reverse();
        }
      }

      window.domQuery(this.querySelector('.pagination')).pagination({
        dataSource: items,
        pageSize: 8,
        showPrevious: false,
        showNext: false,
        callback: (currentPageItems) => {
          wrapper.innerHTML = '';
          let allHtml = '';

          currentPageItems.forEach(item => {
            item['image'] = item['image'] || defaultImage;
            let html = this.itemManager.replaceToken(item, template);
            let elm = this.htmlToElement(html);
            elm.id = item['id'];
            new ItemPackage(elm);
            console.log('Elm',elm);
            // allHtml = allHtml + html;
            wrapper.appendChild(elm);
          });

          // wrapper.innerHTML = allHtml;

          this._matchHeight();
          setTimeout(() => {
            this._matchHeight();
          }, 1000);
        },
      });

    });
  }

  async loadDomQueryAndPlugins() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
    await import(window.helpers.getDefaultConfig().jsLibs.jqueryValidate);
    await import(window.helpers.getDefaultConfig().jsLibs.matchHeight);
  }

  async loadJsLibs() {
    // Load notification
    await import(window.helpers.getDefaultConfig().jsLibs.toastr);
    window.helpers.loadCSS(window.helpers.getDefaultConfig().cssLibs.toastr);

    // Load notification
    console.log(window.helpers.getDefaultConfig());
    await import(window.helpers.getDefaultConfig().jsLibs.pagination);
    window.helpers.loadCSS(window.helpers.getDefaultConfig().cssLibs.pagination);
  }

  _handleSearchForm() {
    const searchForm = this.querySelector('.search');
    window.domQuery(searchForm).validate({
      submitHandler: (form) => {
        const formValues = {};
        const formItems = window.domQuery(form).serializeArray();
        formItems.map(item => {
          formValues[item.name] = item.value;
        });

        this.search(formValues);
      },
    });
  }

  // Match height to better UI
  _matchHeight() {
    setTimeout(() => {
      window.domQuery('.item .wrap-title').matchHeight();
      window.domQuery('.item .wrap-image').matchHeight();
    }, 500);
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzHotProductCode.getName(), dzHotProductCode);
