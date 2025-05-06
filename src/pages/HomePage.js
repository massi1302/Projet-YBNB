import { getCategories } from '../services/categories.js';
import { getListings, getListingsByCategory } from '../services/listings.js';
import { getFavorites } from '../services/favorites.js';

export function renderHomePage(container) {
  container.innerHTML = `
    <div class="home-page">
      <div class="categories-container">
        <div class="categories-scroll">
          <div class="categories" id="categories-list"></div>
        </div>
        <button class="scroll-btn scroll-left">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="scroll-btn scroll-right">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="filters-btn-container">
          <button class="filters-btn">
            <i class="fas fa-sliders-h"></i>
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      <div class="listings-container">
        <div class="listings-grid" id="listings-grid"></div>
      </div>
    </div>
  `;
  
  loadCategoriesAndListings();
  setupCategoryScroll();
}

async function loadCategoriesAndListings() {
  const categories = await getCategories();
  const searchParams = new URLSearchParams(window.location.search);
  const selectedCategory = searchParams.get('category');
  
  const listings = selectedCategory 
    ? await getListingsByCategory(selectedCategory)
    : await getListings();
    
  const favorites = getFavorites();
  
  renderCategories(categories, selectedCategory);
  renderListings(listings, favorites);
}

function renderCategories(categories, selectedCategory) {
  const categoriesList = document.getElementById('categories-list');
  
  if (!categoriesList) return;
  
  categoriesList.innerHTML = categories.map(category => `
    <a href="/?category=${encodeURIComponent(category.name)}" 
       class="category-item ${category.name === selectedCategory ? 'active' : ''}">
      <div class="category-icon">
        <i class="${category.icon}"></i>
      </div>
      <span>${category.name}</span>
    </a>
  `).join('');
}

function renderListings(listings, favorites) {
  const listingsGrid = document.getElementById('listings-grid');
  
  if (!listingsGrid) return;
  
  if (listings.length === 0) {
    listingsGrid.innerHTML = `
      <div class="no-results">
        <h3>No listings found</h3>
        <p>Try adjusting your search criteria or selecting a different category.</p>
      </div>
    `;
    return;
  }
  
  listingsGrid.innerHTML = listings.map(listing => `
    <div class="listing-card">
      <div class="listing-img-container">
        <a href="/listing/${listing.id}">
          <div class="listing-img-slider">
            ${listing.images.map(image => `
              <div class="listing-img">
                <img src="${image}" alt="${listing.title}">
              </div>
            `).join('')}
          </div>
          <div class="listing-img-nav">
            ${listing.images.map((_, index) => `
              <span class="img-dot ${index === 0 ? 'active' : ''}"></span>
            `).join('')}
          </div>
        </a>
        <button class="heart-btn ${favorites.includes(listing.id) ? 'favorited' : ''}" data-id="${listing.id}">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      
      <div class="listing-info">
        <a href="/listing/${listing.id}" class="listing-title">
          <div class="listing-location-rating">
            <h3>${listing.location}</h3>
            <div class="listing-rating">
              <i class="fas fa-star"></i>
              <span>${listing.rating}</span>
            </div>
          </div>
          <p class="listing-host">${listing.host.type} host${listing.host.superhost ? ' · Superhost' : ''}</p>
          <p class="listing-dates">${listing.dates}</p>
          <p class="listing-price"><span class="price">${listing.price}</span> night</p>
        </a>
      </div>
    </div>
  `).join('');
  
  setupImageSliders();
}

function setupImageSliders() {
  document.querySelectorAll('.listing-img-container').forEach(container => {
    const slider = container.querySelector('.listing-img-slider');
    const dots = container.querySelectorAll('.img-dot');
    
    if (!slider || dots.length <= 1) return;
    
    let currentSlide = 0;
    const slideWidth = 100; // percentage
    const totalSlides = dots.length;
    
    // Add navigation buttons if more than one image
    if (totalSlides > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'img-nav-btn prev';
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'img-nav-btn next';
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      
      container.appendChild(prevBtn);
      container.appendChild(nextBtn);
      
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
      });
      
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
      });
    }
    
    // Click on dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentSlide = index;
        updateSlider();
      });
    });
    
    function updateSlider() {
      slider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
      
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  });
}

function setupCategoryScroll() {
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
  
  // Check if scroll buttons should be visible
  const checkScrollButtons = () => {
    if (container.scrollLeft <= 0) {
      leftBtn.classList.add('hidden');
    } else {
      leftBtn.classList.remove('hidden');
    }
    
    if (container.scrollLeft + container.clientWidth >= list.scrollWidth - 10) {
      rightBtn.classList.add('hidden');
    } else {
      rightBtn.classList.remove('hidden');
    }
  };
  
  container.addEventListener('scroll', checkScrollButtons);
  window.addEventListener('resize', checkScrollButtons);
  
  // Initialize
  checkScrollButtons();
}