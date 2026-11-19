const brands=import.meta.glob('./brands/*.svg',{query:'?url',import:'default',eager:true});
import {tools} from './tools-data.js';
export {tools};
export function brandMark(brand,fallback='◇'){const url=brands['./brands/'+brand+'.svg'];return url?'<span class="brand-mark" aria-hidden="true" style="--brand-mark:url(&quot;'+url+'&quot;)"></span>':'<span class="own-mark" aria-hidden="true">'+fallback+'</span>';}
