// ================== DATA ==================
const standards = {
  '9001': { name: 'ISO 9001:2015', short: '9001' },
  '14001': { name: 'ISO 14001:2015', short: '14001' }
};

const credentials = {
  'admin9001': { standard: '9001', password: '9001' },
  'admin14001': { standard: '14001', password: '14001' }
};

let currentUser = null;
let currentStandardData = [];
let answers = {};
let currentClauseNum = '4';
let currentSearchTerm = '';
let loginProgressInterval = null;
let exportMetadata = {};

// ================== FULL STANDARD DATA ==================
function loadStandardData(standard) {
  if (standard === '14001') {
    return [
      { clause: "4", title: "Konteks Organisasi", items: [
        { id: "14001-4.1", req: "Organisasi harus memahami organisasi dan konteksnya.", eng: "The organization shall understand the organization and its context." },
        { id: "14001-4.2", req: "Organisasi harus memahami kebutuhan dan harapan pihak berkepentingan.", eng: "The organization shall understand the needs and expectations of interested parties." },
        { id: "14001-4.3", req: "Organisasi harus menetapkan ruang lingkup sistem manajemen lingkungan.", eng: "The organization shall determine the scope of the environmental management system." },
        { id: "14001-4.4", req: "Organisasi harus menetapkan, menerapkan, memelihara dan terus meningkatkan sistem manajemen lingkungan.", eng: "The organization shall establish, implement, maintain and continually improve the environmental management system." }
      ]},
      { clause: "5", title: "Kepemimpinan", items: [
        { id: "14001-5.1", req: "Manajemen puncak harus menunjukkan kepemimpinan dan komitmen terhadap sistem manajemen lingkungan.", eng: "Top management shall demonstrate leadership and commitment with respect to the environmental management system." },
        { id: "14001-5.2", req: "Manajemen puncak harus menetapkan kebijakan lingkungan.", eng: "Top management shall establish, implement and maintain an environmental policy." },
        { id: "14001-5.3", req: "Manajemen puncak harus memastikan peran, tanggung jawab dan wewenang telah ditetapkan.", eng: "Top management shall assign the roles, responsibilities and authorities relevant to the environmental management system." }
      ]},
      { clause: "6", title: "Perencanaan", items: [
        { id: "14001-6.1", req: "Organisasi harus merencanakan tindakan untuk mengatasi risiko dan peluang.", eng: "The organization shall determine the risks and opportunities that need to be addressed." },
        { id: "14001-6.2", req: "Organisasi harus menetapkan sasaran lingkungan dan perencanaan untuk mencapainya.", eng: "The organization shall establish environmental objectives and plans to achieve them." }
      ]},
      { clause: "7", title: "Dukungan", items: [
        { id: "14001-7.1", req: "Organisasi harus menyediakan sumber daya yang diperlukan.", eng: "The organization shall determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the environmental management system." },
        { id: "14001-7.2", req: "Organisasi harus memastikan kompetensi personel.", eng: "The organization shall ensure that persons doing work under its control have the necessary competence." },
        { id: "14001-7.3", req: "Organisasi harus memastikan kesadaran personel.", eng: "The organization shall ensure that persons doing work under its control are aware of the environmental policy, their contribution to the effectiveness of the environmental management system, and the implications of not conforming with the environmental management system requirements." },
        { id: "14001-7.4", req: "Organisasi harus menentukan komunikasi internal dan eksternal.", eng: "The organization shall determine the internal and external communications relevant to the environmental management system." },
        { id: "14001-7.5", req: "Organisasi harus mengendalikan informasi terdokumentasi.", eng: "The organization shall control the documented information required by the environmental management system and by this International Standard." }
      ]},
      { clause: "8", title: "Operasi", items: [
        { id: "14001-8.1", req: "Organisasi harus merencanakan dan mengendalikan operasi.", eng: "The organization shall plan, implement and control the processes needed to meet the requirements of the environmental management system." },
        { id: "14001-8.2", req: "Organisasi harus mempersiapkan dan merespons keadaan darurat.", eng: "The organization shall establish, implement and maintain the processes needed to prepare for and respond to potential emergency situations." }
      ]},
      { clause: "9", title: "Evaluasi Kinerja", items: [
        { id: "14001-9.1", req: "Organisasi harus memantau, mengukur, menganalisis dan mengevaluasi kinerja.", eng: "The organization shall monitor, measure, analyze and evaluate its environmental performance." },
        { id: "14001-9.2", req: "Organisasi harus melakukan audit internal.", eng: "The organization shall conduct internal audits at planned intervals." },
        { id: "14001-9.3", req: "Manajemen puncak harus melakukan tinjauan manajemen.", eng: "Top management shall review the organization's environmental management system at planned intervals." }
      ]},
      { clause: "10", title: "Peningkatan", items: [
        { id: "14001-10.1", req: "Organisasi harus terus meningkatkan kesesuaian sistem manajemen lingkungan.", eng: "The organization shall continually improve the suitability, adequacy and effectiveness of the environmental management system." },
        { id: "14001-10.2", req: "Organisasi harus menangani ketidaksesuaian dan tindakan korektif.", eng: "The organization shall react to nonconformities and take corrective action." },
        { id: "14001-10.3", req: "Organisasi harus terus meningkatkan kinerja sistem manajemen lingkungan.", eng: "The organization shall continually improve the suitability, adequacy and effectiveness of the environmental management system." }
      ]}
    ];
  }
  return [
    { clause: "4", title: "Konteks Organisasi", items: [
      { id: "9001-4.1", req: "Organisasi harus menentukan isu eksternal dan internal yang relevan dengan tujuannya dan memengaruhi kemampuannya mencapai hasil yang diinginkan.", eng: "The organization shall determine external and internal issues that are relevant to its purpose and its strategic direction and that affect its ability to achieve the intended result(s) of its quality management system." },
      { id: "9001-4.2", req: "Organisasi harus menentukan kebutuhan dan harapan pihak berkepentingan yang relevan dengan sistem manajemen mutu.", eng: "The organization shall determine the interested parties that are relevant to the quality management system and the requirements of these interested parties." },
      { id: "9001-4.3", req: "Organisasi harus menentukan ruang lingkup sistem manajemen mutu.", eng: "The organization shall determine the boundaries and applicability of the quality management system." },
      { id: "9001-4.4", req: "Organisasi harus menetapkan, menerapkan, memelihara, dan terus meningkatkan sistem manajemen mutu.", eng: "The organization shall establish, implement, maintain and continually improve a quality management system, including the processes needed and their interactions." }
    ]},
    { clause: "5", title: "Kepemimpinan", items: [
      { id: "9001-5.1", req: "Manajemen puncak harus menunjukkan kepemimpinan dan komitmen terhadap sistem manajemen mutu.", eng: "Top management shall demonstrate leadership and commitment with respect to the quality management system." },
      { id: "9001-5.2", req: "Manajemen puncak harus menetapkan, menerapkan, dan memelihara kebijakan mutu.", eng: "Top management shall establish, implement and maintain a quality policy." },
      { id: "9001-5.3", req: "Manajemen puncak harus memastikan tanggung jawab dan wewenang telah ditetapkan.", eng: "Top management shall ensure that the responsibilities and authorities for relevant roles are assigned, communicated and understood." }
    ]},
    { clause: "6", title: "Perencanaan", items: [
      { id: "9001-6.1", req: "Organisasi harus merencanakan tindakan untuk mengatasi risiko dan peluang.", eng: "The organization shall plan actions to address risks and opportunities." },
      { id: "9001-6.2", req: "Organisasi harus menetapkan sasaran mutu dan rencana untuk mencapainya.", eng: "The organization shall establish quality objectives at relevant functions, levels and processes." }
    ]},
    { clause: "7", title: "Dukungan", items: [
      { id: "9001-7.1", req: "Organisasi harus menentukan dan menyediakan sumber daya yang diperlukan.", eng: "The organization shall determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the quality management system." },
      { id: "9001-7.2", req: "Organisasi harus memastikan bahwa personel yang melakukan pekerjaan kompeten.", eng: "The organization shall ensure that the persons doing work under its control are competent on the basis of appropriate education, training or experience." },
      { id: "9001-7.3", req: "Organisasi harus memastikan kesadaran personel terhadap tugas dan kebijakan mutu.", eng: "The organization shall ensure that persons doing work under its control are aware of the quality policy, relevant quality objectives, their contribution to the effectiveness of the quality management system and the implications of not conforming with the quality management system requirements." },
      { id: "9001-7.4", req: "Organisasi harus menentukan kebutuhan komunikasi internal dan eksternal.", eng: "The organization shall determine the internal and external communications relevant to the quality management system." },
      { id: "9001-7.5", req: "Organisasi harus mengendalikan informasi terdokumentasi yang diperlukan.", eng: "The organization shall control the documented information required by the quality management system and by this International Standard." }
    ]},
    { clause: "8", title: "Operasi", items: [
      { id: "9001-8.1", req: "Organisasi harus merencanakan, melaksanakan dan mengendalikan proses yang diperlukan untuk memenuhi persyaratan.", eng: "The organization shall plan, implement and control the processes needed to meet the requirements for the provision of products and services." },
      { id: "9001-8.2", req: "Organisasi harus berkomunikasi dengan pelanggan mengenai produk dan jasa.", eng: "The organization shall communicate with customers regarding requirements for products and services." },
      { id: "9001-8.3", req: "Organisasi harus merancang dan mengembangkan produk dan jasa.", eng: "The organization shall establish, implement and maintain a design and development process." },
      { id: "9001-8.4", req: "Organisasi harus mengendalikan proses, produk dan jasa yang disediakan oleh pihak eksternal.", eng: "The organization shall ensure that externally provided processes, products and services conform to requirements." },
      { id: "9001-8.5", req: "Organisasi harus mengendalikan produksi dan penyediaan jasa.", eng: "The organization shall implement production and service provision under controlled conditions." },
      { id: "9001-8.6", req: "Organisasi harus melaksanakan release produk dan jasa.", eng: "The organization shall implement planned arrangements to verify that the product and service requirements have been met." },
      { id: "9001-8.7", req: "Organisasi harus mengendalikan output yang tidak sesuai.", eng: "The organization shall ensure that nonconforming outputs are identified and controlled." }
    ]},
    { clause: "9", title: "Evaluasi Kinerja", items: [
      { id: "9001-9.1", req: "Organisasi harus memantau, mengukur, menganalisis, dan mengevaluasi kinerja sistem manajemen mutu.", eng: "The organization shall monitor, measure, analyze and evaluate the effectiveness of the quality management system." },
      { id: "9001-9.2", req: "Organisasi harus melakukan audit internal pada interval yang direncanakan.", eng: "The organization shall conduct internal audits at planned intervals to provide information on whether the quality management system conforms to requirements." },
      { id: "9001-9.3", req: "Manajemen puncak harus meninjau sistem manajemen mutu pada interval yang direncanakan.", eng: "Top management shall review the organization's quality management system at planned intervals." }
    ]},
    { clause: "10", title: "Peningkatan", items: [
      { id: "9001-10.1", req: "Organisasi harus menentukan peluang untuk peningkatan dan menerapkannya.", eng: "The organization shall determine and select opportunities for improvement and implement necessary actions." },
      { id: "9001-10.2", req: "Organisasi harus bereaksi terhadap ketidaksesuaian dan mengambil tindakan korektif.", eng: "The organization shall react to nonconformities and take corrective action." },
      { id: "9001-10.3", req: "Organisasi harus terus meningkatkan kesesuaian, kecukupan, dan efektivitas sistem manajemen mutu.", eng: "The organization shall continually improve the suitability, adequacy and effectiveness of the quality management system." }
    ]}
  ];
}

