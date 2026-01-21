# Cha0smagick Labs Website

Static website for Cha0smagick Labs, blending occultism and technology.

## Structure

- `index.html`: Main page.
- `pages/app-details.html`: Template for individual app landing pages.
- `css/style.css`: CSS styles.
- `js/apps-data.js`: Modular database of apps.
- `js/app-render.js`: JavaScript for dynamic rendering.
- `assets/images/`: Images for apps.
- `sitemap.xml`: Basic site map for SEO.
- `robots.txt`: Instructions for crawlers.

## Deployment on GitHub Pages

1. Upload this repository to GitHub.
2. Go to Settings > Pages.
3. Select "Deploy from a branch" and choose the main branch.
4. The site will be available at `https://your-username.github.io/repo-name/`.

## Adding New Apps

Edit `js/apps-data.js` and add a new object to the `appsData` array (e.g., `{id: "new-app", name: "...", ...}`). The site will update automatically.