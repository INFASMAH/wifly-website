const menuBtn=document.getElementById("menuBtn"),mobileMenu=document.getElementById("mobileMenu");
menuBtn?.addEventListener("click",()=>{const open=mobileMenu.classList.toggle("open");menuBtn.setAttribute("aria-expanded",open);menuBtn.textContent=open?"✕":"☰"});
document.querySelectorAll(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{mobileMenu.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");menuBtn.textContent="☰"}));

/* Portfolio filters (event delegation so filters/cards can be rebuilt from data/portfolio.json) */
document.querySelector(".filters")?.addEventListener("click",e=>{const btn=e.target.closest(".filter");if(!btn)return;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.filter;document.querySelectorAll(".work-card").forEach(w=>w.style.display=(f==="all"||w.dataset.category===f)?"block":"none")});

const toast=document.getElementById("toast");
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3200)}
document.querySelectorAll(".service-more").forEach(btn=>btn.addEventListener("click",()=>{document.getElementById("contact").scrollIntoView({behavior:"smooth"});setTimeout(()=>{const s=document.querySelector('select[name="service"]'); if(s){[...s.options].forEach(o=>{if(o.textContent===btn.dataset.service)o.selected=true})}},500)}));

/* ===== Form -> WhatsApp ===== */
const WHATSAPP_NUMBER="94000000000"; // <-- replace with your real number (country code, no + or spaces)
document.getElementById("quoteForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target),v=k=>(f.get(k)||"").toString().trim();
  const lines=["*New Inquiry - WiFly Website*","","*Name:* "+v("name"),"*Phone:* "+v("phone")];
  if(v("email"))lines.push("*Email:* "+v("email"));
  lines.push("*Service:* "+v("service"),"","*Message:*",v("message"));
  const url="https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(lines.join("\n"));
  const w=window.open(url,"_blank","noopener");
  if(!w)window.location.href=url;
  showToast("Opening WhatsApp… just press Send.");
  e.target.reset();
});

/* ===== Dark / Light theme ===== */
const themeBtn=document.getElementById("themeToggle"),root=document.documentElement;
function applyTheme(t){
  const dark=t==="dark";
  dark?root.setAttribute("data-theme","dark"):root.removeAttribute("data-theme");
  if(themeBtn){themeBtn.textContent=dark?"☀":"☾";themeBtn.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode")}
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",dark?"#0a1220":"#ffffff");
}
applyTheme(root.getAttribute("data-theme")==="dark"?"dark":"light");
themeBtn?.addEventListener("click",()=>{
  const next=root.getAttribute("data-theme")==="dark"?"light":"dark";
  applyTheme(next);
  try{localStorage.setItem("wifly-theme",next)}catch(err){}
});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const topBtn=document.getElementById("toTop");
window.addEventListener("scroll",()=>{topBtn.classList.toggle("show",window.scrollY>600)});
topBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));


/* ===== Page loader ===== */
(function(){
  const loader=document.getElementById("pageLoader");if(!loader)return;
  const start=Date.now();let done=false;
  function hide(){
    if(done)return;done=true;
    const wait=Math.max(0,1000-(Date.now()-start));
    setTimeout(()=>{loader.classList.add("hide");setTimeout(()=>loader.remove(),600)},wait);
  }
  window.addEventListener("load",hide);
  setTimeout(hide,3500); // safety: never block the site
})();

/* ===== Typing effect ===== */
(function(){
  const el=document.getElementById("typedText");if(!el)return;
  const words=["IT Solutions","Graphic Design","Personalized Gifts","Document Services","Flight Services"];
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=words.join(" • ");return}
  let w=0,c=0,del=false;
  el.textContent="";
  function tick(){
    const word=words[w];let d;
    el.textContent=word.slice(0,c);
    if(!del&&c===word.length){del=true;d=1400}
    else if(del&&c===0){del=false;w=(w+1)%words.length;d=350}
    else{c+=del?-1:1;d=del?35:75}
    setTimeout(tick,d);
  }
  setTimeout(tick,1100);
})();

