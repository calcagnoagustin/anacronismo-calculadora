/* chat.js (16/10/2026) - Burbuja de IA de Anacronismo, presente en toda la app.
   Habla de una pieza del Radar o del Analista (con sus fotos), de un link de eBay que pegues, o de lo que quieras.
   Backend: https://vm.semillaredes.com/anacronismo/api/chat* (VM anacronismo_api/chat.py). Usa BASE y TOKEN de index.html. */
(function(){
  var API=(window.BASE||"https://vm.semillaredes.com/anacronismo")+"/api", T=window.TOKEN||"";
  var ocup=false, abierto=false, cargado=false, CTX=null, PEND=[];
  var st=document.createElement("style");
  st.textContent=[
   '#acFab{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:2147483001;width:58px;height:58px;border-radius:50%;border:1.5px solid #F2EBDC;background:#1A1A1A;color:#F2EBDC;cursor:pointer;box-shadow:0 10px 28px rgba(26,26,26,.38);display:flex;align-items:center;justify-content:center;padding:0}',
   '#acFab svg{width:27px;height:27px}#acFab i{position:absolute;top:9px;right:10px;width:8px;height:8px;border-radius:50%;background:#B5462E}',
   '#acTip{position:fixed;right:86px;bottom:calc(30px + env(safe-area-inset-bottom));z-index:2147483001;background:#1A1A1A;color:#F2EBDC;font:600 13px/1.2 -apple-system,system-ui,sans-serif;padding:9px 13px;box-shadow:0 8px 22px rgba(0,0,0,.25);cursor:pointer;letter-spacing:.02em}',
   '#acBox{position:fixed;right:18px;bottom:90px;z-index:2147483002;width:min(420px,calc(100vw - 24px));height:min(660px,calc(100vh - 120px));background:#F2EBDC;border:1.5px solid #1A1A1A;box-shadow:0 22px 60px rgba(26,26,26,.35);display:none;flex-direction:column;overflow:hidden;font:15px/1.45 -apple-system,BlinkMacSystemFont,system-ui,sans-serif;color:#1A1A1A}',
   '#acBox.on{display:flex}',
   '@media(max-width:600px){#acBox{right:0;bottom:0;width:100vw;height:100dvh;border:0;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}#acFab.on,#acTip.on{display:none}}',
   '#acHead{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1.5px solid #1A1A1A;background:#1A1A1A;color:#F2EBDC}',
   '#acHead b{flex:1;font-size:12px;letter-spacing:.3em;text-transform:uppercase;font-weight:400}#acHead b span{color:#B5462E}',
   '#acHead button{background:transparent;color:#F2EBDC;border:1px solid rgba(242,235,220,.35);padding:6px 10px;font:inherit;font-size:12px;cursor:pointer}',
   '#acCtx{display:none;align-items:center;gap:8px;padding:8px 12px;background:#E8DEC9;border-bottom:1.5px solid #1A1A1A;font-size:12.5px}#acCtx.on{display:flex}',
   '#acCtx span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#acCtx span b{color:#7A1F1A}#acCtx button{border:0;background:transparent;font-size:16px;cursor:pointer;color:#1A1A1A}',
   '#acMsgs{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}',
   '.acM{max-width:88%;padding:10px 13px;white-space:pre-wrap;word-wrap:break-word}',
   '.acM.yo{align-self:flex-end;background:#1A1A1A;color:#F2EBDC}',
   '.acM.ia{align-self:flex-start;background:#fff8ec;border:1.5px solid #1A1A1A}',
   '.acM .cx{display:block;font-size:11px;opacity:.6;margin-bottom:4px;letter-spacing:.04em}',
   '.acChip{display:block;margin-top:8px;font-size:12px;padding:6px 9px;background:#E8DEC9;color:#7A1F1A}',
   '.acM img{display:block;max-width:100%;max-height:240px;margin-top:6px}',
   '#acIn{display:flex;gap:6px;padding:10px;border-top:1.5px solid #1A1A1A;background:#F2EBDC}',
   '#acIn textarea{flex:1;resize:none;height:44px;max-height:120px;border:1.5px solid #1A1A1A;background:#fff8ec;color:#1A1A1A;padding:11px 12px;font:inherit;font-size:16px;border-radius:0;outline:none}',
   '#acIn button{border:0;padding:0 15px;background:#1A1A1A;color:#F2EBDC;font:700 12px -apple-system,system-ui;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}',
   '#acIn button:disabled{opacity:.45}#acIn .ic{padding:0 10px;background:#E8DEC9;color:#1A1A1A;font-size:17px;letter-spacing:0}',
   '#acIn .ic.rec{background:#B5462E;color:#fff;animation:acD 1.2s infinite}',
   '#acPend{display:none;gap:8px;padding:8px 10px 0;flex-wrap:wrap}#acPend.on{display:flex}',
   '#acPend div{position:relative}#acPend img{width:56px;height:56px;object-fit:cover;border:1.5px solid #1A1A1A}',
   '#acPend b{position:absolute;top:-6px;right:-6px;background:#7A1F1A;color:#fff;border-radius:50%;width:20px;height:20px;font:12px/20px system-ui;text-align:center;cursor:pointer}',
   '.acHint{opacity:.62;font-size:13px;text-align:center;padding:8px 14px;line-height:1.5}',
   '.acSug{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;padding:0 8px}.acSug button{border:1.5px solid #1A1A1A;background:transparent;padding:7px 10px;font:inherit;font-size:12.5px;cursor:pointer;color:#1A1A1A}',
   '.acDots:after{content:"\\2026";animation:acD 1.2s infinite}@keyframes acD{0%{opacity:.2}50%{opacity:1}100%{opacity:.2}}',
   'button.chatb{background:transparent!important;color:var(--negro,#1A1A1A)!important}'
  ].join("");
  document.head.appendChild(st);
  function el(t,a,h){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(h!=null)e.innerHTML=h;return e;}
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  function md(s){return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:inherit">$1</a>');}
  function post(ruta,body){ return fetch(API+"/"+ruta,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+T},body:JSON.stringify(body||{})}).then(function(r){return r.json();}); }
  function fotoUrl(id){ return API+"/chat-foto?id="+encodeURIComponent(id)+"&t="+encodeURIComponent(T); }

  var ICONO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 2"/><path d="M12 1.8v1.6M12 20.6v1.6M1.8 12h1.6M20.6 12h1.6"/></svg><i></i>';
  var fab=el("button",{id:"acFab","aria-label":"Hablar con la IA"},ICONO);
  var tip=el("div",{id:"acTip"},"Preguntale a la IA");
  var box=el("div",{id:"acBox"});
  box.innerHTML='<div id="acHead"><b>Anacronismo <span>&middot;</span> IA</b><button id="acNew" title="Empezar de cero">Limpiar</button><button id="acX">&#10005;</button></div>'
    +'<div id="acCtx"><span></span><button id="acCtxX" title="Sacar la pieza">&#10005;</button></div>'
    +'<div id="acMsgs"></div><div id="acPend"></div>'
    +'<div id="acIn"><button class="ic" id="acF" title="Mandar foto">&#128247;</button><button class="ic" id="acV" title="Dictar">&#127908;</button><textarea id="acT" placeholder="Pegá un link o preguntá lo que quieras&hellip;"></textarea><button id="acS">Enviar</button></div>'
    +'<input type="file" id="acFile" accept="image/*" multiple style="display:none">';
  document.body.appendChild(fab); document.body.appendChild(tip); document.body.appendChild(box);
  try{ if(localStorage.getItem("anacro_chat_tip")) tip.remove(); }catch(e){}
  var $=function(i){return document.getElementById(i);};

  function pintarCtx(){
    var c=$("acCtx"); c.classList.toggle("on",!!CTX);
    if(CTX) c.querySelector("span").innerHTML="Hablando de: <b>"+esc(CTX.nombre||CTX.url||"pieza")+"</b>";
  }
  function abrir(v){
    abierto=v; box.classList.toggle("on",v); fab.classList.toggle("on",v); tip.classList.toggle("on",v);
    document.documentElement.style.overflow=(v&&window.innerWidth<=600)?"hidden":"";
    if(v){ try{localStorage.setItem("anacro_chat_tip","1");}catch(e){} if(tip.parentNode) tip.remove(); pintarCtx(); cargar();
      setTimeout(function(){ if(window.innerWidth>600) $("acT").focus(); },80); }
  }
  window.anaChat={ abrir:function(ctx){ CTX=ctx||null; abrir(true); }, cerrar:function(){ abrir(false); }, abierto:function(){ return abierto; } };
  fab.onclick=function(){ abrir(!abierto); }; tip.onclick=function(){ abrir(true); }; $("acX").onclick=function(){ abrir(false); };
  $("acCtxX").onclick=function(){ CTX=null; pintarCtx(); };
  $("acNew").onclick=function(){ if(!confirm("¿Borrar la conversación?")) return; post("chat-borrar").then(function(){ cargado=false; $("acMsgs").innerHTML=""; cargar(); }); };

  // botones "Preguntarle a la IA" en Radar y Analista (los pinta index.html con data-ctipo)
  document.addEventListener("click",function(ev){
    var b=ev.target.closest&&ev.target.closest("[data-ctipo]"); if(!b) return;
    ev.preventDefault(); ev.stopPropagation();
    window.anaChat.abrir({tipo:b.getAttribute("data-ctipo"),id:b.getAttribute("data-cid"),nombre:b.getAttribute("data-cnom"),url:b.getAttribute("data-curl")});
  },true);

  function burbuja(m){
    var d=el("div",{"class":"acM "+(m.rol==="ia"?"ia":"yo")});
    var h="";
    if(m.ctx&&m.rol!=="ia") h+="<span class='cx'>sobre: "+esc(m.ctx.nombre||m.ctx.url||"")+"</span>";
    d.innerHTML=h+md(m.texto);
    (m.fotos||[]).forEach(function(f){ d.appendChild(el("img",{src:fotoUrl(f),alt:""})); });
    if(m.vio) d.appendChild(el("span",{"class":"acChip"},"&#128065; Miré "+m.vio+" foto"+(m.vio===1?"":"s")));
    if(m.accion) d.appendChild(el("span",{"class":"acChip"},"&#10003; "+esc(m.accion)));
    $("acMsgs").appendChild(d); $("acMsgs").scrollTop=1e9;
  }
  function bienvenida(){
    var w=el("div",{"class":"acHint"},"Pegá un link de eBay y lo miro con las fotos, o tocá <b>Preguntarle a la IA</b> en cualquier pieza del Radar o del Analista. También podés preguntar de tus compras, vendedores o búsquedas.");
    var s=el("div",{"class":"acSug"});
    ["¿Qué pieza del Radar comprarías?","¿Cómo vengo con las compras?","¿Qué calibre tiene un Vostok Amphibia?"].forEach(function(t){
      var b=el("button",null,esc(t)); b.onclick=function(){ $("acT").value=t; enviar(); }; s.appendChild(b); });
    $("acMsgs").appendChild(w); $("acMsgs").appendChild(s);
  }
  function cargar(){
    if(cargado) return;
    $("acMsgs").innerHTML='<div class="acHint acDots">Cargando</div>';
    post("chat-hilo").then(function(d){
      cargado=true; $("acMsgs").innerHTML="";
      if(!(d.hilo||[]).length) bienvenida();
      (d.hilo||[]).forEach(burbuja);
    }).catch(function(){ $("acMsgs").innerHTML='<div class="acHint">No pude conectar con el servidor. Tirá para abajo para recargar.</div>'; });
  }
  function pintarPend(){ var p=$("acPend"); p.innerHTML=""; p.classList.toggle("on",PEND.length>0);
    PEND.forEach(function(f,i){ var w=el("div"); w.appendChild(el("img",{src:fotoUrl(f)})); var x=el("b",null,"&times;"); x.onclick=function(){PEND.splice(i,1);pintarPend();}; w.appendChild(x); p.appendChild(w); }); }
  function achicar(file){ return new Promise(function(ok,mal){
    var fr=new FileReader(); fr.onload=function(){ var im=new Image(); im.onload=function(){
      var M=1600, r=Math.min(1,M/Math.max(im.width,im.height)), c=document.createElement("canvas"); c.width=Math.round(im.width*r); c.height=Math.round(im.height*r);
      c.getContext("2d").drawImage(im,0,0,c.width,c.height); ok(c.toDataURL("image/jpeg",0.85).split(",")[1]); };
      im.onerror=function(){ mal("img"); }; im.src=fr.result; }; fr.onerror=mal; fr.readAsDataURL(file); }); }
  $("acF").onclick=function(){ $("acFile").click(); };
  $("acFile").onchange=async function(){
    var fs=Array.prototype.slice.call(this.files||[]).slice(0,4-PEND.length); this.value="";
    for(var i=0;i<fs.length;i++){
      try{ var r=await post("chat-foto",{mime:"image/jpeg",b64:await achicar(fs[i])});
        if(r.id){ PEND.push(r.id); pintarPend(); } else alert(r.error||"No pude subir la foto");
      }catch(e){ alert("No pude subir la foto"); }
    }
  };
  // voz: dictado del navegador (es-AR) y, si no hay, grabar y transcribir en el servidor
  var grab=null, trozos=[], rec=null;
  $("acV").onclick=async function(){
    var b=$("acV");
    if(rec){ rec.stop(); return; } if(grab){ grab.stop(); return; }
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(SR){ try{ rec=new SR(); rec.lang="es-AR"; rec.interimResults=false; rec.continuous=false; var base=$("acT").value;
        rec.onresult=function(e){ var t=""; for(var i=0;i<e.results.length;i++) t+=e.results[i][0].transcript; $("acT").value=(base?base+" ":"")+t; };
        rec.onend=function(){ rec=null; b.classList.remove("rec"); }; rec.onerror=function(){ rec=null; b.classList.remove("rec"); };
        rec.start(); b.classList.add("rec"); return; }catch(e){ rec=null; } }
    if(!(navigator.mediaDevices&&window.MediaRecorder)){ alert("Tu navegador no permite dictar. Usá el micrófono del teclado."); return; }
    try{ var s=await navigator.mediaDevices.getUserMedia({audio:true}); }catch(e){ alert("Necesito permiso para el micrófono."); return; }
    var mime=["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg;codecs=opus"].filter(function(m){ return MediaRecorder.isTypeSupported(m); })[0]||"";
    grab=new MediaRecorder(s,mime?{mimeType:mime}:{}); trozos=[]; b.classList.add("rec");
    grab.ondataavailable=function(e){ if(e.data&&e.data.size) trozos.push(e.data); };
    grab.onstop=function(){ s.getTracks().forEach(function(t){t.stop();}); b.classList.remove("rec"); var bl=new Blob(trozos,{type:grab.mimeType||"audio/webm"}); grab=null;
      var fr=new FileReader(); fr.onload=function(){ post("chat-voz",{mime:bl.type,b64:fr.result.split(",")[1]}).then(function(r){
        if(r.texto) $("acT").value=($("acT").value?$("acT").value+" ":"")+r.texto; else alert(r.error||"No se entendió el audio"); }).catch(function(){ alert("No pude transcribir"); }); };
      fr.readAsDataURL(bl); };
    grab.start();
  };
  function pedirClavesEbay(){
    if(sessionStorage.getItem("ac_ebay_no")) return;
    var a=prompt("Para leer en vivo links nuevos de eBay (precio, envío a AR y fotos) necesito las claves de eBay una sola vez.\n\nPegá el App ID (Client ID):");
    if(!a){ sessionStorage.setItem("ac_ebay_no","1"); return; }
    var c=prompt("Ahora el Cert ID (Client Secret):"); if(!c) return;
    post("chat-ebay",{app_id:a.trim(),cert_id:c.trim()}).then(function(r){ alert(r.ok?"Listo: claves de eBay guardadas. Mandá el link de nuevo.":"No funcionaron: "+(r.error||"")); });
  }
  function enviar(){
    var t=$("acT").value.trim(); if((!t&&!PEND.length)||ocup) return;
    var fotos=PEND.slice(); PEND=[]; pintarPend();
    ocup=true; $("acS").disabled=true; $("acT").value="";
    Array.prototype.forEach.call($("acMsgs").querySelectorAll(".acHint,.acSug"),function(x){ x.remove(); });
    burbuja({rol:"yo",texto:t,fotos:fotos,ctx:CTX});
    var hayLink=/https?:\/\//.test(t)||CTX;
    var w=el("div",{"class":"acM ia acDots"},hayLink?"Mirando la publicación y las fotos":"Pensando"); $("acMsgs").appendChild(w); $("acMsgs").scrollTop=1e9;
    post("chat",{texto:t,fotos:fotos,ctx:CTX}).then(function(d){ w.remove(); burbuja({rol:"ia",texto:d.respuesta||"(sin respuesta)",accion:d.accion,vio:d.vio});
        if(d.accion&&/lanzado/.test(d.accion)&&typeof cargarAnalisis==="function") cargarAnalisis();
        if(d.faltan_claves_ebay) setTimeout(pedirClavesEbay,400); })
      .catch(function(){ w.remove(); burbuja({rol:"ia",texto:"No pude conectar. Probá de nuevo."}); })
      .then(function(){ ocup=false; $("acS").disabled=false; });
  }
  $("acS").onclick=enviar;
  $("acT").addEventListener("keydown",function(e){ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); enviar(); } });
})();
