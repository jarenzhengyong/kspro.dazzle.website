class dzUserPanelCode extends dzEditableComponent {
  isLoggedIn = false;

  constructor() {
    super();
    this.coreVariable = [
      'dz-user-no-login',
      'dz-user-logined',
      'dz-user-name',
      'dz-logout'
    ];
    this.coreElement ={};
    try{
          this.coreVariable.forEach(vars => {
              let elm = this.querySelectorAll('['+vars+']') || null;
              
              // if (elm)
              this.coreElement[vars] = elm;
          });
          console.log('Vars',this.coreElement);
    } catch(e){
        console.log('Vars error');
    }
  }

  static get is() {
    return 'dz-user-panel';
  }

  // async _initWebEditor() {
  //   new defaultPackage(this);
  // }

  render() {
    return this.html`
      <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async _handleClickEvents() {
    // Use dz-func to handle click event
    let buttons = document.querySelectorAll('[dz-func]');
    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', async (e) => {
        switch (fc) {
          case '_handleClickUserPanel':
            if (!this.isLoggedIn) {
              location.href = window.helpers.getDefaultConfig().urls.login;
            }
            break;
          case '_handleClickLogout':
            localStorage.removeItem('authUser');
            localStorage.removeItem('token');

            await window.helpers.showModal(window.helpers.getDefaultConfig().messages.logoutSuccessfully, {autoClose: true});
            location.href = window.helpers.getDefaultConfig().urls.login;
            break;
          case '_handleClickProfile':
            location.href = window.helpers.getDefaultConfig().urls.profile;
            break;
          case '_handleClickLogin':
            location.href = window.helpers.getDefaultConfig().urls.login;
            break;
          case '_handleClickRegister':
            location.href = window.helpers.getDefaultConfig().urls.register;
            break;
        }
      });
    });
  }

  _checkCurrentAccount() {
    let authUser = null;
    try {
      authUser = JSON.parse(localStorage.getItem('authUser'));
      this.subUser = authUser;
    } catch (e) {
      console.log(e);
    }
    console.log(authUser,'0909090')
    const placeHolder = this.querySelector('.user-panel-placeholder');

      if (authUser) {
        console.log('I am logined');
        this.isLoggedIn = true;
        this.coreElement['dz-user-no-login'].forEach(item=>{
          console.log('Vars',item);
          item.remove();
        });
        this.coreElement['dz-user-logined'].forEach(item=>{
          item.style.visibility ='visible';         
        });
        this.coreElement['dz-logout'].forEach(item=>{
          item.addEventListener('click',e=>{
            this.logout();
          });
        });

        // this.coreElement['dz-user-name'].innerHTML = '';
        this.coreElement['dz-user-name'][0].innerHTML = authUser.profile.email;
      } else {
        this.coreElement['dz-user-no-login'].forEach(item=>{
          item.style.visibility ='visible';
        });
        this.coreElement['dz-user-logined'].forEach(item=>{
          item.remove();
        });  
      }
    

  }
  async logout(){
          localStorage.removeItem('authUser');
          localStorage.removeItem('token');
          await window.helpers.showModal(window.helpers.getDefaultConfig().messages.logoutSuccessfully, {autoClose: true});
          location.href = window.helpers.getDefaultConfig().urls.login;
  }
  async loadDomQuery() {
    await import(window.helpers.getDefaultConfig().jsLibs.domQuery);
  }

  async loadJsLibs() {
    await import(window.helpers.getDefaultConfig().jsLibs.popperJs);

  }

  async onCreated() {
    // await this.loadDomQuery();
    // await this.loadJsLibs();

    this._checkCurrentAccount();
    // this.updateHeader();
    // // this.updateShoppingCart();
    // this._handleClickEvents();

  }

  updateHeader(){

    // let subUser = store.get('subUser') || null;
    let json= JSON.parse(localStorage.getItem('authUser'));
    let subUser = json['profile'];
    console.log('Sub User',subUser);
   
  }
  updateShoppingCart(){
    let cart = store.get('cartItems') || null;
    console.log('Sub User',subUser);
    let html = `
    <button type="button" data-toggle="dropdown" class="btn btn-inverse btn-block btn-lg dropdown-toggle heading">
    <a><span id="cart-total" data-loading-text="加載中......&nbsp;&nbsp;">
        <span dz-cart-item-total>0</span> 項商品 - HK$<span dz-cart-subtotal>0.0</span></span> <i></i></a></button>
            <div class="content">
                <template id="dz-cart-item-detail">
                    <tr>
                        <td class="text-center image">            
                                <a href="/productdetail.html#[[id]]">
                                <img src="[[image]]" alt="[[title]]" class="img-thumbnail"></a>
                        </td>
                        <td class="text-left name"><a href="/productdetail.html#[[id]]">[[title]]</a>
                                <div>
                                        
                                </div>
                        </td>
                        <td class="text-right quantity">x [[qty]]</td>
                        <td class="text-right total">HK$<span dz-subtotal>[[price]]</span></td>
                        <td class="text-center remove">
                            <button type="button" dz-func="removeCart"  title="移除" class=""><i class=""></i></button>
                        </td>
                    </tr>
                </template>

                <ul class="cart-wrapper" dz-cart-panel>
                    <li class="mini-cart-info">
                    <table class="table table-striped">
                        <tbody template="dz-cart-item-detail">
                    
                        </tbody>
                    </table>
                    </li>
                    <li>
                    <div class="mini-cart-total">
                        <table class="table table-bordered">
                                    <tbody>
                                    
                                    <tr>
                            <td class="text-right right"><strong>總計</strong></td>
                            <td class="text-right right">HK$<span dz-cart-subtotal>338.0</span></td>
                        </tr>
                                </tbody></table>
                        <p class="text-right checkout">&nbsp;
                            <a class="button" href="#" dz-func="_recalc">更新</a>
                            <a class="button" href="#" dz-func="_checkout">結算</a>
                        </p>
                    </div>
                    </li>
                </ul>
            <ul class="cart-wrapper" dz-cart-no-item>
                <li>
                    <p class="text-center empty">您的購物車沒有添加商品！</p>
                </li>
            </ul>

            </div>
    
    `;
    document.querySelector('.top-menu').innerHTML = html;
  }
  // async ready() {
  //   super.ready();

  //   await this.loadJsLibs();

  //   this._handleClickEvents();
  //   this._checkCurrentAccount();
  // }
}

customElements.define(dzUserPanelCode.is, dzUserPanelCode);
