import { getListings } from '../services/listings.js';
import { getFavorites } from '../services/favorites.js';

export function renderSearchPage(container, searchParams) {
  const { location, checkIn, checkOut, guests } = searchParams;
  
  container.innerHTML = `
    <div class="search-page">
      <div class="search-container">
        <div class="search-filters">
          <div class="filter-tags" id="filter-tags">
            <button class="filter-tag active">
              <span>Price</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <button class="filter-tag">
              <span>Type of place</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <button class="filter-tag">
              <span>Rooms and beds</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <button class="filter-tag">
              <span>Amenities</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <button class="filter-tag">
              <span>Booking options</span>
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
        
        <div class="search-results">
          <div class="search-header">
            <h2 id="search-title">Loading listings...</h2>
            <div class="search-toggle">
              <button class="toggle-btn list-view active">
                <i class="fas fa-list"></i>
                <span>List</span>
              </button>
              <button class="toggle-btn map-view">
                <i class="fas fa-map-marker-alt"></i>
                <span>Map</span>
              </button>
            </div>
          </div>
          
          <div class="search-results-container">
            <div class="listings-grid" id="search-listings"></div>
            <div class="map-container" id="map-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  loadSearchResults(searchParams);
  setupSearchInteractions();
}

async function loadSearchResults(searchParams) {
  const { location, checkIn, checkOut, guests } = searchParams;
  
  // In a real app, we'd use these parameters to filter results
  const listings = await getListings();
  const favorites = getFavorites();
  
  const filteredListings = location 
    ? listings.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase()))
    : listings;
  
  renderSearchResults(filteredListings, favorites, searchParams);
  initializeMap(filteredListings);
}

function renderSearchResults(listings, favorites, searchParams) {
  const searchListings = document.getElementById('search-listings');
  const searchTitle = document.getElementById('search-title');
  
  if (!searchListings || !searchTitle) return;
  
  const { location } = searchParams;
  
  // Update search title
  searchTitle.textContent = location 
    ? `Stays in ${location}`
    : `${listings.length} stays`;
  
  if (listings.length === 0) {
    searchListings.innerHTML = `
      <div class="no-results">
        <h3>No stays found</h3>
        <p>Try adjusting your search by changing your dates or removing filters.</p>
      </div>
    `;
    return;
  }
  
  searchListings.innerHTML = listings.map(listing => `
    <div class="listing-card search-card">
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
          <div class="listing-details">
            <p class="listing-amenities">${listing.bedrooms} bedrooms · ${listing.beds} beds · ${listing.baths} baths</p>
            ${listing.amenities.slice(0, 3).map(amenity => `
              <p class="listing-amenity"><i class="fas fa-check"></i> ${amenity}</p>
            `).join('')}
          </div>
          <p class="listing-price"><span class="price">${listing.price}</span> night</p>
        </a>
      </div>
    </div>
  `).join('');
  
  // Setup image sliders
  setupImageSliders();
}

function initializeMap(listings) {
  const mapContainer = document.getElementById('map-container');
  
  if (!mapContainer) return;
  
  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initializeLeafletMap(listings, mapContainer);
    document.head.appendChild(script);
  } else {
    initializeLeafletMap(listings, mapContainer);
  }
}

function initializeLeafletMap(listings, container) {
  // Create map
  const map = L.map(container).setView([48.8566, 2.3522], 12); // Default to Paris coordinates
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  // Add markers for each listing
  listings.forEach(listing => {
    // In a real app, each listing would have its own lat/lng
    // For demo, we're generating random points around Paris
    const lat = 48.8566 + (Math.random() - 0.5) * 0.05;
    const lng = 2.3522 + (Math.random() - 0.5) * 0.05;
    
    const priceMarker = L.divIcon({
      className: 'price-marker',
      html: `<div class="price-marker-inner">€${listing.price.replace('€', '')}</div>`,
      iconSize: [60, 30],
      iconAnchor: [30, 15]
    });
    
    const marker = L.marker([lat, lng], { icon: priceMarker }).addTo(map);
    
    marker.bindPopup(`
      <div class="map-popup">
        <img src="${listing.images[0]}" alt="${listing.title}">
        <div class="popup-info">
          <div class="popup-rating">
            <i class="fas fa-star"></i>
            <span>${listing.rating}</span>
          </div>
          <h3>${listing.location}</h3>
          <p class="popup-price">${listing.price} night</p>
        </div>
      </div>
    `);
  });
  
  // Adjust map to fit all markers
  if (listings.length > 0) {
    // In a real app, we'd use listing coordinates to fit bounds
    const bounds = L.latLngBounds([
      [48.8566 - 0.03, 2.3522 - 0.03],
      [48.8566 + 0.03, 2.3522 + 0.03]
    ]);
    map.fitBounds(bounds);
  }
}

function setupSearchInteractions() {
  const listViewBtn = document.querySelector('.list-view');
  const mapViewBtn = document.querySelector('.map-view');
  const listingsGrid = document.getElementById('search-listings');
  const mapContainer = document.getElementById('map-container');
  
  if (!listViewBtn || !mapViewBtn || !listingsGrid || !mapContainer) return;
  
  // Toggle between list and map view
  listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add('active');
    mapViewBtn.classList.remove('active');
    listingsGrid.style.display = 'grid';
    mapContainer.style.display = 'none';
  });
  
  mapViewBtn.addEventListener('click', () => {
    mapViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    mapContainer.style.display = 'block';
    listingsGrid.style.display = 'none';
    
    // Trigger a resize event to fix map display
    window.dispatchEvent(new Event('resize'));
  });
  
  // Filter tag handling
  const filterTags = document.querySelectorAll('.filter-tag');
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });
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