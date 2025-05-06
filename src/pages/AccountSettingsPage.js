import { getCurrentUser } from '../services/auth.js';

export function renderAccountSettingsPage(container) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/';
    return;
  }

  container.innerHTML = `
    <div class="settings-page">
      <div class="settings-container">
        <div class="settings-sidebar">
          <h2>Account</h2>
          <nav class="settings-nav">
            <a href="#personal-info" class="active">Personal info</a>
            <a href="#login-security">Login & security</a>
            <a href="#payments">Payments & payouts</a>
            <a href="#notifications">Notifications</a>
            <a href="#privacy">Privacy & sharing</a>
          </nav>
        </div>

        <div class="settings-content">
          <section id="personal-info" class="settings-section">
            <h1>Personal info</h1>
            <p>Update your personal information and how it's shared with the YBNB community</p>

            <div class="info-card">
              <div class="info-header">
                <h3>Legal name</h3>
                <button class="btn-text">Edit</button>
              </div>
              <p>${user.name}</p>
            </div>

            <div class="info-card">
              <div class="info-header">
                <h3>Email address</h3>
                <button class="btn-text">Edit</button>
              </div>
              <p>${user.email}</p>
            </div>

            <div class="info-card">
              <div class="info-header">
                <h3>Phone number</h3>
                <button class="btn-text">Add</button>
              </div>
              <p>Not provided</p>
            </div>

            <div class="info-card">
              <div class="info-header">
                <h3>Government ID</h3>
                <button class="btn-text">Add</button>
              </div>
              <p>Not provided</p>
            </div>

            <div class="info-card">
              <div class="info-header">
                <h3>Address</h3>
                <button class="btn-text">Add</button>
              </div>
              <p>Not provided</p>
            </div>
          </section>

          <section id="login-security" class="settings-section hidden">
            <h1>Login & security</h1>
            <p>Update your password and secure your account</p>

            <div class="security-card">
              <div class="security-header">
                <h3>Password</h3>
                <button class="btn-text">Update</button>
              </div>
              <p>Last updated 3 months ago</p>
            </div>

            <div class="security-card">
              <div class="security-header">
                <h3>Two-factor authentication</h3>
                <button class="btn btn-outline">Enable</button>
              </div>
              <p>Add an extra layer of security to your account</p>
            </div>

            <div class="security-card">
              <div class="security-header">
                <h3>Connected accounts</h3>
                <button class="btn-text">Manage</button>
              </div>
              <p>Connect your social media accounts</p>
            </div>
          </section>

          <section id="payments" class="settings-section hidden">
            <h1>Payments & payouts</h1>
            <p>Manage your payment methods and payout preferences</p>

            <div class="payment-methods">
              <h3>Payment methods</h3>
              <button class="btn btn-outline">Add payment method</button>
              <p>No payment methods added</p>
            </div>

            <div class="payout-methods">
              <h3>Payout methods</h3>
              <button class="btn btn-outline">Add payout method</button>
              <p>No payout methods added</p>
            </div>
          </section>

          <section id="notifications" class="settings-section hidden">
            <h1>Notifications</h1>
            <p>Choose notification preferences and how you want to be contacted</p>

            <div class="notification-group">
              <h3>Email notifications</h3>
              <div class="notification-option">
                <div>
                  <h4>Booking updates</h4>
                  <p>Updates about your reservations and requests</p>
                </div>
                <label class="switch">
                  <input type="checkbox" checked>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="notification-option">
                <div>
                  <h4>Reminders</h4>
                  <p>Upcoming trips and tasks to complete</p>
                </div>
                <label class="switch">
                  <input type="checkbox" checked>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="notification-option">
                <div>
                  <h4>Promotions</h4>
                  <p>Deals, travel tips, and the latest news</p>
                </div>
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </section>

          <section id="privacy" class="settings-section hidden">
            <h1>Privacy & sharing</h1>
            <p>Manage your personal data and connected services</p>

            <div class="privacy-option">
              <div>
                <h3>Profile visibility</h3>
                <p>Choose who can see your profile information</p>
              </div>
              <select>
                <option>Everyone</option>
                <option>Only hosts and guests</option>
                <option>Only past hosts and guests</option>
              </select>
            </div>

            <div class="privacy-option">
              <div>
                <h3>Search visibility</h3>
                <p>Control how your profile appears in search results</p>
              </div>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="data-sharing">
              <h3>Data sharing</h3>
              <p>Manage how your data is used to improve YBNB services</p>
              <button class="btn btn-outline">Manage preferences</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  `;

  setupSettingsInteractions();
}

function setupSettingsInteractions() {
  const navLinks = document.querySelectorAll('.settings-nav a');
  const sections = document.querySelectorAll('.settings-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      sections.forEach(section => {
        if (section.id === targetId) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });
}