/* ===== Scroll progress + active menu ===== */
(function(){
  const bar=document.getElementById("scrollProgress");
  const links=[...document.querySelectorAll(".desktop-nav a, .mobile-menu a:not(.btn)")];
  const secs=[...document.querySelectorAll("main section[id]")];
  let ticking=false;
  function update(){
    ticking=false;
    const max=document.documentElement.scrollHeight-innerHeight;
    if(bar)bar.style.transform="scaleX("+(max>0?Math.min(1,scrollY/max):0)+")";
    let current="";
    const line=scrollY+120;
    secs.forEach(s=>{if(s.offsetTop<=line)current=s.id});
    if(max>0&&scrollY>=max-4)current="contact";
    links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  addEventListener("scroll",onScroll,{passive:true});
  addEventListener("resize",onScroll);
  update();
})();


/* ===== WhatsApp links: one number for the whole site (WHATSAPP_NUMBER above) ===== */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{
  const t=a.dataset.text;
  a.href="https://wa.me/"+WHATSAPP_NUMBER+(t?"?text="+encodeURIComponent(t):"");
});

/* ===== Portfolio lightbox =====
   Add a real image to any card with:  data-image="assets/portfolio/your-image.jpg" */
(function(){
  const lb=document.getElementById("lightbox");if(!lb)return;
  const grid=document.querySelector(".portfolio-grid");
  const getCards=()=>[...grid.querySelectorAll(".work-card")];
  const media=document.getElementById("lbMedia"),title=document.getElementById("lbTitle"),cat=document.getElementById("lbCat");
  const closeBtn=document.getElementById("lbClose"),prev=document.getElementById("lbPrev"),next=document.getElementById("lbNext"),cta=document.getElementById("lbCta");
  let list=[],idx=0,lastFocus=null;

  /* Any photo size works. On Netlify, photos are resized automatically (Netlify Image CDN).
     If that is not available (GitHub Pages, local file), the original photo is used instead. */
  const canCDN=location.protocol.startsWith("http")&&!/github\.io$/.test(location.hostname)&&!/^(localhost|127\.|192\.168\.)/.test(location.hostname);
  function candidates(src,w){
    const list=[];
    if(canCDN)list.push("/.netlify/images?url="+encodeURIComponent("/"+src.replace(/^\/+/,""))+"&w="+w);
    list.push(src);return list;
  }
  function loadFirst(list,ok,fail){
    let i=0;
    (function try_(){
      if(i>=list.length){fail&&fail();return}
      const im=new Image();im.onload=()=>ok(list[i]);im.onerror=()=>{i++;try_()};im.src=list[i];
    })();
  }
  function loadThumb(card){
    const art=card.querySelector(".work-art");if(!art||!card.dataset.image)return;
    loadFirst(candidates(card.dataset.image,800),u=>{art.style.backgroundImage='url("'+u+'")';art.classList.add("has-img");art.textContent=""},()=>{delete card.dataset.image}); // bad path -> keep placeholder
  }
  const lazy="IntersectionObserver" in window?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){lazy.unobserve(en.target);loadThumb(en.target)}}),{rootMargin:"300px"}):null;
  function setupCard(card){
    const art=card.querySelector(".work-art"),name=card.querySelector("h3")?.textContent||"Work";
    card.setAttribute("tabindex","0");card.setAttribute("role","button");card.setAttribute("aria-label","View "+name);
    card.dataset.label=art?art.textContent.trim():"";
    if(card.dataset.image)lazy?lazy.observe(card):loadThumb(card);
    card.addEventListener("click",()=>open(card));
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open(card)}});
  }
  window.setupPortfolioCards=()=>getCards().forEach(setupCard);
  window.setupPortfolioCards();

  function visible(){return getCards().filter(c=>c.style.display!=="none")}
  function render(){
    const card=list[idx],art=card.querySelector(".work-art");
    media.innerHTML="";
    if(card.dataset.image){
      const img=document.createElement("img"),c=candidates(card.dataset.image,1600);let k=0;img.alt=card.querySelector("h3").textContent;img.onerror=()=>{if(++k<c.length)img.src=c[k]};img.src=c[0];media.appendChild(img);
    }else{
      const d=document.createElement("div");
      d.className="lb-art "+([...art.classList].find(c=>c.startsWith("art-"))||"");
      d.textContent=card.dataset.label;media.appendChild(d);
    }
    title.textContent=card.querySelector("h3").textContent;
    cat.textContent=card.querySelector(":scope > span")?.textContent||"";
    const many=list.length>1;prev.style.display=next.style.display=many?"":"none";
  }
  function open(card){
    list=visible();idx=Math.max(0,list.indexOf(card));lastFocus=document.activeElement;
    render();lb.hidden=false;void lb.offsetWidth;lb.classList.add("open");
    document.body.style.overflow="hidden";closeBtn.focus();
  }
  function close(){
    lb.classList.remove("open");document.body.style.overflow="";
    setTimeout(()=>{lb.hidden=true},250);lastFocus&&lastFocus.focus&&lastFocus.focus();
  }
  function step(n){idx=(idx+n+list.length)%list.length;render()}
  closeBtn.addEventListener("click",close);
  prev.addEventListener("click",()=>step(-1));next.addEventListener("click",()=>step(1));
  cta.addEventListener("click",close);
  lb.addEventListener("click",e=>{if(e.target===lb)close()});
  document.addEventListener("keydown",e=>{
    if(lb.hidden)return;
    if(e.key==="Escape")close();
    else if(e.key==="ArrowLeft")step(-1);
    else if(e.key==="ArrowRight")step(1);
  });
  let sx=0;
  lb.addEventListener("touchstart",e=>{sx=e.changedTouches[0].clientX},{passive:true});
  lb.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60&&list.length>1)step(dx<0?1:-1)},{passive:true});
})();


