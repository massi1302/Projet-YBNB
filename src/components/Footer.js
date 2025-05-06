export function setupFooter() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;
  
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-section">
        <h3>Support</h3>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">AirCover</a></li>
          <li><a href="#">Anti-discrimination</a></li>
          <li><a href="#">Disability support</a></li>
          <li><a href="#">Cancellation options</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>Hosting</h3>
        <ul>
          <li><a href="#">YBNB your home</a></li>
          <li><a href="#">YBNCover for Hosts</a></li>
          <li><a href="#">Hosting resources</a></li>
          <li><a href="#">Community forum</a></li>
          <li><a href="#">Hosting responsibly</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>YBNB</h3>
        <ul>
          <li><a href="#">Newsroom</a></li>
          <li><a href="#">New features</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Investors</a></li>
          <li><a href="#">Gift cards</a></li>
        </ul>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-legal">
          <span>&copy; 2025 YBNB, Inc.</span>
          <span>&middot;</span>
          <a href="#">Privacy</a>
          <span>&middot;</span>
          <a href="#">Terms</a>
          <span>&middot;</span>
          <a href="#">Sitemap</a>
        </div>
        
        <div class="footer-right">
          <div class="language-selector">
            <i class="fas fa-globe"></i>
            <span>English (US)</span>
          </div>
          <div class="currency-selector">
            <span>$ USD</span>
          </div>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>
  `;
}