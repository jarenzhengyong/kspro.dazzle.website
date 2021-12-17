// import {Dazzle} from 'http://localhost:8002/node_modules/@dazzle/dz-dazzle/dz-library.js';
import {Dazzle} from 'https://portal.dazzle.website/node_modules/@dazzle/dz-dazzle/dz-library.js';
import 'https://portal.dazzle.website/node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
// import './dz-booking.js';

window.siteUid = 'kspro';

await Dazzle.listenHotKeys();
await Dazzle.initGlobalVars();
await Dazzle.dynamicLoadComponents();

let dzBlock = document.createElement('dz-block');
document.querySelector('body').appendChild(dzBlock);
