import { getCurrentUser } from '../services/auth.js';
import { renderAuthModals } from './AuthModals.js';

export function setupHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  renderHeader(header);
  renderAuthModals(document.body);
  setupHeaderInteractivity();
}

function renderHeader(container) {
  const user = getCurrentUser();
  const path = window.location.pathname;
  const isHomePage = path === '/' || path === '/index.html';
  
  container.innerHTML = `
    <div class="header-container ${isHomePage ? 'home-header' : ''}">
      <div class="logo-container">
        <a href="/" class="logo">
          <svg width="30" height="32" fill="#0066cc" viewBox="0 0 32 32">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.414 3.62l-.28.023-.253.005c-4.157 0-6.345-2.806-6.345-6.476 0-1.209.265-2.264.89-3.59.088-.19.185-.392.318-.673.407-.868 1.527-3.199 3.328-6.878l1.024-2.1.512-1.06.512-1.062 1.02-2.137C11.852 2.645 13.5 1 16 1z"></path>
          </svg>
          <span>ybnb</span>
        </a>
      </div>

      ${isHomePage ? `
      <div class="search-bar-container">
        <button class="search-bar" id="search-bar-button">
          <div class="search-bar-text">Anywhere</div>
          <div class="search-bar-divider"></div>
          <div class="search-bar-text">Any week</div>
          <div class="search-bar-divider"></div>
          <div class="search-bar-text guests">Add guests</div>
          <div class="search-icon-container">
            <i class="fas fa-search"></i>
          </div>
        </button>
      </div>
      ` : `
      <div class="search-bar-container compact">
        <form id="search-form" class="search-form-compact">
          <div class="search-input-container">
            <input type="text" name="location" placeholder="Where are you going?" value="${getSearchParam('location') || ''}">
          </div>
          <div class="search-dates-container">
            <input type="date" name="check-in" placeholder="Check in" value="${getSearchParam('check_in') || ''}">
            <input type="date" name="check-out" placeholder="Check out" value="${getSearchParam('check_out') || ''}">
          </div>
          <div class="search-guests-container">
            <select name="guests">
              ${Array.from({length: 16}, (_, i) => 
                `<option value="${i+1}" ${getSearchParam('guests') == i+1 ? 'selected' : ''}>${i+1} guest${i !== 0 ? 's' : ''}</option>`
              ).join('')}
            </select>
          </div>
          <button type="submit" class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </form>
      </div>
      `}

      <div class="nav-right">
        <a href="#" class="become-host">YBNB your home</a>
        <div class="language-selector">
          <i class="fas fa-globe"></i>
        </div>
        <div class="profile-container">
          <button class="profile-btn ${user ? 'logged-in' : ''}" id="profile-button">
            ${user 
              ? `<div class="avatar">${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : user.name.charAt(0).toUpperCase()}</div>`
              : `<i class="fas fa-bars"></i>
                 <div class="avatar"><i class="fas fa-user"></i></div>`
            }
          </button>
          <div class="profile-dropdown" id="profile-dropdown">
            ${user 
              ? `<div class="dropdown-section">
                   <a href="#" class="dropdown-item">Profile</a>
                   <a href="#" class="dropdown-item">Trips</a>
                   <a href="#" class="dropdown-item">Wishlists</a>
                   <hr>
                   <a href="#" class="dropdown-item">Host your home</a>
                   <a href="#" class="dropdown-item">Account</a>
                   <hr>
                   <a href="#" class="dropdown-item" id="logout-btn">Log out</a>
                 </div>`
              : `<div class="dropdown-section">
                   <a href="#" class="dropdown-item" data-modal-target="login-modal">Log in</a>
                   <a href="#" class="dropdown-item" data-modal-target="register-modal">Sign up</a>
                   <hr>
                   <a href="#" class="dropdown-item">Host your home</a>
                   <a href="#" class="dropdown-item">Help</a>
                 </div>`
            }
          </div>
        </div>
      </div>
    </div>

    ${isHomePage ? `
    <div class="search-expanded" id="search-expanded">
      <div class="search-expanded-container">
        <form id="search-form" class="search-form">
          <div class="search-tab active" data-tab="stays">
            <span>Stays</span>
          </div>
          <div class="search-tab" data-tab="experiences">
            <span>Experiences</span>
          </div>
          <div class="search-tab" data-tab="online-experiences">
            <span>Online Experiences</span>
          </div>
          
          <div class="search-inputs-container">
            <div class="search-input-col">
              <label>Where</label>
              <input type="text" name="location" placeholder="Search destinations">
            </div>
            <div class="search-input-col">
              <label>Check in</label>
              <input type="date" name="check-in" placeholder="Add dates">
            </div>
            <div class="search-input-col">
              <label>Check out</label>
              <input type="date" name="check-out" placeholder="Add dates">
            </div>
            <div class="search-input-col">
              <label>Who</label>
              <select name="guests">
                ${Array.from({length: 16}, (_, i) => 
                  `<option value="${i+1}">${i+1} guest${i !== 0 ? 's' : ''}</option>`
                ).join('')}
              </select>
            </div>
            <button type="submit" class="search-btn">
              <i class="fas fa-search"></i>
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    ` : ''}

    <div class="header-backdrop" id="header-backdrop"></div>
  `;
}

function setupHeaderInteractivity() {
  const searchBarButton = document.getElementById('search-bar-button');
  const searchExpanded = document.getElementById('search-expanded');
  const headerBackdrop = document.getElementById('header-backdrop');
  const profileButton = document.getElementById('profile-button');
  const profileDropdown = document.getElementById('profile-dropdown');
  
  // Handle search bar expansion
  if (searchBarButton && searchExpanded && headerBackdrop) {
    searchBarButton.addEventListener('click', () => {
      searchExpanded.classList.add('active');
      headerBackdrop.classList.add('active');
      document.body.classList.add('overlay-active');
    });
    
    headerBackdrop.addEventListener('click', () => {
      searchExpanded.classList.remove('active');
      headerBackdrop.classList.remove('active');
      document.body.classList.remove('overlay-active');
    });
  }
  
  // Handle profile dropdown
  if (profileButton && profileDropdown) {
    profileButton.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
      if (!profileButton.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('active');
      }
    });
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.reload();
      });
    }
  }
}

function getSearchParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}