// ================== ROBUST RESET LOGIN ==================
function resetLoginButton() {
  if (loginProgressInterval) {
    clearInterval(loginProgressInterval);
    loginProgressInterval = null;
  }
  const btn = document.getElementById('login-btn');
  const content = document.getElementById('login-content');
  btn.disabled = false;
  content.innerHTML = `<span class="flex items-center justify-center w-full">🚀 Masuk</span>`;
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

// ================== LOGIN ==================
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const btn = document.getElementById('login-btn');
  const content = document.getElementById('login-content');

  if (loginProgressInterval) clearInterval(loginProgressInterval);

  btn.disabled = true;
  content.innerHTML = `
    <div class="flex flex-col items-center w-full gap-2">
      <div class="flex items-center justify-between w-full text-sm font-medium">
        <span>Memverifikasi...</span>
        <span id="login-percent">0%</span>
      </div>
      <div class="w-full h-2 bg-white/30 rounded-full overflow-hidden">
        <div id="login-progress-bar" class="h-full bg-white transition-all duration-100" style="width: 0%"></div>
      </div>
    </div>
  `;

  let progress = 0;
  const progressBar = document.getElementById('login-progress-bar');
  const percentText = document.getElementById('login-percent');

  loginProgressInterval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;
    percentText.textContent = `${Math.floor(progress)}%`;

    if (progress >= 100) {
      clearInterval(loginProgressInterval);
      loginProgressInterval = null;
      setTimeout(() => {
        if (credentials[username] && credentials[username].password === password) {
          currentUser = username;
          currentStandardData = loadStandardData(credentials[username].standard);
          answers = JSON.parse(localStorage.getItem(`iso_audit_${currentUser}`)) || {};

          document.getElementById('login-screen').classList.add('hidden');
          document.getElementById('main-app').classList.remove('hidden');

          document.getElementById('current-standard').textContent = standards[credentials[username].standard].name;
          document.getElementById('mobile-standard').textContent = standards[credentials[username].standard].name;

          currentSearchTerm = '';
          document.getElementById('search-input').value = '';
          document.getElementById('search-clear-btn').classList.add('hidden');

          renderSidebar();
          loadClause('4');
          loadDarkModePreference();
          resetLoginButton();
        } else {
          content.innerHTML = `<span class="flex items-center justify-center text-red-200">❌ Login Gagal!</span>`;
          setTimeout(() => { resetLoginButton(); }, 1800);
        }
      }, 300);
    }
  }, 45);
});

