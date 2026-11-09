// --- GLOBAL LOGIC (MENÚ MÓVIL) ---
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuBtn.innerHTML = mobileMenu.classList.contains('active') ? '✕' : '☰';
  });
}

// --- BLOQUEO TOTAL DE NAVEGACIÓN Y BOTONES SIN SESIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  // Seleccionamos todos los enlaces de la navegación y los botones de acción principal
  const allInteractiveLinks = document.querySelectorAll('.nav-links a, .mobile-menu a, .hero .btn');

  allInteractiveLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');

      // Permitimos solo navegación al Inicio (index.html), Login o Registro
      if (targetHref === 'index.html' || targetHref === 'login.html' || targetHref === 'register.html') {
        return; 
      }

      // Verificamos si hay sesión activa en el navegador
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

      if (!isLoggedIn) {
        e.preventDefault(); // Detiene el clic en el botón
        alert('Debes iniciar sesión o registrarte primero para poder acceder a esta sección.');
        window.location.href = 'login.html';
      }
    });
  });
});

// --- TOURNAMENTS FILTERING ---
const searchInput = document.getElementById('searchTournament');
const sportFilter = document.getElementById('sportFilter');
const statusFilter = document.getElementById('statusFilter');
const tournamentCards = document.querySelectorAll('.tournament-card');

function filterTournaments() {
  if (!searchInput) return;
  const searchVal = searchInput.value.toLowerCase();
  const sportVal = sportFilter.value;
  const statusVal = statusFilter.value;

  tournamentCards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const sport = card.dataset.sport;
    const status = card.dataset.status;

    const matchesSearch = title.includes(searchVal);
    const matchesSport = sportVal === 'all' || sport === sportVal;
    const matchesStatus = statusVal === 'all' || status === statusVal;

    if (matchesSearch && matchesSport && matchesStatus) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterTournaments);
  sportFilter.addEventListener('change', filterTournaments);
  statusFilter.addEventListener('change', filterTournaments);
}

// --- AUTH VALIDATION ---
// --- AUTH VALIDATION ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    const pwd = document.getElementById('password').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    const alertError = document.getElementById('alertError');

    if (pwd !== confirmPwd) {
      e.preventDefault();
      alertError.style.display = 'block';
      alertError.textContent = 'Las contraseñas no coinciden.';
    }
  });
}
// --- TEAMS MANAGEMENT (teams.html) ---
if (document.getElementById('teamsList')) {
  let teams = JSON.parse(localStorage.getItem('sportOrganizeTeams')) || [
    { id: 1, name: "Tigres FC", emoji: "🐯", players: [{id: 1, name: "Carlos Martínez", position: "Portero", number: 1}, {id: 2, name: "Juan Pérez", position: "Defensa", number: 4}] },
    { id: 2, name: "Águilas United", emoji: "🦅", players: [{id: 1, name: "Pedro González", position: "Delantero", number: 9}] }
  ];
  let activeTeamId = null;

  const teamsList = document.getElementById('teamsList');
  const playersList = document.getElementById('playersList');
  const teamDetailPanel = document.getElementById('teamDetailPanel');
  const emptyState = document.getElementById('emptyState');
  const addTeamBtn = document.getElementById('addTeamBtn');
  const addTeamForm = document.getElementById('addTeamForm');
  const newTeamSubmit = document.getElementById('newTeamSubmit');

  function saveTeams() {
    localStorage.setItem('sportOrganizeTeams', JSON.stringify(teams));
    renderTeams();
    if(activeTeamId) renderPlayers(activeTeamId);
  }

  function renderTeams() {
    teamsList.innerHTML = '';
    teams.forEach(team => {
      const div = document.createElement('div');
      div.className = `team-item ${team.id === activeTeamId ? 'active' : ''}`;
      div.innerHTML = `
        <div class="flex items-center gap-4">
          <span style="font-size: 1.5rem;">${team.emoji}</span>
          <div>
            <div style="font-weight: 600;">${team.name}</div>
            <div style="font-size: 0.8rem; color: #9ca3af;">${team.players.length} jugadores</div>
          </div>
        </div>
        <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; border-color: #ef4444; color: #ef4444;" onclick="deleteTeam(${team.id}, event)">🗑</button>
      `;
      div.onclick = () => selectTeam(team.id);
      teamsList.appendChild(div);
    });
  }

  function selectTeam(id) {
    activeTeamId = id;
    renderTeams();
    renderPlayers(id);
  }

  window.deleteTeam = function(id, event) {
    event.stopPropagation();
    teams = teams.filter(t => t.id !== id);
    if(activeTeamId === id) activeTeamId = null;
    saveTeams();
  }

  function renderPlayers(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) {
      emptyState.style.display = 'block';
      teamDetailPanel.style.display = 'none';
      return;
    }
    
    emptyState.style.display = 'none';
    teamDetailPanel.style.display = 'block';
    document.getElementById('detailTeamEmoji').textContent = team.emoji;
    document.getElementById('detailTeamName').textContent = team.name;
    document.getElementById('detailPlayerCount').textContent = `${team.players.length} jugadores`;

    playersList.innerHTML = '';
    team.players.forEach(p => {
      const div = document.createElement('div');
      div.className = 'player-card justify-between';
      div.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="player-number">${p.number}</div>
          <div>
            <div style="font-weight: 600;">${p.name}</div>
            <div style="font-size: 0.875rem; color: #9ca3af;">${p.position}</div>
          </div>
        </div>
        <button class="btn" style="background: transparent; color: #ef4444;" onclick="deletePlayer(${team.id}, ${p.id})">🗑</button>
      `;
      playersList.appendChild(div);
    });
  }

  window.deletePlayer = function(teamId, playerId) {
    const team = teams.find(t => t.id === teamId);
    team.players = team.players.filter(p => p.id !== playerId);
    saveTeams();
  }

  if (addTeamBtn) {
    addTeamBtn.onclick = () => { addTeamForm.style.display = addTeamForm.style.display === 'none' ? 'block' : 'none'; };
  }
  
  if (newTeamSubmit) {
    newTeamSubmit.onclick = () => {
      const name = document.getElementById('newTeamName').value;
      const emoji = document.getElementById('newTeamEmoji').value || '⚽';
      if(name) {
        teams.push({ id: Date.now(), name, emoji, players: [] });
        document.getElementById('newTeamName').value = '';
        addTeamForm.style.display = 'none';
        saveTeams();
      }
    };
  }

  if (document.getElementById('addPlayerBtn')) {
    document.getElementById('addPlayerBtn').onclick = () => {
      const form = document.getElementById('addPlayerForm');
      form.style.display = form.style.display === 'none' ? 'grid' : 'none';
    };
  }

  if (document.getElementById('newPlayerSubmit')) {
    document.getElementById('newPlayerSubmit').onclick = () => {
      const name = document.getElementById('newPlayerName').value;
      const position = document.getElementById('newPlayerPos').value;
      const number = document.getElementById('newPlayerNum').value;
      if(name && number && activeTeamId) {
        const team = teams.find(t => t.id === activeTeamId);
        team.players.push({ id: Date.now(), name, position, number });
        document.getElementById('newPlayerName').value = '';
        document.getElementById('newPlayerNum').value = '';
        document.getElementById('addPlayerForm').style.display = 'none';
        saveTeams();
      }
    };
  }

  renderTeams();
}