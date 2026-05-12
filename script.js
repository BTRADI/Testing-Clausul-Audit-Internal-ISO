const standards = {
  '9001': { name: '9001:2015', short: '9001' },
  '14001': { name: '14001:2015', short: '14001' }
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

  // ==================== ISO 9001:2015 FULL DATA (sesuai dokumen Word) ====================
  return [
    { clause: "4", title: "Konteks Organisasi", items: [
      { id: "9001-4.1", req: "Memahami Organisasi dan Konteksnya", eng: "Understanding the Organization and its Context" },
      { id: "9001-4.2", req: "Memahami Kebutuhan dan Harapan Pihak Berkepentingan", eng: "Understanding the Needs and Expectations of Interested Parties" },
      { id: "9001-4.3", req: "Menentukan Ruang Lingkup Sistem Manajemen Mutu", eng: "Determining the Scope of the Quality Management System" },
      { id: "9001-4.4", req: "Sistem Manajemen Mutu dan Proses-Prosesnya", eng: "Quality Management System and its Processes" }
    ]},
    { clause: "5", title: "Kepemimpinan", items: [
      { id: "9001-5.1", req: "Kepemimpinan dan Komitmen", eng: "Leadership and Commitment" },
      { id: "9001-5.1.1", req: "Umum", eng: "General" },
      { id: "9001-5.1.2", req: "Fokus pada Pelanggan", eng: "Customer Focus" },
      { id: "9001-5.2", req: "Kebijakan", eng: "Policy" },
      { id: "9001-5.2.1", req: "Menetapkan Kebijakan Mutu", eng: "Establishing the Quality Policy" },
      { id: "9001-5.2.2", req: "Mengkomunikasikan Kebijakan Mutu", eng: "Communicating the Quality Policy" },
      { id: "9001-5.3", req: "Peran, Tanggung Jawab, dan Wewenang Organisasi", eng: "Organizational Roles, Responsibilities and Authorities" }
    ]},
    { clause: "6", title: "Perencanaan", items: [
      { id: "9001-6.1", req: "Tindakan untuk Mengatasi Risiko dan Peluang", eng: "Actions to Address Risks and Opportunities" },
      { id: "9001-6.2", req: "Sasaran Mutu dan Perencanaan untuk Mencapainya", eng: "Quality Objectives and Planning to Achieve Them" },
      { id: "9001-6.3", req: "Perencanaan Perubahan", eng: "Planning of Changes" }
    ]},
    { clause: "7", title: "Dukungan", items: [
      { id: "9001-7.1", req: "Sumber Daya", eng: "Resources" },
      { id: "9001-7.1.1", req: "Umum", eng: "General" },
      { id: "9001-7.1.2", req: "Orang / Personel", eng: "People" },
      { id: "9001-7.1.3", req: "Infrastruktur", eng: "Infrastructure" },
      { id: "9001-7.1.4", req: "Lingkungan untuk Operasional Proses", eng: "Environment for the Operation of Processes" },
      { id: "9001-7.1.5", req: "Sumber Daya Pemantauan dan Pengukuran", eng: "Monitoring and Measuring Resources" },
      { id: "9001-7.1.5.1", req: "Umum", eng: "General" },
      { id: "9001-7.1.5.2", req: "Ketertelusuran Pengukuran", eng: "Measurement Traceability" },
      { id: "9001-7.1.6", req: "Pengetahuan Organisasi", eng: "Organizational Knowledge" },
      { id: "9001-7.2", req: "Kompetensi", eng: "Competence" },
      { id: "9001-7.3", req: "Kesadaran", eng: "Awareness" },
      { id: "9001-7.4", req: "Komunikasi", eng: "Communication" },
      { id: "9001-7.5", req: "Informasi Terdokumentasi", eng: "Documented Information" },
      { id: "9001-7.5.1", req: "Umum", eng: "General" },
      { id: "9001-7.5.2", req: "Membuat dan Memperbarui", eng: "Creating and Updating" },
      { id: "9001-7.5.3", req: "Pengendalian Informasi Terdokumentasi", eng: "Control of Documented Information" }
    ]},
    { clause: "8", title: "Operasional", items: [
      { id: "9001-8.1", req: "Perencanaan dan Pengendalian Operasional", eng: "Operational Planning and Control" },
      { id: "9001-8.2", req: "Persyaratan Produk dan Jasa", eng: "Requirements for Products and Services" },
      { id: "9001-8.2.1", req: "Komunikasi Pelanggan", eng: "Customer Communication" },
      { id: "9001-8.2.2", req: "Menentukan Persyaratan Produk dan Jasa", eng: "Determining Requirements for Products and Services" },
      { id: "9001-8.2.3", req: "Tinjauan Persyaratan Produk dan Jasa", eng: "Review of Requirements for Products and Services" },
      { id: "9001-8.2.4", req: "Perubahan Persyaratan Produk dan Jasa", eng: "Changes to Requirements for Products and Services" },
      { id: "9001-8.3", req: "Desain dan Pengembangan Produk dan Jasa", eng: "Design and Development of Products and Services" },
      { id: "9001-8.4", req: "Pengendalian Proses, Produk, dan Jasa yang Disediakan Eksternal", eng: "Control of Externally Provided Processes, Products and Services" },
      { id: "9001-8.5", req: "Produksi dan Penyediaan Jasa", eng: "Production and Service Provision" },
      { id: "9001-8.5.1", req: "Pengendalian Produksi dan Penyediaan Jasa", eng: "Control of Production and Service Provision" },
      { id: "9001-8.5.2", req: "Identifikasi dan Ketertelusuran", eng: "Identification and Traceability" },
      { id: "9001-8.5.3", req: "Properti Milik Pelanggan atau Penyedia Eksternal", eng: "Property Belonging to Customers or External Providers" },
      { id: "9001-8.5.4", req: "Pemeliharaan", eng: "Preservation" },
      { id: "9001-8.5.5", req: "Aktivitas Pasca Penyerahan", eng: "Post-delivery Activities" },
      { id: "9001-8.5.6", req: "Pengendalian Perubahan", eng: "Control of Changes" },
      { id: "9001-8.6", req: "Pelepasan Produk dan Jasa", eng: "Release of Products and Services" },
      { id: "9001-8.7", req: "Pengendalian Output Tidak Sesuai", eng: "Control of Nonconforming Outputs" }
    ]},
    { clause: "9", title: "Evaluasi Kinerja", items: [
      { id: "9001-9.1", req: "Pemantauan, Pengukuran, Analisis, dan Evaluasi", eng: "Monitoring, Measurement, Analysis and Evaluation" },
      { id: "9001-9.1.1", req: "Umum", eng: "General" },
      { id: "9001-9.1.2", req: "Kepuasan Pelanggan", eng: "Customer Satisfaction" },
      { id: "9001-9.1.3", req: "Analisis dan Evaluasi", eng: "Analysis and Evaluation" },
      { id: "9001-9.2", req: "Audit Internal", eng: "Internal Audit" },
      { id: "9001-9.3", req: "Tinjauan Manajemen", eng: "Management Review" }
    ]},
    { clause: "10", title: "Peningkatan", items: [
      { id: "9001-10.1", req: "Umum", eng: "General" },
      { id: "9001-10.2", req: "Ketidaksesuaian dan Tindakan Perbaikan", eng: "Nonconformity and Corrective Action" },
      { id: "9001-10.3", req: "Peningkatan Berkelanjutan", eng: "Continual Improvement" }
    ]}
  ];
}

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
          loadClause('4', true);
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

