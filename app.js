(() => {
"use strict";
const $ = id => document.getElementById(id);
const SUBJECTS = [
  {id:"ku", name:"کوردی", icon:"📘"}, {id:"ar",name:"عەرەبی",icon:"📗"},
  {id:"en",name:"ئینگلیزی",icon:"🔤"}, {id:"ph",name:"فەلسەفە",icon:"💭"},
  {id:"re",name:"ئاین",icon:"📖"}, {id:"ec",name:"ئابووری",icon:"📊"},
  {id:"hi",name:"مێژوو",icon:"🏛️"}, {id:"ma",name:"بیرکاری",icon:"➗"},
  {id:"ge",name:"جوگرافیا",icon:"🌍"}
];
const I18N = {
 en:{subtitle:"Your study notebook",backup:"Backup",restore:"Restore",subjects:"Subjects",saved:"Saved on this device",notebook:"STUDY NOTEBOOK",newNote:"New note",myNotes:"My notes",typing:"Typing",penPaper:"Pen paper",bullets:"Bullets",numbers:"Numbers",todo:"To-do",highlight:"Highlight",penColor:"Pen",size:"Size",eraser:"Eraser",undo:"Undo",clear:"Clear",saveDrawing:"Save drawing",paperTip:"Write with your stylus or finger on the grid paper.",autoSave:"Auto-saves on this device",addSubject:"Add a subject",cancel:"Cancel",add:"Add",newNotePrompt:"Create a note for the selected subject?",create:"Create",titlePlaceholder:"Note title...",writePlaceholder:"Write your notes here...",noNotes:"No notes yet. Create a note to get started.",untitled:"Untitled note",words:"words",savedToast:"Saved",subjectPrompt:"Enter a subject name",restored:"Backup restored",backupDone:"Backup downloaded",drawingSaved:"Handwriting saved",confirmClear:"Clear the handwriting canvas?",allSubjects:"All subjects"},
 ku:{subtitle:"دەفتەری خوێندنت",backup:"پاڵپشتی",restore:"گەڕاندنەوە",subjects:"بابەتەکان",saved:"لەسەر ئەم ئامێرە پاشەکەوت کراوە",notebook:"دەفتەری خوێندن",newNote:"تێبینیی نوێ",myNotes:"تێبینییەکانم",typing:"نووسین",penPaper:"قەڵەم و کاغەز",bullets:"خاڵەکان",numbers:"ژمارەکان",todo:"لیستی کار",highlight:"هایلایت",penColor:"قەڵەم",size:"قەبارە",eraser:"سڕینەوە",undo:"گەڕانەوە",clear:"پاککردنەوە",saveDrawing:"پاشەکەوتی وێنە",paperTip:"بە قەڵەم یان پەنجە لەسەر کاغەزی تۆڕدار بنووسە.",autoSave:"خۆکارانە لەم ئامێرە پاشەکەوت دەبێت",addSubject:"زیادکردنی بابەت",cancel:"پاشگەزبوونەوە",add:"زیادکردن",newNotePrompt:"تێبینییەک بۆ ئەم بابەتە دروست بکە؟",create:"دروستکردن",titlePlaceholder:"ناونیشانی تێبینی...",writePlaceholder:"تێبینییەکەت لێرە بنووسە...",noNotes:"هێشتا تێبینی نییە. تێبینییەکی نوێ دروست بکە.",untitled:"تێبینیی بێ ناونیشان",words:"وشە",savedToast:"پاشەکەوت کرا",subjectPrompt:"ناوی بابەت بنووسە",restored:"پاڵپشتی گەڕێندرایەوە",backupDone:"پاڵپشتی داگیرا",drawingSaved:"نووسینی دەستی پاشەکەوت کرا",confirmClear:"کەنڤاسی قەڵەم پاک بکەیتەوە؟",allSubjects:"هەموو بابەتەکان"},
 ar:{subtitle:"دفتر دراستك",backup:"نسخة احتياطية",restore:"استعادة",subjects:"المواد",saved:"محفوظ على هذا الجهاز",notebook:"دفتر الدراسة",newNote:"ملاحظة جديدة",myNotes:"ملاحظاتي",typing:"كتابة",penPaper:"القلم والورق",bullets:"نقاط",numbers:"ترقيم",todo:"قائمة مهام",highlight:"تمييز",penColor:"القلم",size:"الحجم",eraser:"ممحاة",undo:"تراجع",clear:"مسح",saveDrawing:"حفظ الرسم",paperTip:"اكتب بالقلم أو الإصبع على الورق الشبكي.",autoSave:"يحفظ تلقائياً على هذا الجهاز",addSubject:"إضافة مادة",cancel:"إلغاء",add:"إضافة",newNotePrompt:"إنشاء ملاحظة للمادة المحددة؟",create:"إنشاء",titlePlaceholder:"عنوان الملاحظة...",writePlaceholder:"اكتب ملاحظاتك هنا...",noNotes:"لا توجد ملاحظات بعد. أنشئ ملاحظة للبدء.",untitled:"ملاحظة بلا عنوان",words:"كلمات",savedToast:"تم الحفظ",subjectPrompt:"أدخل اسم المادة",restored:"تمت استعادة النسخة الاحتياطية",backupDone:"تم تنزيل النسخة الاحتياطية",drawingSaved:"تم حفظ الكتابة اليدوية",confirmClear:"مسح لوحة الكتابة؟",allSubjects:"كل المواد"}
};
const STORAGE_KEY="studyspace-notetaking-v1";
let data = loadData(), currentSubject = data.currentSubject || "ku", currentNoteId = null, mode="type", erasing=false, drawing=false, lastPoint=null, strokes=[], redoStack=[];
function defaultData(){return {version:1,language:"ku",currentSubject:"ku",subjects:SUBJECTS.map(s=>({...s,custom:false})),notes:[]};}
function loadData(){try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY));if(d&&Array.isArray(d.notes)&&Array.isArray(d.subjects)){const def=defaultData();d.subjects=[...def.subjects,...d.subjects.filter(s=>s.custom&&!def.subjects.some(x=>x.id===s.id))];return d;}}catch(e){}return defaultData();}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));$("saveStatus").textContent=t("saved");}catch(e){toast("Storage full — export a backup.");}}
function t(key){return (I18N[data.language]||I18N.ku)[key]||I18N.en[key]||key;}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function uid(){return "n"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function currentNote(){return data.notes.find(n=>n.id===currentNoteId)||null;}
function subject(){return data.subjects.find(s=>s.id===currentSubject)||data.subjects[0];}
function applyLanguage(){
 const lang=data.language||"ku";document.documentElement.lang=lang==="ku"?"ckb":lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;el.textContent=t(key);});
 $("subtitle").textContent=t("subtitle");$("noteTitle").placeholder=t("titlePlaceholder");$("typingArea").dataset.placeholder=t("writePlaceholder");
 $("fontSize").querySelectorAll("option").forEach((o,i)=>{o.textContent=({en:["Small","Normal","Large","XL","XXL"],ku:["بچووک","ئاسایی","گەورە","زۆر گەورە","گەورەترین"],ar:["صغير","عادي","كبير","كبير جداً","الأكبر"]}[lang]||[])[i]||o.textContent;});
 renderSubjects();renderNotes();updateCounts();
}
function renderSubjects(){
 const nav=$("subjectList");nav.innerHTML="";
 data.subjects.forEach(s=>{const b=document.createElement("button");b.className="subject-btn"+(s.id===currentSubject?" active":"");b.innerHTML=`<span class="subject-icon">${esc(s.icon||"📚")}</span><span>${esc(s.name)}</span>`;b.onclick=()=>selectSubject(s.id);nav.appendChild(b);});
 $("subjectTitle").textContent=subject().name;
}
function renderNotes(){
 const list=$("notesList"),notes=data.notes.filter(n=>n.subjectId===currentSubject).sort((a,b)=>b.updatedAt-a.updatedAt);
 $("noteCount").textContent=notes.length;list.innerHTML="";
 if(!notes.length){list.innerHTML=`<div class="empty">${esc(t("noNotes"))}</div>`;return;}
 notes.forEach(n=>{const b=document.createElement("button");b.className="note-item"+(n.id===currentNoteId?" active":"");const plain=(n.content||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();b.innerHTML=`<strong>${esc(n.title||t("untitled"))}</strong><small>${esc(plain.slice(0,42)||"✎ " + (n.drawing?"Handwriting":""))}</small>`;b.onclick=()=>openNote(n.id);list.appendChild(b);});
}
function updateCounts(){const n=currentNote();const txt=$("typingArea").innerText||"";$("wordCount").textContent=txt.trim()?txt.trim().split(/\s+/).length+" "+t("words"):"0 "+t("words");$("noteTitle").value=n?n.title:"";}
function selectSubject(id){currentSubject=id;data.currentSubject=id;currentNoteId=null;const n=data.notes.filter(x=>x.subjectId===id).sort((a,b)=>b.updatedAt-a.updatedAt)[0];if(n)currentNoteId=n.id;loadEditor();renderSubjects();renderNotes();save();}
function createNote(){const n={id:uid(),subjectId:currentSubject,title:"",content:"",drawing:"",updatedAt:Date.now()};data.notes.push(n);currentNoteId=n.id;save();loadEditor();renderNotes();$("noteTitle").focus();}
function openNote(id){currentNoteId=id;loadEditor();renderNotes();}
function loadEditor(){const n=currentNote();$("noteTitle").value=n?n.title:"";$("typingArea").innerHTML=n?n.content:"";strokes=[];redoStack=[];if(n&&n.drawing){try{strokes=JSON.parse(n.drawing);}catch(e){strokes=[];}}redrawCanvas();updateCounts();}
function persistEditor(){const n=currentNote();if(!n)return;n.title=$("noteTitle").value;n.content=$("typingArea").innerHTML;n.drawing=JSON.stringify(strokes);n.updatedAt=Date.now();save();renderNotes();updateCounts();}
let saveTimer;function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(persistEditor,250);}
function setMode(next){mode=next;document.querySelectorAll(".mode-tab").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));$("typingTools").classList.toggle("hidden",mode!=="type");$("typingArea").classList.toggle("hidden",mode!=="type");$("penTools").classList.toggle("hidden",mode!=="pen");$("penArea").classList.toggle("hidden",mode!=="pen");if(mode==="pen")setTimeout(redrawCanvas,30);}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2200);}
function execCommand(command,value=null){$("typingArea").focus();document.execCommand(command,false,value);queueSave();}
function addTodo(){const sel=window.getSelection();const li=document.createElement("div");li.dataset.todo="1";li.textContent=" ";const range=sel&&sel.rangeCount?sel.getRangeAt(0):null;if(range&&$("typingArea").contains(range.commonAncestorContainer)){range.deleteContents();range.insertNode(li);}else $("typingArea").appendChild(li);li.onclick=()=>{li.classList.toggle("checked");queueSave();};queueSave();}
function wireTodoClicks(){ $("typingArea").querySelectorAll("[data-todo]").forEach(li=>li.onclick=()=>{li.classList.toggle("checked");queueSave();});}
function resizeCanvas(){const c=$("drawingCanvas"),rect=c.getBoundingClientRect();if(!rect.width)return;const dpr=window.devicePixelRatio||1;const old=document.createElement("canvas");old.width=c.width;old.height=c.height;old.getContext("2d").drawImage(c,0,0);c.width=Math.round(rect.width*dpr);c.height=Math.round(rect.height*dpr);const ctx=c.getContext("2d");ctx.scale(dpr,dpr);ctx.drawImage(old,0,0,old.width,old.height,0,0,rect.width,rect.height);redrawCanvas();}
function redrawCanvas(){const c=$("drawingCanvas");if(!c)return;const ctx=c.getContext("2d"),dpr=window.devicePixelRatio||1,rect=c.getBoundingClientRect();if(!rect.width||!c.width)return;ctx.clearRect(0,0,c.width,c.height);ctx.save();ctx.scale(dpr,dpr);strokes.forEach(s=>drawStroke(ctx,s));ctx.restore();}
function drawStroke(ctx,s){if(!s.points||!s.points.length)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=s.erase?"#ffffff":s.color;ctx.lineWidth=s.size;ctx.beginPath();ctx.moveTo(s.points[0].x,s.points[0].y);for(let i=1;i<s.points.length;i++)ctx.lineTo(s.points[i].x,s.points[i].y);if(s.points.length===1){ctx.lineTo(s.points[0].x+.1,s.points[0].y+.1);}ctx.stroke();ctx.restore();}
function canvasPoint(e){const r=$("drawingCanvas").getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top,p:e.pressure||.5};}
function pointerDown(e){e.preventDefault();drawing=true;lastPoint=canvasPoint(e);strokes.push({color:$("penColor").value,size:Number($("penSize").value),erase:erasing,points:[lastPoint]});redoStack=[];$("drawingCanvas").setPointerCapture?.(e.pointerId);redrawCanvas();}
function pointerMove(e){if(!drawing)return;e.preventDefault();const p=canvasPoint(e),s=strokes[strokes.length-1];s.points.push(p);const c=$("drawingCanvas"),ctx=c.getContext("2d"),dpr=window.devicePixelRatio||1;ctx.save();ctx.scale(dpr,dpr);drawStroke(ctx,s);ctx.restore();lastPoint=p;}
function pointerUp(){if(!drawing)return;drawing=false;lastPoint=null;queueSave();}
function undoStroke(){if(strokes.length){redoStack.push(strokes.pop());redrawCanvas();queueSave();}}
function clearCanvas(){if(!confirm(t("confirmClear")))return;strokes=[];redoStack=[];redrawCanvas();queueSave();}
function exportBackup(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="studyspace-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(t("backupDone"));}
function importBackup(file){const reader=new FileReader();reader.onload=()=>{try{const incoming=JSON.parse(reader.result);if(!Array.isArray(incoming.subjects)||!Array.isArray(incoming.notes))throw Error();if(!confirm("Restore backup? Current notes will be replaced."))return;data=incoming;currentSubject=data.currentSubject||"ku";currentNoteId=null;save();applyLanguage();selectSubject(currentSubject);toast(t("restored"));}catch(e){toast("Backup file is not valid.");}};reader.readAsText(file);}
function addSubject(){const name=$("subjectName").value.trim();if(!name)return;const s={id:"custom-"+uid(),name,icon:"📚",custom:true};data.subjects.push(s);currentSubject=s.id;data.currentSubject=s.id;$("subjectName").value="";$("subjectDialog").close();save();renderSubjects();renderNotes();createNote();}
function init(){
 $("language").value=data.language||"ku";$("language").onchange=e=>{data.language=e.target.value;save();applyLanguage();};
 $("addSubject").onclick=()=>$("subjectDialog").showModal();$("confirmSubject").onclick=e=>{e.preventDefault();addSubject();};
 $("newNote").onclick=()=>$("noteDialog").showModal();$("confirmNewNote").onclick=e=>{e.preventDefault();$("noteDialog").close();createNote();};
 document.querySelectorAll(".mode-tab").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
 document.querySelectorAll("[data-command]").forEach(b=>b.onclick=()=>execCommand(b.dataset.command));
 $("todoButton").onclick=addTodo;$("fontSize").onchange=e=>execCommand("fontSize",e.target.value);
 $("textColor").oninput=e=>execCommand("foreColor",e.target.value);
 $("highlightButton").onclick=()=>execCommand("hiliteColor",$("highlightColor").value);
 $("clearFormat").onclick=()=>execCommand("removeFormat");
 $("noteTitle").oninput=queueSave;$("typingArea").oninput=()=>{queueSave();wireTodoClicks();};$("typingArea").addEventListener("click",wireTodoClicks);
 $("penColor").oninput=()=>{erasing=false;$("eraserButton").classList.remove("active");};$("eraserButton").onclick=()=>{erasing=!erasing;$("eraserButton").classList.toggle("active",erasing);};
 $("undoButton").onclick=undoStroke;$("clearCanvas").onclick=clearCanvas;$("saveDrawing").onclick=()=>{persistEditor();toast(t("drawingSaved"));};
 const c=$("drawingCanvas");c.addEventListener("pointerdown",pointerDown);c.addEventListener("pointermove",pointerMove);c.addEventListener("pointerup",pointerUp);c.addEventListener("pointercancel",pointerUp);c.addEventListener("pointerleave",pointerUp);
 $("backupExport").onclick=exportBackup;$("backupImport").onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value="";};
 currentSubject=data.currentSubject||"ku";applyLanguage();const first=data.notes.filter(n=>n.subjectId===currentSubject).sort((a,b)=>b.updatedAt-a.updatedAt)[0];currentNoteId=first?first.id:null;loadEditor();renderNotes();setMode("type");
 if("serviceWorker" in navigator && location.protocol!=="file:")navigator.serviceWorker.register("./sw.js").catch(()=>{});
 window.addEventListener("resize",()=>{if(mode==="pen")resizeCanvas();});
 if(!currentNoteId)createNote();
}
init();
})();