// ================== SIDEBAR ==================
function renderSidebar() {
  let html = '';
  currentStandardData.forEach(clause => {
    const totalItems = clause.items.length;
    const answered = clause.items.filter(item => answers[item.id]?.status).length;
    const percent = totalItems ? Math.round((answered / totalItems) * 100) : 0;
    html += `
      <button onclick="loadClause('${clause.clause}'); if(window.innerWidth < 1024) toggleMobileMenu();" 
              class="clause-btn w-full text-left p-6 rounded-3xl glass hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all ${clause.clause === currentClauseNum ? 'bg-blue-600 text-white shadow-lg' : ''}">
        <div class="flex justify-between items-start">
          <div>
            <span class="font-mono text-2xl font-black">Clause ${clause.clause}</span>
            <p class="text-sm mt-1">${clause.title}</p>
          </div>
          <div class="text-right">
            <span class="text-3xl">${clause.clause === currentClauseNum ? '🎯' : '📋'}</span>
            <p class="text-xs mt-2 font-bold ${percent === 100 ? 'text-emerald-500' : 'text-blue-500'}">${answered}/${totalItems} (${percent}%)</p>
          </div>
        </div>
      </button>`;
  });
  document.getElementById('sidebar-content').innerHTML = html;
  document.getElementById('mobile-sidebar-content').innerHTML = html;
  updateSummary();
}