function renderSidebar() {
  let html = '';
  currentStandardData.forEach(clause => {
    const totalItems = clause.items.length;
    const answered = clause.items.filter(item => answers[item.id]?.status).length;
    const percent = totalItems ? Math.round((answered / totalItems) * 100) : 0;
    html += `
      <button onclick="loadClause('${clause.clause}', true); if(window.innerWidth < 1024) toggleMobileMenu();" 
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
  loadClause(clauseNum, true);
}

function loadClause(clauseNum, scrollToTop = false) {
  currentClauseNum = clauseNum;
  const clause = currentStandardData.find(c => c.clause === clauseNum);
  if (!clause) return;

  document.getElementById('header').innerHTML = `
    <h2 class="text-5xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Clause ${clause.clause}</h2>
    <p class="text-2xl lg:text-3xl mt-4" style="color: var(--text-secondary)">${clause.title}</p>
  `;

  const filteredItems = clause.items.filter(item => {
    if (!currentSearchTerm) return true;
    return item.req.toLowerCase().includes(currentSearchTerm) || 
           item.eng.toLowerCase().includes(currentSearchTerm) || 
           item.id.toLowerCase().includes(currentSearchTerm);
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
            
            <div class="flex flex-wrap gap-4 mb-8 items-center">
              <span class="px-6 py-3 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-medium">${item.id}</span>
              
              ${ans.status ? 
                `<span onclick="resetStatus('${item.id}')" class="px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer ${ans.status==='Compliant' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}">
                  ${ans.status === 'Compliant' ? '✅ Compliant' : '❌ Non-Compliant'} <span class="ml-2 text-xs opacity-75">(klik untuk batal)</span>
                </span>` : 
                `<span class="px-6 py-3 border-2 border-dashed border-gray-400 rounded-2xl text-sm">⏳ Belum Dinilai</span>`
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button onclick="setStatus('${item.id}', 'Compliant')" class="status-btn py-6 rounded-2xl border-2 border-emerald-500 font-bold transition-all ${ans.status==='Compliant' ? 'bg-emerald-500 text-white scale-105' : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}">✅ Compliant</button>
              <button onclick="setStatus('${item.id}', 'Non-Compliant')" class="status-btn py-6 rounded-2xl border-2 border-red-500 font-bold transition-all ${ans.status==='Non-Compliant' ? 'bg-red-500 text-white scale-105' : 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'}">❌ Non-Compliant</button>
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

  if (scrollToTop) {
    const mainContent = document.getElementById('main-content-area');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

function resetStatus(id) {
  if (answers[id]) {
    delete answers[id].status;
    delete answers[id].timestamp;
    localStorage.setItem(`iso_audit_${currentUser}`, JSON.stringify(answers));
    loadClause(currentClauseNum);
    showBannerNotification('Status telah dibatalkan', 'pending');
  }
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
  const current = answers[id] || {};
  if (current.status === status) {
    resetStatus(id);
    return;
  }
  answers[id] = answers[id] || {};
  answers[id].status = status;
  answers[id].timestamp = new Date().toISOString();
  localStorage.setItem(`iso_audit_${currentUser}`, JSON.stringify(answers));
  loadClause(currentClauseNum);
  
  const message = status === 'Compliant' ? 'Status Compliant berhasil disimpan' : 'Status Non-Compliant berhasil disimpan';
  showBannerNotification(message, status);
}

function saveEvidence(id, text) {
  if (!answers[id]) answers[id] = {};
  answers[id].evidence = text;
  localStorage.setItem(`iso_audit_${currentUser}`, JSON.stringify(answers));
}

function updateProgress() {
  const total = currentStandardData.reduce((sum, c) => sum + c.items.length, 0);
  const answered = Object.keys(answers).filter(k => answers[k]?.status).length;
  const percent = total ? Math.round((answered / total) * 100) : 0;
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').textContent = percent + '%';
  document.getElementById('mobile-progress-bar').style.width = percent + '%';
  document.getElementById('mobile-progress-text').textContent = percent + '%';
}

function showBannerNotification(message, type) {
  const banner = document.getElementById('banner-notification');
  let bgColor = '#10b981';
  let icon = '✅';
  if (type === 'Non-Compliant') {
    bgColor = '#ef4444';
    icon = '❌';
  } else if (type === 'pending') {
    bgColor = '#64748b';
    icon = '⏳';
  }
  
  banner.innerHTML = `
    <div class="banner-content" style="background-color: ${bgColor};">
      <span class="text-2xl">${icon}</span>
      <div class="flex-1 text-sm">${message}</div>
    </div>
  `;
  banner.classList.remove('hidden');
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(-20px)';

  setTimeout(() => {
    banner.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    banner.style.opacity = '1';
    banner.style.transform = 'translateY(0)';
  }, 10);

  setTimeout(() => {
    banner.style.transition = 'all 0.3s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-20px)';
    setTimeout(() => banner.classList.add('hidden'), 300);
  }, 2800);
}

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

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    document.getElementById('theme-icon').className = 'fas fa-moon text-2xl';
    if (document.getElementById('bottom-theme-icon')) document.getElementById('bottom-theme-icon').className = 'fas fa-moon text-2xl';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    document.getElementById('theme-icon').className = 'fas fa-sun text-2xl';
    if (document.getElementById('bottom-theme-icon')) document.getElementById('bottom-theme-icon').className = 'fas fa-sun text-2xl';
  }
}

function loadDarkModePreference() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-icon').className = 'fas fa-sun text-2xl';
    if (document.getElementById('bottom-theme-icon')) document.getElementById('bottom-theme-icon').className = 'fas fa-sun text-2xl';
  }
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('mobile-sidebar');
  sidebar.classList.toggle('hidden');
  if (!sidebar.classList.contains('hidden')) {
    setTimeout(() => sidebar.classList.add('open'), 10);
  } else {
    sidebar.classList.remove('open');
  }
}

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
    if (currentUser) localStorage.removeItem(`iso_audit_${currentUser}`);
    answers = {};
    currentUser = null;
    currentClauseNum = '4';
    currentSearchTerm = '';
    hideLogoutModal();
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    resetLoginButton();
    document.getElementById('search-input').value = '';
    document.getElementById('search-clear-btn').classList.add('hidden');
    document.getElementById('search-suggestions').style.display = 'none';
    showNotification("✅ Logout berhasil!", "success");
  }, 600);
}

function showFileErrorModal() {
  document.getElementById('file-error-modal').classList.remove('hidden');
}

function hideFileErrorModal() {
  document.getElementById('file-error-modal').classList.add('hidden');
}

function showNotification(message, type = "success") {
  const notif = document.createElement('div');
  notif.className = `fixed bottom-6 right-6 px-8 py-4 rounded-2xl shadow-2xl text-white font-medium z-[3000] ${type === "success" ? "bg-emerald-500" : "bg-blue-500"}`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 4000);
}
