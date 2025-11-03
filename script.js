const startBtn = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const desktop = document.getElementById('desktop');
const windowsContainer = document.getElementById('windows');
const template = document.getElementById('window-template');
let zIndexCounter = 10;

// Ceas
function updateClock(){
  const c = document.getElementById('clock');
  const now = new Date();
  c.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

startBtn.addEventListener('click', ()=> startMenu.classList.toggle('hidden'));

document.querySelectorAll('[data-app]').forEach(el=>{
  el.addEventListener('click', ()=>{
    const app = el.dataset.app;
    openApp(app);
    startMenu.classList.add('hidden');
  });
});

function openApp(app){
  const win = template.content.firstElementChild.cloneNode(true);
  const title = win.querySelector('.title');
  const content = win.querySelector('.content');

  if(app === 'notepad'){
    title.textContent = 'Notepad';
    content.innerHTML = `<textarea style="width:100%;height:100%;background:transparent;color:inherit;border:1px solid rgba(255,255,255,0.03);padding:8px;resize:none;"></textarea>`;
  } else if(app === 'file-explorer'){
    title.textContent = 'File Explorer';
    content.innerHTML = `<div style="display:flex;gap:12px;height:100%"><div style="width:180px;border-right:1px solid rgba(255,255,255,0.02)"><ul style="list-style:none;padding:8px;margin:0;color:#cfe6ff"><li>Documents</li><li>Pictures</li><li>Music</li></ul></div><div style="flex:1;padding:8px;color:#d8e9ff">Simulare File Explorer. Nu există fișiere reale.</div></div>`;
  } else if(app === 'settings'){
    title.textContent = 'Settings';
    content.innerHTML = `<div style="padding:8px; color:#d8e9ff"><h3>Settings (Demo)</h3><p>Teme și opțiuni false.</p></div>`;
  }

  win.style.left = (50 + Math.random()*200) + 'px';
  win.style.top = (50 + Math.random()*120) + 'px';
  win.style.zIndex = ++zIndexCounter;

  const btnClose = win.querySelector('.close');
  const btnMin = win.querySelector('.min');
  const btnMax = win.querySelector('.max');

  btnClose.addEventListener('click', ()=> win.remove());
  btnMin.addEventListener('click', ()=> win.style.display = 'none');
  btnMax.addEventListener('click', ()=>{
    if(win.dataset.max === '1'){
      win.style.width = win.dataset.oldWidth;
      win.style.height = win.dataset.oldHeight;
      win.style.left = win.dataset.oldLeft;
      win.style.top = win.dataset.oldTop;
      delete win.dataset.max;
    } else {
      win.dataset.oldWidth = win.style.width || win.offsetWidth+'px';
      win.dataset.oldHeight = win.style.height || win.offsetHeight+'px';
      win.dataset.oldLeft = win.style.left || win.offsetLeft+'px';
      win.dataset.oldTop = win.style.top || win.offsetTop+'px';
      win.style.left = '12px';
      win.style.top = '12px';
      win.style.width = (window.innerWidth - 24) + 'px';
      win.style.height = (window.innerHeight - 96) + 'px';
      win.dataset.max = '1';
    }
  });

  win.addEventListener('mousedown', ()=> win.style.zIndex = ++zIndexCounter);

  const titlebar = win.querySelector('.titlebar');
  titlebar.style.cursor = 'grab';
  titlebar.addEventListener('mousedown', (e)=>{
    if(e.target.closest('.controls')) return;
    const startX = e.clientX, startY = e.clientY;
    const rect = win.getBoundingClientRect();
    const offsetX = startX - rect.left, offsetY = startY - rect.top;

    function onMove(ev){
      win.style.left = (ev.clientX - offsetX) + 'px';
      win.style.top = (ev.clientY - offsetY) + 'px';
    }
    function onUp(){
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  });

  windowsContainer.appendChild(win);
}

document.getElementById('taskbar-center').addEventListener('click', ()=>{
  const hidden = Array.from(windowsContainer.querySelectorAll('.window')).find(w => w.style.display === 'none');
  if(hidden) hidden.style.display = 'flex';
});

desktop.addEventListener('dblclick', ()=> openApp('notepad'));
document.addEventListener('dragstart', e => e.preventDefault());
