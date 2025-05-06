import { getListing } from '../services/listings.js';
import { getFavorites, toggleFavorite } from '../services/favorites.js';
import { getCurrentUser } from '../services/auth.js';

export function renderListingPage(container, listingId) {
  container.innerHTML = `
    <div class="listing-page">
      <div class="listing-loading">
        <div class="loader"></div>
        <p>Loading listing details...</p>
      </div>
    </div>
  `;
  
  loadListingDetails(container, listingId);
}

async function loadListingDetails(container, listingId) {
  try {
    const listing = await getListing(listingId);
    const favorites = getFavorites();
    const isFavorite = favorites.includes(listingId);
    
    renderListingDetails(container, listing, isFavorite);
    initializeListingPage(listing);
  } catch (error) {
    console.error('Error loading listing:', error);
    container.innerHTML = `
      <div class="listing-error">
        <h2>Listing Not Found</h2>
        <p>Sorry, the listing you're looking for doesn't exist or has been removed.</p>
        <a href="/" class="btn btn-primary">Back to Home</a>
      </div>
    `;
  }
}

function renderListingDetails(container, listing, isFavorite) {
  document.title = `${listing.title} · YBNB`;
  
  container.innerHTML = `
    <div class="listing-page">
      <div class="listing-header">
        <h1>${listing.title}</h1>
        <div class="listing-header-right">
          <div class="listing-actions">
            <button class="action-btn share-btn">
              <i class="fas fa-share"></i>
              <span>Share</span>
            </button>
            <button class="action-btn save-btn ${isFavorite ? 'active' : ''}" id="save-listing" data-id="${listing.id}">
              <i class="far fa-heart"></i>
              <span>${isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="listing-gallery">
        <div class="gallery-main">
          <img src="${listing.images[0]}" alt="${listing.title}">
        </div>
        <div class="gallery-grid">
          ${listing.images.slice(1, 5).map((image, index) => `
            <div class="gallery-item">
              <img src="${image}" alt="${listing.title} ${index + 2}">
            </div>
          `).join('')}
        </div>
        <button class="gallery-view-all">
          <i class="fas fa-th"></i>
          <span>Show all photos</span>
        </button>
      </div>
      
      <div class="listing-content">
        <div class="listing-main">
          <div class="listing-description">
            <div class="host-info">
              <h2>Entire ${listing.type} hosted by ${listing.host.name}</h2>
              <div class="host-details">
                <span>${listing.guests} guests</span>
                <span>&middot;</span>
                <span>${listing.bedrooms} bedrooms</span>
                <span>&middot;</span>
                <span>${listing.beds} beds</span>
                <span>&middot;</span>
                <span>${listing.baths} baths</span>
              </div>
              ${listing.host.superhost ? `
                <div class="host-badge">
                  <i class="fas fa-medal"></i>
                  <span>${listing.host.name} is a Superhost</span>
                </div>
              ` : ''}
            </div>
            
            <div class="listing-features">
              <div class="feature">
                <div class="feature-icon">
                  <i class="fas fa-home"></i>
                </div>
                <div class="feature-text">
                  <h3>Entire home</h3>
                  <p>You'll have the ${listing.type} to yourself.</p>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">
                  <i class="fas fa-broom"></i>
                </div>
                <div class="feature-text">
                  <h3>Enhanced Clean</h3>
                  <p>This host committed to YBNB's 5-step cleaning process.</p>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">
                  <i class="fas fa-key"></i>
                </div>
                <div class="feature-text">
                  <h3>Self check-in</h3>
                  <p>Check yourself in with the lockbox.</p>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="feature-text">
                  <h3>Free cancellation before ${listing.cancellationDate}</h3>
                  <p></p>
                </div>
              </div>
            </div>
            
            <div class="listing-description-text">
              <p>${listing.description}</p>
              <button class="btn-text" id="show-more-desc">Show more</button>
            </div>
            
            <div class="listing-amenities">
              <h2>What this place offers</h2>
              <div class="amenities-grid">
                ${listing.amenities.map(amenity => `
                  <div class="amenity">
                    <i class="fas fa-check"></i>
                    <span>${amenity}</span>
                  </div>
                `).join('')}
              </div>
              <button class="btn btn-outline" id="show-all-amenities">Show all ${listing.amenities.length} amenities</button>
            </div>
          </div>
          
          <div class="listing-reviews">
            <div class="reviews-header">
              <h2>
                <i class="fas fa-star"></i>
                <span>${listing.rating}</span>
                <span>&middot;</span>
                <span>${listing.reviews.length} reviews</span>
              </h2>
            </div>
            
            <div class="reviews-categories">
              <div class="review-category">
                <span>Cleanliness</span>
                <div class="progress-bar">
                  <div class="progress" style="width: ${listing.scores.cleanliness * 20}%"></div>
                </div>
                <span>${listing.scores.cleanliness}</span>
              </div>
              
              <div class="review-category">
                <span>Communication</span>
                <div class="progress-bar">
                  <div class="progress" style="width: ${listing.scores.communication * 20}%"></div>
                </div>
                <span>${listing.scores.communication}</span>
              </div>
              
              <div class="review-category">
                <span>Check-in</span>
                <div class="progress-bar">
                  <div class="progress" style="width: ${listing.scores.checkin * 20}%"></div>
                </div>
                <span>${listing.scores.checkin}</span>
              </div>
              
              <div class="review-category">
                <span>Accuracy</span>
                <div class="progress-bar">
                  <div class="progress" style="width: ${listing.scores.accuracy * 20}%"></div>
                </div>
                <span>${listing.scores.accuracy}</span>
              </div>
              
              <div class="review-category">
                <span>Location</span>
                <div class="progress-bar">
                  <div class="progress" style="width: ${listing.scores.location * 20}%"></div>
                </div>
                <span>${listing.scores.location}</span>
              </div>
              
              <div class="review-category">
                <span>Value</span>
                <div class="progress-bar">
                  <div class="progress" style="width: ${listing.scores.value * 20}%"></div>
                </div>
                <span>${listing.scores.value}</span>
              </div>
            </div>
            
            <div class="reviews-list">
              ${listing.reviews.slice(0, 6).map(review => `
                <div class="review">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <div class="reviewer-avatar">
                        ${review.user.avatar 
                          ? `<img src="${review.user.avatar}" alt="${review.user.name}">`
                          : `<div class="avatar-placeholder">${review.user.name.charAt(0)}</div>`
                        }
                      </div>
                      <div class="reviewer-details">
                        <h3>${review.user.name}</h3>
                        <span>${review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div class="review-content">
                    <p>${review.comment}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <button class="btn btn-outline" id="show-all-reviews">Show all ${listing.reviews.length} reviews</button>
          </div>
          
          <div class="listing-location">
            <h2>Where you'll be</h2>
            <p>${listing.location}</p>
            <div class="location-map" id="location-map"></div>
            <div class="location-details">
              ${listing.locationDescription ? `<p>${listing.locationDescription}</p>` : ''}
              <button class="btn-text" id="show-more-location">Show more</button>
            </div>
          </div>
          
          <div class="host-profile">
            <div class="host-profile-header">
              <div class="host-avatar">
                ${listing.host.avatar 
                  ? `<img src="${listing.host.avatar}" alt="${listing.host.name}">`
                  : `<div class="avatar-placeholder">${listing.host.name.charAt(0)}</div>`
                }
              </div>
              <div class="host-details">
                <h2>Hosted by ${listing.host.name}</h2>
                <p>Joined in ${listing.host.joinDate} · ${listing.host.totalReviews} reviews</p>
                ${listing.host.superhost ? `
                  <div class="host-badge">
                    <i class="fas fa-medal"></i>
                    <span>Superhost</span>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <div class="host-stats">
              <div class="host-stat">
                <i class="fas fa-star"></i>
                <span>${listing.host.totalReviews} Reviews</span>
              </div>
              <div class="host-stat">
                <i class="fas fa-shield-alt"></i>
                <span>Identity verified</span>
              </div>
              <div class="host-stat">
                <i class="fas fa-medal"></i>
                <span>${listing.host.superhost ? 'Superhost' : 'Host'}</span>
              </div>
            </div>
            
            <div class="host-bio">
              <p>${listing.host.bio || 'This host has not provided a bio yet.'}</p>
            </div>
            
            <div class="host-response">
              <p>Response rate: ${listing.host.responseRate}</p>
              <p>Response time: ${listing.host.responseTime}</p>
            </div>
            
            <button class="btn btn-outline" id="contact-host">Contact host</button>
          </div>
        </div>
        
        <div class="listing-sidebar">
          <div class="booking-card">
            <div class="booking-header">
              <div class="booking-price">
                <span class="price">${listing.price}</span> night
              </div>
              <div class="booking-rating">
                <i class="fas fa-star"></i>
                <span>${listing.rating}</span>
                <span class="reviews-count">${listing.reviews.length} reviews</span>
              </div>
            </div>
            
            <form class="booking-form" id="booking-form">
              <div class="booking-dates">
                <div class="date-input check-in">
                  <label>CHECK-IN</label>
                  <input type="date" name="check-in" id="check-in" required>
                </div>
                <div class="date-input check-out">
                  <label>CHECKOUT</label>
                  <input type="date" name="check-out" id="check-out" required>
                </div>
              </div>
              
              <div class="booking-guests">
                <label>GUESTS</label>
                <select name="guests" id="guests">
                  ${Array.from({length: listing.guests}, (_, i) => 
                    `<option value="${i+1}">${i+1} guest${i !== 0 ? 's' : ''}</option>`
                  ).join('')}
                </select>
              </div>
              
              <button type="submit" class="btn btn-primary btn-block" id="reserve-btn">Reserve</button>
              <p class="booking-notice">You won't be charged yet</p>
            </form>
            
            <div class="booking-summary">
              <div class="booking-cost-item">
                <span>${listing.price} x 5 nights</span>
                <span>€${(parseInt(listing.price.replace('€', '')) * 5).toLocaleString()}</span>
              </div>
              <div class="booking-cost-item">
                <span>Cleaning fee</span>
                <span>€70</span>
              </div>
              <div class="booking-cost-item">
                <span>Service fee</span>
                <span>€186</span>
              </div>
              <div class="booking-cost-item">
                <span>Taxes</span>
                <span>€75</span>
              </div>
              <div class="booking-total">
                <span>Total</span>
                <span>€${(parseInt(listing.price.replace('€', '')) * 5 + 70 + 186 + 75).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="report-listing">
            <button class="btn-text" id="report-listing">Report this listing</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeListingPage(listing) {
  // Initialize map
  initializeListingMap(listing);
  
  // Setup save/favorite functionality
  const saveBtn = document.getElementById('save-listing');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const listingId = saveBtn.dataset.id;
      const isSaved = saveBtn.classList.contains('active');
      
      const user = getCurrentUser();
      if (!user) {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
          loginModal.classList.add('open');
          document.body.classList.add('modal-open');
        }
        return;
      }
      
      toggleFavorite(listingId);
      
      if (isSaved) {
        saveBtn.classList.remove('active');
        saveBtn.querySelector('span').textContent = 'Save';
      } else {
        saveBtn.classList.add('active');
        saveBtn.querySelector('span').textContent = 'Saved';
      }
    });
  }
  
  // Setup booking form
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const user = getCurrentUser();
      if (!user) {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
          loginModal.classList.add('open');
          document.body.classList.add('modal-open');
        }
        return;
      }
      
      const checkIn = document.getElementById('check-in').value;
      const checkOut = document.getElementById('check-out').value;
      const guests = document.getElementById('guests').value;
      
      if (!checkIn || !checkOut) {
        alert('Please select check-in and check-out dates');
        return;
      }
      
      // In a real app, we'd send this to the server
      alert(`Booking confirmed for ${guests} guests from ${checkIn} to ${checkOut}`);
    });
  }
  
  // Setup show more buttons
  const showMoreDesc = document.getElementById('show-more-desc');
  if (showMoreDesc) {
    showMoreDesc.addEventListener('click', () => {
      const descText = document.querySelector('.listing-description-text p');
      descText.classList.toggle('expanded');
      showMoreDesc.textContent = descText.classList.contains('expanded') ? 'Show less' : 'Show more';
    });
  }
  
  // Setup gallery view all button
  const galleryViewAll = document.querySelector('.gallery-view-all');
  if (galleryViewAll) {
    galleryViewAll.addEventListener('click', () => {
      // In a real app, we'd open a fullscreen gallery modal
      alert('This would open a fullscreen gallery in a real app');
    });
  }
}

function initializeListingMap(listing) {
  const mapContainer = document.getElementById('location-map');
  
  if (!mapContainer) return;
  
  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initializeLeafletMap(listing, mapContainer);
    document.head.appendChild(script);
  } else {
    initializeLeafletMap(listing, mapContainer);
  }
}

function initializeLeafletMap(listing, container) {
  // In a real app, we'd use the listing's actual coordinates
  // For demo, we're using random coordinates around Paris
  const lat = 48.8566 + (Math.random() - 0.5) * 0.03;
  const lng = 2.3522 + (Math.random() - 0.5) * 0.03;
  
  // Create map
  const map = L.map(container).setView([lat, lng], 14);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  // Add marker
  const marker = L.marker([lat, lng]).addTo(map);
  
  // Add circle to show approximate area (for privacy)
  L.circle([lat, lng], {
    color: '#0066cc',
    fillColor: '#0066cc',
    fillOpacity: 0.2,
    radius: 500
  }).addTo(map);
}