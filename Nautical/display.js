(function(){
  if(window.testOn) return;
  window.testOn = true;

  let p = document.querySelector("p");
  if(!p){ alert("No text!"); return; }

  let words = p.innerText.trim().split(/\s+/).slice(0,40);
  let text = words.join(" ");
  p.innerHTML = "";
  text.split("").forEach(ch=>{
    let s=document.createElement("span");
    s.textContent=ch;
    p.appendChild(s);
  });
  let spans = p.querySelectorAll("span");

  let box = document.createElement("textarea");
  box.style.position="fixed"; box.style.opacity=0;
  document.body.appendChild(box); box.focus();

  let time=60, start=null, i=0, done=false, w=0;
  let tbox=document.createElement("div");
  tbox.style="position:fixed;top:10px;right:10px;background:#000;color:#fff;padding:4px;";
  document.body.appendChild(tbox);

  let wbox=document.createElement("div");
  wbox.style="position:fixed;top:40px;right:10px;background:#333;color:yellow;padding:4px;";
  wbox.textContent="👉 "+words[0];
  document.body.appendChild(wbox);

  let timer=setInterval(()=>{
    time--; tbox.textContent="⏱ "+time+"s";
    if(time<=0) finish(true);
  },1000);

  function finish(timeout){
    if(done) return; done=true;
    clearInterval(timer);
    box.remove(); tbox.remove(); wbox.remove();
    let sec=(Date.now()-start)/1000;
    let wpm=Math.round((words.length/sec)*60);
    let res=document.createElement("div");
    res.textContent=(timeout?"⏰ Time up! ":"✅ Done! ")+"WPM: "+wpm;
    p.after(res);
  }

  box.addEventListener("input",()=>{
    if(done) return;
    if(!start) start=Date.now();
    let c=box.value.slice(-1), exp=spans[i]?.textContent;
    spans[i].style.background=(c===exp?"lightgreen":"salmon");
    i++;
    if(c===" "||spans[i-1]?.textContent===" "){
      w++; if(w<words.length) wbox.textContent="👉 "+words[w];
    }
    if(i>=spans.length) finish(false);
  });

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
      p.innerText=text;
      box.remove();tbox.remove();wbox.remove();
      clearInterval(timer);window.testOn=false;
    }
  });
})();
