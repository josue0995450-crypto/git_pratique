const dialog = document.querySelector('#loginDialog');
const openButtons = [document.querySelector('#openLogin'), document.querySelector('#openLogin2')];
const identifier = document.querySelector('#identifier');
let method = 'gmail';

openButtons.forEach(btn => btn.addEventListener('click', () => dialog.showModal()));
document.querySelectorAll('.method').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.method').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  method = btn.dataset.method;
  identifier.placeholder = method === 'gmail' ? 'adresse@gmail.com' : '+243 000 000 000';
}));

document.querySelector('#loginBtn').addEventListener('click', () => {
  const role = document.querySelector('#role').value;
  if (!identifier.value.trim()) return alert('Entrez votre Gmail ou numéro de téléphone.');
  dialog.close();
  showDashboard(role);
});

document.querySelector('#logout').addEventListener('click', () => {
  document.querySelector('#dashboard').classList.add('hidden');
  window.scrollTo({top:0, behavior:'smooth'});
});

document.querySelector('#joinForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Demande envoyée. Un administrateur devra valider le dossier.');
  e.target.reset();
});

function showDashboard(role){
  const dashboard = document.querySelector('#dashboard');
  const title = document.querySelector('#dashTitle');
  const content = document.querySelector('#dashContent');
  const cards = role === 'admin' ? [
    ['Gestion des membres','Valider, suspendre, changer les rôles et suivre les cotisations.'],
    ['Projets & activités','Créer, modifier et publier les projets ADR.'],
    ['Finances','Suivre les cotisations, dons, subventions et rapports.'],
    ['Documents officiels','Publier statuts, règlements, procès-verbaux et convocations.'],
    ['Votes & Assemblées','Créer les AG, contrôler quorum, enregistrer décisions.'],
    ['Paramètres','Configurer rôles, sécurité, catégories de membres et antennes.']
  ] : [
    ['Mon profil','Consulter et mettre à jour mes informations personnelles.'],
    ['Mes cotisations','Voir le statut de mes paiements et reçus.'],
    ['Projets ADR','Consulter les actions, s’inscrire comme bénévole.'],
    ['Documents','Lire les statuts, règlement intérieur et convocations.'],
    ['Assemblées','Recevoir les invitations et consulter les procès-verbaux.'],
    ['Messages','Contacter la Direction Exécutive ou le Conseil d’Administration.']
  ];
  title.textContent = role === 'admin' ? 'Tableau de bord administrateur' : 'Espace membre';
  content.innerHTML = cards.map(([h,p]) => `<article class="card"><h3>${h}</h3><p>${p}</p></article>`).join('');
  dashboard.classList.remove('hidden');
  dashboard.scrollIntoView({behavior:'smooth'});
}
