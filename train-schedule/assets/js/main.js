// Données simulées des horaires
const trainSchedules = [
  {
    id: 1,
    trainNumber: 'TER 87654',
    departure: 'Dijon',
    arrival: 'Besançon',
    departureTime: '08:15',
    arrivalTime: '09:30',
    duration: '1h15',
    status: 'À l\'heure'
  },
  {
    id: 2,
    trainNumber: 'TER 76543',
    departure: 'Besançon',
    arrival: 'Dijon',
    departureTime: '09:45',
    arrivalTime: '11:00',
    duration: '1h15',
    status: 'À l\'heure'
  },
  {
    id: 3,
    trainNumber: 'TER 65432',
    departure: 'Dijon',
    arrival: 'Montbard',
    departureTime: '10:20',
    arrivalTime: '10:50',
    duration: '30min',
    status: 'Retard 5min'
  },
  {
    id: 4,
    trainNumber: 'TER 54321',
    departure: 'Montbard',
    arrival: 'Dijon',
    departureTime: '11:15',
    arrivalTime: '11:45',
    duration: '30min',
    status: 'Supprimé'
  }
];

// Fonction pour afficher les horaires
function displaySchedules(schedules) {
  const table = document.querySelector('.schedule-table');
  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Train</th>
          <th>Départ</th>
          <th>Arrivée</th>
          <th>Heure départ</th>
          <th>Heure arrivée</th>
          <th>Durée</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        ${schedules.map(schedule => `
          <tr>
            <td>${schedule.trainNumber}</td>
            <td>${schedule.departure}</td>
            <td>${schedule.arrival}</td>
            <td>${schedule.departureTime}</td>
            <td>${schedule.arrivalTime}</td>
            <td>${schedule.duration}</td>
            <td class="status-${schedule.status.includes('À l\'heure') ? 'on-time' : 
                               schedule.status.includes('Retard') ? 'delayed' : 'cancelled'}">
              ${schedule.status}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Gestion du formulaire de recherche
document.getElementById('schedule-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const departure = document.getElementById('departure').value;
  const arrival = document.getElementById('arrival').value;
  const date = document.getElementById('date').value;
  
  // Filtrage basique des résultats (simulation)
  let filteredSchedules = trainSchedules;
  
  if (departure) {
    filteredSchedules = filteredSchedules.filter(schedule => 
      schedule.departure.toLowerCase().includes(departure.toLowerCase())
    );
  }
  
  if (arrival) {
    filteredSchedules = filteredSchedules.filter(schedule => 
      schedule.arrival.toLowerCase().includes(arrival.toLowerCase())
    );
  }
  
  displaySchedules(filteredSchedules);
});

// Charger les infos trafic
function loadTrafficInfo() {
  fetch('assets/data/traffic-info.json')
    .then(response => response.json())
    .then(data => {
      const container = document.querySelector('.traffic-alerts');
      container.innerHTML = data.map(alert => `
        <div class="traffic-alert ${alert.severity}">
          <h3>${alert.title}</h3>
          <p>${alert.message}</p>
          <small>Lignes concernées: ${alert.lines.join(', ')}</small>
        </div>
      `).join('');
    })
    .catch(error => console.error('Erreur de chargement des infos trafic:', error));
}

// Afficher tous les horaires et infos trafic au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  displaySchedules(trainSchedules);
  loadTrafficInfo();
});
