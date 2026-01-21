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
            <img src="${app.image}" alt="${app.name}" loading="lazy" class="app-image img-${app.id.replace(/-/g, '-')}">
            <h4>${app.name}</h4>
            <p>${app.description}</p>
            <span class="status ${app.status}">${app.status === 'available' ? 'Available' : 'Coming Soon'}</span>
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
        <img src="${app.image}" alt="${app.name}" loading="lazy">
        <h2>${app.name}</h2>
        <p>${app.description}</p>
        <span class="status ${app.status}">${app.status === 'available' ? 'Available' : 'Coming Soon'}</span>
        ${app.url ? `<a href="${app.url}" class="cta-button" target="_blank">Download on Google Play</a>` : '<p class="cta-button">Coming Soon</p>'}
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