function updateSummary() {
  let compliant = 0, noncompliant = 0, pending = 0;
  currentStandardData.forEach(clause => {
    clause.items.forEach(item => {
      const status = answers[item.id]?.status;
      if (status === 'Compliant') compliant++;
      else if (status === 'Non-Compliant') noncompliant++;
      else pending++;
    });
  });
  document.getElementById('summary-compliant').textContent = compliant;
  document.getElementById('summary-noncompliant').textContent = noncompliant;
  document.getElementById('summary-pending').textContent = pending;
  document.getElementById('mobile-summary-compliant').textContent = compliant;
  document.getElementById('mobile-summary-noncompliant').textContent = noncompliant;
  document.getElementById('mobile-summary-pending').textContent = pending;
}

// ================== SEARCH ==================
function handleSearchInput() {
  const input = document.getElementById('search-input');
  currentSearchTerm = input.value.toLowerCase().trim();
  const clearBtn = document.getElementById('search-clear-btn');
  
  if (currentSearchTerm === '') {
    clearBtn.classList.add('hidden');
  } else {
    clearBtn.classList.remove('hidden');
  }

  const suggestionsContainer = document.getElementById('search-suggestions');
  if (currentSearchTerm === '') {
    suggestionsContainer.style.display = 'none';
    loadClause(currentClauseNum);
    return;
  }

  let html = '';
  let hasResult = false;
  currentStandardData.forEach(clause => {
    const matchingItems = clause.items.filter(item => 
      item.req.toLowerCase().includes(currentSearchTerm) ||
      item.eng.toLowerCase().includes(currentSearchTerm) ||
      item.id.toLowerCase().includes(currentSearchTerm)
    );
    if (matchingItems.length > 0) {
      hasResult = true;
      html += `<div class="px-4 py-2 text-xs font-medium text-blue-600 border-b border-[var(--border-color)]">${clause.title} (Clause ${clause.clause})</div>`;
      matchingItems.forEach(item => {
        html += `
          <div onclick="selectSuggestion('${clause.clause}')" 
               class="px-6 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer flex items-center gap-3 border-b border-[var(--border-color)] last:border-none">
            <span class="font-mono text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-xl">${item.id}</span>
            <span class="text-sm line-clamp-2">${item.req}</span>
          </div>`;
      });
    }
  });
  if (!hasResult) html = `<div class="px-6 py-8 text-center text-[var(--text-secondary)]">Tidak ada hasil yang cocok</div>`;
  suggestionsContainer.innerHTML = html;
  suggestionsContainer.style.display = 'block';
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  currentSearchTerm = '';
  document.getElementById('search-clear-btn').classList.add('hidden');
  document.getElementById('search-suggestions').style.display = 'none';
  loadClause(currentClauseNum);
}

