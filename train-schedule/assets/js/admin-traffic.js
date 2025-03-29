// Charger les alertes trafic
function loadTrafficAlerts() {
  fetch('../assets/data/traffic-info.json')
    .then(response => response.json())
    .then(data => {
      const container = document.querySelector('.traffic-alerts-list');
      container.innerHTML = data.map(alert => `
        <div class="traffic-alert ${alert.severity}">
          <h3>${alert.title} <small>(${alert.date})</small></h3>
          <p>${alert.message}</p>
          <p><small>Lignes: ${alert.lines.join(', ')}</small></p>
          <button class="delete-alert ter-button" data-id="${alert.id}">
            <i class="fas fa-trash"></i> Supprimer
          </button>
        </div>
      `).join('');

      // Ajouter les écouteurs d'événements
      document.querySelectorAll('.delete-alert').forEach(btn => {
        btn.addEventListener('click', deleteAlert);
      });
    })
    .catch(error => console.error('Erreur:', error));
}

// Ajouter une nouvelle alerte
document.getElementById('add-traffic-alert').addEventListener('submit', function(e) {
  e.preventDefault();
  
  fetch('../assets/data/traffic-info.json')
    .then(response => response.json())
    .then(data => {
      const newAlert = {
        id: Date.now(),
        title: document.getElementById('alert-title').value,
        message: document.getElementById('alert-message').value,
        severity: document.getElementById('alert-severity').value,
        lines: document.getElementById('alert-lines').value.split(',').map(item => item.trim()),
        date: new Date().toISOString().split('T')[0]
      };

      data.push(newAlert);
      
      // Enregistrer les modifications
      return fetch('../assets/data/traffic-info.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    })
    .then(() => {
      alert('Alerte ajoutée avec succès');
      this.reset();
      loadTrafficAlerts();
    })
    .catch(error => console.error('Erreur:', error));
});

// Supprimer une alerte
function deleteAlert(e) {
  if (!confirm('Supprimer cette alerte ?')) return;
  
  const id = parseInt(e.target.closest('button').dataset.id);
  
  fetch('../assets/data/traffic-info.json')
    .then(response => response.json())
    .then(data => {
      const updatedData = data.filter(alert => alert.id !== id);
      
      return fetch('../assets/data/traffic-info.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
    })
    .then(() => {
      loadTrafficAlerts();
    })
    .catch(error => console.error('Erreur:', error));
}

// Charger les alertes au démarrage
document.addEventListener('DOMContentLoaded', loadTrafficAlerts);