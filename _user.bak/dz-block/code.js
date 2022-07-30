class dzBlockCode extends dzEditableComponent {
  static getName() {
    return 'dz-block';
  }

  static get properties() {
    return {
    };
  }
  constructor(){
    super();
   
  }
  async onCreated(){
    let header = this._template['_header'];
    let footer = this._template['_footer'];
    try{
      document.querySelector('[dz-template-id="_header"]').innerHTML = header;
      document.querySelector('[dz-template-id="_footer"]').innerHTML = footer;
        
      /* document.querySelectorAll('[dz-master]').forEach(item=>{
      let id = item.getAttribute('dz-master') || null;
      if (id)
        item.innerHTML = this._template[id];
      }); */
    } catch(e){
      
    }
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzBlockCode.getName(), dzBlockCode);
