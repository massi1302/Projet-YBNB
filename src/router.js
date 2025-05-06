import { renderHomePage } from './pages/HomePage.js';
import { renderSearchPage } from './pages/SearchPage.js';
import { renderListingPage } from './pages/ListingPage.js';
import { renderCheckoutPage } from './pages/CheckoutPage.js';
import { renderExperiencesPage } from './pages/ExperiencesPage.js';
import { renderTripsPage } from './pages/TripsPage.js';
import { renderProfilePage } from './pages/ProfilePage.js';
import { renderAccountSettingsPage } from './pages/AccountSettingsPage.js';
import { renderNotFoundPage } from './pages/NotFoundPage.js';

export function setupRouter() {
  // Handle initial page load
  handleNavigation();
  
  // Handle browser navigation (back/forward)
  window.addEventListener('popstate', handleNavigation);
  
  // Handle link clicks for internal navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href').startsWith('/')) {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    }
  });
}

export function navigateTo(url) {
  history.pushState(null, null, url);
  handleNavigation();
}

function handleNavigation() {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const mainContent = document.getElementById('main-content');
  
  // Update active nav state
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Reset scroll position
  window.scrollTo(0, 0);
  
  // Route to appropriate page
  if (path === '/' || path === '/index.html') {
    renderHomePage(mainContent);
    document.title = 'YBNB: Vacation Homes & Experiences';
  } else if (path === '/search') {
    const location = searchParams.get('location') || '';
    const checkIn = searchParams.get('check_in') || '';
    const checkOut = searchParams.get('check_out') || '';
    const guests = searchParams.get('guests') || '1';
    
    renderSearchPage(mainContent, { location, checkIn, checkOut, guests });
    document.title = `${location || 'Stays'} · YBNB`;
  } else if (path.startsWith('/listing/')) {
    const listingId = path.split('/')[2];
    renderListingPage(mainContent, listingId);
  } else if (path.startsWith('/checkout/')) {
    const listingId = path.split('/')[2];
    renderCheckoutPage(mainContent, listingId);
    document.title = 'Confirm and pay · YBNB';
  } else if (path === '/experiences') {
    renderExperiencesPage(mainContent);
    document.title = 'Experiences · YBNB';
  } else if (path === '/trips') {
    renderTripsPage(mainContent);
    document.title = 'Trips · YBNB';
  } else if (path.startsWith('/profile/')) {
    const userId = path.split('/')[2];
    renderProfilePage(mainContent, userId);
    document.title = 'Profile · YBNB';
  } else if (path === '/account-settings') {
    renderAccountSettingsPage(mainContent);
    document.title = 'Account Settings · YBNB';
  } else {
    renderNotFoundPage(mainContent);
    document.title = 'Page Not Found · YBNB';
  }
}