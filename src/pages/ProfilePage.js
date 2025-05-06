import { getCurrentUser } from '../services/auth.js';

export function renderProfilePage(container, userId) {
  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser && currentUser.id === userId;

  container.innerHTML = `
    <div class="profile-page">
      <div class="profile-header">
        <div class="profile-info">
          <div class="profile-avatar">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile">
          </div>
          <div class="profile-details">
            <h1>Rubens</h1>
            <p>Joined in January 2019</p>
            ${isOwnProfile ? `
              <button class="btn btn-outline">Edit profile</button>
            ` : ''}
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat">
            <i class="fas fa-star"></i>
            <span>78 reviews</span>
          </div>
          <div class="stat">
            <i class="fas fa-check-circle"></i>
            <span>Identity verified</span>
          </div>
          <div class="stat">
            <i class="fas fa-medal"></i>
            <span>Superhost</span>
          </div>
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h2>About</h2>
          <p>Hi! I love hosting and helping people explore Paris. I can give you insider tips about the best spots to visit!</p>
        </div>

        <div class="profile-section">
          <h2>Reviews</h2>
          <div class="reviews-grid">
            <div class="review-card">
              <div class="reviewer-info">
                <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="Sophie">
                <div>
                  <h3>Sophie</h3>
                  <p>June 2023</p>
                </div>
              </div>
              <p>Amazing host! Very responsive and helpful with local recommendations.</p>
            </div>

            <div class="review-card">
              <div class="reviewer-info">
                <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Marcus">
                <div>
                  <h3>Marcus</h3>
                  <p>May 2023</p>
                </div>
              </div>
              <p>Great communication and the place was exactly as described.</p>
            </div>
          </div>
        </div>

        ${isOwnProfile ? `
          <div class="profile-section">
            <h2>Verified Info</h2>
            <div class="verified-info">
              <div class="verified-item">
                <i class="fas fa-check"></i>
                <span>Email address</span>
              </div>
              <div class="verified-item">
                <i class="fas fa-check"></i>
                <span>Phone number</span>
              </div>
              <div class="verified-item">
                <i class="fas fa-check"></i>
                <span>Government ID</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}