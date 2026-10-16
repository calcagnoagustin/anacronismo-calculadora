/* refresco.js (16/10/2026) - Tirar para abajo para refrescar (como SemillaIA y Portfolio Vision).
   - Pull-to-refresh: sirve tambien con la app instalada en la pantalla de inicio.
   - Al volver a la app despues de 2+ minutos, se recarga (salvo chat abierto o escribiendo).
   Antes de recargar, index.html guarda lo pendiente en beforeunload. */
(function(){
  var st=document.createElement("style");
  st.textContent='html,body{overscroll-behavior-y:contain}'
   +'#ptr{position:fixed;left:50%;top:env(safe-area-inset-top);z-index:2147483000;transform:translate(-50%,-60px);width:40px;height:40px;border-radius:50%;background:#1A1A1A;border:1.5px solid #F2EBDC;display:flex;align-items:center;justify-content:center;color:#F2EBDC;font:19px system-ui;transition:opacity .2s;opacity:0;pointer-events:none;box-shadow:0 6px 18px rgba(26,26,26,.3)}'
   +'#ptr.go span{animation:ptrg .8s linear infinite;display:inline-block}@keyframes ptrg{to{transform:rotate(360deg)}}';
  document.head.appendChild(st);
  var ptr=document.createElement("div"); ptr.id="ptr"; ptr.innerHTML="<span>&#8635;</span>"; document.body.appendChild(ptr);
  var y0=null, dy=0, UMBRAL=75;
  function chatAbierto(){ return !!(window.anaChat&&window.anaChat.abierto()); }
  function escribiendo(){ var a=document.activeElement; return !!(a&&(a.tagName==="TEXTAREA"||a.tagName==="INPUT"||a.tagName==="SELECT")); }
  function recargar(){ ptr.classList.add("go"); ptr.style.opacity=1; ptr.style.transform="translate(-50%,16px)";
    setTimeout(function(){ location.replace(location.pathname+"?r="+Date.now()); },250); }
  document.addEventListener("touchstart",function(e){ if(window.scrollY<=0&&!chatAbierto()&&e.touches.length===1){ y0=e.touches[0].clientY; dy=0; } else y0=null; },{passive:true});
  document.addEventListener("touchmove",function(e){ if(y0==null) return; dy=e.touches[0].clientY-y0;
    if(dy>0&&window.scrollY<=0){ var d=Math.min(dy,130); ptr.style.opacity=Math.min(1,d/UMBRAL); ptr.style.transform="translate(-50%,"+(d*0.5-40)+"px) rotate("+(d*2)+"deg)"; } },{passive:true});
  document.addEventListener("touchend",function(){ if(y0==null) return; if(dy>UMBRAL) recargar(); else { ptr.style.opacity=0; ptr.style.transform="translate(-50%,-60px)"; } y0=null; },{passive:true});
  var oculto=null;
  document.addEventListener("visibilitychange",function(){
    if(document.hidden) oculto=Date.now();
    else if(oculto&&Date.now()-oculto>120000&&!chatAbierto()&&!escribiendo()) recargar();
  });
})();
