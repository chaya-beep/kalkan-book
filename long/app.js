const PAGE_COUNT = 32;
let page = 1;
let touchStart = null;
const stage = document.querySelector("#stage");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const progress = document.querySelector("#progress");
const bar = document.querySelector("#bar");
const mobile = () => matchMedia("(max-width:760px)").matches;
const src = n => `pages/page-${String(n).padStart(2,"0")}.png`;

function pages() {
  if (mobile() || page === 1 || page === PAGE_COUNT) return [page];
  const even = page % 2 === 0 ? page : page - 1;
  return [even + 1, even];
}
function label() {
  if (mobile()) return `עמוד ${page} מתוך ${PAGE_COUNT}`;
  if (page === 1) return "כריכה";
  if (page === PAGE_COUNT) return "כריכה אחורית";
  const even = page % 2 === 0 ? page : page - 1;
  return `עמודים ${even}–${even + 1}`;
}
function render() {
  const visible = pages();
  stage.className = `stage ${visible.length === 1 ? "single" : "spread"}`;
  stage.innerHTML = visible.map(n => `<figure><img src="${src(n)}" alt="${n === 1 ? "כריכת ספר הדרך והמותג של קלכאן" : n === PAGE_COUNT ? "הכריכה האחורית של ספר קלכאן" : `עמוד ${n} בספר הדרך והמותג של קלכאן`}" draggable="false"></figure>`).join("");
  previous.disabled = page === 1;
  next.disabled = page === PAGE_COUNT;
  progress.textContent = label();
  bar.style.width = `${page / PAGE_COUNT * 100}%`;
}
function move(direction) {
  if (mobile()) page = direction === "next" ? Math.min(PAGE_COUNT,page+1) : Math.max(1,page-1);
  else if (direction === "next") page = page === 1 ? 2 : Math.min(PAGE_COUNT,(page%2===0?page:page-1)+2);
  else page = page === PAGE_COUNT ? 14 : ((page%2===0?page:page-1)<=2 ? 1 : (page%2===0?page:page-1)-2);
  stage.classList.add("turning"); setTimeout(()=>stage.classList.remove("turning"),220);
  render();
}
previous.onclick = () => move("previous");
next.onclick = () => move("next");
document.querySelector("#fullscreen").onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
addEventListener("keydown",e => { if(e.key==="ArrowLeft") move("next"); if(e.key==="ArrowRight") move("previous"); if(e.key==="Home"){page=1;render()} if(e.key==="End"){page=PAGE_COUNT;render()} });
addEventListener("resize",render);
document.querySelector(".book-app").addEventListener("touchstart",e => touchStart=e.changedTouches[0]?.clientX ?? null,{passive:true});
document.querySelector(".book-app").addEventListener("touchend",e => { if(touchStart===null)return; const d=(e.changedTouches[0]?.clientX??touchStart)-touchStart; if(d>48&&page<PAGE_COUNT)move("next"); if(d<-48&&page>1)move("previous"); touchStart=null },{passive:true});
render();
