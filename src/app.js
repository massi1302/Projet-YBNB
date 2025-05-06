import { getFavorites, toggleFavorite } from './services/favorites.js';
import { getCurrentUser, setCurrentUser } from './services/auth.js';

export function initializeApp() {
  // Initialize global event listeners
  initializeEventListeners();
  
  // Check for stored user session
  checkUserSession();
}

function initializeEventListeners() {
  // Global event delegation for the entire app
  document.addEventListener('click', (e) => {
    // Handle favorite/heart button clicks
    if (e.target.closest('.heart-btn')) {
      const heartBtn = e.target.closest('.heart-btn');
      const listingId = heartBtn.dataset.id;
      toggleFavoriteUI(heartBtn, listingId);
    }
    
    // Handle modal open/close
    if (e.target.closest('[data-modal-target]')) {
      const modalId = e.target.closest('[data-modal-target]').dataset.modalTarget;
      openModal(modalId);
    }
    
    if (e.target.closest('.modal-close') || 
        (e.target.classList.contains('modal') && !e.target.closest('.modal-content'))) {
      closeAllModals();
    }
  });
  
  // Handle form submissions
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'login-form') {
      e.preventDefault();
      handleLogin(e.target);
    } else if (e.target.id === 'register-form') {
      e.preventDefault();
      handleRegister(e.target);
    } else if (e.target.id === 'search-form') {
      e.preventDefault();
      handleSearch(e.target);
    }
  });
}

function checkUserSession() {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      updateAuthUI(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
    }
  }
}

function toggleFavoriteUI(heartBtn, listingId) {
  const user = getCurrentUser();
  if (!user) {
    openModal('login-modal');
    return;
  }
  
  const isFavorited = heartBtn.classList.contains('favorited');
  toggleFavorite(listingId);
  
  if (isFavorited) {
    heartBtn.classList.remove('favorited');
  } else {
    heartBtn.classList.add('favorited');
    heartBtn.classList.add('pulse');
    setTimeout(() => {
      heartBtn.classList.remove('pulse');
    }, 300);
  }
}

function updateAuthUI(user) {
  const profileBtn = document.querySelector('.profile-btn');
  if (profileBtn) {
    if (user) {
      profileBtn.innerHTML = `
        <div class="avatar">
          ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : user.name.charAt(0).toUpperCase()}
        </div>
      `;
      profileBtn.classList.add('logged-in');
    } else {
      profileBtn.innerHTML = `
        <i class="fas fa-bars"></i>
        <div class="avatar"><i class="fas fa-user"></i></div>
      `;
      profileBtn.classList.remove('logged-in');
    }
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal.open').forEach(modal => {
    modal.classList.remove('open');
  });
  document.body.classList.remove('modal-open');
}

function handleLogin(form) {
  const email = form.querySelector('[name="email"]').value;
  const password = form.querySelector('[name="password"]').value;
  
  // This would be an API call in a real application
  // For demo purposes, we'll just mock a successful login
  const user = {
    id: '123',
    name: 'Demo User',
    email: email,
    avatar: null
  };
  
  setCurrentUser(user);
  localStorage.setItem('user', JSON.stringify(user));
  updateAuthUI(user);
  closeAllModals();
}

function handleRegister(form) {
  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const password = form.querySelector('[name="password"]').value;
  
  // This would be an API call in a real application
  // For demo purposes, we'll just mock a successful registration
  const user = {
    id: '123',
    name: name,
    email: email,
    avatar: null
  };
  
  setCurrentUser(user);
  localStorage.setItem('user', JSON.stringify(user));
  updateAuthUI(user);
  closeAllModals();
}

function handleSearch(form) {
  const location = form.querySelector('[name="location"]').value;
  const checkIn = form.querySelector('[name="check-in"]').value;
  const checkOut = form.querySelector('[name="check-out"]').value;
  const guests = form.querySelector('[name="guests"]').value;
  
  const searchParams = new URLSearchParams();
  if (location) searchParams.set('location', location);
  if (checkIn) searchParams.set('check_in', checkIn);
  if (checkOut) searchParams.set('check_out', checkOut);
  if (guests) searchParams.set('guests', guests);
  
  window.location.href = `/search?${searchParams.toString()}`;
}