// Fonction pour charger et afficher les horaires
function loadSchedules() {
  // En production, on ferait une requête API ici
  const schedules = JSON.parse(localStorage.getItem('trainSchedules')) || [];
  
  const table = document.querySelector('.admin-schedule-table');
  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Train</th>
          <th>Départ</th>
          <th>Arrivée</th>
          <th>Heure départ</th>
          <th>Heure arrivée</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${schedules.map(schedule => `
          <tr data-id="${schedule.id}">
            <td>${schedule.trainNumber}</td>
            <td>${schedule.departure}</td>
            <td>${schedule.arrival}</td>
            <td>${schedule.departureTime}</td>
            <td>${schedule.arrivalTime}</td>
            <td>${schedule.status}</td>
            <td>
              <button class="edit-btn" data-id="${schedule.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" data-id="${schedule.id}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Ajout des écouteurs d'événements
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', deleteSchedule);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', editSchedule);
  });
}

// Fonction pour ajouter un nouvel horaire
document.getElementById('add-schedule-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const schedules = JSON.parse(localStorage.getItem('trainSchedules')) || [];
  
  const newSchedule = {
    id: Date.now(),
    trainNumber: document.getElementById('train-number').value,
    departure: document.getElementById('departure-station').value,
    arrival: document.getElementById('arrival-station').value,
    departureTime: document.getElementById('departure-time').value,
    arrivalTime: document.getElementById('arrival-time').value,
    status: document.getElementById('status').value
  };
  
  schedules.push(newSchedule);
  localStorage.setItem('trainSchedules', JSON.stringify(schedules));
  
  // Réinitialiser le formulaire
  this.reset();
  
  // Recharger les horaires
  loadSchedules();
});

// Fonction pour supprimer un horaire
function deleteSchedule(e) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
    return;
  }
  
  const id = parseInt(e.target.closest('button').dataset.id);
  let schedules = JSON.parse(localStorage.getItem('trainSchedules')) || [];
  
  schedules = schedules.filter(schedule => schedule.id !== id);
  localStorage.setItem('trainSchedules', JSON.stringify(schedules));
  
  loadSchedules();
  
  // Afficher un message temporaire avec animation
  const message = document.createElement('div');
  message.textContent = 'Horaire supprimé avec succès';
  message.className = 'success-message';
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add('fade-out');
    setTimeout(() => message.remove(), 300);
  }, 2700);
}

// Fonction pour éditer un horaire
function editSchedule(e) {
  const id = parseInt(e.target.closest('button').dataset.id);
  const schedules = JSON.parse(localStorage.getItem('trainSchedules')) || [];
  const schedule = schedules.find(s => s.id === id);
  
  if (schedule) {
    document.getElementById('train-number').value = schedule.trainNumber;
    document.getElementById('departure-station').value = schedule.departure;
    document.getElementById('arrival-station').value = schedule.arrival;
    document.getElementById('departure-time').value = schedule.departureTime;
    document.getElementById('arrival-time').value = schedule.arrivalTime;
    document.getElementById('status').value = schedule.status;
    
    // Supprimer l'ancien horaire
    const updatedSchedules = schedules.filter(s => s.id !== id);
    localStorage.setItem('trainSchedules', JSON.stringify(updatedSchedules));
  }
}

// Calcul automatique de la durée
document.getElementById('departure-time').addEventListener('change', updateDuration);
document.getElementById('arrival-time').addEventListener('change', updateDuration);

function updateDuration() {
  const departure = document.getElementById('departure-time').value;
  const arrival = document.getElementById('arrival-time').value;
  
  if (departure && arrival) {
    const duration = calculateDuration(departure, arrival);
    const durationDisplay = document.getElementById('duration-display');
    durationDisplay.innerHTML = `<i class="fas fa-clock"></i> <span>Durée: ${duration}</span>`;
    durationDisplay.style.display = 'block';
  }
}

// Charger les horaires au démarrage
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser avec des données par défaut si vide
  if (!localStorage.getItem('trainSchedules')) {
    const defaultSchedules = [
      {
        id: 1,
        trainNumber: 'TER 87654',
        departure: 'Dijon',
        arrival: 'Besançon',
        departureTime: '08:15',
        arrivalTime: '09:30',
        status: 'À l\'heure'
      },
      {
        id: 2,
        trainNumber: 'TER 76543',
        departure: 'Besançon',
        arrival: 'Dijon',
        departureTime: '09:45',
        arrivalTime: '11:00',
        status: 'À l\'heure'
      }
    ];
    localStorage.setItem('trainSchedules', JSON.stringify(defaultSchedules));
  }
  
  loadSchedules();
});