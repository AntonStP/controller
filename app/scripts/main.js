//webpack сам подключит
import './../style/main.scss';
import './../style/css/fonts.css';
import './../favicon.ico';


import './../components/project/project';
import { anchorSmoothScroll } from './anchorSmoothScroll';
import 'lazysizes';
import "lazysizes/plugins/bgset/ls.bgset.min";
import "lazysizes/plugins/respimg/ls.respimg.min";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";


if ( /*@cc_on!@*/false || !!document.documentMode) document.body.classList.add('_ie'); // detect IE

let add = (a,b) => a+b;
console.log(add(3,6));
anchorSmoothScroll();
