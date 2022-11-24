var f=Object.defineProperty;var u=(s,i,n)=>i in s?f(s,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[i]=n;var l=(s,i,n)=>(u(s,typeof i!="symbol"?i+"":i,n),n);(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?e.credentials="include":t.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function o(t){if(t.ep)return;t.ep=!0;const e=n(t);fetch(t.href,e)}})();class d{constructor(i,n={blurRadius:50}){l(this,"element");l(this,"canvas");l(this,"media");l(this,"options");var r,a,h;this.options=n;let o=i;if(typeof i=="string"&&(o=document.querySelector(i),!o))throw new ReferenceError("There are no elements with this selector: "+i);this.element=o,this.element.classList.add("softlight");let t=this.element.querySelector("canvas");if(t===null)throw new ReferenceError("There are no canvas elements within this SoftLight element.");let e=(a=(r=this.element.querySelector("img"))!=null?r:this.element.querySelector("video"))!=null?a:this.element.querySelector("iframe");if(e===null)throw new ReferenceError("There are no img, video, or iframe elements within this SoftLight element.");if(this.canvas=t,e instanceof HTMLIFrameElement&&(e=(h=e.contentWindow)==null?void 0:h.document.querySelector("video")),e==null)throw new ReferenceError("There are no video elements within this iframe element.");this.media=e,this.media instanceof HTMLImageElement?this.media.onload=this.update.bind(this):(this.media.onseeked=this.update.bind(this),this.media.ontimeupdate=this.update.bind(this),setTimeout(()=>{const c=new Event("seeked");this.media.dispatchEvent(c)},250))}update(){const{x:i,y:n,width:o,height:t}=this.element.getBoundingClientRect();this.canvas.width=o,this.canvas.height=t;const{x:e,y:r,width:a,height:h}=this.media.getBoundingClientRect(),c=this.canvas.getContext("2d");if(!c)throw new Error("Cannot get context for canvas.");c.drawImage(this.media,e-i,r-n,a,h),this.canvas.style.filter=`blur(${this.options.blurRadius}px)`}}new d("#softlight-img");new d("#softlight-vid");
