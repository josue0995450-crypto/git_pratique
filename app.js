const roleKey = 'adrUserRole';
const requestsKey = 'adrMembershipRequests';
const sessionKey = 'adrSessionIdentifier';

const methodsEl = document.querySelector('.methods');
const identifier = document.getElementById('identifier');
const roleSelect = document.getElementById('role');
const loginBtn = document.getElementById('loginBtn');
const joinForm = document.getElementById('joinForm');
const dashboardSection = document.getElementById('dashboard');
const dashTitle = document.getElementById('dashTitle');
const dashSubtitle = document.getElementById('dashSubtitle');
const dashContent = document.getElementById('dashContent');
const logoutBtn = document.getElementById('logout');

const placeholders = {
  gmail: 'adresse@gmail.com',
  phone: '+243 000 000 000'
};

const projects = [
  { name: 'Clinique mobile communautaire', field: 'Santé', progress: 72 },
  { name: 'Éducation des jeunes filles', field: 'Éducation', progress: 58 },
  { name: 'Assainissement de quartier', field: 'Environnement', progress: 44 }
];

const documents = [
  'Statuts ADR',
  'Règlement intérieur',
  'Procès-verbal Assemblée Générale',
  'Rapport annuel'
];

const defaultRequests = [
  {
    id: 'ADR-REQ-1001',
    fullName: 'Grâce Mbala',
    email: 'grace.mbala@email.com',
    phone: '+243 812 000 145',
    category: 'Membre actif',
    motivation: 'Participer aux actions sociales et soutenir les projets de santé.',
    status: 'En attente',
    createdAt: '2026-06-09'
  },
  {
    id: 'ADR-REQ-1002',
    fullName: 'David Kalume',
    email: 'david.kalume@email.com',
    phone: '+243 997 214 800',
    category: 'Membre bienfaiteur',
    motivation: 'Contribuer aux programmes d’éducation et aux collectes de fonds.',
    status: 'Validée',
    createdAt: '2026-06-08'
  }
];

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const setRole = role => localStorage.setItem(roleKey, role);
const getRole = () => localStorage.getItem(roleKey);
const clearRole = () => localStorage.removeItem(roleKey);

const getRequests = () => {
  const stored = localStorage.getItem(requestsKey);
  if (!stored) {
    localStorage.setItem(requestsKey, JSON.stringify(defaultRequests));
    return defaultRequests;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(requestsKey, JSON.stringify(defaultRequests));
    return defaultRequests;
  }
};

const saveRequests = requests => localStorage.setItem(requestsKey, JSON.stringify(requests));