function selectSuggestion(clauseNum) {
  document.getElementById('search-suggestions').style.display = 'none';
  loadClause(clauseNum);
}

// ================== LOAD CLAUSE ==================
function loadClause(clauseNum) {
  currentClauseNum = clauseNum;
  const clause = currentStandardData.find(c => c.clause === clauseNum);
  if (!clause) return;

  document.getElementById('header').innerHTML = `
    <h2 class="text-5xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Clause ${clause.clause}</h2>
    <p class="text-2xl lg:text-3xl mt-4" style="color: var(--text-secondary)">${clause.title}</p>
  `;

  const filteredItems = clause.items.filter(item => {
    if (!currentSearchTerm) return true;
    return item.req.toLowerCase().includes(currentSearchTerm) || item.eng.toLowerCase().includes(currentSearchTerm) || item.id.toLowerCase().includes(currentSearchTerm);
  });

  const html = filteredItems.map((item, idx) => {
    const ans = answers[item.id] || {};
    const file = ans.evidenceFile || {};
    let fileHTML = '';
    if (file.data) {
      const isImage = file.type.startsWith('image/');
      fileHTML = `
        <div class="mt-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
          ${isImage ? `<img src="${file.data}" class="h-12 w-12 object-cover rounded-xl">` : `<i class="fas fa-file-${file.type.includes('pdf')?'pdf':'alt'} text-3xl text-blue-500"></i>`}
          <div class="flex-1 text-sm">
            <p class="font-medium">${file.name}</p>
            <p class="text-xs text-[var(--text-secondary)]">${(file.size/1024).toFixed(1)} KB</p>
          </div>
          <button onclick="removeEvidenceFile('${item.id}'); event.stopImmediatePropagation();" class="text-red-500 hover:text-red-600">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
    }
    return `
      <div class="item-card glass p-8 lg:p-12 rounded-3xl shadow-xl border border-[var(--border-color)]">
        <div class="flex gap-8">
          <div class="w-16 h-16 flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-3xl flex items-center justify-center text-4xl font-black text-blue-600">${idx+1}</div>
          <div class="flex-1">
            <h3 class="text-2xl font-semibold leading-tight mb-4">${item.req}</h3>
            <p class="text-sm text-[var(--text-secondary)] italic mb-8">${item.eng}</p>
            
            <div class="flex flex-wrap gap-4 mb-8">
              <span class="px-6 py-3 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-medium">${item.id}</span>
              ${ans.status ? 
                `<span class="px-6 py-3 rounded-2xl text-sm font-bold ${ans.status==='Compliant' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}">
                  ${ans.status === 'Compliant' ? '✅ Compliant' : '❌ Non-Compliant'}
                </span>` : 
                `<span class="px-6 py-3 border-2 border-dashed border-gray-400 rounded-2xl text-sm">⏳ Belum Dinilai</span>`
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button onclick="setStatus('${item.id}', 'Compliant')" class="status-btn py-6 rounded-2xl border-2 border-emerald-500 font-bold ${ans.status==='Compliant' ? 'bg-emerald-500 text-white' : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}">✅ Compliant</button>
              <button onclick="setStatus('${item.id}', 'Non-Compliant')" class="status-btn py-6 rounded-2xl border-2 border-red-500 font-bold ${ans.status==='Non-Compliant' ? 'bg-red-500 text-white' : 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'}">❌ Non-Compliant</button>
            </div>

            <textarea id="evidence-${item.id}" class="w-full p-4 rounded-2xl border border-[var(--border-color)] focus:border-blue-500 outline-none text-sm resize-y min-h-[100px] mb-6"
              placeholder="Catatan / Bukti audit / Temuan (opsional)" 
              onchange="saveEvidence('${item.id}', this.value)">${ans.evidence || ''}</textarea>

            <div class="upload-area rounded-3xl p-6 text-center cursor-pointer" onclick="document.getElementById('file-upload-${item.id}').click()">
              <input type="file" id="file-upload-${item.id}" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" class="hidden" onchange="handleFileUpload('${item.id}', this)">
              <i class="fas fa-cloud-upload-alt text-4xl text-blue-500 mb-3"></i>
              <p class="font-medium">Upload Evidence</p>
              <p class="text-xs text-[var(--text-secondary)]">PDF, JPG, PNG, Word, Excel (max 500 KB)</p>
            </div>
            ${fileHTML}
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('questions').innerHTML = html || `<div class="text-center py-20 text-[var(--text-secondary)]">Tidak ada hasil pencarian yang cocok.</div>`;
  renderSidebar();
  updateProgress();
}

function handleFileUpload(id, input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 500 * 1024) {
    showFileErrorModal();
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    if (!answers[id]) answers[id] = {};
    answers[id].evidenceFile = {
      name: file.name,
      type: file.type,
      size: file.size,
      data: e.target.result
    };
    localStorage.setItem(`iso_audit_${currentUser}`, JSON.stringify(answers));
    loadClause(currentClauseNum);
  };
  reader.readAsDataURL(file);
}

function removeEvidenceFile(id) {
  if (answers[id]) delete answers[id].evidenceFile;
  localStorage.setItem(`iso_audit_${currentUser}`, JSON.stringify(answers));
  loadClause(currentClauseNum);
}

function setStatus(id, status) {
  answers[id] = answers[id] || {};
  answers[id].status = status;
  answers[id].timestamp = new Date().toISOString();
  localStorage.setItem(`iso_audit_${currentUser}`, JSON.stringify(answers));
  loadClause(currentClauseNum);
  showNotification(`✅ Status ${status} berhasil disimpan`, "success");
}

function saveEvidence(id, text) {
  if (!answers[id]) answers[id] = {};
  answers[id].evidence = text;
  localStorage.setItem(`iso_audit_${currentUser}`, JSON.stringify(answers));
}

// ================== PROGRESS ==================
function updateProgress() {
  const total = currentStandardData.reduce((sum, c) => sum + c.items.length, 0);
  const answered = Object.keys(answers).filter(k => answers[k]?.status).length;
  const percent = total ? Math.round((answered / total) * 100) : 0;
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').textContent = percent + '%';
  document.getElementById('mobile-progress-bar').style.width = percent + '%';
  document.getElementById('mobile-progress-text').textContent = percent + '%';
}

// ================== EXPORT ==================
function showExportModal() {
  const modal = document.getElementById('export-modal');
  modal.classList.remove('hidden');
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('export-audit-date').value = today;
}

function hideExportModal() {
  document.getElementById('export-modal').classList.add('hidden');
}

function startPDFExport() {
  const auditDateStr = document.getElementById('export-audit-date').value;
  const auditDate = auditDateStr ? new Date(auditDateStr) : new Date();
  
  const dueDate = new Date(auditDate);
  dueDate.setDate(dueDate.getDate() + 45);

  exportMetadata = {
    auditor: document.getElementById('export-auditor').value || 'Auditor',
    auditee: document.getElementById('export-auditee').value || '-',
    division: document.getElementById('export-division').value || '-',
    auditDate: auditDate.toLocaleDateString('id-ID'),
    dueDate: dueDate.toLocaleDateString('id-ID')
  };
  hideExportModal();
  generatePDF();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 20;

  doc.setFontSize(22);
  doc.text("LAPORAN AUDIT ISO", 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(12);
  doc.text(`Auditor     : ${exportMetadata.auditor}`, 20, y);
  doc.text(`Auditee     : ${exportMetadata.auditee}`, 20, y + 7);
  doc.text(`Divisi/Unit : ${exportMetadata.division}`, 20, y + 14);
  doc.text(`Tanggal Audit : ${exportMetadata.auditDate}`, 20, y + 21);
  doc.text(`Due Date      : ${exportMetadata.dueDate} (45 hari kerja)`, 20, y + 28);
  y += 40;

  let compliant = 0, noncompliant = 0;
  currentStandardData.forEach(clause => {
    clause.items.forEach(item => {
      const status = answers[item.id]?.status;
      if (status === 'Compliant') compliant++;
      else if (status === 'Non-Compliant') noncompliant++;
    });
  });
  doc.setFontSize(14);
  doc.text(`Ringkasan: ${compliant} Compliant | ${noncompliant} Non-Compliant`, 20, y);
  y += 15;

  const standardCode = currentUser.includes('9001') ? '9001' : '14001';
  const standard = standards[standardCode];

  currentStandardData.forEach(clause => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.text(`Clause ${clause.clause} - ${clause.title}`, 20, y);
    y += 12;

    clause.items.forEach(item => {
      if (y > 270) { doc.addPage(); y = 20; }
      const ans = answers[item.id] || {};
      const status = ans.status || "Belum Dinilai";
      const textEvidence = ans.evidence || "-";

      doc.setFontSize(11);
      doc.text(`• ${item.id}`, 25, y);
      doc.text(status, 170, y, { align: "right" });
      y += 8;

      doc.setFontSize(10);
      doc.text(`Catatan: ${textEvidence.substring(0, 90)}${textEvidence.length > 90 ? '...' : ''}`, 30, y);
      y += 8;

      if (ans.evidenceFile && ans.evidenceFile.data && ans.evidenceFile.type.startsWith('image/')) {
        try {
          doc.addImage(ans.evidenceFile.data, 'JPEG', 30, y, 80, 50);
          y += 55;
        } catch(e) {}
      } else if (ans.evidenceFile) {
        doc.text(`File: ${ans.evidenceFile.name}`, 30, y);
        y += 8;
      }
      y += 5;
    });
    y += 12;
  });

  doc.save(`ISO_Audit_Report_${standard.short}_${new Date().toISOString().slice(0,10)}.pdf`);
  showNotification("📄 Laporan PDF berhasil diunduh!", "success");
  exportMetadata = {};
}

// ================== DARK MODE ==================
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    document.getElementById('theme-icon').className = 'fas fa-moon text-2xl';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    document.getElementById('theme-icon').className = 'fas fa-sun text-2xl';
  }
}

function loadDarkModePreference() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-icon').className = 'fas fa-sun text-2xl';
  }
}

