// app-render.js - Script for dynamically rendering apps

// Function to render the apps grid on the home page
function renderAppsGrid() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;

    appsData.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.onclick = () => window.location.href = `pages/app-details.html?id=${app.id}`;

        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${app.image}" alt="${app.name}" loading="lazy" class="app-image img-${app.id.replace(/-/g, '-')}">
            </div>
            <div class="card-content">
                <h4>${app.name}</h4>
                <p>${app.description}</p>
                <div class="card-footer">
                    <span class="status-indicator ${app.status}"></span>
                    <span class="status-text">${app.status === 'available' ? 'Available' : 'Coming Soon'}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Function to render details of a specific app
function renderAppDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');

    if (!appId) {
        document.body.innerHTML = '<h1>App not found</h1>';
        return;
    }

    const app = appsData.find(a => a.id === appId);
    if (!app) {
        document.body.innerHTML = '<h1>App not found</h1>';
        return;
    }

    const detailsContainer = document.getElementById('app-details');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <div class="detail-header-layout">
            <img src="../${app.image}" alt="${app.name}" loading="lazy" class="detail-main-image">
            <div class="detail-header-info">
                <h2>${app.name}</h2>
                <p class="lead-text">${app.description}</p>
                ${app.url ? `<a href="${app.url}" class="cta-button primary" target="_blank">Download on Google Play</a>` : '<button class="cta-button disabled">Coming Soon</button>'}
            </div>
        </div>
    `;

    // Render detailed description if available
    const detailedContainer = document.getElementById('app-detailed-info');
    if (detailedContainer && app.detailedDescription) {
        detailedContainer.innerHTML = app.detailedDescription;
    }
}

// Execute the appropriate function based on the page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('apps-grid')) {
        renderAppsGrid();
    } else if (document.getElementById('app-details')) {
        renderAppDetails();
    }
});