const notify = (message, type = 'success') => {
  let region = document.querySelector('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.append(toast);

  window.setTimeout(() => toast.remove(), 3800);
};

const activeMethod = () => methodsEl?.querySelector('.method.active')?.dataset.method || 'gmail';

const updateMethod = selectedMethod => {
  if (!identifier || !methodsEl) return;

  identifier.placeholder = placeholders[selectedMethod];
  identifier.type = selectedMethod === 'gmail' ? 'email' : 'tel';
  identifier.value = '';

  methodsEl.querySelectorAll('.method').forEach(button => {
    button.classList.toggle('active', button.dataset.method === selectedMethod);
  });
};

const isValidIdentifier = () => {
  if (!identifier) return false;

  const value = identifier.value.trim();
  if (!value) return false;

  if (activeMethod() === 'gmail') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  return /^[+\d\s()-]{8,}$/.test(value);
};

const countByStatus = requests => ({
  pending: requests.filter(request => request.status === 'En attente').length,
  approved: requests.filter(request => request.status === 'Validée').length,
  rejected: requests.filter(request => request.status === 'Refusée').length
});

const renderMetrics = metrics => `
  <div class="metric-strip" aria-label="Indicateurs">
    ${metrics.map(metric => `
      <div>
        <strong>${escapeHtml(metric.value)}</strong>
        <span>${escapeHtml(metric.label)}</span>
      </div>
    `).join('')}
  </div>
`;

const renderProjects = () => `
  <section class="dashboard-section">
    <div class="section-heading compact">
      <span class="panel-label">Projets</span>
      <h2>Portefeuille d'actions</h2>
    </div>
    <div class="section-grid three">
      ${projects.map(project => `
        <article class="panel dashboard-card">
          <span class="status">${escapeHtml(project.field)}</span>
          <h3>${escapeHtml(project.name)}</h3>
          <div class="progress" aria-label="Progression ${project.progress}%">
            <span style="width: ${project.progress}%"></span>
          </div>
          <p>${project.progress}% de progression opérationnelle.</p>
        </article>
      `).join('')}
    </div>
  </section>
`;

const renderDocuments = () => `
  <section class="panel document-panel">
    <div>
      <span class="panel-label">Documents</span>
      <h2>Bibliothèque institutionnelle</h2>
      <p>Documents de gouvernance prêts à être reliés à un stockage réel.</p>
    </div>
    <ul class="document-list">
      ${documents.map(documentName => `<li>${escapeHtml(documentName)} <span>Disponible</span></li>`).join('')}
    </ul>
  </section>
`;

const renderAdminRequests = requests => `
  <section class="panel admin-panel">
    <div class="table-head">
      <div>
        <span class="panel-label">Adhésions</span>
        <h2>Demandes à traiter</h2>
      </div>
      <span class="count-pill">${countByStatus(requests).pending} en attente</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Contact</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${requests.map(request => `
            <tr>
              <td>
                <strong>${escapeHtml(request.fullName)}</strong>
                <small>${escapeHtml(request.createdAt)}</small>
              </td>
              <td>${escapeHtml(request.category)}</td>
              <td>
                ${escapeHtml(request.email)}
                <small>${escapeHtml(request.phone)}</small>
              </td>
              <td><span class="status-badge ${request.status === 'Validée' ? 'approved' : request.status === 'Refusée' ? 'rejected' : ''}">${escapeHtml(request.status)}</span></td>
              <td>
                <div class="table-actions">
                  <button type="button" class="mini-button" data-request-action="approve" data-request-id="${escapeHtml(request.id)}">Valider</button>
                  <button type="button" class="mini-button danger" data-request-action="reject" data-request-id="${escapeHtml(request.id)}">Refuser</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </section>
`;

const renderAdminDashboard = () => {
  const requests = getRequests();
  const totals = countByStatus(requests);

  dashTitle.textContent = 'Tableau de bord administrateur';
  dashSubtitle.textContent = 'Vue de pilotage pour suivre les adhésions, projets, documents et décisions.';

  dashContent.innerHTML = `
    ${renderMetrics([
      { value: requests.length, label: 'Demandes totales' },
      { value: totals.pending, label: 'En attente' },
      { value: totals.approved, label: 'Validées' }
    ])}
    ${renderAdminRequests(requests)}
    ${renderProjects()}
    ${renderDocuments()}
  `;
};

const renderMemberDashboard = () => {
  const sessionIdentifier = localStorage.getItem(sessionKey) || 'membre@adr.org';
  const requests = getRequests();
  const matchingRequest = requests.find(request => request.email === sessionIdentifier || request.phone === sessionIdentifier);
  const status = matchingRequest?.status || 'Compte actif';
  const category = matchingRequest?.category || 'Membre standard';

  dashTitle.textContent = 'Espace membre';
  dashSubtitle.textContent = 'Vue personnelle pour suivre votre profil, vos cotisations, documents et activités ADR.';

  dashContent.innerHTML = `
    ${renderMetrics([
      { value: status, label: 'Statut du dossier' },
      { value: category, label: 'Catégorie' },
      { value: '2026', label: 'Exercice courant' }
    ])}
    <section class="section-grid three">
      <article class="panel dashboard-card">
        <span class="status">Profil</span>
        <h3>Mes informations</h3>
        <p>Identifiant connecté : ${escapeHtml(sessionIdentifier)}.</p>
      </article>
      <article class="panel dashboard-card">
        <span class="status">Cotisations</span>
        <h3>Suivi financier</h3>
        <p>Votre prochaine cotisation sera affichée ici après validation administrative.</p>
      </article>
      <article class="panel dashboard-card">
        <span class="status">Messages</span>
        <h3>Contact ADR</h3>
        <p>La Direction Exécutive pourra envoyer des notifications aux membres.</p>
      </article>
    </section>
    ${renderProjects()}
    ${renderDocuments()}
  `;
};

if (methodsEl) {
  methodsEl.addEventListener('click', event => {
    const clicked = event.target.closest('.method');
    if (!clicked) return;
    updateMethod(clicked.dataset.method);
  });

  updateMethod('gmail');
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    if (!isValidIdentifier()) {
      notify('Entrez un identifiant valide pour continuer.', 'error');
      identifier?.focus();
      return;
    }

    setRole(roleSelect?.value || 'member');
    localStorage.setItem(sessionKey, identifier.value.trim());
    notify('Connexion réussie. Redirection vers votre espace.');
    window.setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 700);
  });
}

if (joinForm) {
  joinForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!joinForm.checkValidity()) {
      joinForm.reportValidity();
      notify('Complétez les champs obligatoires avant l’envoi.', 'error');
      return;
    }

    const formData = new FormData(joinForm);
    const requests = getRequests();
    const createdAt = new Date().toISOString().slice(0, 10);
    const request = {
      id: `ADR-REQ-${Date.now().toString().slice(-6)}`,
      fullName: formData.get('fullName').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      category: formData.get('category'),
      motivation: formData.get('motivation').trim(),
      status: 'En attente',
      createdAt
    };

    saveRequests([request, ...requests]);
    localStorage.setItem(sessionKey, request.email);
    notify('Demande envoyée et enregistrée. Elle est visible dans le dashboard admin.');
    joinForm.reset();
  });
}

if (dashboardSection) {
  const role = getRole();

  if (!role) {
    window.location.href = 'login.html';
  } else if (role === 'admin') {
    renderAdminDashboard();
  } else {
    renderMemberDashboard();
  }

  dashContent?.addEventListener('click', event => {
    const button = event.target.closest('[data-request-action]');
    if (!button) return;

    const requests = getRequests();
    const nextStatus = button.dataset.requestAction === 'approve' ? 'Validée' : 'Refusée';
    const updatedRequests = requests.map(request => (
      request.id === button.dataset.requestId ? { ...request, status: nextStatus } : request
    ));

    saveRequests(updatedRequests);
    renderAdminDashboard();
    notify(`Demande ${nextStatus.toLowerCase()}.`);
  });

  logoutBtn?.addEventListener('click', () => {
    clearRole();
    localStorage.removeItem(sessionKey);
    window.location.href = 'login.html';
  });
}
