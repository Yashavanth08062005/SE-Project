(() => {
  // Storage key
<<<<<<< HEAD
  const STORAGE_KEY = "psi_data_v1";

  // Demo data
  const demo = {
    profile: { name: "You", meta: "3rd Year - CSE", avatar: "" },
    mySkills: ["Python", "HTML"],
    peers: [
      { name: "imran", skills: ["Github"], company: "junpier" },
      { name: "farhaan", skills: ["Typescript"], company: "Dell" },
      { name: "farhan", skills: ["MongoDB"], company: "" }
    ],
    resources: []
  };

  // state
  let state = {
    profile: { name: "", meta: "", avatar: "" },
    mySkills: [],
    peers: [],
    resources: []
  };

  // Load state from DB
  async function loadState() {
    if (!currentUserId) return;
    try {
      const res = await fetch(`/api/state/${currentUserId}`);
      const data = await res.json();
      state = data;
    } catch (e) {
      console.error("Load State Error:", e);
    }
  }

  // Save state to DB

  async function saveState() {
    if (!currentUserId) {
      console.warn("[Client] saveState called but currentUserId is missing");
      return;
    }
    console.log("[Client] Saving state for UserID:", currentUserId);
    try {
      const res = await fetch('/api/state/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          profile: state.profile,
          mySkills: state.mySkills,
          peers: state.peers
        })
      });
      if (!res.ok) console.error("[Client] Save failed:", res.status, await res.text());
      else console.log("[Client] Save successful");
    } catch (e) {
      console.error("Save Error:", e);
    }
=======
  const STORAGE_KEY = "psi_store_v1";   // stores users + peers + resources
  const AUTH_KEY = "psi_auth_v1";

  // Credentials / username rule
  const REQUIRED_PASSWORD = "Abcd@12345";   // exact match
  const USER_REGEX = /^01fe\d{2}[A-Za-z]{3}\d{3}$/i; // 01fe + 2 digits + 3 letters + 3 digits (case-insensitive)

  // default global peers/resources
  const DEFAULT_PEERS = [
    { name: "imran", skills: ["Github"], company: "junpier" },
    { name: "farhaan", skills: ["Typescript"], company: "Dell" },
    { name: "farhan", skills: ["MongoDB"], company: "" }
  ];

  const DEFAULT_STORE = {
    users: {
      // sample prepopulated user (optional). You can remove if you want no prepopulated user.
      "01fe24bcs418": {
        profile: { name: "You", meta: "3rd Year - CSE", avatar: "" },
        mySkills: ["Python", "HTML"]
      }
    },
    peers: DEFAULT_PEERS.slice(),
    resources: []
  };

  // in-memory store and current user
  let store = loadStore();
  let currentUser = getAuthUser(); // lowercase key or null

  // ---------- storage helpers ----------
  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STORE));
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }
  function saveStore() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
  function getAuthUser() {
    try {
      const a = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      if (a && a.logged && a.username) return a.username;
    } catch (e) {}
    return null;
  }
  function setAuthUser(usernameLower) {
    const obj = { logged: !!usernameLower, username: usernameLower || null, ts: Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(obj));
    currentUser = usernameLower;
    updateAuthUI();
  }
  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    currentUser = null;
    updateAuthUI();
  }

  // ensure per-user record exists
  function ensureUser(usernameLower) {
    if (!usernameLower) return null;
    if (!store.users) store.users = {};
    if (!store.users[usernameLower]) {
      store.users[usernameLower] = {
        profile: { name: usernameLower.toUpperCase(), meta: "", avatar: "" },
        mySkills: []
      };
      saveStore();
    }
    return store.users[usernameLower];
  }
  function getCurrentUserState() {
    if (!currentUser) return null;
    return ensureUser(currentUser);
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
  }

  // utils
  function normalizeSkill(s) {
    return s.trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
<<<<<<< HEAD

  function aggregateSkillCounts() {
    const counts = {};
    state.peers.forEach(p => (p.skills || []).forEach(s => {
      const sk = normalizeSkill(s);
      counts[sk] = (counts[sk] || 0) + 1;
    }));
    state.mySkills.forEach(s => {
      const sk = normalizeSkill(s);
      counts[sk] = (counts[sk] || 0) + 1;
    });
    return counts;
  }

  function topNFromCounts(counts, n = 8) {
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
  }

  // dom refs
  const pages = document.querySelectorAll(".page");
  const navBtns = document.querySelectorAll(".nav-btn");
=======
  function aggregateSkillCounts() {
    const counts = {};
    (store.peers || []).forEach(p => (p.skills || []).forEach(s => {
      const sk = normalizeSkill(s);
      counts[sk] = (counts[sk] || 0) + 1;
    }));
    const userState = getCurrentUserState();
    if (userState && userState.mySkills) {
      userState.mySkills.forEach(s => {
        const sk = normalizeSkill(s);
        counts[sk] = (counts[sk] || 0) + 1;
      });
    }
    return counts;
  }
  function topNFromCounts(counts, n = 8) {
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,n);
  }

  // DOM refs
  const pages = document.querySelectorAll(".page");
  const navBtns = document.querySelectorAll(".nav-btn");
  const topbar = document.querySelector(".topbar-main");

  // login elements
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");
  const loginBtn = document.getElementById("loginBtn");
  const loginMsg = document.getElementById("loginMsg");
  const logoutBtn = document.getElementById("logoutBtn");
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856

  // profile
  const brandAvatar = document.getElementById("brandAvatar");
  const avatarInput = document.getElementById("avatarInput");
  const nameInput = document.getElementById("nameInput");
  const metaInput = document.getElementById("metaInput");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const profileMsg = document.getElementById("profileMsg");
  const profileSummary = document.getElementById("profileSummary");
  const changeAvatarBtn = document.getElementById("changeAvatarBtn");
  const removeAvatarBtn = document.getElementById("removeAvatarBtn");

  // myskills mini
  const mySkillsPfp = document.getElementById("mySkillsPfp");
  const mySkillsName = document.getElementById("mySkillsName");
  const mySkillsMeta = document.getElementById("mySkillsMeta");
  const mySkillsChangePhoto = document.getElementById("mySkillsChangePhoto");
  const mySkillsRemovePhoto = document.getElementById("mySkillsRemovePhoto");
  const mySkillsPhotoInput = document.getElementById("mySkillsPhotoInput");

  // skills
  const skillInput = document.getElementById("skillInput");
  const addSkillBtn = document.getElementById("addSkillBtn");
  const mySkillsList = document.getElementById("mySkillsList");

  // peers
  const peerName = document.getElementById("peerName");
  const peerSkills = document.getElementById("peerSkills");
  const peerCompany = document.getElementById("peerCompany");
  const addPeerBtn = document.getElementById("addPeerBtn");
  const peerList = document.getElementById("peerList");

  // charts
  const trendingCtx = document.getElementById("trendingChart").getContext("2d");
