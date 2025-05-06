import { getCategories } from '../services/categories.js';

export function renderExperiencesPage(container) {
  container.innerHTML = `
    <div class="experiences-page">
      <div class="experiences-header">
        <h1>Discover experiences</h1>
        <div class="experiences-filters">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">In person</button>
          <button class="filter-btn">Online</button>
        </div>
      </div>

      <div class="categories-container">
        <div class="categories-scroll">
          <div class="categories" id="experience-categories"></div>
        </div>
        <button class="scroll-btn scroll-left">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="scroll-btn scroll-right">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="experiences-grid" id="experiences-grid">
        <div class="experience-card">
          <div class="experience-img">
            <img src="https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg" alt="Cooking Class">
            <button class="heart-btn">
              <i class="fas fa-heart"></i>
            </button>
          </div>
          <div class="experience-info">
            <div class="experience-rating">
              <i class="fas fa-star"></i>
              <span>4.98</span>
              <span>(124)</span>
            </div>
            <h3>Traditional French Cooking Class</h3>
            <p class="experience-price">From €65 / person</p>
          </div>
        </div>

        <div class="experience-card">
          <div class="experience-img">
            <img src="https://images.pexels.com/photos/2519390/pexels-photo-2519390.jpeg" alt="Wine Tasting">
            <button class="heart-btn">
              <i class="fas fa-heart"></i>
            </button>
          </div>
          <div class="experience-info">
            <div class="experience-rating">
              <i class="fas fa-star"></i>
              <span>4.92</span>
              <span>(86)</span>
            </div>
            <h3>Wine Tasting in Montmartre</h3>
            <p class="experience-price">From €45 / person</p>
          </div>
        </div>

        <div class="experience-card">
          <div class="experience-img">
            <img src="https://images.pexels.com/photos/2972939/pexels-photo-2972939.jpeg" alt="Photo Tour">
            <button class="heart-btn">
              <i class="fas fa-heart"></i>
            </button>
          </div>
          <div class="experience-info">
            <div class="experience-rating">
              <i class="fas fa-star"></i>
              <span>4.95</span>
              <span>(203)</span>
            </div>
            <h3>Paris Photography Tour</h3>
            <p class="experience-price">From €75 / person</p>
          </div>
        </div>
      </div>
    </div>
  `;

  loadExperienceCategories();
  setupExperiencesInteractions();
}

async function loadExperienceCategories() {
  const categories = await getCategories();
  const categoriesList = document.getElementById('experience-categories');
  
  if (!categoriesList) return;
  
  categoriesList.innerHTML = categories.map(category => `
    <a href="/experiences?category=${encodeURIComponent(category.name)}" class="category-item">
      <div class="category-icon">
        <i class="${category.icon}"></i>
      </div>
      <span>${category.name}</span>
    </a>
  `).join('');
}

function setupExperiencesInteractions() {
  // Setup category scroll
  const container = document.querySelector('.categories-scroll');
  const list = document.querySelector('.categories');
  const leftBtn = document.querySelector('.scroll-left');
  const rightBtn = document.querySelector('.scroll-right');
  
  if (!container || !list || !leftBtn || !rightBtn) return;
  
  leftBtn.addEventListener('click', () => {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  });
  
  rightBtn.addEventListener('click', () => {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  });
  
  // Setup filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}