/* ===== Portfolio loaded from data/portfolio.json (edited via /admin) =====
   If the file can't be loaded (e.g. opened directly from a folder), the cards written in index.html are used. */
(async function(){
  const grid=document.querySelector(".portfolio-grid"),bar=document.querySelector(".filters");if(!grid||!bar)return;
  const CATS={
    it:{filter:"IT",label:"IT Solutions",art:"art-it",ph:"WEB"},
    design:{filter:"Design",label:"Graphic Design",art:"art-design",ph:"BRAND"},
    gift:{filter:"Gifts",label:"Frames & Gifts",art:"art-gift",ph:"GIFT"},
    docs:{filter:"Documents",label:"Document Services",art:"art-docs",ph:"DOCS"},
    travel:{filter:"Travel",label:"Flight Services",art:"art-travel",ph:"FLY"}
  };
  try{
    const res=await fetch("data/portfolio.json",{cache:"no-cache"});
    if(!res.ok)throw new Error("no data");
    const items=((await res.json()).items||[]).filter(i=>i&&i.title&&CATS[i.category]);
    if(!items.length)return;
    grid.innerHTML="";
    items.forEach(i=>{
      const c=CATS[i.category],card=document.createElement("div");
      card.className="work-card";card.dataset.category=i.category;
      if(i.image)card.dataset.image=String(i.image).replace(/^\/+/,"");
      const art=document.createElement("div");art.className="work-art "+c.art;art.textContent=c.ph;
      const h=document.createElement("h3");h.textContent=i.title;
      const s=document.createElement("span");s.textContent=c.label;
      card.append(art,h,s);grid.appendChild(card);
    });
    const used=[...new Set(items.map(i=>i.category))];
    bar.innerHTML='<button class="filter active" data-filter="all">All</button>'+used.map(k=>'<button class="filter" data-filter="'+k+'">'+CATS[k].filter+'</button>').join("");
    window.setupPortfolioCards&&window.setupPortfolioCards();
  }catch(e){/* keep the static cards */}
})();
