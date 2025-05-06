import './styles/style.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/home.css';
import './styles/search.css';
import './styles/listing.css';
import './styles/checkout.css';
import './styles/experiences.css';
import './styles/trips.css';
import './styles/profile.css';
import './styles/settings.css';
import './styles/modal.css';
import { setupRouter } from './router.js';
import { setupHeader } from './components/Header.js';
import { setupFooter } from './components/Footer.js';
import { initializeApp } from './app.js';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Setup the app container
  const app = document.getElementById('app');
  app.innerHTML = `
    <header id="main-header"></header>
    <main id="main-content"></main>
    <footer id="main-footer"></footer>
  `;

  // Setup components
  setupHeader();
  setupFooter();
  
  // Initialize router
  setupRouter();
  
  // Initialize app functionality
  initializeApp();
});