// Attribute 
// dz-search-form
// This is an attribute applied to form for searching product.

// input[name="keyword"]
// You should assign the name attribute to keyword for keyword search.

class dzProductSearchCode extends dzEditableComponent{
  constructor() {
    super();
    this.itemManager = new DataPackage('product');
  }
  static getName() {
    return 'dz-product-search';
  }


  async onCreated() {
    // alert('hello')
    await this.loadDomQueryAndPlugins();
    await this.loadJsLibs();

    this._handleSearchForm();
  }

  _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', async () => {
        switch (fc) {
          case '_addToCart':
            // jaren
            await this._addToCart(item.getAttribute('data-id'));
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
  async _addToCart(productId) {
    // jaren
    const cartItems = this._getStore('cartItems') || {};
    const purchaseQuantity = 1;
    const updatedCartItems = {
      ...cartItems,
      [productId]: {
        id: productId,
        quantity: productId in cartItems ? cartItems[productId].quantity + purchaseQuantity : purchaseQuantity,
      },
    };
    await window['helpers'].showModal('Add item successfully', {autoClose: true});
    this._setStore('cartItems', updatedCartItems);
  }
  

  _setStore(key, value) {
    window.store.set(key, value);
  }
  _getStore(key) {
    return window.store.get(key);
  }

  formatData(data) {
    return data.map(item => ({
      ...item,
      price: window.helpers.formatNumber(item.price || 0),
      salePrice: item.salePrice ? window.helpers.formatNumber(item.salePrice) : '-',
    }));
  }

  search() {
    let wrapper = this.querySelector('[data-wrapper]');
    let filterConditions = window.helpers.getParamsUrl();
    this.query = {
      'match': {
       
      },
    };

    if (Object.keys(filterConditions).length) {
      if (filterConditions.keyword) {
        this.query.match.title = {
          'query': filterConditions.keyword || '',
        };
      }
      if (filterConditions.categories) {
        this.query.match.category = {
          'query': filterConditions.categories || '',
        };
      }
    } else {
      this.query = {
        /* 'match': {
          'category':'product'
        }, 
        'match': {
          'category':'美容產品'
        },*/
        "match_all": {
        }
      };
    }

    let json = this.query;
    // let template = this.querySelector('template#product-item').innerHTML;
    let template = this._template['product-item'];
    const defaultImage = window.helpers.getDefaultConfig().urls.defaultImage;
    console.log('Search',json);
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
            allHtml = allHtml + html;
          });

          wrapper.innerHTML = allHtml;

          this._matchHeight();
          setTimeout(() => {
            this._matchHeight();
            // jaren
            this._listenDzFunction();
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
    const searchForm = this.querySelector('[dz-search-form]');
    window.domQuery(searchForm).validate({
      submitHandler: (form) => {
        const formValues = {};
        const formItems = window.domQuery(form).serializeArray();
        console.log('Form Items',formItems);

        formItems.map(item => {
          formValues[item.name] = item.value;
        });

        let keyword = formItems[0].value;
        console.log(keyword);
        location.href = "/product.html?keyword="+keyword;
        
        // this.search(formValues);
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

customElements.define(dzProductSearchCode.getName(), dzProductSearchCode);
