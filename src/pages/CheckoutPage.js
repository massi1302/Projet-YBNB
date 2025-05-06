import { getCurrentUser } from '../services/auth.js';
import { getListing } from '../services/listings.js';

export function renderCheckoutPage(container, listingId) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/';
    return;
  }

  container.innerHTML = `
    <div class="checkout-page">
      <div class="loading">
        <div class="loader"></div>
        <p>Loading checkout details...</p>
      </div>
    </div>
  `;

  loadCheckoutDetails(container, listingId);
}

async function loadCheckoutDetails(container, listingId) {
  try {
    const listing = await getListing(listingId);
    renderCheckoutForm(container, listing);
  } catch (error) {
    container.innerHTML = `
      <div class="error-container">
        <h2>Error Loading Checkout</h2>
        <p>Sorry, we couldn't load the checkout details. Please try again.</p>
        <a href="/listing/${listingId}" class="btn btn-primary">Back to Listing</a>
      </div>
    `;
  }
}

function renderCheckoutForm(container, listing) {
  container.innerHTML = `
    <div class="checkout-page">
      <div class="checkout-container">
        <div class="checkout-main">
          <div class="checkout-header">
            <h1>Confirm and pay</h1>
          </div>

          <div class="trip-details">
            <h2>Your trip</h2>
            <div class="trip-info">
              <div class="dates-info">
                <h3>Dates</h3>
                <p>${listing.dates}</p>
                <button class="btn-text">Edit</button>
              </div>
              <div class="guests-info">
                <h3>Guests</h3>
                <p>${listing.guests} guests</p>
                <button class="btn-text">Edit</button>
              </div>
            </div>
          </div>

          <form id="checkout-form" class="checkout-form">
            <div class="payment-section">
              <h2>Pay with</h2>
              <div class="payment-methods">
                <div class="payment-method">
                  <input type="radio" name="payment" id="credit-card" checked>
                  <label for="credit-card">
                    <i class="fas fa-credit-card"></i>
                    Credit or debit card
                  </label>
                </div>
                <div class="payment-method">
                  <input type="radio" name="payment" id="paypal">
                  <label for="paypal">
                    <i class="fab fa-paypal"></i>
                    PayPal
                  </label>
                </div>
              </div>

              <div class="card-details">
                <div class="form-group">
                  <label for="card-number">Card number</label>
                  <input type="text" id="card-number" placeholder="0000 0000 0000 0000" required>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="expiry">Expiration</label>
                    <input type="text" id="expiry" placeholder="MM/YY" required>
                  </div>
                  <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="zip">ZIP code</label>
                  <input type="text" id="zip" required>
                </div>
              </div>
            </div>

            <div class="coupon-section">
              <h2>Coupons</h2>
              <div class="coupon-input">
                <input type="text" placeholder="Enter coupon code">
                <button type="button" class="btn btn-outline">Apply</button>
              </div>
            </div>

            <div class="cancellation-section">
              <h2>Cancellation policy</h2>
              <p>Free cancellation before ${listing.cancellationDate}. After that, cancel before check-in and get a partial refund.</p>
              <button type="button" class="btn-text">Learn more</button>
            </div>

            <div class="rules-section">
              <h2>Ground rules</h2>
              <div class="rules-list">
                <p>We ask every guest to remember a few simple things about what makes a great guest:</p>
                <ul>
                  <li>Follow the house rules</li>
                  <li>Treat the home with respect</li>
                  <li>Keep the space clean</li>
                  <li>Be considerate of neighbors</li>
                </ul>
              </div>
              <div class="rules-agreement">
                <input type="checkbox" id="agree-rules" required>
                <label for="agree-rules">I agree to the house rules and to be a considerate guest.</label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Confirm and pay</button>
          </form>
        </div>

        <div class="checkout-sidebar">
          <div class="booking-summary">
            <div class="listing-preview">
              <img src="${listing.images[0]}" alt="${listing.title}">
              <div class="listing-preview-info">
                <h3>${listing.title}</h3>
                <p>${listing.type} in ${listing.location}</p>
                <div class="listing-preview-rating">
                  <i class="fas fa-star"></i>
                  <span>${listing.rating}</span>
                  <span>(${listing.reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            <div class="price-breakdown">
              <h3>Price breakdown</h3>
              <div class="price-details">
                <div class="price-item">
                  <span>${listing.price} x 5 nights</span>
                  <span>€${(parseInt(listing.price.replace('€', '')) * 5).toLocaleString()}</span>
                </div>
                <div class="price-item">
                  <span>Cleaning fee</span>
                  <span>€70</span>
                </div>
                <div class="price-item">
                  <span>Service fee</span>
                  <span>€186</span>
                </div>
                <div class="price-item">
                  <span>Taxes</span>
                  <span>€75</span>
                </div>
                <div class="price-total">
                  <span>Total</span>
                  <span>€${(parseInt(listing.price.replace('€', '')) * 5 + 70 + 186 + 75).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setupCheckoutForm();
}

function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // In a real app, we would:
    // 1. Validate all inputs
    // 2. Process payment
    // 3. Create reservation
    // 4. Send confirmation email
    // For demo, we'll just show a success message
    
    alert('Booking confirmed! Check your email for details.');
    window.location.href = '/trips';
  });
}