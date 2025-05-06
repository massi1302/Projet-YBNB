export function renderAuthModals(container) {
  const modalHtml = `
    <div id="login-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <button class="modal-close">&times;</button>
          <h2>Log in</h2>
        </div>
        <div class="modal-body">
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" name="email" required>
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Log in</button>
          </form>
          <div class="auth-divider">
            <span>or</span>
          </div>
          <div class="social-login">
            <button class="btn btn-social btn-google">
              <i class="fab fa-google"></i>
              Continue with Google
            </button>
            <button class="btn btn-social btn-facebook">
              <i class="fab fa-facebook-f"></i>
              Continue with Facebook
            </button>
            <button class="btn btn-social btn-apple">
              <i class="fab fa-apple"></i>
              Continue with Apple
            </button>
          </div>
          <div class="auth-footer">
            <p>Don't have an account? <a href="#" data-modal-target="register-modal">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
    
    <div id="register-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <button class="modal-close">&times;</button>
          <h2>Sign up</h2>
        </div>
        <div class="modal-body">
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input type="text" id="register-name" name="name" required>
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" name="email" required>
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Sign up</button>
          </form>
          <div class="auth-divider">
            <span>or</span>
          </div>
          <div class="social-login">
            <button class="btn btn-social btn-google">
              <i class="fab fa-google"></i>
              Continue with Google
            </button>
            <button class="btn btn-social btn-facebook">
              <i class="fab fa-facebook-f"></i>
              Continue with Facebook
            </button>
            <button class="btn btn-social btn-apple">
              <i class="fab fa-apple"></i>
              Continue with Apple
            </button>
          </div>
          <div class="auth-footer">
            <p>Already have an account? <a href="#" data-modal-target="login-modal">Log in</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Create a div to hold the modals
  const modalsContainer = document.createElement('div');
  modalsContainer.classList.add('modals-container');
  modalsContainer.innerHTML = modalHtml;
  
  // Append to the container
  container.appendChild(modalsContainer);
}