<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#05070b">
<meta name="description" content="StudySpace — Grade 11–12 study notes">
<title>StudySpace 11–12</title>
<link rel="icon" href="icon.svg" type="image/svg+xml">
<style>
:root{color-scheme:dark;--bg:#05070b;--card:#0d111a;--ink:#f4f8ff;--muted:#9ba9bd;--accent:#1687ff;--line:#263448}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px system-ui,-apple-system,sans-serif}
header{padding:20px max(16px,calc((100% - 920px)/2));background:linear-gradient(120deg,#05070b,#10294a);color:white;border-bottom:1px solid #1687ff;box-shadow:0 8px 28px #1687ff22}
header h1{margin:0;font-size:24px}header p{margin:5px 0 0;opacity:.9}
main{max-width:920px;margin:0 auto;padding:16px;display:grid;gap:14px}
.card{background:linear-gradient(145deg,#101722,#0a0e15);border:1px solid var(--line);border-radius:16px;padding:16px;box-shadow:0 8px 26px #0008}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.subjects{display:flex;gap:8px;flex-wrap:wrap}
button,select,input{font:inherit}button,select,input[type=text]{border:1px solid var(--line);border-radius:10px;padding:10px;background:#101722;color:var(--ink)}
button{cursor:pointer}.subject{border-radius:999px}.subject.active{background:var(--accent);color:white;border-color:var(--accent);box-shadow:0 0 16px #1687ff55}
input[type=text]{width:100%}.field{display:grid;gap:6px;margin:10px 0}.label{font-size:13px;color:var(--muted);font-weight:650}
.toolbar{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.toolbar button{padding:8px 10px}.editor{min-height:230px;border:1px solid var(--line);border-radius:12px;padding:14px;outline:none;line-height:1.7;background:#080c12;overflow-wrap:anywhere}.editor:focus{border-color:var(--accent)}.editor:empty:before{content:attr(data-placeholder);color:#999}
.note{padding:12px;border:1px solid var(--line);border-radius:12px;margin-top:8px;cursor:pointer}.note strong{display:block}.note small{color:var(--muted)}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.primary{background:var(--accent);color:white;border-color:var(--accent)}.danger{color:#ff8794}.hint{font-size:13px;color:var(--muted)}h2{font-size:18px;margin:0 0 10px}
@media(min-width:760px){main{grid-template-columns:260px 1fr;align-items:start}.editorcard{grid-column:2}.subjectsCard{grid-column:1}.savedCard{grid-column:1;grid-row:2}}
</style>
</head>
<body>
<header><h1>StudySpace 11–12</h1><p>Your study notebook — add as many subjects as you need</p></header>
<main>
<section class="card subjectsCard"><h2>Subjects</h2><div class="subjects" id="subjects"></div><div class="field"><label class="label" for="newSubject">Add your own subject</label><div class="row"><input id="newSubject" type="text" placeholder="e.g. Biology, Physics, Art" style="flex:1;min-width:0"><button class="primary" id="addSubject" type="button">Add subject</button></div></div><p class="hint">Create as many subjects as you want. Custom subjects are saved in this browser on this device.</p></section>
<section class="card savedCard"><h2>Saved notes</h2><input id="search" type="text" placeholder="Search notes…"><div id="notes"></div><div class="actions"><button id="backup">Export backup</button><button id="restoreBtn">Import backup</button><input id="restoreFile" type="file" accept=".json,application/json" hidden></div></section>
<section class="card editorcard"><h2 id="editorTitle">New note</h2>
<div class="field"><label class="label" for="title">Note title</label><input id="title" type="text" placeholder="e.g. Chapter 1 — Key ideas"></div>
<div class="field"><label class="label" for="chapter">Chapter (optional)</label><input id="chapter" type="text" placeholder="Chapter or lesson"></div>
<label class="label">Formatting</label><div class="toolbar"><button type="button" data-cmd="bold"><b>B</b></button><button type="button" data-cmd="italic"><i>I</i></button><button type="button" data-cmd="underline"><u>U</u></button><select id="fontSize" aria-label="Text size"><option value="3">Normal size</option><option value="2">Small text</option><option value="4">Large text</option><option value="5">Extra large</option><option value="6">Heading</option></select><label class="row" style="border:1px solid var(--line);border-radius:10px;padding:5px 8px">Text color <input id="textColor" type="color" value="#f4f8ff" style="width:32px;height:28px;border:0;padding:0;background:transparent"></label><button type="button" id="numbered">1. Numbered list</button><button type="button" id="bullets">• Bullets</button></div>
<div id="content" class="editor" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="Write your study notes here… Kurdish، عربي، English"></div>
<div class="actions"><button class="primary" id="save">Save note</button><button id="new">New note</button><button class="danger" id="delete">Delete note</button></div>
<p class="hint" id="status">Notes save in this browser on this device. Export a backup regularly; publishing updates does not upload your notes.</p>
</section></main>
<script>
const defaultSubjects=["Kurdish","Arabic","English","Economics","History","Philosophy","Computer","Religion","Geography"];
const STORAGE_KEY="studyspace-simple-v1";
const $=id=>document.getElementById(id);
let data={notes:[],subjects:[]},subjects=[...defaultSubjects],subject=subjects[0],activeId=null;
try{data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{"notes":[],"subjects":[]}')}catch(e){data={notes:[],subjects:[]}}
if(!Array.isArray(data.notes))data.notes=[];
if(!Array.isArray(data.subjects))data.subjects=[];
subjects=[...new Set([...defaultSubjects,...data.subjects.filter(s=>typeof s==="string"&&s.trim())])];
// Keep older saved notes usable, even if they refer to a subject not in the default list.
data.notes.forEach(n=>{if(n.subject&&!subjects.includes(n.subject))subjects.push(n.subject)});
function persist(){data.subjects=subjects.filter(s=>!defaultSubjects.includes(s));localStorage.setItem(STORAGE_KEY,JSON.stringify(data));$("status").textContent="Saved on this device."}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderSubjects(){let box=$("subjects");box.innerHTML="";subjects.forEach(s=>{let b=document.createElement("button");b.textContent=s;b.className="subject"+(s===subject?" active":"");b.type="button";b.onclick=()=>{subject=s;activeId=null;clearEditor();renderSubjects();renderNotes()};box.append(b)})}
function addSubject(){let field=$("newSubject"),name=field.value.trim();if(!name){field.focus();return}if(subjects.some(s=>s.toLocaleLowerCase()===name.toLocaleLowerCase())){alert("That subject already exists.");return}subjects.push(name);subject=name;activeId=null;clearEditor();field.value="";persist();renderSubjects();renderNotes();$("status").textContent="Subject added and saved on this device."}
$("addSubject").onclick=addSubject;$("newSubject").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addSubject()}});
function current(){return data.notes.find(n=>n.id===activeId)}
function clearEditor(){activeId=null;$("title").value="";$("chapter").value="";$("content").innerHTML="";$("editorTitle").textContent="New note"}
function openNote(n){activeId=n.id;subject=n.subject;if(!subjects.includes(subject))subjects.push(subject);$("title").value=n.title||"";$("chapter").value=n.chapter||"";$("content").innerHTML=n.content||"";$("editorTitle").textContent="Edit note";renderSubjects();renderNotes();window.scrollTo({top:0,behavior:"smooth"})}
function plain(s){let d=document.createElement("div");d.innerHTML=s||"";return d.textContent||""}
function renderNotes(){let q=$("search").value.toLowerCase();let ns=data.notes.filter(n=>n.subject===subject&&[n.title,n.chapter,plain(n.content)].join(" ").toLowerCase().includes(q));$("notes").innerHTML="";if(!ns.length){$("notes").innerHTML='<p class="hint">No notes yet for '+esc(subject)+'.</p>';return}ns.forEach(n=>{let b=document.createElement("button");b.className="note";b.style.width="100%";b.style.textAlign="left";b.innerHTML="<strong>"+esc(n.title||"Untitled note")+"</strong><small>"+esc(n.chapter||subject)+"</small>";b.onclick=()=>openNote(n);$("notes").append(b)})}
function save(){let n=current();if(!n){n={id:Date.now().toString(36)+Math.random().toString(36).slice(2),subject,title:"",chapter:"",content:""};data.notes.unshift(n);activeId=n.id}n.subject=subject;n.title=$("title").value.trim()||"Untitled note";n.chapter=$("chapter").value;n.content=$("content").innerHTML;persist();$("editorTitle").textContent="Edit note";renderNotes()}
$("save").onclick=save;$("new").onclick=()=>{clearEditor();$("title").focus()};$("delete").onclick=()=>{if(!activeId)return;if(!confirm("Delete this note?"))return;data.notes=data.notes.filter(n=>n.id!==activeId);persist();clearEditor();renderNotes()};$("search").addEventListener("input",renderNotes);
document.querySelectorAll("[data-cmd]").forEach(b=>b.onclick=()=>{$("content").focus();document.execCommand(b.dataset.cmd,false,null)});
$("numbered").onclick=()=>{$("content").focus();document.execCommand("insertOrderedList",false,null)};$("bullets").onclick=()=>{$("content").focus();document.execCommand("insertUnorderedList",false,null)};$("fontSize").onchange=e=>{$("content").focus();document.execCommand("fontSize",false,e.target.value)};$("textColor").oninput=e=>{$("content").focus();document.execCommand("foreColor",false,e.target.value)};
$("backup").onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="studyspace-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$("restoreBtn").onclick=()=>$("restoreFile").click();$("restoreFile").onchange=async e=>{let file=e.target.files&&e.target.files[0];if(!file)return;try{let obj=JSON.parse(await file.text());if(!Array.isArray(obj.notes))throw Error();data={notes:obj.notes,subjects:Array.isArray(obj.subjects)?obj.subjects:[]};subjects=[...new Set([...defaultSubjects,...data.subjects.filter(s=>typeof s==="string"&&s.trim()),...data.notes.map(n=>n.subject).filter(Boolean)])];subject=subjects[0];persist();clearEditor();renderSubjects();renderNotes();alert("Backup imported.")}catch(err){alert("That backup file could not be read.")}finally{e.target.value=""}};
renderSubjects();renderNotes();
</script>
</body></html>


/* 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f5eedc">
<title>StudySpace</title>
<style>
:root{--paper:#fffdf5;--ink:#25334a;--blue:#b9d5f1;--red:#d96a6a;--accent:#345f9b}
*{box-sizing:border-box}
body{margin:0;font-family:Arial,system-ui,sans-serif;color:var(--ink);background:#e8eaf0}
header{background:#263c60;color:white;padding:16px}
h1{margin:0 0 12px;font-size:25px}
main{max-width:950px;margin:auto;padding:14px}
.panel{background:white;padding:14px;border-radius:12px;margin-bottom:14px;box-shadow:0 2px 8px #17274612}
.toolbar,.actions{display:flex;gap:8px;flex-wrap:wrap}
button,select,input,.file-label{font:inherit;border:1px solid #c6ccda;border-radius:8px;padding:10px;background:white;color:#24334b}
button,.file-label{cursor:pointer}
button:hover,.file-label:hover{background:#edf3ff}
label{display:block;font-weight:bold;margin:10px 0 5px}
.wide{width:100%}
.paper{background-color:var(--paper);background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 31px,var(--blue) 32px,transparent 33px);border-left:3px solid var(--red);padding:15px 12px 20px 24px;min-height:420px}
#chapterTitle{width:100%;border:0;border-bottom:1px solid var(--blue);border-radius:0;background:transparent;font-size:20px;font-weight:bold;margin-bottom:12px}
#notes{width:100%;min-height:340px;resize:vertical;border:0;outline:0;border-radius:0;padding:0;background:transparent;color:#263750;font:17px/33px Arial,system-ui,sans-serif}
.status{font-size:13px;color:#52705b;margin-top:8px}
#pdfViewer{width:100%;height:65vh;min-height:350px;border:1px solid #ccd1db;border-radius:8px}
[hidden]{display:none!important}
footer{text-align:center;padding:20px;color:#58657b;font-size:13px}
</style>
</head>
<body>
<header>
<h1>📚 StudySpace</h1>
<div class="toolbar">
<select id="language" aria-label="Language">
<option value="en">English</option>
<option value="ku">کوردی (سۆرانی)</option>
<option value="ar">العربية</option>
</select>
<button id="backup">Export backup</button>
<button id="restore">Restore backup</button>
<input id="restoreFile" type="file" accept=".json,application/json" hidden>
</div>
</header>

<main>
<section class="panel">
<label for="subject" data-t="subject">Subject</label>
<select id="subject" class="wide">
<option>Kurdish</option><option>Arabic</option><option>English</option>
<option>Mathematics</option><option>Economics</option><option>History</option>
<option>Philosophy</option><option>Computer</option><option>Religion</option><option>Geography</option>
</select>

<label for="chapterList" data-t="chapters">Saved chapters</label>
<select id="chapterList" class="wide"></select>

<label for="chapterTitle" data-t="title">Chapter title</label>
<input id="chapterTitle" placeholder="Enter chapter title" maxlength="200">

<div class="actions" style="margin-top:12px">
<button id="newChapter" data-t="new">New chapter</button>
<button id="deleteChapter" data-t="delete">Delete chapter</button>
</div>
</section>

<section class="panel">
<div class="paper">
<textarea id="notes" placeholder="Write your study notes here..."></textarea>
</div>
<div class="status" id="status" role="status">Saved on this device</div>
</section>

<section class="panel">
<h2 data-t="pdf">📄 PDF reader</h2>
<p data-t="pdfInfo">Choose a PDF to read it here. The file stays on this device.</p>
<div class="actions">
<label for="pdfFile" class="file-label" data-t="choose">Choose PDF</label>
<input id="pdfFile" type="file" accept="application/pdf,.pdf" hidden>
<button id="closePdf" data-t="close">Close PDF</button>
</div>
<p id="pdfName"></p>
<iframe id="pdfViewer" title="PDF reader" hidden></iframe>
</section>

<section class="panel">
<h2 data-t="cloud">☁️ Cloud sync</h2>
<p data-t="cloudInfo">Cloud syncing is not connected yet. Notes are saved locally on this device. Firebase setup is required to sync between devices.</p>
<p data-t="backupInfo">Export backups regularly to protect your notes.</p>
</section>
</main>
<footer>StudySpace • Your study notebook</footer>

<script>
(() => {
const $=id=>document.getElementById(id);
const subject=$("subject"),list=$("chapterList"),title=$("chapterTitle"),notes=$("notes"),status=$("status");
const KEY="studyspace-upgrade-v1";
let chapters=[],currentId=null,timer=null,pdfUrl=null;
const translations={
en:{subject:"Subject",chapters:"Saved chapters",title:"Chapter title",new:"New chapter",delete:"Delete chapter",pdf:"📄 PDF reader",pdfInfo:"Choose a PDF to read it here. The file stays on this device.",choose:"Choose PDF",close:"Close PDF",cloud:"☁️ Cloud sync",cloudInfo:"Cloud syncing is not connected yet. Notes are saved locally on this device. Firebase setup is required to sync between devices.",backupInfo:"Export backups regularly to protect your notes.",placeholder:"Write your study notes here...",titlePlaceholder:"Enter chapter title",saved:"Saved on this device",empty:"Untitled chapter",none:"No chapters yet",confirm:"Delete this chapter?",restored:"Backup restored.",bad:"Could not read the backup file.",backup:"Export backup",restore:"Restore backup"},
ku:{subject:"بابەت",chapters:"بەشە پاشەکەوتکراوەکان",title:"ناونیشانی بەش",new:"بەشی نوێ",delete:"سڕینەوەی بەش",pdf:"📄 خوێندنەوەی PDF",pdfInfo:"فایلی PDF هەڵبژێرە بۆ خوێندنەوە. فایلەکە لەم ئامێرە دەمێنێتەوە.",choose:"هەڵبژاردنی PDF",close:"داخستنی PDF",cloud:"☁️ هاوکاتکردنی هەوری",cloudInfo:"هاوکاتکردنی هەوری هێشتا پەیوەست نەکراوە. تێبینییەکانت لەم ئامێرە پاشەکەوت دەبن. بۆ هاوکاتکردنی ئامێرەکان پێویستە Firebase ڕێکبخرێت.",backupInfo:"بەردەوام پاشەکەوت هەناردە بکە بۆ پاراستنی تێبینییەکانت.",placeholder:"تێبینییەکانی خوێندن بنووسە...",titlePlaceholder:"ناونیشانی بەش بنووسە",saved:"لەسەر ئەم ئامێرە پاشەکەوت کرا",empty:"بەشی بێ ناونیشان",none:"هێشتا هیچ بەشێک نییە",confirm:"ئەم بەشە بسڕدرێتەوە؟",restored:"پاشەکەوت گەڕێندرایەوە.",bad:"نەتوانرا فایلی پاشەکەوتەکە بخوێندرێتەوە.",backup:"هەناردەکردنی پاشەکەوت",restore:"گەڕاندنەوەی پاشەکەوت"},
ar:{subject:"المادة",chapters:"الفصول المحفوظة",title:"عنوان الفصل",new:"فصل جديد",delete:"حذف الفصل",pdf:"📄 قارئ PDF",pdfInfo:"اختر ملف PDF لقراءته هنا. يبقى الملف على هذا الجهاز.",choose:"اختيار PDF",close:"إغلاق PDF",cloud:"☁️ المزامنة السحابية",cloudInfo:"المزامنة السحابية غير متصلة بعد. تحفظ الملاحظات على هذا الجهاز. يلزم إعداد Firebase للمزامنة بين الأجهزة.",backupInfo:"صدّر نسخة احتياطية بانتظام لحماية ملاحظاتك.",placeholder:"اكتب ملاحظاتك الدراسية هنا...",titlePlaceholder:"أدخل عنوان الفصل",saved:"تم الحفظ على هذا الجهاز",empty:"فصل بلا عنوان",none:"لا توجد فصول بعد",confirm:"هل تريد حذف هذا الفصل؟",restored:"تمت استعادة النسخة الاحتياطية.",bad:"تعذرت قراءة ملف النسخة الاحتياطية.",backup:"تصدير نسخة احتياطية",restore:"استعادة نسخة احتياطية"}
};
function t(k){return translations[$("language").value][k]||translations.en[k]||k}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(chapters));status.textContent=t("saved")}catch(e){status.textContent="Storage full — export a backup."}}
function getCurrent(){return chapters.find(c=>c.id===currentId)||null}
function makeId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function forSubject(){return chapters.filter(c=>c.subject===subject.value)}
function renderList(){
list.replaceChildren();
let items=forSubject().sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""));
if(!items.length){let o=document.createElement("option");o.value="";o.textContent=t("none");list.append(o);return}
items.forEach(c=>{let o=document.createElement("option");o.value=c.id;o.textContent=c.title.trim()||t("empty");list.append(o)});
if(!items.some(c=>c.id===currentId))currentId=items[0].id;
list.value=currentId;
}
function display(){
let c=getCurrent();title.value=c?c.title:"";notes.value=c?c.notes:"";
title.disabled=notes.disabled=!c;$("deleteChapter").disabled=!c;
status.textContent=t("saved");
}
function createChapter(){
let c={id:makeId(),subject:subject.value,title:"",notes:"",updatedAt:new Date().toISOString()};
chapters.push(c);currentId=c.id;persist();renderList();display();title.focus();
}
function saveEditor(){
let c=getCurrent();if(!c)return;
c.title=title.value;c.notes=notes.value;c.updatedAt=new Date().toISOString();
status.textContent="Saving...";
clearTimeout(timer);timer=setTimeout(()=>{persist();renderList()},250);
}
function changeLanguage(){
let lang=$("language").value;
document.documentElement.lang=lang==="ku"?"ckb":lang;
document.documentElement.dir=lang==="en"?"ltr":"rtl";
document.querySelectorAll("[data-t]").forEach(el=>el.textContent=t(el.dataset.t));
notes.placeholder=t("placeholder");title.placeholder=t("titlePlaceholder");
$("backup").textContent=t("backup");$("restore").textContent=t("restore");
renderList();display();
}
try{
let saved=JSON.parse(localStorage.getItem(KEY)||"[]");
if(Array.isArray(saved))chapters=saved;
}catch(e){chapters=[]}
if(!forSubject().length)createChapter();
else{currentId=forSubject()[0].id;renderList();display()}

subject.addEventListener("change",()=>{currentId=forSubject()[0]?.id||null;if(!currentId)createChapter();else{renderList();display()}});
list.addEventListener("change",()=>{currentId=list.value||null;display()});
title.addEventListener("input",saveEditor);notes.addEventListener("input",saveEditor);
$("newChapter").addEventListener("click",createChapter);
$("deleteChapter").addEventListener("click",()=>{
if(!getCurrent()||!confirm(t("confirm")))return;
chapters=chapters.filter(c=>c.id!==currentId);currentId=forSubject()[0]?.id||null;
if(!currentId)createChapter();else{persist();renderList();display()}
});
$("backup").addEventListener("click",()=>{
let blob=new Blob([JSON.stringify({app:"StudySpace",version:1,chapters},null,2)],{type:"application/json"});
let url=URL.createObjectURL(blob),a=document.createElement("a");
a.href=url;a.download="studyspace-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$("restore").addEventListener("click",()=>$("restoreFile").click());
$("restoreFile").addEventListener("change",async e=>{
let file=e.target.files[0];if(!file)return;
try{
let data=JSON.parse(await file.text());
let incoming=Array.isArray(data)?data:data.chapters;
if(!Array.isArray(incoming))throw Error("Invalid backup");
if(!confirm("Restore backup? This replaces the current notes."))return;
chapters=incoming.filter(c=>c&&typeof c.subject==="string").map(c=>({
id:typeof c.id==="string"?c.id:makeId(),subject:c.subject,
title:typeof c.title==="string"?c.title:"",notes:typeof c.notes==="string"?c.notes:"",
updatedAt:c.updatedAt||new Date().toISOString()
}));
currentId=forSubject()[0]?.id||null;
if(!currentId)createChapter();else{persist();renderList();display()}
alert(t("restored"));
}catch(err){alert(t("bad"))}finally{e.target.value=""}
});
$("language").addEventListener("change",changeLanguage);
$("pdfFile").addEventListener("change",e=>{
let file=e.target.files[0];if(!file)return;
if(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf")){alert("Choose a PDF file.");return}
if(pdfUrl)URL.revokeObjectURL(pdfUrl);
pdfUrl=URL.createObjectURL(file);$("pdfViewer").src=pdfUrl;$("pdfViewer").hidden=false;$("pdfName").textContent=file.name;
});
$("closePdf").addEventListener("click",()=>{
$("pdfViewer").removeAttribute("src");$("pdfViewer").hidden=true;$("pdfName").textContent="";
if(pdfUrl)URL.revokeObjectURL(pdfUrl);pdfUrl=null;$("pdfFile").value="";
});
$("language").addEventListener("change",changeLanguage);
window.addEventListener("beforeunload",()=>{clearTimeout(timer);let c=getCurrent();if(c){c.title=title.value;c.notes=notes.value;persist()}if(pdfUrl)URL.revokeObjectURL(pdfUrl)});
changeLanguage();
})();
</script>
</body>
</html>
 school notebook paper */
.paper {
  background-color: #fffdf5;
  background-image:
    linear-gradient(
      to right,
      transparent 53px,
      #d87979 54px,
      #d87979 55px,
      transparent 56px
    ),
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 31px,
      #9dc3e8 32px,
      transparent 33px
    );
  border: 1px solid #d6cbb8;
  border-radius: 4px 12px 12px 4px;
  box-shadow: 0 10px 25px #40372720;
  min-height: 65vh;
}

#notes {
  background: transparent;
  color: #283a50;
  font-size: 16px;
  line-height: 33px;
  padding-left: 75px;
  border: none;
  resize: vertical;
}

#chapterTitle {
  background: transparent;
  color: #244e78;
  border: none;
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
}
# StudySpace — fresh starter build

A simple static web app starter for an Android tablet. Includes subject dashboard, typed notes, local saving, math symbol insertion, paper-like canvas drawing, pen/highlighter/eraser controls, undo, dark mode, and JSON backup/restore.

## Files
- `index.html` — app structure
- `style.css` — responsive design and themes
- `app.js` — note data, drawing tools, local storage, backup/restore
- `manifest.webmanifest` — PWA metadata
- `service-worker.js` — offline cache starter

## Run locally
Open `index.html` in a modern browser. Local storage and canvas work in a browser. PWA/offline caching requires serving over HTTPS or localhost and registering the service worker.

## Publish on GitHub Pages
1. Back up the existing repository and any notes.
2. Upload the contents of this folder to the repository root or the configured Pages publishing folder.
3. Commit the changes to the branch/folder configured in Settings → Pages.
4. Wait for deployment and open the published site.
5. Test on the actual Android tablet.

## Important limitations of this starter
- Language selector currently saves the selected language but does not translate every UI label.
- Notes are stored in this browser's local storage; clearing browser/site data can remove them. Use Export Backup regularly.
- The drawing canvas is a single page per note in this first build.
- This is a starter implementation and has not been verified on the user's device or deployed website yet.

## Install to Android home screen and use offline
This must be published on an HTTPS site (for example GitHub Pages). A local HTML file opened from Downloads cannot reliably install as a PWA or register its offline service worker.

1. Upload the contents of this folder, including the `icons` folder, to the GitHub Pages publishing folder.
2. Wait until the HTTPS website shows the new version.
3. On the Infinix XPad, open the HTTPS website in Chrome while online.
4. Open Chrome's ⋮ menu and choose **Install app** or **Add to Home screen** (the wording depends on Chrome).
5. Launch StudySpace from the new home-screen icon once while online. After the first successful load, the app shell should be cached for offline opening.
6. Create a test note, close the app, enable Airplane mode, reopen StudySpace and check the note. Keep using Export Backup regularly.

Note: offline access depends on the browser's storage not being cleared. Notes are local to the browser/app installation and are not automatically synced across devices. Test offline behavior before relying on it for important study notes.
