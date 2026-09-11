const STATUSES = ["感兴趣","准备联系导师","已联系导师","准备申请材料","已提交","等待结果","Offer","Rejected","放弃申请"];
const saved = JSON.parse(localStorage.getItem('northstar-statuses') || '{}');
const state = { search:'', country:'', minMatch:0, sort:'match' };
const el = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function statusFor(p){ return saved[p.id] || '感兴趣'; }
function saveStatus(id, value){ saved[id]=value; localStorage.setItem('northstar-statuses', JSON.stringify(saved)); renderAll(); }
function deadlineText(p){ return p.deadline || '来源未说明'; }
function filtered(){
  let rows=PROJECTS.filter(p=>{const hay=[p.title,p.institution,p.country,p.city,p.lab,...p.topics].join(' ').toLowerCase(); return hay.includes(state.search.toLowerCase()) && (!state.country||p.country===state.country) && p.match>=state.minMatch;});
  return rows.sort((a,b)=>state.sort==='match'?b.match-a.match:state.sort==='newest'?b.firstSeen.localeCompare(a.firstSeen):(a.deadline||'9999').localeCompare(b.deadline||'9999'));
}
function renderCards(){
  const rows=filtered(); el('result-count').textContent=`找到 ${rows.length} 个已核验岗位`;
  el('cards').innerHTML=rows.map(p=>`<article class="project-card" data-id="${p.id}">
    <div class="card-top"><div class="match-ring" style="--score:${p.match}"><span>${p.match}</span><small>%</small></div><div class="card-heading"><div class="badges"><span>${esc(p.country)}</span><span class="verified">✓ 已核验来源</span></div><h2>${esc(p.title)}</h2><p>${esc(p.institution)}</p></div></div>
    <div class="facts"><span>⌖ ${esc(p.city)}</span><span>◷ 截止 ${deadlineText(p)}</span><span>＋ 首次发现 ${p.firstSeen}</span></div>
    <div class="tags">${p.topics.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
    <div class="card-bottom"><label>申请状态<select class="status-select" data-id="${p.id}">${STATUSES.map(s=>`<option ${statusFor(p)===s?'selected':''}>${s}</option>`).join('')}</select></label><button class="detail-button">查看详情 <span>→</span></button></div>
  </article>`).join('') || '<div class="empty"><strong>目前没有通过详情页核验的开放岗位</strong><span>这里不再展示学校首页、搜索入口或无法打开的链接。下方仍可使用已收藏的岗位发现渠道。</span></div>';
  document.querySelectorAll('.project-card').forEach(c=>c.addEventListener('click',e=>{if(!e.target.closest('select')) openDrawer(PROJECTS.find(p=>p.id===c.dataset.id));}));
  document.querySelectorAll('.status-select').forEach(s=>s.addEventListener('change',()=>saveStatus(s.dataset.id,s.value)));
}
function openDrawer(p){
  el('drawer-content').innerHTML=`<p class="eyebrow">${esc(p.sourceType)}</p><h2>${esc(p.title)}</h2><p class="institution">${esc(p.institution)}</p><div class="drawer-score"><strong>${p.match}%</strong><span>与你的研究经历匹配</span></div><h3>项目内容</h3><p>${esc(p.summary)}</p><h3>申请要求</h3><ul>${p.requirements.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>为什么匹配</h3><ul>${p.fit.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="source-box"><span>原始来源</span><strong>${p.verified?'已核验入口':'待核验'}</strong><a href="${p.source}" target="_blank" rel="noopener">打开官方来源 ↗</a></div>`;
  el('drawer').classList.add('open'); el('overlay').classList.add('open'); el('drawer').setAttribute('aria-hidden','false');
}
function closeDrawer(){el('drawer').classList.remove('open');el('overlay').classList.remove('open');el('drawer').setAttribute('aria-hidden','true');}
function renderBoard(){
  el('board').innerHTML=STATUSES.map(s=>{const ps=PROJECTS.filter(p=>statusFor(p)===s);return `<div class="column"><div class="column-title"><h3>${s}</h3><span>${ps.length}</span></div>${ps.map(p=>`<button class="mini-card" data-id="${p.id}"><strong>${esc(p.title)}</strong><span>${esc(p.institution.split('·')[0])}</span><i>${p.match}% 匹配</i></button>`).join('')||'<p class="column-empty">暂无项目</p>'}</div>`}).join('');
  document.querySelectorAll('.mini-card').forEach(c=>c.addEventListener('click',()=>openDrawer(PROJECTS.find(p=>p.id===c.dataset.id))));
}
function renderStats(){ el('open-count').textContent=PROJECTS.length; el('high-count').textContent=PROJECTS.filter(p=>p.match>=85).length; el('new-count').textContent=PROJECTS.filter(p=>p.firstSeen>='2026-09-03').length; el('tracked-count').textContent=PROJECTS.filter(p=>!['感兴趣','Rejected','放弃申请'].includes(statusFor(p))).length; }
function renderLogs(){el('log-list').innerHTML=SEARCH_LOGS.map(l=>`<div class="log-row"><div class="log-date"><strong>${l.date}</strong><span>${l.time}</span></div><div class="log-metrics"><span>扫描来源 <b>${l.found}</b></span><span>新增 <b>${l.added}</b></span><span>合并重复 <b>${l.duplicates}</b></span><span>关闭 <b>${l.closed}</b></span></div><p>${l.note}</p></div>`).join('');}
function renderSources(){el('source-grid').innerHTML=SAVED_SOURCES.map(([name,desc,url])=>`<a class="source-card" href="${url}" target="_blank" rel="noopener"><div><strong>${name}</strong><span>${desc}</span></div><b>↗</b></a>`).join('');}
function renderAll(){renderCards();renderBoard();renderStats();renderLogs();renderSources();}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.nav-item,.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');el(b.dataset.view).classList.add('active');const titles={opportunities:['博士机会','围绕浮式海上风电与耦合动力学，为你的研究轨迹筛选。'],pipeline:['申请看板','从第一次心动到最终结果，每一步都在这里。'],profile:['匹配画像','你的研究积累，是筛选机会的核心坐标。'],logs:['检索记录','查看每日发现、核验、去重与状态更新。']}; el('page-title').textContent=titles[b.dataset.view][0];el('page-subtitle').textContent=titles[b.dataset.view][1];}));
['search','country-filter','match-filter','sort'].forEach(id=>el(id).addEventListener(id==='search'?'input':'change',e=>{if(id==='search')state.search=e.target.value;if(id==='country-filter')state.country=e.target.value;if(id==='match-filter')state.minMatch=+e.target.value;if(id==='sort')state.sort=e.target.value;renderCards();}));
[...new Set(PROJECTS.map(p=>p.country))].forEach(c=>el('country-filter').insertAdjacentHTML('beforeend',`<option>${c}</option>`));
el('close-drawer').onclick=closeDrawer;el('overlay').onclick=closeDrawer;document.addEventListener('keydown',e=>e.key==='Escape'&&closeDrawer());
el('theme-button').onclick=()=>document.body.classList.toggle('dark');
PROFILE.topics.forEach(x=>el('profile-topics').insertAdjacentHTML('beforeend',`<span>${x}</span>`));PROFILE.tools.forEach(x=>el('profile-tools').insertAdjacentHTML('beforeend',`<span>${x}</span>`));
renderAll();