// ================== MOBILE MENU ==================
function toggleMobileMenu() {
  const sidebar = document.getElementById('mobile-sidebar');
  sidebar.classList.toggle('hidden');
  if (!sidebar.classList.contains('hidden')) {
    setTimeout(() => sidebar.classList.add('open'), 10);
  } else {
    sidebar.classList.remove('open');
  }
}

// ================== LOGOUT ==================
function showLogoutModal() {
  document.getElementById('logout-modal').classList.remove('hidden');
}

function hideLogoutModal() {
  document.getElementById('logout-modal').classList.add('hidden');
}

function confirmLogout() {
  const btn = document.getElementById('logout-confirm-btn');
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
  btn.disabled = true;

  setTimeout(() => {
    if (currentUser) {
      localStorage.removeItem(`iso_audit_${currentUser}`);
    }
    currentUser = null;
    hideLogoutModal();
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    
    resetLoginButton();
    currentSearchTerm = '';
    document.getElementById('search-input').value = '';
    document.getElementById('search-clear-btn').classList.add('hidden');
    document.getElementById('search-suggestions').style.display = 'none';
    
    showNotification("✅ Logout berhasil!", "success");
  }, 1100);
}

// ================== FILE ERROR MODAL ==================
function showFileErrorModal() {
  document.getElementById('file-error-modal').classList.remove('hidden');
}

function hideFileErrorModal() {
  document.getElementById('file-error-modal').classList.add('hidden');
}

// ================== NOTIFICATION ==================
function showNotification(message, type = "success") {
  const notif = document.createElement('div');
  notif.className = `fixed bottom-6 right-6 px-8 py-4 rounded-2xl shadow-2xl text-white font-medium z-[3000] ${type === "success" ? "bg-emerald-500" : "bg-blue-500"}`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 4000);
}