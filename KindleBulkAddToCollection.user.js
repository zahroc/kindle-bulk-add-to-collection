// ==UserScript==
// @name Kindle Bulk Add to Collection
// @namespace https://github.com/zahroc/kindle-bulk-add-to-collection
// @version 1.5.0
// @match https://www.amazon.com/hz/mycd/*
// @description Add Kindle books to an existing collection in batches.
// @author zahroc
// @license MIT
// @homepageURL https://github.com/zahroc/kindle-bulk-add-to-collection
// @supportURL https://github.com/zahroc/kindle-bulk-add-to-collection/issues
// @updateURL https://raw.githubusercontent.com/zahroc/kindle-bulk-add-to-collection/main/KindleBulkAddToCollection.user.js
// @downloadURL https://raw.githubusercontent.com/zahroc/kindle-bulk-add-to-collection/main/KindleBulkAddToCollection.user.js
// @grant none
// ==/UserScript==
(() => {
'use strict';
if (!location.pathname.includes('/contentlist/booksAll/')) return;
const key='kindleBulkProgressV15';
const panel=document.createElement('div');
panel.style.cssText='position:fixed;right:12px;bottom:12px;width:340px;z-index:2147483647;background:white;color:#222;border:2px solid #888;border-radius:8px;padding:12px;box-shadow:0 3px 15px #0005;font:14px Arial';
panel.innerHTML='<b>Kindle Bulk Add to Collection v1.5</b><p>Collection <input id="kbName" placeholder="Existing collection name" style="width:180px"></p><p>Delay (seconds) <select id="kbDelay" style="width:85px;color:#222;background:white"><option value="5">5 sec</option><option value="10">10 sec</option><option value="15">15 sec</option><option value="20">20 sec</option><option value="30">30 sec</option></select></p><p><label><input id="kbTest" type="checkbox" checked> Preview only</label></p><p><label><input id="kbAll" type="checkbox"> Automatically advance pages</label></p><button id="kbStart">Start / Resume</button> <button id="kbPause">Pause</button> <button id="kbStop">Stop</button><p id="kbStatus">Ready</p><pre id="kbLog" style="white-space:pre-wrap;max-height:150px;overflow:auto"></pre>';
document.body.append(panel);
const $=id=>panel.querySelector('#'+id);
let running=false,paused=false,stopped=false;
const log=s=>{$('kbStatus').textContent=s;$('kbLog').textContent=(s+'\n'+$('kbLog').textContent).slice(0,5000);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const visible=e=>e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';
function controls(root,label){return [...root.querySelectorAll('button,a,input[type=button],input[type=submit],[role=button],span')].filter(e=>!panel.contains(e)&&visible(e)&&norm(e.value||e.innerText||e.textContent)===label&&!e.closest(':disabled,[aria-disabled="true"],.a-button-disabled')).filter((e,i,a)=>!a.some(x=>x!==e&&x.contains(e)));}
function unique(root,label){const a=controls(root,label);if(a.length!==1)throw Error('Expected one control: '+label+'; found '+a.length);return a[0];}
function range(){const m=document.body.innerText.match(/Showing\s+([\d,]+)\s+to\s+([\d,]+)\s+of\s+([\d,]+)\s+items(?:\s*\|\s*([\d,]+)\s+selected)?/i);if(!m)return null;return m.slice(1).map(x=>Number((x||'0').replace(/,/g,'')));}
async function wait(fn,ms=15000){const end=Date.now()+ms;while(Date.now()<end){if(stopped)throw Error('Stopped');const v=fn();if(v)return v;await sleep(250);}throw Error('Timed out waiting for Amazon interface');}
async function gate(){while(paused&&!stopped)await sleep(250);if(stopped)throw Error('Stopped');}
function dialog(){const list=document.getElementById('BULK_ADD_TO_COLLECTION_DIALOG_ID');if(!list||!visible(list))return null;let p=list.parentElement;while(p&&p!==document.body){if(controls(p,'Cancel').length===1&&[...p.querySelectorAll('span,button')].some(e=>visible(e)&&norm(e.textContent)==='Make Changes'))return p;p=p.parentElement;}return null;}
function rows(d){return [...d.querySelectorAll('#BULK_ADD_TO_COLLECTION_DIALOG_ID > li')].map(row=>{const label=row.querySelector('[class*="action_list_value"]'),b=row.querySelector('[role="checkbox"]');if(!label||!b)throw Error('Unexpected collection row');return {name:norm(label.textContent),b,state:b.getAttribute('aria-checked')};});}
function target(d,name){const matches=rows(d).filter(x=>x.name===name);if(matches.length!==1)throw Error('Cannot uniquely identify collection: '+name);return matches[0].b;}
function state(b){return b.getAttribute('aria-checked');}
function snapshot(d){return rows(d).map(x=>({name:x.name,state:x.state}));}
function notification(){const a=[...document.querySelectorAll('[class*="Notification-module_message_heading_success"]')].filter(visible);if(a.length>1)throw Error('Multiple success notifications');return a[0]||null;}
function nextControl(page){const candidates=controls(document,String(page));if(candidates.length!==1)throw Error('Cannot uniquely identify page '+page);return candidates[0];}
$('kbPause').onclick=()=>{paused=!paused; $('kbPause').textContent=paused?'Continue':'Pause';log(paused?'Pause requested (before next action)':'Continuing');};
$('kbStop').onclick=()=>{stopped=true;paused=false;log('Stop requested');};
$('kbStart').onclick=async()=>{
if(running){paused=false;return;}
const name=$('kbName').value.trim(),test=$('kbTest').checked,all=$('kbAll').checked,delay=Math.max(5,Number($('kbDelay').value)||5)*1000;
if(!name)return log('Enter collection name');

if(!test&&!confirm('Add '+(all?'all books from the current page onward':'only the current page')+' to collection "'+name+'"? Checkpoints record Amazon-confirmed batches, not independently verified membership.'))return;
running=true;stopped=false;paused=false;
try{
while(true){await gate();if(notification()||document.querySelectorAll('#notification-close').length&&[...document.querySelectorAll('#notification-close')].some(visible))throw Error('Close existing notification first');if(dialog())throw Error('Close existing collection dialog first');const r=range();if(!r)throw Error('Book range not detected');const [first,last,total]=r,count=last-first+1;log(`Page ${first}-${last} of ${total}`);
if(r[3]!==count)unique(document,'Select All').click();await wait(()=>{const x=range();return x&&x[0]===first&&x[3]===count;});await gate();(await wait(()=>{const a=controls(document,'Add to Collections');if(a.length>1)throw Error('Ambiguous Add to Collections control');return a.length===1?a[0]:null;})).click();const d=await wait(dialog);const title=d.innerText.match(/add\s+([\d,]+)\s+title(?:\(s\)|s)?/i);if(!title||Number(title[1].replace(/,/g,''))!==count)throw Error('Dialog title count mismatch');const b=target(d,name);const before=snapshot(d);
if(test){log(`Preview: ${count} books; target ${name}; checkbox ${state(b)}. No changes saved.`);unique(d,'Cancel').click();break;}
await gate();if(state(b)!=='true'){if(!['false','mixed'].includes(state(b)))throw Error('Unknown checkbox state');b.click();await wait(()=>state(target(d,name))==='true');const after=snapshot(d);if(after.length!==before.length||before.some(x=>x.name!==name&&!after.some(y=>y.name===x.name&&y.state===x.state)))throw Error('Another collection changed; cancel dialog manually');await gate();unique(d,'Make Changes').click();const msg=await wait(notification,60000);const m=norm(msg.textContent).match(/^(\d[\d,]*) title\(s\) have been added to (\d[\d,]*) collection\(s\)\.$/i);if(!m||Number(m[1].replace(/,/g,''))!==count||Number(m[2].replace(/,/g,''))!==1)throw Error('Unexpected success message: '+norm(msg.textContent));
localStorage.setItem(key,JSON.stringify({name,first,last,total,at:new Date().toISOString()}));log(`Amazon confirmed items ${first}-${last} of ${total}`);
await gate();const close=[...document.querySelectorAll('#notification-close[role="button"][aria-label="Close"]')].filter(visible);if(close.length!==1)throw Error('Cannot uniquely identify notification close button');close[0].click();await wait(()=>!notification()&&!close.some(visible)&&!dialog(),30000);await sleep(delay);await gate();
}else{throw Error('Target already checked on opening; ambiguous action state; inspect manually');}
const now=range();if(!now||now[0]!==first||now[1]!==last||now[2]!==total)throw Error('Page changed unexpectedly after submission');
log(`Confirmed items ${first}-${last} of ${total}; notification closed.`);
if(!all||last===total){log(last===total?'Final page confirmed by Amazon. Verify collection contents.':'One-page confirmation complete.');break;}
await gate();if(now[3]>0){unique(document,'Deselect All').click();await wait(()=>range()?.[3]===0);}
const page=Math.floor((first-1)/25)+2;nextControl(page).click();await wait(()=>{const x=range();return x&&x[0]===last+1&&x[2]===total&&x[3]===0;},30000);await sleep(delay);

}
}catch(e){log('Stopped: '+e.message+' — inspect Amazon before resuming.');}finally{running=false;}
};
try{const p=JSON.parse(localStorage.getItem(key)||'null');if(p){$('kbName').value=p.name;log(`Last Amazon-confirmed checkpoint: item ${p.last}. Navigate to the desired page before resuming.`);}}catch{}
})();
