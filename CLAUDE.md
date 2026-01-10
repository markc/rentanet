# CLAUDE.md

Project guidance for Claude Code when working with this repository.

## Project Overview

RentaNet is a static marketing website for an Australian web and email hosting company (renta.net). Promotes PHP/static hosting, email services, domain registration, and Linux consulting.

## File Structure

```
rentanet/
├── index.html          # Homepage
├── rentanet.css        # All styles (CSS custom properties, responsive)
├── rentanet.js         # Theme toggle, particles, scroll effects, mobile menu
├── ai.txt              # AI-readable site summary (like robots.txt for AI agents)
├── deploy.php          # Webhook handler for auto-deploy
├── Server_Room_Dark.webp  # Hero background image
├── services/index.html # Services page
├── pricing/index.html  # Pricing page
├── linux/index.html    # Linux support page
├── settings/index.html # Email settings page
└── .env.example        # Webhook secret template
```

## Key Patterns

### Theming
- Dark mode default (`html.dark` class)
- Theme persisted to localStorage (`renta-theme` key)
- CSS custom properties: `--bg-primary`, `--accent`, `--text-primary`, etc.
- Respects `prefers-color-scheme` when no stored preference

### Styling
- Glass morphism via `backdrop-filter` and semi-transparent backgrounds
- Brand color: `#BF0000` (dark red)
- Responsive breakpoints: 1024px, 900px, 768px, 600px
- No build step - vanilla HTML/CSS/JS

### Shared Components
- Navigation, footer, particles duplicated in each HTML file (no templating)
- All pages link to `/rentanet.css` and `/rentanet.js`

## Development

```bash
# Local dev server
python -m http.server 8080
# or
npx serve -p 8080
```

## Deployment

Push to `main` branch triggers GitHub webhook to `https://renta.net/deploy.php` which runs `git pull`.

Server path: `mrn:/srv/renta.net/web/app/public`
