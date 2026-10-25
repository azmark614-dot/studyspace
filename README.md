
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
