if(!self.define){let e,s={};const n=(n,r)=>(n=new URL(n+".js",r).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,i)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let o={};const t=e=>n(e,l),d={module:{uri:l},exports:o,require:t};s[l]=Promise.all(r.map((e=>d[e]||t(e)))).then((e=>(i(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/auth-vendor-2gQdNE61.js",revision:null},{url:"assets/browser-Ch-eXBWJ.js",revision:null},{url:"assets/date-vendor-CBpsKyOP.js",revision:null},{url:"assets/index-Bw5jjWMK.css",revision:null},{url:"assets/index-OvAf7Cxo.js",revision:null},{url:"assets/map-vendor--SRgJ61u.js",revision:null},{url:"assets/react-vendor-DuyEvWKb.js",revision:null},{url:"assets/state-vendor-D2RKdSO0.js",revision:null},{url:"index.html",revision:"bec5363d720684a440d5f23c26d19264"},{url:"offline.html",revision:"86749d5046701c9e34a068c8e102e49c"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icon-144x144.png",revision:"0e4cdb4e064ec1bdd9aacd67ae605faa"},{url:"manifest.webmanifest",revision:"5aa4bdac462704784aa4dec8a2d2c60b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
