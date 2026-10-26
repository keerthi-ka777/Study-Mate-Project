/* StudyMate — task management, filters, schedule, and local storage */
(() => {
  "use strict";
  const STORAGE_KEY = "studymate.tasks.v1";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const today = new Date();
  const dateISO = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const addDays = (amount) => { const d = new Date(); d.setDate(d.getDate()+amount); return dateISO(d); };
  const escapeHTML = (value="") => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const demoTasks = [
    {id:"demo-1",title:"Revise JavaScript fundamentals",subject:"Computer Science",date:addDays(0),priority:"high",duration:45,notes:"Review arrays, functions, and DOM events.",completed:false},
    {id:"demo-2",title:"Finish the DBMS assignment",subject:"Database Systems",date:addDays(1),priority:"medium",duration:60,notes:"Double-check diagrams before submitting.",completed:false},
    {id:"demo-3",title:"Read two chapters of physics",subject:"Physics",date:addDays(2),priority:"low",duration:35,notes:"Make a one-page formula sheet.",completed:false},
    {id:"demo-4",title:"Polish project presentation",subject:"Project Work",date:addDays(3),priority:"high",duration:50,notes:"Keep the slides simple and visual.",completed:false},
    {id:"demo-5",title:"Organise class notes",subject:"English",date:addDays(-1),priority:"low",duration:25,notes:"",completed:true}
  ];
  let tasks = loadTasks();
  let toastTimer;

  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : demoTasks;
    } catch (error) {
      console.warn("StudyMate could not load saved tasks.", error);
      return demoTasks;
    }
  }
  function saveTasks() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch (error) { showToast("Couldn't save in this browser. Check storage settings."); }
  }
  function formatDate(dateString, options={month:"short",day:"numeric"}) {
    if (!dateString) return "No due date";
    const date = new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, options);
  }
  function relativeDate(dateString) {
    if (dateString === dateISO(new Date())) return "Today";
    if (dateString === addDays(1)) return "Tomorrow";
    if (dateString < dateISO(new Date())) return "Overdue";
    return formatDate(dateString,{month:"short",day:"numeric"});
  }
  function accentFor(subject) {
    const palette = ["#8b70f4","#f18bb8","#efbd4d","#55c9a0","#70b7f5","#ff9a76"];
    let total = 0;
    for (const char of subject || "Study") total += char.charCodeAt(0);
    return palette[total % palette.length];
  }
  function priorityLabel(priority) {
    return ({high:"🔥 High",medium:"🌼 Medium",low:"🌿 Low"})[priority] || "🌼 Medium";
  }
  function taskRow(task) {
    return `<article class="task-row">
      <input class="task-check" type="checkbox" data-action="toggle" data-id="${escapeHTML(task.id)}" ${task.completed?"checked":""} aria-label="Mark ${escapeHTML(task.title)} complete">
      <div class="task-main"><span class="task-name">${escapeHTML(task.title)}</span><div class="task-subline"><span><i class="subject-dot" style="background:${accentFor(task.subject)}"></i> ${escapeHTML(task.subject)}</span><span>•</span><span>${escapeHTML(relativeDate(task.date))}</span></div></div>
      <span class="priority priority-${escapeHTML(task.priority)}">${priorityLabel(task.priority)}</span>
    </article>`;
  }
  function taskCard(task) {
    return `<article class="task-card ${task.completed?"completed":""}" style="--card-accent:${accentFor(task.subject)}">
      <div class="task-card-top"><span class="task-card-subject">${escapeHTML(task.subject.toUpperCase())}</span><span class="priority priority-${escapeHTML(task.priority)}">${priorityLabel(task.priority)}</span></div>
      <h3>${escapeHTML(task.title)}</h3><p>${escapeHTML(task.notes || "A little progress is still progress. You can do this! ✨")}</p>
      <div class="task-card-bottom"><span class="due-label">🗓 ${escapeHTML(relativeDate(task.date))} &nbsp;·&nbsp; ⏱ ${Number(task.duration)||30} min</span><div class="card-buttons"><button class="edit-button" data-action="edit" data-id="${escapeHTML(task.id)}">✎ Edit</button><button class="delete-button" data-action="delete" data-id="${escapeHTML(task.id)}">✕</button></div></div>
      <div style="margin-top:11px"><label style="font-size:10px;color:#9891b0"><input type="checkbox" data-action="toggle" data-id="${escapeHTML(task.id)}" ${task.completed?"checked":""}> ${task.completed?"All done — lovely work!":"Mark as complete"}</label></div>
    </article>`;
  }
  function renderStats() {
    const total = tasks.length, completed = tasks.filter(t=>t.completed).length;
    const minutes = tasks.filter(t=>t.completed).reduce((sum,t)=>sum+(Number(t.duration)||0),0);
    const rate = total ? Math.round(completed/total*100) : 0;
    $("#totalTasks").textContent = total;
    $("#completedTasks").textContent = completed;
    $("#studyHours").innerHTML = `${Math.round(minutes/60*10)/10}<span class="unit">h</span>`;
    $("#completionRate").innerHTML = `${rate}<span class="unit">%</span>`;
    $("#completedBar").style.width = `${rate}%`; $("#rateBar").style.width = `${rate}%`;
    $("#gardenCount").textContent = `${completed} / ${total}`;
    $("#gardenPercent").textContent = `${rate}%`;
    $("#gardenCircle").style.background = `conic-gradient(#8b70f4 ${rate}%, #eee9ff ${rate}%)`;
    $("#encouragement").textContent = rate===100 && total ? "Everything is blooming! Take a breath and celebrate your hard work. 🎉" : completed ? "Look at your progress blooming! Keep nurturing those goals. 🌸" : "Plant a task today. Watch your confidence grow. 🌱";
  }
  function renderDashboard() {
    const upcoming = tasks.filter(t=>!t.completed).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
    $("#dashboardTaskList").innerHTML = upcoming.length ? upcoming.map(taskRow).join("") : `<div class="empty-state"><div class="empty-emoji">🌈</div><strong>Nothing on your radar!</strong>You've earned a breather. Or add a new goal.</div>`;
  }
  function renderFilters() {
    const current = $("#subjectFilter").value;
    const subjects = [...new Set(tasks.map(t=>t.subject).filter(Boolean))].sort();
    $("#subjectFilter").innerHTML = `<option value="all">All subjects</option>${subjects.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join("")}`;
    if (subjects.includes(current)) $("#subjectFilter").value = current;
  }
  function renderAllTasks() {
    const query = $("#searchInput").value.trim().toLowerCase();
    const status = $("#statusFilter").value, subject = $("#subjectFilter").value;
    const filtered = tasks.filter(t => {
      const matchesQuery = [t.title,t.subject,t.notes].some(v=>String(v||"").toLowerCase().includes(query));
      return matchesQuery && (status==="all" || (status==="completed" ? t.completed : !t.completed)) && (subject==="all" || t.subject===subject);
    }).sort((a,b)=>Number(a.completed)-Number(b.completed) || a.date.localeCompare(b.date));
    $("#filteredCount").textContent = `${filtered.length} ${filtered.length===1?"task":"tasks"}`;
    $("#allTaskList").innerHTML = filtered.length ? filtered.map(taskCard).join("") : `<div class="empty-state" style="grid-column:1/-1;background:#fff;border-radius:16px;border:1px solid #efedf7"><div class="empty-emoji">🪴</div><strong>No tasks found just yet</strong>Try another search or add a fresh little goal.</div>`;
  }
  function renderSchedule() {
    const upcoming = tasks.filter(t=>!t.completed).sort((a,b)=>a.date.localeCompare(b.date));
    if (!upcoming.length) {
      $("#scheduleList").innerHTML = `<div class="empty-state"><div class="empty-emoji">🦋</div><strong>Your calendar has room to breathe</strong>Add a task whenever you're ready.</div>`;
      return;
    }
    const groups = {};
    upcoming.forEach(t => (groups[t.date] ||= []).push(t));
    $("#scheduleList").innerHTML = Object.entries(groups).map(([date,items]) => {
      const label = date===dateISO(new Date()) ? "TODAY · "+formatDate(date,{weekday:"long",month:"long",day:"numeric"}) : date===addDays(1) ? "TOMORROW · "+formatDate(date,{weekday:"long",month:"long",day:"numeric"}) : formatDate(date,{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
      const dateObj = new Date(`${date}T12:00:00`);
      return `<div class="schedule-day">${escapeHTML(label)}</div>${items.map(t=>`<div class="schedule-item"><div class="date-chip"><strong>${dateObj.getDate()}</strong><span>${dateObj.toLocaleDateString(undefined,{month:"short"})}</span></div><div class="schedule-info"><strong>${escapeHTML(t.title)}</strong><span>${escapeHTML(t.subject)} · ${priorityLabel(t.priority)}</span></div><span class="schedule-time">⏱ ${Number(t.duration)||30} min</span><button class="mini-action" data-action="edit" data-id="${escapeHTML(t.id)}" aria-label="Edit ${escapeHTML(t.title)}">✎</button></div>`).join("")}`;
    }).join("");
  }
  function render() { renderStats(); renderDashboard(); renderFilters(); renderAllTasks(); renderSchedule(); }
  function showToast(message) {
    const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
  }
  function openModal(task=null) {
    $("#taskForm").reset(); $("#taskId").value = task?.id || "";
    $("#modalTitle").textContent = task ? "A little task refresh" : "Add a new task";
    $("#taskTitle").value = task?.title || ""; $("#taskSubject").value = task?.subject || "";
    $("#taskDate").value = task?.date || dateISO(new Date()); $("#taskPriority").value = task?.priority || "medium";
    $("#taskDuration").value = task?.duration || 30; $("#taskNotes").value = task?.notes || "";
    $("#taskModal").classList.add("open"); $("#taskModal").setAttribute("aria-hidden","false");
    setTimeout(()=>$("#taskTitle").focus(),80);
  }
  function closeModal() { $("#taskModal").classList.remove("open"); $("#taskModal").setAttribute("aria-hidden","true"); }
  function switchView(view) {
    $$(".view").forEach(el=>el.classList.toggle("active-view",el.id===`${view}View`));
    $$(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
    $("#breadcrumbLabel").textContent = ({dashboard:"Overview",tasks:"My tasks",schedule:"Study schedule"})[view] || "Overview";
    if (view==="tasks") renderAllTasks();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function handleAction(action,id) {
    const task = tasks.find(t=>t.id===id);
    if (!task) return;
    if (action==="toggle") {
      task.completed = !task.completed; saveTasks(); render();
      showToast(task.completed ? "Task complete! Look at you go! 🎉" : "Task moved back to your list 🌱");
    } else if (action==="edit") openModal(task);
    else if (action==="delete") {
      if (window.confirm(`Delete "${task.title}"? You can't undo this.`)) {
        tasks = tasks.filter(t=>t.id!==id); saveTasks(); render(); showToast("Task removed. Making space for new things. 💜");
      }
    }
  }

  $("#taskForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("#taskId").value;
    const existing = tasks.find(t=>t.id===id);
    const task = {id:id || `task-${Date.now()}-${Math.random().toString(16).slice(2,7)}`,title:$("#taskTitle").value.trim(),subject:$("#taskSubject").value.trim(),date:$("#taskDate").value,priority:$("#taskPriority").value,duration:Math.min(600,Math.max(5,Number($("#taskDuration").value)||30)),notes:$("#taskNotes").value.trim(),completed:existing?.completed || false};
    if (!task.title || !task.subject || !task.date) { showToast("Please fill in the task name, subject, and due date."); return; }
    if (existing) tasks = tasks.map(t=>t.id===id?task:t); else tasks.push(task);
    saveTasks(); closeModal(); render(); switchView("tasks"); showToast(existing?"Your task has been refreshed ✨":"A new goal has joined your garden! 🌷");
  });
  document.addEventListener("click", event => {
    const action = event.target.closest("[data-action]");
    if (action) { handleAction(action.dataset.action,action.dataset.id); return; }
    const nav = event.target.closest("[data-view]");
    if (nav) { switchView(nav.dataset.view); return; }
    const goto = event.target.closest("[data-goto]");
    if (goto) switchView(goto.dataset.goto);
  });
  ["addTaskButton","heroAddButton","scheduleAddButton"].forEach(id=>$("#"+id).addEventListener("click",()=>openModal()));
  $("#closeModal").addEventListener("click",closeModal); $("#cancelModal").addEventListener("click",closeModal);
  $("#taskModal").addEventListener("click",event=>{if(event.target===$("#taskModal"))closeModal();});
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeModal();});
  ["searchInput","statusFilter","subjectFilter"].forEach(id=>$("#"+id).addEventListener(id==="searchInput"?"input":"change",renderAllTasks));
  $("#themeButton").addEventListener("click",()=>{document.body.classList.toggle("dark-mode");const dark=document.body.classList.contains("dark-mode");$("#themeButton").textContent=dark?"☀":"☾";try{localStorage.setItem("studymate.dark",dark?"yes":"no");}catch(_){ }});
  try { if(localStorage.getItem("studymate.dark")==="yes"){document.body.classList.add("dark-mode");$("#themeButton").textContent="☀";} } catch(_){}
  $("#todayLabel").textContent = today.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
  $("#taskDate").min = "";
  render();
})();