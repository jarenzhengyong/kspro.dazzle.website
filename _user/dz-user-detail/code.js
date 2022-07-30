class dzUserDetailCode extends dzEditableComponent {

  static get is() {
    return 'dz-user-detail';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }
  static get observedAttributes() {
    return ['items'];
  }
  attributeUpdate(name,text){
    try {
      this.querySelector('['+name+']').innerHTML = text;
    } catch(e){
      return;
    }
  }

  async bindData (){
    console.log('Bind Data');
    let manager = new DataPackage('user');
    this.userId = this.items;
    this.user = await manager.getDataByES(this.userId);
    console.log('User',this.user,this.userId);
    // try {
    //     this.attributeUpdate('dz-user-name',)

    // }catch(e){

    // }

  }
  async attributeChangedCallback(name, oldValue, newValue) {
    await this.bindData();
  }
  connectedCallback() {
    super.connectedCallback();
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
  }
}

customElements.define(dzUserDetailCode.is, dzUserDetailCode);
