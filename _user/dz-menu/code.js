class dzMenuCode extends dzEditableComponent {
  static getName() {
    return 'dz-menu';
  }

  async _initWebEditor() {
    this.label = 'Menu';
  }

  static get properties() {
    return {
    };
  }
  async onCreated() {
    // jaren 高亮菜单状态
    const box = this.querySelectorAll('[dz-menu-active] li')
    box.forEach(item => {
      let element = item.querySelector('a')
      const pathname = element.href.replace(/http:\/\/\S+?\//g, '')
      if( pathname === window.location.pathname.slice(1) ) {
        item.setAttribute('class', 'active')
      }
    })
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzMenuCode.getName(), dzMenuCode);
