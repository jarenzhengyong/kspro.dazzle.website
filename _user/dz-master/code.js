class dzMasterCode extends dzEditableComponent {
  static getName() {
    return 'dz-master';
  }
  async onCreated() {
    // alert('hello')
    // await this.loadDomQueryAndPlugins();
    // await this.loadJsLibs();
    // Dazzle.getContent('/_user/template.html').then(html=>{
    //   console.log('HTML',html);
    // });
    
  }
  static get properties() {
    return {
    };
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzMasterCode.getName(), dzMasterCode);
