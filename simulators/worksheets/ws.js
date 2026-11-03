/* Share any spare space on each page among the answer boxes, so each worksheet fills its two pages. */
function fillPages(){
  document.querySelectorAll('.page').forEach(function(pg){
    var boxes=[].slice.call(pg.querySelectorAll('.ans,.grid-sketch'));
    boxes.forEach(function(b){ if(!b.dataset.h) b.dataset.h=b.getBoundingClientRect().height; b.style.height=b.dataset.h+'px'; });
    var foot=pg.querySelector('.foot'); if(!foot||!boxes.length) return;
    var bottom=0; [].slice.call(pg.children).forEach(function(c){ if(c!==foot) bottom=Math.max(bottom,c.getBoundingClientRect().bottom); });
    var slack=foot.getBoundingClientRect().top-34-bottom; if(slack<=0) return;
    var add=Math.min(90,Math.floor(slack/boxes.length));
    boxes.forEach(function(b){ b.style.height=(parseFloat(b.dataset.h)+add)+'px'; });
  });
}
window.addEventListener('load',fillPages);
window.addEventListener('beforeprint',fillPages);
window.addEventListener('afterprint',fillPages);
if(window.matchMedia){ var mq=window.matchMedia('print'); if(mq.addEventListener) mq.addEventListener('change',fillPages); }