<<<<<<< HEAD

=======
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
  const companyCtx = document.getElementById("companyChart").getContext("2d");
  const domainCanvas = document.getElementById("domainChart");
  const domainCtx = domainCanvas ? domainCanvas.getContext("2d") : null;

  // skill gap
  const gapChipsEl = document.getElementById("gapChips");
  const compareTableBody = document.querySelector("#compareTable tbody");

  // companies
  const companyList = document.getElementById("companyList");

  // resources
  const resourceGrid = document.getElementById("resourceGrid");
  const resourceModal = document.getElementById("resourceModal");
  const resPeerIndex = document.getElementById("resPeerIndex");
  const resSkill = document.getElementById("resSkill");
  const resTitle = document.getElementById("resTitle");
  const resURL = document.getElementById("resURL");
  const resNote = document.getElementById("resNote");
  const saveResourceBtn = document.getElementById("saveResourceBtn");
  const cancelResourceBtn = document.getElementById("cancelResourceBtn");

  // filters
  const resourceSearch = document.getElementById("resourceSearch");
  const filterSkill = document.getElementById("filterSkill");
  const filterPeer = document.getElementById("filterPeer");
  const resetFilters = document.getElementById("resetFilters");

  let trendingChart, companyChart, domainChart;

<<<<<<< HEAD
  // navigation
  function showPage(id) {
    pages.forEach(p => p.id === id ? p.classList.add("active") : p.classList.remove("active"));
    navBtns.forEach(b => b.dataset.page === id ? b.classList.add("active") : b.classList.remove("active"));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  navBtns.forEach(b => b.addEventListener("click", () => showPage(b.dataset.page)));

  // profile rendering
  function renderProfile() {
    if (!nameInput) return;
    nameInput.value = state.profile.name || "";
    metaInput.value = state.profile.meta || "";
    brandAvatar.src = state.profile.avatar || "";
    if (profileSummary) {
      profileSummary.innerHTML = `
        <img class="pfp" src="${state.profile.avatar || ''}" onerror="this.style.visibility='hidden'"/>
        <div>
          <strong>${escapeHtml(state.profile.name || "Your Name")}</strong>
          <div class="muted">${escapeHtml(state.profile.meta || "")}</div>
          <div style="margin-top:8px">Skills: ${(state.mySkills || []).length} • Peers: ${(state.peers || []).length}</div>
=======
  // Navigation + page show (hide topbar on login)
  function showPage(id){
    if (!isLoggedIn() && id !== "login") {
      pages.forEach(p=>p.id==="login" ? p.classList.add("active") : p.classList.remove("active"));
      navBtns.forEach(b=> b.classList.remove("active"));
      if (topbar) topbar.style.display = "none";
      if (loginUsername) loginUsername.focus();
      return;
    }

    if (id === "login") {
      if (topbar) topbar.style.display = "none";
    } else {
      if (topbar) topbar.style.display = "";
    }

    pages.forEach(p=>p.id===id ? p.classList.add("active") : p.classList.remove("active"));
    navBtns.forEach(b=> b.dataset.page===id ? b.classList.add("active") : b.classList.remove("active"));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  navBtns.forEach(b=> b.addEventListener("click", () => showPage(b.dataset.page)));

  function isLoggedIn() {
    return !!currentUser;
  }

  // Rendering (per-user)
  function renderProfile() {
    const userState = getCurrentUserState();
    if (!userState) {
      if (nameInput) nameInput.value = "";
      if (metaInput) metaInput.value = "";
      if (brandAvatar) brandAvatar.src = "";
      if (profileSummary) profileSummary.innerHTML = "";
      return;
    }
    nameInput.value = (userState.profile && userState.profile.name) || "";
    metaInput.value = (userState.profile && userState.profile.meta) || "";
    brandAvatar.src = (userState.profile && userState.profile.avatar) || "";
    if (profileSummary) {
      profileSummary.innerHTML = `
        <img class="pfp" src="${escapeHtml((userState.profile && userState.profile.avatar) || '')}" onerror="this.style.visibility='hidden'"/>
        <div>
          <strong>${escapeHtml((userState.profile && userState.profile.name) || "Your Name")}</strong>
          <div class="muted">${escapeHtml((userState.profile && userState.profile.meta) || "")}</div>
          <div style="margin-top:8px">Skills: ${ (userState.mySkills||[]).length } • Peers: ${ (store.peers||[]).length }</div>
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
        </div>
      `;
    }
  }

  function renderMySkillsProfileCard() {
<<<<<<< HEAD
    if (mySkillsPfp) mySkillsPfp.src = state.profile.avatar || "";
    if (mySkillsName) mySkillsName.textContent = state.profile.name || "Your Name";
    if (mySkillsMeta) mySkillsMeta.textContent = state.profile.meta || "";
  }

  // avatar handling
  avatarInput && avatarInput.addEventListener("change", (ev) => {
=======
    const userState = getCurrentUserState();
    if (mySkillsPfp) mySkillsPfp.src = (userState && userState.profile && userState.profile.avatar) || "";
    if (mySkillsName) mySkillsName.textContent = (userState && userState.profile && userState.profile.name) || "Your Name";
    if (mySkillsMeta) mySkillsMeta.textContent = (userState && userState.profile && userState.profile.meta) || "";
  }

  // Avatar handling (per-user)
  avatarInput && avatarInput.addEventListener("change", (ev) => {
    if (!isLoggedIn()) { alert("Please log in to edit your profile."); showPage("login"); return; }
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
<<<<<<< HEAD
      state.profile.avatar = reader.result;
      saveState();
=======
      const userState = getCurrentUserState();
      userState.profile.avatar = reader.result;
      saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      renderProfile();
      renderMySkillsProfileCard();
    };
    reader.readAsDataURL(file);
  });

  mySkillsPhotoInput && mySkillsPhotoInput.addEventListener("change", (ev) => {
<<<<<<< HEAD
=======
    if (!isLoggedIn()) { alert("Please log in to edit your profile."); showPage("login"); return; }
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
<<<<<<< HEAD
      state.profile.avatar = reader.result;
      saveState();
=======
      const userState = getCurrentUserState();
      userState.profile.avatar = reader.result;
      saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      renderProfile();
      renderMySkillsProfileCard();
    };
    reader.readAsDataURL(file);
  });

<<<<<<< HEAD
  mySkillsPfp && mySkillsPfp.addEventListener("click", () => mySkillsPhotoInput && mySkillsPhotoInput.click());
  mySkillsChangePhoto && mySkillsChangePhoto.addEventListener("click", () => mySkillsPhotoInput && mySkillsPhotoInput.click());
  changeAvatarBtn && changeAvatarBtn.addEventListener("click", () => avatarInput && avatarInput.click());

  mySkillsRemovePhoto && mySkillsRemovePhoto.addEventListener("click", () => {
    if (!confirm("Remove profile photo?")) return;
    state.profile.avatar = "";
    saveState();
=======
  mySkillsPfp && mySkillsPfp.addEventListener("click", ()=> { if (isLoggedIn()) mySkillsPhotoInput && mySkillsPhotoInput.click(); else { alert("Please log in to edit your profile."); showPage("login"); } });
  mySkillsChangePhoto && mySkillsChangePhoto.addEventListener("click", ()=> { if (isLoggedIn()) mySkillsPhotoInput && mySkillsPhotoInput.click(); else { alert("Please log in to edit your profile."); showPage("login"); } });
  changeAvatarBtn && changeAvatarBtn.addEventListener("click", ()=> { if (isLoggedIn()) avatarInput && avatarInput.click(); else { alert("Please log in to edit your profile."); showPage("login"); } });

  mySkillsRemovePhoto && mySkillsRemovePhoto.addEventListener("click", ()=> {
    if (!isLoggedIn()) { alert("Please log in to edit your profile."); showPage("login"); return; }
    if (!confirm("Remove profile photo?")) return;
    const userState = getCurrentUserState();
    userState.profile.avatar = "";
    saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    renderProfile();
    renderMySkillsProfileCard();
  });

<<<<<<< HEAD
  removeAvatarBtn && removeAvatarBtn.addEventListener("click", () => {
    if (!confirm("Remove profile photo?")) return;
    state.profile.avatar = "";
    saveState();
=======
  removeAvatarBtn && removeAvatarBtn.addEventListener("click", ()=> {
    if (!isLoggedIn()) { alert("Please log in to edit your profile."); showPage("login"); return; }
    if (!confirm("Remove profile photo?")) return;
    const userState = getCurrentUserState();
    userState.profile.avatar = "";
    saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    renderProfile();
    renderMySkillsProfileCard();
  });

<<<<<<< HEAD
  saveProfileBtn && saveProfileBtn.addEventListener("click", () => {
    state.profile.name = nameInput.value.trim() || "You";
    state.profile.meta = metaInput.value.trim();
    saveState();
    renderProfile();
    renderMySkillsProfileCard();
    profileMsg.textContent = "Profile saved.";
    setTimeout(() => profileMsg.textContent = "", 1500);
    refreshAll();
  });

  // my skills
  function renderMySkills() {
    mySkillsList.innerHTML = "";
    (state.mySkills || []).forEach((s, idx) => {
=======
  // Save profile (per-user)
  saveProfileBtn && saveProfileBtn.addEventListener("click", ()=> {
    if (!isLoggedIn()) {
      alert("Please log in to edit your profile.");
      showPage("login");
      return;
    }
    const userState = getCurrentUserState();
    userState.profile.name = nameInput.value.trim() || currentUser.toUpperCase();
    userState.profile.meta = metaInput.value.trim();
    saveStore();
    renderProfile();
    renderMySkillsProfileCard();
    profileMsg.textContent = "Profile saved.";
    setTimeout(()=>profileMsg.textContent="",1500);
    refreshAll();
  });

  // My skills (per-user)
  function renderMySkills(){
    mySkillsList.innerHTML = "";
    const userState = getCurrentUserState();
    const list = (userState && userState.mySkills) ? userState.mySkills : [];
    list.forEach((s, idx) => {
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      const li = document.createElement("li");
      li.textContent = s;
      li.dataset.idx = idx;
      li.title = "Click to remove";
      li.style.cursor = "pointer";
<<<<<<< HEAD
      li.addEventListener("click", () => {
        if (confirm(`Remove skill "${s}" from your profile?`)) {
          state.mySkills.splice(idx, 1);
          saveState();
=======
      li.addEventListener("click", ()=> {
        if (!isLoggedIn()) { alert("Please log in to edit skills."); showPage("login"); return; }
        if (confirm(`Remove skill "${s}" from your profile?`)) {
          userState.mySkills.splice(idx,1);
          saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
          renderMySkills();
          refreshAll();
        }
      });
      mySkillsList.appendChild(li);
    });
  }

<<<<<<< HEAD
  addSkillBtn && addSkillBtn.addEventListener("click", () => {
    const raw = skillInput.value;
    if (!raw.trim()) return;
    const normalized = normalizeSkill(raw);
    if (!state.mySkills.includes(normalized)) {
      state.mySkills.push(normalized);
      saveState();
=======
  addSkillBtn && addSkillBtn.addEventListener("click", ()=> {
    if (!isLoggedIn()) { alert("Please log in to add skills."); showPage("login"); return; }
    const raw = skillInput.value;
    if (!raw || !raw.trim()) return;
    const normalized = normalizeSkill(raw);
    const userState = getCurrentUserState();
    if (!userState.mySkills.includes(normalized)) {
      userState.mySkills.push(normalized);
      saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      skillInput.value = "";
      renderMySkills();
      refreshAll();
    } else {
      alert("You already have this skill.");
    }
  });

<<<<<<< HEAD
  // peers
  addPeerBtn && addPeerBtn.addEventListener("click", () => {
=======
  // Peers (global)
  addPeerBtn && addPeerBtn.addEventListener("click", ()=> {
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    const name = peerName.value.trim();
    const skillsText = peerSkills.value.trim();
    const company = peerCompany.value.trim();
    if (!skillsText) { alert("Please add at least one skill (comma separated)"); return; }
<<<<<<< HEAD
    const skills = skillsText.split(",").map(s => normalizeSkill(s)).filter(Boolean);
    state.peers.push({ name: name || "", skills, company });
    saveState();
=======
    const skills = skillsText.split(",").map(s=> normalizeSkill(s)).filter(Boolean);
    store.peers = store.peers || [];
    store.peers.push({ name: name || "", skills, company });
    saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    peerName.value = peerSkills.value = peerCompany.value = "";
    renderPeerList();
    refreshAll();
    showPage("peers");
  });

  function renderPeerList() {
    peerList.innerHTML = "";
<<<<<<< HEAD
    state.peers.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "peer-item";
      const name = p.name || `Peer ${i + 1}`;
      const skillsHtml = (p.skills || []).map(s => `<span style="display:inline-block;background:#eef2ff;padding:4px 8px;border-radius:6px;margin-right:6px">${escapeHtml(s)}</span>`).join("");
      div.innerHTML = `
        <div style="flex:0 0 auto; width:44px; height:44px; border-radius:8px; background:#f3f6fb; display:flex;align-items:center;justify-content:center;color:#0f172a;font-weight:600">
          ${(name[0] || 'P').toUpperCase()}
=======
    (store.peers || []).forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "peer-item";
      const name = p.name || `Peer ${i+1}`;
      const skillsHtml = (p.skills||[]).map(s => `<span style="display:inline-block;background:#eef2ff;padding:4px 8px;border-radius:6px;margin-right:6px">${escapeHtml(s)}</span>`).join("");
      div.innerHTML = `
        <div style="flex:0 0 auto; width:44px; height:44px; border-radius:8px; background:#f3f6fb; display:flex;align-items:center;justify-content:center;color:#0f172a;font-weight:600">
          ${ (name[0]||'P').toUpperCase() }
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
        </div>
        <div style="flex:1">
          <strong>${escapeHtml(name)}</strong>
          <div class="peer-meta">${escapeHtml(p.company || '')}</div>
          <div style="margin-top:8px">${skillsHtml}</div>
        </div>
        <div style="flex:0 0 auto; display:flex; flex-direction:column; gap:8px">
          <div style="display:flex; gap:8px;">
            <button data-i="${i}" class="recommendResourceBtn action secondary">Recommend Resource</button>
            <button data-i="${i}" class="removePeerBtn secondary">Remove</button>
          </div>
        </div>
      `;
      peerList.appendChild(div);
    });

<<<<<<< HEAD
    document.querySelectorAll(".recommendResourceBtn").forEach(btn => {
      btn.addEventListener("click", (ev) => {
        const i = parseInt(ev.target.dataset.i, 10);
        resPeerIndex.value = i;
        // populate skill dropdown with peer skills
        const skills = (state.peers[i].skills || []).slice();
        resSkill.innerHTML = "<option value=''>(any skill)</option>" + skills.map(s => `<option>${escapeHtml(s)}</option>`).join("");
=======
    document.querySelectorAll(".recommendResourceBtn").forEach(btn=>{
      btn.addEventListener("click", (ev)=>{
        const i = parseInt(ev.target.dataset.i, 10);
        resPeerIndex.value = i;
        const skills = (store.peers[i].skills || []).slice();
        resSkill.innerHTML = "<option value=''>(any skill)</option>" + skills.map(s=>`<option>${escapeHtml(s)}</option>`).join("");
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
        resTitle.value = "";
        resURL.value = "";
        resNote.value = "";
        resourceModal.style.display = "flex";
      });
    });

    document.querySelectorAll(".removePeerBtn").forEach(btn => btn.addEventListener("click", (ev) => {
<<<<<<< HEAD
      const i = parseInt(ev.target.dataset.i, 10);
      if (confirm("Remove this peer entry?")) {
        // remove any resources authored by this peer index
        state.resources = (state.resources || []).filter(r => r.peerIndex !== i);
        // adjust peerIndex on resources greater than i
        state.resources.forEach(r => { if (r.peerIndex > i) r.peerIndex = r.peerIndex - 1; });
        state.peers.splice(i, 1);
        saveState();
=======
      const i = parseInt(ev.target.dataset.i,10);
      if (confirm("Remove this peer entry?")) {
        store.resources = (store.resources || []).filter(r => r.peerIndex !== i);
        store.resources.forEach(r => { if (r.peerIndex > i) r.peerIndex = r.peerIndex - 1; });
        store.peers.splice(i,1);
        saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
        renderPeerList();
        refreshAll();
      }
    }));
  }

<<<<<<< HEAD
  // charts & analytics
  function initCharts() {
=======
  // Charts
  function initCharts(){
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    if (trendingChart) trendingChart.destroy();
    if (companyChart) companyChart.destroy();
    if (domainChart) domainChart.destroy();

    trendingChart = new Chart(trendingCtx, {
      type: "bar",
      data: { labels: [], datasets: [{ label: "Student Count", data: [], backgroundColor: Array(10).fill('#0f62fe') }] },
<<<<<<< HEAD
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });



    companyChart = new Chart(companyCtx, {
      type: "bar",
      data: { labels: [], datasets: [{ label: "Internship Count", data: [], backgroundColor: '#0f62fe' }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
=======
      options: { responsive: true, plugins:{legend:{display:false}} ,scales:{y:{beginAtZero:true}} }
    });

    companyChart = new Chart(companyCtx, {
      type: "bar",
      data: { labels: [], datasets: [{ label: "Internship Count", data: [], backgroundColor: '#0f62fe' }]},
      options:{responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    });

    if (domainCtx) {
      domainChart = new Chart(domainCtx, {
        type: "doughnut",
<<<<<<< HEAD
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#0f62fe', '#60a5fa', '#93c5fd', '#bfdbfe', '#e6f0ff', '#fde68a', '#fca5a5'] }] },
=======
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#0f62fe','#60a5fa','#93c5fd','#bfdbfe','#e6f0ff','#fde68a','#fca5a5'] }]},
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, padding: 8 } }
          }
        }
      });
    }
  }

<<<<<<< HEAD
  function refreshCharts() {
    // Trending
    const counts = aggregateSkillCounts();
    const top = topNFromCounts(counts, 10);
    trendingChart.data.labels = top.map(t => t[0]);
    trendingChart.data.datasets[0].data = top.map(t => t[1]);
    trendingChart.update();

    // timeline
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    timelineChart.data.labels = months;
    const trend = months.map((m, idx) => {
      const weight = top.reduce((acc, t) => acc + t[1], 0);
      return Math.max(1, Math.round(weight * (0.3 + idx * 0.15)));
    });
    timelineChart.data.datasets[0].data = trend;
    timelineChart.update();

    // Companies - only non-empty companies counted
    const compCounts = {};
    state.peers.forEach(p => {
      const c = (p.company || "").toString().trim();
      if (!c) return;
      compCounts[c] = (compCounts[c] || 0) + 1;
    });
    const compTop = Object.entries(compCounts).sort((a, b) => b[1] - a[1]);
    companyChart.data.labels = compTop.map(c => c[0]);
    companyChart.data.datasets[0].data = compTop.map(c => c[1]);
    companyChart.update();

    // Company donut
    if (domainChart) {
      domainChart.data.labels = compTop.map(c => c[0]);
      domainChart.data.datasets[0].data = compTop.map(c => c[1]);
      domainChart.update();
    }

    // Company list UI
    companyList.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "company-cards";
    Object.entries(compCounts).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
      const el = document.createElement("div");
      el.className = "company-card";
      const initials = (c.split(/\s+/).map(s => s[0] || '').slice(0, 2).join('')).toUpperCase();
      el.innerHTML = `<div class="company-avatar">${escapeHtml(initials || 'U')}</div>
=======
  function refreshCharts(){
    const counts = aggregateSkillCounts();
    const top = topNFromCounts(counts, 10);
    trendingChart.data.labels = top.map(t=>t[0]);
    trendingChart.data.datasets[0].data = top.map(t=>t[1]);
    trendingChart.update();

    const compCounts = {};
    (store.peers || []).forEach(p => {
      const c = (p.company || "").toString().trim();
      if (!c) return;
      compCounts[c] = (compCounts[c]||0)+1;
    });
    const compTop = Object.entries(compCounts).sort((a,b)=>b[1]-a[1]);
    companyChart.data.labels = compTop.map(c=>c[0]);
    companyChart.data.datasets[0].data = compTop.map(c=>c[1]);
    companyChart.update();

    if (domainChart) {
      domainChart.data.labels = compTop.map(c=>c[0]);
      domainChart.data.datasets[0].data = compTop.map(c=>c[1]);
      domainChart.update();
    }

    // Company list
    companyList.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "company-cards";
    Object.entries(compCounts).sort((a,b)=>b[1]-a[1]).forEach(([c,n]) => {
      const el = document.createElement("div");
      el.className = "company-card";
      const initials = (c.split(/\s+/).map(s=>s[0]||'').slice(0,2).join('')).toUpperCase();
      el.innerHTML = `<div class="company-avatar">${escapeHtml(initials||'U')}</div>
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
        <div style="flex:1">
          <div style="font-weight:700">${escapeHtml(c)}</div>
          <div style="font-size:13px;color:var(--muted)">${n} interns</div>
        </div>
      `;
      wrapper.appendChild(el);
    });
    if (wrapper.children.length === 0) {
      companyList.innerHTML = '<div class="muted">No company data available. Add company names to peer entries to populate internship trends.</div>';
    } else companyList.appendChild(wrapper);
  }

  // Skill gap
  function computeGap() {
<<<<<<< HEAD
    const counts = aggregateSkillCounts();
    const userSet = new Set((state.mySkills || []).map(s => normalizeSkill(s)));
    const arr = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const gap = arr.filter(([skill]) => !userSet.has(skill));
    return { all: arr, gap };
  }

  function renderGap() {
    const { all, gap } = computeGap();
    gapChipsEl.innerHTML = "";
    gap.slice(0, 20).forEach(([skill, count]) => {
      const chip = document.createElement("div");
      chip.className = "gap-chip";
      chip.innerHTML = `<div style="font-weight:600">${escapeHtml(skill)}</div><small>${count}</small>`;
      chip.addEventListener("click", () => {
        if (confirm(`Add "${skill}" to your skills?`)) {
          state.mySkills.push(skill);
          saveState();
=======
    const counts = {};
    (store.peers || []).forEach(p => (p.skills || []).forEach(s => {
      const sk = normalizeSkill(s);
      counts[sk] = (counts[sk] || 0) + 1;
    }));
    const userState = getCurrentUserState();
    if (userState && userState.mySkills) {
      userState.mySkills.forEach(s => {
        const sk = normalizeSkill(s);
        counts[sk] = (counts[sk] || 0) + 1;
      });
    }
    const all = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    const userSet = new Set((userState && userState.mySkills || []).map(s => normalizeSkill(s)));
    const gap = all.filter(([skill]) => !userSet.has(skill));
    return { all, gap };
  }

  function renderGap() {
    const {all,gap} = computeGap();
    gapChipsEl.innerHTML = "";
    gap.slice(0,20).forEach(([skill,count])=>{
      const chip = document.createElement("div");
      chip.className = "gap-chip";
      chip.innerHTML = `<div style="font-weight:600">${escapeHtml(skill)}</div><small>${count}</small>`;
      chip.addEventListener("click", ()=>{
        if (!isLoggedIn()) { alert("Please log in to add skills."); showPage("login"); return; }
        if (confirm(`Add "${skill}" to your skills?`)) {
          const userState = getCurrentUserState();
          userState.mySkills.push(skill);
          saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
          renderMySkills();
          renderGap();
          refreshCharts();
        }
      });
      gapChipsEl.appendChild(chip);
    });

    compareTableBody.innerHTML = "";
<<<<<<< HEAD
    all.forEach(([skill, count]) => {
      const tr = document.createElement("tr");
      const have = state.mySkills.includes(skill) ? "Yes" : "No";
=======
    all.forEach(([skill,count])=>{
      const tr = document.createElement("tr");
      const userState = getCurrentUserState();
      const have = (userState && userState.mySkills && userState.mySkills.includes(skill)) ? "Yes" : "No";
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      tr.innerHTML = `<td>${escapeHtml(skill)}</td><td>${count}</td><td>${have}</td>`;
      compareTableBody.appendChild(tr);
    });
  }

<<<<<<< HEAD
  // Resources rendering & filters
  function populateFilters() {
    // skills and peers that have resources
    const skillsSet = new Set();
    const peersSet = new Set();
    (state.resources || []).forEach(r => {
      if (r.skill) skillsSet.add(r.skill);
      if (r.author) peersSet.add(r.author);
    });

    // also include all peer names for peer filter
    state.peers.forEach((p, i) => {
      if (p.name) peersSet.add(p.name);
    });

    filterSkill.innerHTML = '<option value="">All Skills</option>' + Array.from(skillsSet).sort().map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    filterPeer.innerHTML = '<option value="">All Peers</option>' + Array.from(peersSet).sort().map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  }

  function renderResources() {
=======
  // Resources (global)
  function populateFilters() {
    const skillsSet = new Set();
    const peersSet = new Set();
    (store.resources||[]).forEach(r=>{
      if (r.skill) skillsSet.add(r.skill);
      if (r.author) peersSet.add(r.author);
    });
    (store.peers||[]).forEach((p)=> { if (p.name) peersSet.add(p.name); });
    filterSkill.innerHTML = '<option value="">All Skills</option>' + Array.from(skillsSet).sort().map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    filterPeer.innerHTML = '<option value="">All Peers</option>' + Array.from(peersSet).sort().map(p=>`<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  }

  function renderResources(){
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    populateFilters();
    const q = (resourceSearch.value || "").trim().toLowerCase();
    const skillF = filterSkill.value;
    const peerF = filterPeer.value;

<<<<<<< HEAD
    const list = (state.resources || []).slice().reverse().filter(r => {
=======
    const list = (store.resources || []).slice().reverse().filter(r=>{
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      if (skillF && r.skill !== skillF) return false;
      if (peerF && r.author !== peerF) return false;
      if (!q) return true;
      const hay = `${r.title} ${r.skill} ${r.author} ${r.note}`.toLowerCase();
      return hay.includes(q);
    });

    resourceGrid.innerHTML = "";
    if (list.length === 0) {
      const card = document.createElement("div");
      card.className = "resource-card";
      card.innerHTML = `<div class="title muted">No resources matched.</div><div class="note">Ask peers to recommend resources from the Peers page.</div>`;
      resourceGrid.appendChild(card);
      return;
    }

<<<<<<< HEAD
    list.forEach(r => {
=======
    list.forEach(r=>{
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      const card = document.createElement("div");
      card.className = "resource-card";
      card.innerHTML = `
        <div class="meta">
          <div>
            <div class="title">${escapeHtml(r.title || r.url)}</div>
            <div class="small">by ${escapeHtml(r.author || "Peer")} • recommended for <strong>${escapeHtml(r.skill || "General")}</strong></div>
          </div>
          <div style="text-align:right">
            <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">Open</a>
          </div>
        </div>
<<<<<<< HEAD
        ${r.note ? `<div class="note">${escapeHtml(r.note)}</div>` : ""}
=======
        ${ r.note ? `<div class="note">${escapeHtml(r.note)}</div>` : "" }
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      `;
      resourceGrid.appendChild(card);
    });
  }

  // resource modal handlers
<<<<<<< HEAD
  saveResourceBtn.addEventListener("click", () => {
    const i = parseInt(resPeerIndex.value, 10);
=======
  saveResourceBtn.addEventListener("click", ()=> {
    const i = parseInt(resPeerIndex.value,10);
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    const title = resTitle.value.trim();
    const url = resURL.value.trim();
    const note = resNote.value.trim();
    const skill = resSkill.value || "";

    if (!url) { alert("Please add a URL."); return; }

<<<<<<< HEAD
    const author = (state.peers[i] && state.peers[i].name) ? state.peers[i].name : `Peer ${i + 1}`;
    const resource = { title: title || url, url, note, skill, author, peerIndex: i, created: Date.now() };
    state.resources = state.resources || [];
    state.resources.push(resource);
    saveState();
=======
    const author = (store.peers[i] && store.peers[i].name) ? store.peers[i].name : `Peer ${i+1}`;
    const resource = { title: title || url, url, note, skill, author, peerIndex: i, created: Date.now() };
    store.resources = store.resources || [];
    store.resources.push(resource);
    saveStore();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    renderResources();
    resourceModal.style.display = "none";
    showPage("resources");
  });

<<<<<<< HEAD
  cancelResourceBtn.addEventListener("click", () => resourceModal.style.display = "none");

  // filters events
  [resourceSearch, filterSkill, filterPeer].forEach(el => {
    el && el.addEventListener("input", renderResources);
    el && el.addEventListener("change", renderResources);
  });
  resetFilters.addEventListener("click", () => {
=======
  cancelResourceBtn.addEventListener("click", ()=> resourceModal.style.display = "none");

  // filters events
  [resourceSearch, filterSkill, filterPeer].forEach(el=>{
    el && el.addEventListener("input", renderResources);
    el && el.addEventListener("change", renderResources);
  });
  resetFilters.addEventListener("click", ()=>{
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    resourceSearch.value = "";
    filterSkill.value = "";
    filterPeer.value = "";
    renderResources();
  });

  // helpers
<<<<<<< HEAD
  function escapeHtml(s) { if (!s) return ""; return s.toString().replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

  // refresh everything
  function refreshAll() {
=======
  function escapeHtml(s){ if(!s) return ""; return s.toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

  // UI access control for profile editing
  function updateProfileAccess() {
    const logged = isLoggedIn();
    if (nameInput) nameInput.disabled = !logged;
    if (metaInput) metaInput.disabled = !logged;
    if (avatarInput) avatarInput.disabled = !logged;
    if (saveProfileBtn) saveProfileBtn.disabled = !logged;

    if (mySkillsChangePhoto) mySkillsChangePhoto.disabled = !logged;
    if (mySkillsRemovePhoto) mySkillsRemovePhoto.disabled = !logged;
    if (mySkillsPhotoInput) mySkillsPhotoInput.disabled = !logged;

    if (changeAvatarBtn) changeAvatarBtn.disabled = !logged;
    if (removeAvatarBtn) removeAvatarBtn.disabled = !logged;

    const profileMsgEl = document.getElementById("profileMsg");
    if (!logged) {
      if (profileMsgEl) profileMsgEl.textContent = "Please log in to edit your profile.";
    } else {
      if (profileMsgEl) profileMsgEl.textContent = "";
    }
  }

  function updateAuthUI() {
    if (isLoggedIn()) {
      logoutBtn.style.display = "inline-block";
    } else {
      logoutBtn.style.display = "none";
    }
    updateProfileAccess();
  }

  // refresh orchestration
  function refreshAll(){
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    renderProfile();
    renderMySkills();
    renderMySkillsProfileCard();
    renderPeerList();
    renderGap();
    refreshCharts();
    renderResources();
<<<<<<< HEAD
  }

  function renderAll() {
=======
    updateAuthUI();
  }
  function renderAll(){
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
    renderProfile();
    renderMySkills();
    renderPeerList();
    initCharts();
    refreshAll();
  }

<<<<<<< HEAD
  // auth
  const authScreen = document.getElementById("authScreen");
  const authTitle = document.getElementById("authTitle");
  const authForm = document.getElementById("authForm");
  const authUsername = document.getElementById("authUsername");
  const authPassword = document.getElementById("authPassword");
  const authSwitch = document.getElementById("authSwitch");
  const authMsg = document.getElementById("authMsg");
  const appContainer = document.querySelector(".app");

  let isRegistering = false;
  let currentUser = localStorage.getItem("psi_user");
  let currentUserId = localStorage.getItem("psi_user_id");

  authSwitch.addEventListener("click", () => {
    isRegistering = !isRegistering;
    authTitle.textContent = isRegistering ? "Register" : "Login";
    authSwitch.textContent = isRegistering ? "Have an account? Login" : "Don't have an account? Register";
    authMsg.textContent = "";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("psi_user");
    localStorage.removeItem("psi_user_id");
    location.reload();
  });

  authForm.addEventListener("submit", async () => {
    authMsg.textContent = "";
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();
    if (!username || !password) return;

    // Email validation
    // Format: Starts with "01fe", ends with "@kletech.ac.in"
    const emailRegex = /^01fe.*@kletech\.ac\.in$/;
    if (!emailRegex.test(username)) {
      authMsg.textContent = "Email must start with '01fe' and end with '@kletech.ac.in'";
      return;
    }

    const endpoint = isRegistering ? '/api/register' : '/api/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        authMsg.textContent = data.error || "Action failed";
        return;
      }

      if (isRegistering) {
        // Switch to login
        alert("Registration successful! Please login.");
        isRegistering = false;
        authTitle.textContent = "Login";
        authSwitch.textContent = "Don't have an account? Register";
        authPassword.value = "";
      } else {
        // Login success
        currentUser = data.username;
        currentUserId = data.userId;
        localStorage.setItem("psi_user", currentUser);
        localStorage.setItem("psi_user_id", currentUserId);
        showApp();
      }
    } catch (e) {
      console.error("Auth Request Error:", e);
      authMsg.textContent = "Network error: " + e.message;
    }
  });

  function showApp() {
    authScreen.style.display = "none";
    appContainer.classList.add("active");
    loadState().then(() => {
      renderAll();
      if (state.profile.avatar) brandAvatar.src = state.profile.avatar;
    });
  }

  // init
  document.addEventListener("DOMContentLoaded", async () => {
    // Check if logged in
    if (currentUser && currentUserId) {
      showApp();
    } else {
      // Ensure auth screen is visible
      authScreen.style.display = "flex";
      appContainer.classList.remove("active");
    }
    // Else show auth screen (default)

    // close modal on clicking outside
    resourceModal.addEventListener("click", (e) => {
      if (e.target === resourceModal) resourceModal.style.display = "none";
    });

    window.addEventListener('resize', () => {
      if (trendingChart) trendingChart.resize();

=======
  // Login
  function validateLogin(username, password) {
    if (!username || !password) return false;
    const uname = username.trim();
    if (!USER_REGEX.test(uname)) return false;
    if (password !== REQUIRED_PASSWORD) return false;
    return true;
  }

  loginBtn && loginBtn.addEventListener("click", ()=> {
    const uraw = (loginUsername.value || "").trim();
    const p = (loginPassword.value || "");
    if (!validateLogin(uraw,p)) {
      alert("Invalid credentials. Enter your valid USN.");
      return;
    }
    const ukey = uraw.toLowerCase();
    ensureUser(ukey);
    setAuthUser(ukey);
    saveStore();
    loginMsg.textContent = "Login successful.";
    setTimeout(()=> loginMsg.textContent = "", 1200);
    showPage("myskills");
    renderAll();
  });

  logoutBtn && logoutBtn.addEventListener("click", ()=> {
    if (!confirm("Log out?")) return;
    clearAuth();
    showPage("login");
  });

  // init
  document.addEventListener("DOMContentLoaded", () => {
    if (!store.peers) store.peers = DEFAULT_PEERS.slice();
    if (!store.resources) store.resources = [];
    if (!currentUser) {
      showPage("login");
      if (loginUsername) loginUsername.focus();
    } else {
      ensureUser(currentUser);
      showPage("myskills");
    }

    renderAll();

    const userState = getCurrentUserState();
    if (userState && userState.profile && userState.profile.avatar) brandAvatar.src = userState.profile.avatar;
    else brandAvatar.src = "";

    resourceModal.addEventListener("click", (e)=> {
      if (e.target === resourceModal) resourceModal.style.display = "none";
    });

    window.addEventListener('resize', ()=> {
      if (trendingChart) trendingChart.resize();
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
      if (companyChart) companyChart.resize();
      if (domainChart) domainChart.resize();
    });
  });

<<<<<<< HEAD
  // expose showPage
=======
  // expose
>>>>>>> 778b5aeffcfb5f89c2fe2a0fcb72fa0d0d4cf856
  window.showPage = (id) => showPage(id);

})();
