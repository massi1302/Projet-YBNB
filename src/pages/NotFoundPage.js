export function renderNotFoundPage(container) {
  container.innerHTML = `
    <div class="not-found-page">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" class="btn btn-primary">Go back home</a>
      </div>
    </div>
  `;
}