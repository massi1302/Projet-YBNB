import { getCurrentUser } from '../services/auth.js';

export function renderTripsPage(container) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/';
    return;
  }

  container.innerHTML = `
    <div class="trips-page">
      <div class="trips-header">
        <h1>Trips</h1>
        <div class="trips-tabs">
          <button class="tab-btn active">Upcoming</button>
          <button class="tab-btn">Past</button>
          <button class="tab-btn">Canceled</button>
        </div>
      </div>

      <div class="trips-container">
        <div class="upcoming-trips">
          <div class="trip-card">
            <img src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" alt="Trip">
            <div class="trip-info">
              <h3>Pretty modern house with rooftop</h3>
              <p class="trip-location">Bagnolet, France</p>
              <p class="trip-dates">Aug 2 - 7, 2023</p>
              <div class="trip-actions">
                <button class="btn btn-outline">View itinerary</button>
                <button class="btn btn-outline">Cancel reservation</button>
              </div>
            </div>
          </div>
        </div>

        <div class="past-trips hidden">
          <div class="trip-card">
            <img src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" alt="Past Trip">
            <div class="trip-info">
              <h3>Stylish apartment with garden view</h3>
              <p class="trip-location">Bagneux, France</p>
              <p class="trip-dates">Jul 15 - 20, 2023</p>
              <div class="trip-actions">
                <button class="btn btn-outline">Write review</button>
                <button class="btn btn-outline">Book again</button>
              </div>
            </div>
          </div>
        </div>

        <div class="canceled-trips hidden">
          <p class="no-trips">No canceled trips</p>
        </div>
      </div>
    </div>
  `;

  setupTripsInteractions();
}

function setupTripsInteractions() {
  const tabs = document.querySelectorAll('.tab-btn');
  const tripSections = document.querySelectorAll('.trips-container > div');
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      tripSections.forEach(section => section.classList.add('hidden'));
      tripSections[index].classList.remove('hidden');
    });
  });
}